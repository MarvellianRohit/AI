import os
import json
import subprocess
from typing import List, Dict, Any, Generator
from backend.mlx_engine import mlx_engine
from backend.system_tools import system_tools

class MissionOrchestrator:
    def __init__(self):
        self.dev_model = "reasoning" # Llama-3.1-70B (Developer)
        self.sre_model = "reasoning" # Llama-3.1-70B (SRE) - conceptually another 'persona' or instance
        self.mission_log = []

    def execute_mission(self, tasks: List[Dict[str, Any]]) -> Generator[str, None, None]:
        """
        Executes the task list with the cross-agent verification loop.
        """
        for task in tasks:
            agent_type = task["agent"]
            task_desc = task["task"]
            
            yield f"\n🚀 [Mission] Starting Task {task['id']}: {task_desc} (Agent {agent_type})\n"
            
            if agent_type == "A":
                # Agent A (Developer) writes code
                code_generation = self._agent_a_develop(task)
                code = ""
                for chunk in code_generation:
                    if chunk.startswith("```"): continue
                    code += chunk
                    yield chunk
                
                # Verify Before Commit Loop
                yield f"\n🔍 [Agent B] Verifying Code for Task {task['id']}...\n"
                verified, logs = self._agent_b_verify(code)
                
                if not verified:
                    yield f"❌ [Verification Failed] Logs: {logs}\n"
                    yield f"🛠️ [Agent A] Fixing code based on logs...\n"
                    # Simple one-turn fix for now
                    fix_gen = self._agent_a_fix(code, logs)
                    for chunk in fix_gen:
                        yield chunk
                else:
                    yield "✅ [Verification Success] Code passed container run.\n"

            elif agent_type == "B":
                # Agent B (SRE) handles infra
                infra_gen = self._agent_b_infra(task)
                for chunk in infra_gen:
                    yield chunk

    def _agent_a_develop(self, task: Dict[str, Any]) -> Generator[str, None, None]:
        prompt = f"Agent A (Developer): Write the code for: {task['task']}. {task['description']}. Output ONLY code."
        return mlx_engine.stream_chat(prompt, model_key=self.dev_model)

    def _agent_a_fix(self, code: str, logs: str) -> Generator[str, None, None]:
        prompt = f"Agent A (Developer): Your code failed verification. Logs: {logs}. Original Code: {code}. Please provide a fixed version. Output ONLY the fixed code."
        return mlx_engine.stream_chat(prompt, model_key=self.dev_model)

    def _agent_b_verify(self, code: str) -> (bool, str):
        """
        Agent B verifies code in a 'local container' (simulated via subprocess/venv).
        """
        # Save code to a temp file
        with open("backend/temp_verify.py", "w") as f:
            f.write(code)
        
        # Run in a simulated isolated environment
        success, output = system_tools.exec_shell("python3 backend/temp_verify.py")
        return success, output

    def _agent_b_infra(self, task: Dict[str, Any]) -> Generator[str, None, None]:
        prompt = f"Agent B (SRE): Write the Terraform or CI/CD script for: {task['task']}. {task['description']}. Output ONLY script."
        return mlx_engine.stream_chat(prompt, model_key=self.sre_model)

mission_orchestrator = MissionOrchestrator()
