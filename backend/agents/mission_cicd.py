import os
import subprocess
import time
import json
from backend.mlx_engine import mlx_engine

class MissionCICD:
    def __init__(self):
        # Specialized models for roles
        self.dev_model = "turbo" # Gemma-2-9B (Fast, specialized in syntax/logic)
        self.sre_model = "reasoning" # Llama-3-70B (Complex reasoning for Infra/SRE)
        
    def run_mission(self):
        print("🚀 Mission Initiation: Production CI/CD & User Auth Module")
        
        # Step 1: Agent A (Developer) - Write Backend Logic
        print("\n[Agent A - Developer] Generating User Auth logic...")
        dev_prompt = "Implement a production-ready User Auth module in FastAPI using SQLAlchemy and Pydantic. Focus on password hashing and JWT token logic. Return ONLY code."
        auth_code = mlx_engine.generate_response(dev_prompt, model_key=self.dev_model)
        
        # Save to temporary file for verification
        os.makedirs("scratchpad/mission", exist_ok=True)
        auth_path = "scratchpad/mission/auth.py"
        with open(auth_path, "w") as f:
            f.write(auth_code.strip())
            
        print(f"✅ Agent A saved code to {auth_path}")

        # Step 2: Agent B (SRE) - Verify and Build Infra
        print("\n[Agent B - SRE] Verifying code and generating Terraform...")
        
        # Local Verification Loop
        success, logs = self.verify_in_container(auth_path)
        
        if not success:
            print(f"❌ Verification Failed. Passing logs back to Agent A...")
            retry_prompt = f"Agent B reports failure in container run. LOGS:\n{logs}\n\nPlease fix the code above and return the corrected version."
            auth_code = mlx_engine.generate_response(retry_prompt, model_key=self.dev_model)
            with open(auth_path, "w") as f:
                f.write(auth_code.strip())
            print("🔄 Agent A applied fix. Re-verifying...")
            success, logs = self.verify_in_container(auth_path)

        if success:
            print("✅ Code Verified. Agent B generating Terraform and CI/CD config...")
            sre_prompt = "Generate a Terraform main.tf for deploying a FastAPI app to Google Cloud Run with a Cloud SQL (Postgres) database. Also provide a GitHub Actions yaml for CI/CD. Return ONLY code blocks."
            sre_output = mlx_engine.generate_response(sre_prompt, model_key=self.sre_model)
            
            # Parsing and saving SRE outputs
            self.save_sre_configs(sre_output)
            print("🚀 Mission Complete: Production-ready Auth and CI/CD pipeline generated.")
        else:
            print("🚨 Mission Halted: Unable to reach 'Green' state.")

    def verify_in_container(self, code_path):
        """Builds a temporary Docker image and runs a health check."""
        dockerfile_content = f"""
FROM python:3.9-slim
WORKDIR /app
COPY {code_path} auth.py
RUN pip install fastapi uvicorn sqlalchemy pydantic passlib[argon2] python-jose[cryptography] PyYAML
CMD ["python", "auth.py"]
"""
        with open("scratchpad/mission/Dockerfile", "w") as f:
            f.write(dockerfile_content)
            
        print("🔨 Building verification container...")
        build = subprocess.run(["docker", "build", "-t", "mission-verify", "scratchpad/mission/"], capture_output=True, text=True)
        
        if build.returncode != 0:
            return False, build.stderr
            
        print("🧪 Running health check...")
        run = subprocess.run(["docker", "run", "--rm", "mission-verify", "python", "-c", "import auth; print('Import logic verified')"], capture_output=True, text=True)
        
        return run.returncode == 0, run.stdout + run.stderr

    def save_sre_configs(self, raw_output):
        # Basic parsing of multi-block output
        os.makedirs("infrastructure", exist_ok=True)
        os.makedirs(".github/workflows", exist_ok=True)
        
        blocks = raw_output.split("```")
        for i, block in enumerate(blocks):
            if "terraform" in block.lower() or "hcl" in block.lower():
                content = block.split("\n", 1)[1] if "\n" in block else block
                with open("infrastructure/main.tf", "w") as f: f.write(content.strip())
            elif "yaml" in block.lower() or "workflow" in block.lower():
                content = block.split("\n", 1)[1] if "\n" in block else block
                with open(".github/workflows/production.yml", "w") as f: f.write(content.strip())

mission_controller = MissionCICD()
