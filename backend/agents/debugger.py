import os
import subprocess
import json
from backend.mlx_engine import mlx_engine

class AutonomousDebugger:
    def __init__(self, max_cycles=5):
        self.max_cycles = max_cycles
        self.model_key = "reasoning" # Llama-3-70B

    def run_tests(self, test_cmd):
        """Runs tests in parallel using M3 Max's 16 cores."""
        print(f"Running tests: {test_cmd}")
        # Utilize all cores where possible (depends on the test runner support)
        result = subprocess.run(test_cmd, shell=True, capture_output=True, text=True)
        return result.returncode == 0, result.stdout, result.stderr

    def analyze_and_fix(self, file_path, traceback):
        """Reason about the fix using Llama-3-70B and apply it."""
        with open(file_path, 'r') as f:
            code = f.read()

        prompt = f"""
You are an expert debugger. The following file has a failing test:
FILE_PATH: {file_path}
TRACEBACK:
{traceback}

CURRENT_CODE:
{code}

Analyze the error and provide the updated code for the ENTIRE file. 
Return ONLY the code within a code block.
"""
        updated_code_raw = mlx_engine.generate_response(prompt, model_key=self.model_key)
        
        # Extract code from Markdown block if present
        if "```" in updated_code_raw:
            updated_code = updated_code_raw.split("```")[1]
            if updated_code.startswith("python"): updated_code = updated_code[6:]
            if updated_code.startswith("javascript"): updated_code = updated_code[10:]
            if updated_code.startswith("typescript"): updated_code = updated_code[10:]
        else:
            updated_code = updated_code_raw

        with open(file_path, 'w') as f:
            f.write(updated_code.strip())
        
        return updated_code.strip()

    def debug_file(self, file_path, test_cmd):
        """Autonomous debugging loop (5 cycles)."""
        print(f"Starting debugging session for {file_path}...")
        
        for cycle in range(1, self.max_cycles + 1):
            success, stdout, stderr = self.run_tests(test_cmd)
            if success:
                print(f"Cycle {cycle}: Tests PASSED!")
                return True, "Fixed"
            
            print(f"Cycle {cycle}: Tests FAILED. Analyzing traceback...")
            traceback = stderr if stderr else stdout
            self.analyze_and_fix(file_path, traceback)
            
        return False, "Max cycles reached without fix."

debugger_agent = AutonomousDebugger()
