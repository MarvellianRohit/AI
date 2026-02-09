import os
import sys
from backend.graph.semantic_indexer import SemanticGraphIndexer

def test_pipeline():
    print("🧪 Starting Simple Pipeline Verification...")
    indexer = SemanticGraphIndexer()
    
    # Test file
    test_file = "/Users/rohitchandra/Documents/AI/backend/auth_production.py"
    
    try:
        # We manually call with 'turbo' for the test
        from backend.mlx_engine import mlx_engine
        
        rel_path = os.path.relpath(test_file, indexer.DOCUMENTS_ROOT if hasattr(indexer, 'DOCUMENTS_ROOT') else "/Users/rohitchandra/Documents")
        with open(test_file, 'r') as f: code = f.read()
        
        prompt = f"<|user|>\nExtract relationships from {rel_path}. Return ONLY JSON.\nCode:\n{code[:1000]}\n<|assistant|>\n"
        response = mlx_engine.generate_response(prompt, model_key="turbo")
        print(f"DEBUG: Response: {response}")
        
        # If the indexer logic works, we can just run a slice of it
        indexer.scan_workspace = lambda: None # Disable global scan
        indexer.ingest_to_neo4j("test/auth.py", {"entities": [], "relationships": []})
        print("✅ Neo4j Connection Verified.")
        
    finally:
        indexer.close()

if __name__ == "__main__":
    test_pipeline()
