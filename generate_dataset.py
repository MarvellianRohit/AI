import os
import json
import random

def generate_dataset(root_dir, output_dir, split_ratio=0.9):
    data = []
    extensions = ('.ts', '.js', '.py')
    exclude_dirs = {'.git', 'node_modules', '.next', 'chroma_db', 'playwright-report', 'test-results', '__pycache__', 'models'}

    for root, dirs, files in os.walk(root_dir):
        # Prune excluded directories
        dirs[:] = [d for d in dirs if d not in exclude_dirs]
        
        for file in files:
            if file.endswith(extensions):
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                        if content.strip():
                            # Format for mlx-lm: a JSON object with a "text" key
                            data.append({"text": f"File: {file}\n\n{content}"})
                except Exception as e:
                    print(f"Error reading {file_path}: {e}")

    random.shuffle(data)
    split_idx = int(len(data) * split_ratio)
    train_data = data[:split_idx]
    valid_data = data[split_idx:]

    os.makedirs(output_dir, exist_ok=True)

    with open(os.path.join(output_dir, 'train.jsonl'), 'w', encoding='utf-8') as f:
        for entry in train_data:
            f.write(json.dumps(entry) + '\n')

    with open(os.path.join(output_dir, 'valid.jsonl'), 'w', encoding='utf-8') as f:
        for entry in valid_data:
            f.write(json.dumps(entry) + '\n')

    print(f"Generated {len(train_data)} training samples and {len(valid_data)} validation samples.")
    print(f"Dataset saved to {output_dir}")

if __name__ == "__main__":
    project_root = "/Users/rohitchandra/Documents/AI"
    output_path = os.path.join(project_root, "data")
    generate_dataset(project_root, output_path)
