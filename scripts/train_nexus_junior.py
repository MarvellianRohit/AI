import os
import subprocess

# Paths
DATA_FILE = "/Users/rohitchandra/Documents/AI/data/distillation/nexus_junior_train.jsonl"
BASE_MODEL = "mlx-community/Meta-Llama-3-8B-Instruct-4bit"
ADAPTER_PATH = "/Users/rohitchandra/Documents/AI/models/nexus-junior-v1-adapters"

def train():
    print("🚀 Initializing Fine-tuning for Nexus-Junior...")
    
    # MLX-LM training command
    # We use LoRA for efficiency. 
    # Hyperparameters optimized for Nexus-AI specific style transfer.
    cmd = [
        "python", "-m", "mlx_lm.lora",
        "--model", BASE_MODEL,
        "--data", os.path.dirname(DATA_FILE),
        "--train",
        "--batch-size", "4",
        "--iters", "1000",
        "--save-every", "100",
        "--steps-per-report", "10",
        "--adapter-file", ADAPTER_PATH,
        "--learning-rate", "1e-5",
        "--lora-layers", "16",
        "--rank", "16"
    ]
    
    # Note: MLX handles memory allocation dynamically, but we ensure 32GB is available 
    # by ensuring the teacher model is unloaded before this starts.
    
    print(f"Running command: {' '.join(cmd)}")
    subprocess.run(cmd)

if __name__ == "__main__":
    train()
