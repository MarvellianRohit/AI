import json
from typing import List, Dict, Any, Optional, Tuple
from backend.mlx_engine import mlx_engine

class ReflexionResult:
    def __init__(self, code: str, critiques: List[str], iteration: int, approved: bool):
        self.code = code
        self.critiques = critiques
        self.iteration = iteration
        self.approved = approved

class GeneratorAgent:
    def generate(self, prompt: str, feedback: Optional[str] = None) -> str:
        print(f"🧠 [Generator] {'Generating initial solution...' if not feedback else 'Refactoring based on feedback...'}")
        full_prompt = prompt
        if feedback:
            full_prompt = f"Existing Code:\n{prompt}\n\nCritic Feedback:\n{feedback}\n\nRefactor the code to address all points above. Return ONLY the code."
        else:
            full_prompt = f"Task: {prompt}\n\nProvide the implementation. Return ONLY the code."
        
        return mlx_engine.generate_response(full_prompt, model_key="generator_hp")

class CriticAgent:
    def audit(self, code: str, task: str) -> Tuple[bool, List[str]]:
        print("🔍 [Critic] Auditing code for flaws (FP16/BF16 Precision)...")
        audit_prompt = f"""You are the Security & Performance Auditor. Analyze the following code implementation for the task: "{task}"

Check for:
1. Edge Cases (null inputs, empty strings, boundary conditions)
2. Security Risks (Injection, insecure defaults, sanitization)
3. Performance Leaks (Unnecessary loops, memory usage, O(n) improvements)

Code:
{code}

Output your audit in JSON format:
{{
  "approved": boolean,
  "flaws": ["flaw1", "flaw2"],
  "explanation": "concise reasoning"
}}
"""
        response = mlx_engine.generate_response(audit_prompt, model_key="critic")
        try:
            import re
            json_match = re.search(r'\{.*\}', response, re.DOTALL)
            if json_match:
                data = json.loads(json_match.group())
                return data.get("approved", False), data.get("flaws", [])
            return False, ["Failed to parse audit report"]
        except Exception as e:
            print(f"❌ Audit Parsing Error: {e}")
            return False, [f"Error during audit: {str(e)}"]

class ReflexionEngine:
    def __init__(self):
        self.generator = GeneratorAgent()
        self.critic = CriticAgent()

    def run_self_correction(self, task: str, max_iterations: int = 3) -> ReflexionResult:
        print(f"🚀 Starting Reflection Loop for Task: {task}")
        current_code = self.generator.generate(task)
        all_critiques = []
        
        for i in range(max_iterations):
            print(f"🔄 Iteration {i+1}...")
            approved, flaws = self.critic.audit(current_code, task)
            
            if approved:
                print("✅ [Reflexion] Critic approved the solution!")
                return ReflexionResult(current_code, flaws, i+1, True)
            
            print(f"⚠️ [Reflexion] Critic found {len(flaws)} flaws. Sending back for refactoring.")
            all_critiques.extend(flaws)
            feedback_str = "\n".join(flaws)
            current_code = self.generator.generate(current_code, feedback=feedback_str)
            
        print("🛑 [Reflexion] Maximum iterations reached without full approval.")
        return ReflexionResult(current_code, all_critiques, max_iterations, False)

reflexion_engine = ReflexionEngine()
