#!/bin/bash

# Define paths
MODEL="mlx-community/Meta-Llama-3-8B-Instruct-4bit"
DATA_DIR="./data"
ADAPTER_PATH="./models/nexus-coder"

# Ensure models directory exists
mkdir -p ./models

# Run MLX LoRA training
# Parameters:
# --train: Enable training
# --model: Base model from Hugging Face or local path
# --data: Directory containing train.jsonl and valid.jsonl
# --batch-size: 8 (as requested for high-intensity usage)
# --lora-layers: 16 (default is often 16, but we specifically want rank 16)
# --rank: 16 (LoRA rank as requested)
# --iters: 500 (can be adjusted based on needs)
# --adapter-path: Where to save the weights
# --learning-rate: 1e-5 (common starting point)

# Run MLX LoRA training using the config file
python3 -m mlx_lm.lora --config lora_config.yaml
