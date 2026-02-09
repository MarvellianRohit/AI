import os
import json
import chromadb
from backend.mlx_engine import mlx_engine

class MemoryManager:
    def __init__(self):
        self.client = chromadb.HttpClient(host="localhost", port=8000)
        self.collection = self.client.get_or_create_collection(name="nexus_memory")

    def summarize_session(self, messages):
        """Generates a 3-sentence summary of the session."""
        session_text = "\n".join([f"{m['role']}: {m['content']}" for m in messages])
        prompt = f"Summarize the following AI chat session in exactly 3 concise sentences for memory storage:\n\n{session_text}\n\nSummary:"
        
        summary = mlx_engine.generate_response(prompt, model_key="turbo")
        return summary.strip()

    def store_memory(self, summary):
        """Stores a session summary in the vector database."""
        # Simple ID based on timestamp
        import time
        mem_id = f"mem_{int(time.time())}"
        
        # Get embedding
        import requests
        payload = {"model": "nomic-embed-text", "prompt": summary}
        response = requests.post("http://localhost:11434/api/embeddings", json=payload, timeout=10)
        embedding = response.json().get("embedding")
        
        if embedding:
            self.collection.add(
                ids=[mem_id],
                embeddings=[embedding],
                documents=[summary],
                metadatas=[{"type": "session_summary", "timestamp": time.time()}]
            )
            print(f"Memory stored: {mem_id}")

memory_manager = MemoryManager()
