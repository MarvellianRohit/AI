import os
import subprocess
import json
from backend.mlx_engine import mlx_engine
from backend.agents.debugger import debugger_agent

class MissionControl:
    def __init__(self):
        # We use DeepSeek-Coder-V2 (logic) pinned in RAM
        self.model_key = "logic" 

    def run_auth_mission(self):
        """Builds a secure authentication module via autonomous iterations."""
        print("🚀 Initializing Mission: Secure Authentication Module")
        
        # Step 1: Implementation Plan
        plan_prompt = "Generate a technical implementation plan for a secure JWT-based authentication module in FastAPI. Include hashing with Argon2 and refresh token logic."
        plan = mlx_engine.generate_response(plan_prompt, model_key="reasoning")
        print("\n### Implementation Plan Generated")
        print(plan)
        
        # Step 2: Write Initial Code
        gen_prompt = f"Based on this plan, write the full implementation for backend/auth.py:\n{plan}\nReturn ONLY the code blocks."
        initial_code_raw = mlx_engine.generate_response(gen_prompt, model_key=self.model_key)
        
        auth_file = "/Users/rohitchandra/Documents/AI/backend/auth.py"
        test_file = "/Users/rohitchandra/Documents/AI/tests/test_auth.py"
        
        # Helper to extract code
        def extract_code(raw):
            if "```" in raw:
                code = raw.split("```")[1]
                if code.startswith("python"): code = code[6:]
                return code.strip()
            return raw.strip()

        initial_code = extract_code(initial_code_raw)
        with open(auth_file, 'w') as f:
            f.write(initial_code)
            
        # Step 3: Enter Verify-and-Fix Loop
        test_cmd = f"python3 -m pytest {test_file}"
        
        # Ensure test file exists or create a basic smoke test
        if not os.path.exists(test_file):
            smoke_test = """
import pytest
from backend.auth import create_access_token

def test_token_creation():
    token = create_access_token({"sub": "testuser"})
    assert token is not None
"""
            os.makedirs(os.path.dirname(test_file), exist_ok=True)
            with open(test_file, 'w') as f:
                f.write(smoke_test.strip())

        print("🔄 Entering Verify-and-Fix Loop...")
        success, message = debugger_agent.debug_file(auth_file, test_cmd)
        
        if success:
            print("✅ Mission Control: AUTH MODULE IS GREEN.")
        else:
            print(f"❌ Mission Control: AUTH MODULE FAILED. {message}")

mission_control = MissionControl()
