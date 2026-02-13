import json
import re
from typing import Tuple, List, Optional
from backend.mlx_engine import mlx_engine

class GuardrailAgent:
    def __init__(self, constitution_path: str = "backend/system_constitution.md"):
        self.constitution_path = constitution_path
        self.constitution = self._load_constitution()

    def _load_constitution(self) -> str:
        try:
            with open(self.constitution_path, "r") as f:
                return f.read()
        except Exception as e:
            return f"Error loading constitution: {e}"

    def verify_code(self, code: str, task_context: str) -> Tuple[bool, List[str], str]:
        """
        Formally verifies code against the System Constitution using the 70B Teacher model.
        Returns: (is_compliant, violations, explanation)
        """
        print("🛡️ [Guardrail] Performing Formal Verification (70B Teacher Model)...")
        
        prompt = f"""You are the Nexus-AI Constitutional Guardrail Agent. 
Your sole purpose is to enforce the following System Constitution.

--- SYSTEM CONSTITUTION ---
{self.constitution}
--- END CONSTITUTION ---

Analyze the following code generated for the task: "{task_context}"

--- CODE TO VERIFY ---
{code}
--- END CODE ---

Check for any violations of the constitution. If any rule is violated, you MUST mark it as non-compliant.

Output your findings in JSON format:
{{
  "is_compliant": boolean,
  "violations": ["Rule ID (e.g. C-001): Description of violation"],
  "explanation": "Concise reasoning for compliance or failure"
}}
"""
        # We use the 'reasoning' model (Llama-3-70B) for high-level policy enforcement
        response = mlx_engine.generate_response(prompt, model_key="reasoning")
        
        try:
            json_match = re.search(r'\{.*\}', response, re.DOTALL)
            if json_match:
                data = json.loads(json_match.group())
                return data.get("is_compliant", False), data.get("violations", []), data.get("explanation", "")
            return False, ["Guardrail Failure: Could not parse verification report"], "Internal parsing error."
        except Exception as e:
            return False, [f"Guardrail Error: {str(e)}"], "Internal processing error."

guardrail_agent = GuardrailAgent()
