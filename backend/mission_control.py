import json
import threading
import concurrent.futures
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from backend.mlx_engine import mlx_engine
from backend.guardrail import guardrail_agent

class MissionPlan(BaseModel):
    task_name: str
    steps: List[str]
    coder_instructions: str
    tester_instructions: str
    linter_rules: List[str]

class WorkerResult(BaseModel):
    worker_type: str
    success: bool
    output: str
    error: Optional[str] = None

class PlanningAgent:
    def generate_plan(self, task: str) -> MissionPlan:
        print("🧠 [Mission Control] Consulting Llama-3.3-70B Planner...")
        prompt = f"""You are the Nexus-AI Mission Planner. Deconstruct the following task into a structured JSON mission plan.
Task: {task}

Output ONLY valid JSON in this format:
{{
  "task_name": "string",
  "steps": ["step1", "step2"],
  "coder_instructions": "detailed coding guide",
  "tester_instructions": "testing requirements",
  "linter_rules": ["rule1", "rule2"]
}}
"""
        response = mlx_engine.generate_response(prompt, model_key="planner")
        try:
            # More robust JSON extraction
            import re
            json_match = re.search(r'\{.*\}', response, re.DOTALL)
            if json_match:
                data = json.loads(json_match.group())
                # Normalize keys just in case
                normalized_data = {
                    "task_name": data.get("task_name", "Mission"),
                    "steps": data.get("steps", []),
                    "coder_instructions": data.get("coder_instructions", data.get("coderinstructions", "")),
                    "tester_instructions": data.get("tester_instructions", data.get("testerinstructions", "")),
                    "linter_rules": data.get("linter_rules", data.get("linterules", []))
                }
                return MissionPlan(**normalized_data)
            else:
                raise ValueError("No JSON found in response")
        except Exception as e:
            print(f"❌ Planning Error: {e}\nRaw Response: {response}")
            # Fallback plan
            return MissionPlan(
                task_name="Fallback Mission",
                steps=["Execute task directly"],
                coder_instructions=task,
                tester_instructions="Verify manually",
                linter_rules=["Standard PEP8"]
            )

class WorkerAgent:
    def __init__(self, worker_type: str, model_key: str):
        self.worker_type = worker_type
        self.model_key = model_key

    def execute(self, instructions: str, shared_context: str = "", max_retries: int = 2) -> WorkerResult:
        print(f"👷 [Worker-{self.worker_type}] Starting work...")
        prompt = f"Role: {self.worker_type}\nInstructions: {instructions}\nContext: {shared_context}\nProvide your technical output."
        
        current_output = mlx_engine.generate_response(prompt, model_key=self.model_key)
        
        # Guardrail Enforcement
        for i in range(max_retries):
            is_compliant, violations, explanation = guardrail_agent.verify_code(current_output, instructions)
            
            if is_compliant:
                print(f"🛡️ [Guardrail] {self.worker_type} output passed verification.")
                return WorkerResult(worker_type=self.worker_type, success=True, output=current_output)
            
            print(f"🚨 [Guardrail] {self.worker_type} output BLOCKED. Violations: {violations}")
            rewrite_prompt = f"""Your previous output was BLOCKED by the System Constitutional Guardrail.
You MUST provide a SECURE REWRITE that fixes all violations.

VIOLATIONS:
{chr(10).join(violations)}

EXPLANATION:
{explanation}

ORIGINAL OUTPUT:
{current_output}
"""
            current_output = mlx_engine.generate_response(rewrite_prompt, model_key=self.model_key)
            
        return WorkerResult(
            worker_type=self.worker_type, 
            success=False, 
            output=current_output, 
            error="Failed to produce compliant code after multiple secure rewrites."
        )

class Orchestrator:
    def __init__(self):
        self.planner = PlanningAgent()
        self.coder = WorkerAgent("Coder", "logic")
        self.tester = WorkerAgent("Tester", "logic")
        self.linter = WorkerAgent("Linter", "turbo")

    def preload_workers(self):
        """Pins all 4 models in the 128GB unified memory pool."""
        print("🚀 [Orchestrator] Pinning all units to unified memory (128GB RAM mode)...")
        models = ["planner", "logic", "turbo"]
        for m in models:
            mlx_engine.load_model(m)
        print("✅ All systems pinned and ready.")

    def run_mission(self, task: str):
        # 1. Plan
        plan = self.planner.generate_plan(task)
        print(f"📝 Mission Plan Confirmed: {plan.task_name}")

        # 2. Parallel Execution
        results = []
        with concurrent.futures.ThreadPoolExecutor(max_workers=3) as executor:
            future_to_worker = {
                executor.submit(self.coder.execute, plan.coder_instructions): "Coder",
                executor.submit(self.tester.execute, plan.tester_instructions): "Tester",
                executor.submit(self.linter.execute, ". ".join(plan.linter_rules)): "Linter"
            }
            
            for future in concurrent.futures.as_completed(future_to_worker):
                worker_name = future_to_worker[future]
                try:
                    res = future.result()
                    results.append(res)
                    print(f"✅ {worker_name} returned success: {res.success}")
                except Exception as exc:
                    print(f"❌ {worker_name} generated an exception: {exc}")
                    results.append(WorkerResult(worker_type=worker_name, success=False, output="", error=str(exc)))

        # 3. Decision Logic
        all_success = all(r.success for r in results)
        
        # Aggregate Report
        report = f"# MISSION REPORT: {plan.task_name}\n\n"
        report += f"**Status**: {'✅ COMPLETE' if all_success else '❌ PARTIAL FAILURE'}\n\n"
        for r in results:
            report += f"## {r.worker_type} Result\n{r.output[:500]}...\n\n"

        return report

mission_control = Orchestrator()
