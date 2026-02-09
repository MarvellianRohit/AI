import sys
import time
import requests
import chromadb
from chromadb.config import Settings

# Configuration
CHROMA_HOST = "localhost"
CHROMA_PORT = 8000
OLLAMA_EMBED_URL = "http://localhost:11434/api/embeddings"
MODEL_NAME = "nomic-embed-text"

def get_embedding(text):
    payload = {"model": MODEL_NAME, "prompt": text}
    try:
        response = requests.post(OLLAMA_EMBED_URL, json=payload, timeout=10)
        return response.json().get("embedding")
    except Exception as e:
        print(f"Embedding error: {e}")
        return None

def search(query, n_results=5):
    client = chromadb.HttpClient(host=CHROMA_HOST, port=CHROMA_PORT)
    try:
        collection = client.get_collection(name="nexus_global_index")
    except Exception:
        print("❌ Error: Global index not found. Please run the indexer first.")
        return

    start_time = time.time()
    query_embedding = get_embedding(query)
    
    if not query_embedding:
        print("❌ Error: Failed to generate embedding for query.")
        return

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=n_results
    )
    
    end_time = time.time()
    duration_ms = (end_time - start_time) * 1000

    print(f"\n🔍 Searching for: '{query}'")
    print(f"⏱️  Query completed in {duration_ms:.2f}ms\n")

    if not results or not results['documents']:
        print("No results found.")
        return

    for i in range(len(results['documents'][0])):
        doc = results['documents'][0][i]
        meta = results['metadatas'][0][i]
        dist = results['distances'][0][i]
        
        print(f"--- Result {i+1} (Distance: {dist:.4f}) ---")
        print(f"📂 Path: {meta['path']}")
        print(f"📄 Snippet:\n{doc[:200]}...")
        print("-" * 40)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 nexus_search.py \"your search query\"")
    else:
        search(" ".join(sys.argv[1:]))
