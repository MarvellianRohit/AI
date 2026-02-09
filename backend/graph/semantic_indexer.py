import os
import glob
import json
import concurrent.futures
from pathlib import Path
from neo4j import GraphDatabase
import chromadb
from backend.mlx_engine import mlx_engine

# Configuration
DOCUMENTS_ROOT = "/Users/rohitchandra/Documents"
NEO4J_URI = "bolt://localhost:7687"
NEO4J_USER = "neo4j"
NEO4J_PASSWORD = "password123"
CHROMA_URL = "http://localhost:8000"

import requests

# API Configuration
SERVER_URL = "http://localhost:8080/api/generate"

class SemanticGraphIndexer:
    def __init__(self):
        print("🔗 Connecting to Neo4j...")
        self.driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))
        print("📁 Connecting to ChromaDB...")
        self.chroma_client = chromadb.HttpClient(host='localhost', port=8000)
        self.collection = self.chroma_client.get_or_create_collection(name="nexus_global_index")

    def close(self):
        self.driver.close()

    def extract_relationships(self, file_path):
        """Uses Llama-3-70B (via API) to extract semantic relationships from code."""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                code = f.read()
            
            # Use top 2000 chars for context to avoid overloading the context window per file
            snippet = code[:2000]
            rel_path = os.path.relpath(file_path, DOCUMENTS_ROOT)
            
            prompt = f"<|user|>\nAnalyze this code file: {rel_path}\nExtract architectural relationships (IMPORTS, INHERITS, CALLS, DEFINES, DEPENDS_ON).\nReturn ONLY valid JSON.\n\nCode:\n{snippet}\n<|assistant|>\n"
            
            # Call centralized server
            response = requests.post(SERVER_URL, json={
                "prompt": prompt,
                "model_key": "reasoning"
            }, timeout=600)
            
            data_raw = response.json().get("result", "")
            print(f"DEBUG: Raw response from LLM: {data_raw[:200]}...")
            
            # Robust JSON extraction
            json_start = data_raw.find('{')
            json_end = data_raw.rfind('}') + 1
            if json_start != -1 and json_end != 0:
                json_raw = data_raw[json_start:json_end]
                data = json.loads(json_raw)
            else:
                raise ValueError("No JSON found in LLM response")
            
            return rel_path, data, code
        except Exception as e:
            return None, str(e), None

    def ingest_to_neo4j(self, rel_path, data):
        with self.driver.session() as session:
            # Create Project Node
            project_name = rel_path.split('/')[0]
            session.run("MERGE (p:Project {name: $name})", {"name": project_name})
            
            # Create File Node and link to Project
            session.run("""
                MERGE (f:File {path: $path})
                WITH f
                MATCH (p:Project {name: $project})
                MERGE (p)-[:CONTAINS]->(f)
            """, {"path": rel_path, "project": project_name})
            
            # Ingest entities and relationships
            for entity in data.get("entities", []):
                session.run("""
                    MERGE (e {name: $name, type: $type})
                    WITH e
                    MATCH (f:File {path: $path})
                    MERGE (f)-[:DEFINES]->(e)
                """, {"name": entity['name'], "type": entity['type'], "path": rel_path})
                
            for rel in data.get("relationships", []):
                session.run(f"""
                    MERGE (s {{name: $source}})
                    MERGE (t {{name: $target}})
                    MERGE (s)-[:{rel.get('type', 'DEPENDS_ON')}]->(t)
                """, {"source": rel['source'], "target": rel['target']})

    def ingest_to_chroma(self, rel_path, code):
        self.collection.add(
            documents=[code[:5000]], # Chroma loves chunks
            metadatas=[{"path": rel_path, "project": rel_path.split('/')[0]}],
            ids=[rel_path]
        )

    def scan_workspace(self):
        extensions = ["*.py", "*.ts", "*.tsx", "*.js", "*.c", "*.cpp"]
        files = []
        # Focus on user documents but skip noise
        skip_dirs = {"node_modules", ".git", "Library", "ScreenShots", "Wallpapers", "Wifeey", "Large Videos"}
        
        for root, dirs, filenames in os.walk(DOCUMENTS_ROOT):
            dirs[:] = [d for d in dirs if d not in skip_dirs]
            for ext in extensions:
                for match in glob.glob(os.path.join(root, ext)):
                    files.append(match)
        
        print(f"🚀 Found {len(files)} files. Starting 16-core parallel processing...")
        
        # Using ThreadPoolExecutor to share the pinned model in unified memory
        with concurrent.futures.ThreadPoolExecutor(max_workers=16) as executor:
            future_to_file = {executor.submit(self.extract_relationships, f): f for f in files}
            for future in concurrent.futures.as_completed(future_to_file):
                rel_path, data, code = future.result()
                if rel_path:
                    print(f"✅ Indexed: {rel_path}")
                    self.ingest_to_neo4j(rel_path, data)
                    self.ingest_to_chroma(rel_path, code)
                else:
                    print(f"⚠️ Error: {data}")

if __name__ == "__main__":
    indexer = SemanticGraphIndexer()
    try:
        indexer.scan_workspace()
    finally:
        indexer.close()
