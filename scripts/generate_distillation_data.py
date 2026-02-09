import os
import json
import time
from backend.mlx_engine import mlx_engine

# Output directory
DATA_DIR = "/Users/rohitchandra/Documents/AI/data/distillation"
os.makedirs(DATA_DIR, exist_ok=True)
OUTPUT_FILE = os.path.join(DATA_DIR, "nexus_junior_train.jsonl")

# Problem categories for variety
CATEGORIES = [
    "Agent Logic & Tooling",
    "UI Component Styling (Tailwind/Framer)",
    "Backend API & Database Integration",
    "ML Orchestration (MLX/Metal)",
    "Self-Correction & Debugging Loops",
    "Infrastructure as Code (Terraform/Docker)"
]

TEACHER_PROMPT_TEMPLATE = """
As the Master Architect of Nexus-AI, generate a highly complex, project-specific coding problem and its optimal solution.
The problem should be related to the category: {category}.
The solution must follow the Nexus-AI style: high performance, M3 Max optimized, and clean architectural separation.

Structure your response exactly as:
PROBLEM: [Description of a challenge that could arise in the Nexus-AI repository]
CODE:
```python/tsx
[Implementation]
```
"""

import requests

# API Configuration
SERVER_URL = "http://localhost:8080/api/generate"

def generate_data(num_samples=1000):
    print(f"🚀 Starting Knowledge Distillation (API-Mode): Generating {num_samples} samples...")
    start_time = time.time()
    
    # Smart Resume: Count existing samples
    existing_count = 0
    if os.path.exists(OUTPUT_FILE):
        with open(OUTPUT_FILE, "r") as f:
            existing_count = sum(1 for _ in f)
    
    print(f"📊 Smart Resume: Found {existing_count} existing samples. Resuming...")

    with open(OUTPUT_FILE, "a") as f:
        for i in range(existing_count, num_samples):
            category = CATEGORIES[i % len(CATEGORIES)]
            print(f"[{i+1}/{num_samples}] Requesting generation for: {category}")
            
            prompt = TEACHER_PROMPT_TEMPLATE.format(category=category)
            
            try:
                # Call centralized server
                response = requests.post(SERVER_URL, json={
                    "prompt": prompt,
                    "model_key": "reasoning"
                }, timeout=600)
                
                raw_response = response.json().get("result", "")
                
                # Simple parsing
                if "PROBLEM:" in raw_response and "CODE:" in raw_response:
                    problem_part = raw_response.split("PROBLEM:")[1].split("CODE:")[0].strip()
                    code_part = raw_response.split("CODE:")[1].strip()
                    
                    data_entry = {
                        "text": f"Instruction: {problem_part}\nResponse: {code_part}"
                    }
                    f.write(json.dumps(data_entry) + "\n")
                    f.flush()
                else:
                    print(f"⚠️ Sample {i+1} failed parsing. Skipping...")
            except Exception as e:
                print(f"🚨 Error generating sample {i+1}: {e}")
                
            if (i + 1) % 10 == 0:
                elapsed = time.time() - start_time
                print(f"📈 Progress: {i+1} samples in {elapsed:.2f}s (~{elapsed/(i+1):.2f}s/sample)")

if __name__ == "__main__":
    generate_data(1000)
