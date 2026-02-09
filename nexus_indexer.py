import os
import time
import json
import requests
import concurrent.futures
from pathlib import Path
import chromadb
from chromadb.config import Settings

# Configuration
CHROMA_HOST = "localhost"
CHROMA_PORT = 8000
OLLAMA_EMBED_URL = "http://localhost:11434/api/embeddings"
MODEL_NAME = "nomic-embed-text"
CHUNK_SIZE_WORDS = 500
MAX_CORES = 16
BATCH_SIZE = 50

# Optimized Exclusion List
EXCLUDE_DIRS = {
    '.git', 'node_modules', '.next', 'chroma_db', 'playwright-report', 
    'test-results', '__pycache__', 'models', 'dist', 'build', 'Library',
    'Applications', 'System', 'Volumes', '.DS_Store'
}
EXCLUDE_EXTENSIONS = {'.exe', '.bin', '.iso', '.obj', '.pyc', '.node', '.dll', '.so'}

class NexusIndexer:
    def __init__(self, target_path):
        self.target_path = Path(target_path)
        self.client = chromadb.HttpClient(host=CHROMA_HOST, port=CHROMA_PORT)
        self.collection = self.client.get_or_create_collection(name="nexus_global_index")
        self.executor = concurrent.futures.ProcessPoolExecutor(max_workers=MAX_CORES)

def process_file_worker(file_info):
    file_path, model_name = file_info
    try:
        if Path(file_path).suffix in EXCLUDE_EXTENSIONS:
            return []
        
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
            if not content.strip():
                return []
            
            # Simple chunking within the worker
            words = content.split()
            chunks = [" ".join(words[i:i + CHUNK_SIZE_WORDS]) for i in range(0, len(words), CHUNK_SIZE_WORDS)]
            
            results = []
            for i, chunk in enumerate(chunks):
                payload = {"model": model_name, "prompt": chunk}
                try:
                    response = requests.post(OLLAMA_EMBED_URL, json=payload, timeout=30)
                    embedding = response.json().get("embedding")
                    if embedding:
                        results.append({
                            "id": f"{file_path}_{i}",
                            "embedding": embedding,
                            "document": chunk,
                            "metadata": {"path": str(file_path), "chunk_index": i}
                        })
                except Exception as e:
                    pass
            return results
    except Exception:
        return []

class NexusIndexer:
    def __init__(self, target_path):
        self.target_path = Path(target_path)
        self.client = chromadb.HttpClient(host=CHROMA_HOST, port=CHROMA_PORT)
        self.collection = self.client.get_or_create_collection(name="nexus_global_index")

    def run(self):
        print(f"🚀 Starting Aggressive Indexing of {self.target_path}")
        start_time = time.time()
        files_to_process = []

        for root, dirs, files in os.walk(self.target_path):
            dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
            for file in files:
                files_to_process.append((str(Path(root) / file), MODEL_NAME))

        print(f"📁 Found {len(files_to_process)} files. Beginning parallel processing...")

        indexed_count = 0
        current_batch = {"ids": [], "embeddings": [], "documents": [], "metadatas": []}

        with concurrent.futures.ProcessPoolExecutor(max_workers=MAX_CORES) as executor:
            for results in executor.map(process_file_worker, files_to_process):
                for res in results:
                    current_batch["ids"].append(res["id"])
                    current_batch["embeddings"].append(res["embedding"])
                    current_batch["documents"].append(res["document"])
                    current_batch["metadatas"].append(res["metadata"])

                    if len(current_batch["ids"]) >= BATCH_SIZE:
                        self.collection.add(**current_batch)
                        indexed_count += len(current_batch["ids"])
                        current_batch = {"ids": [], "embeddings": [], "documents": [], "metadatas": []}
                        print(f"✅ Indexed {indexed_count} chunks...")

        if current_batch["ids"]:
            self.collection.add(**current_batch)
            indexed_count += len(current_batch["ids"])

        end_time = time.time()
        print(f"🏁 Finished! Indexed {indexed_count} chunks in {end_time - start_time:.2f} seconds.")

if __name__ == "__main__":
    # Index only the Documents folder for the first test run to be safe
    target = "/Users/rohitchandra/Documents"
    indexer = NexusIndexer(target)
    indexer.run()
