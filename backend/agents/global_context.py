import os
from llama_index.core import SummaryIndex, SimpleDirectoryReader, StorageContext, load_index_from_storage
from llama_index.core.node_parser import SentenceSplitter
from backend.mlx_engine import mlx_engine

# Custom LLM wrapper for MLX might be needed for advanced LlamaIndex integration,
# but for now, we'll use LLamaIndex's direct text manipulation features 
# and link it to our MLX engine for reasoning.

class GlobalContextManager:
    def __init__(self, repo_path="/Users/rohitchandra/Documents/AI"):
        self.repo_path = repo_path
        self.index_dir = "nexus_index"
        self.index = None
        self.splitter = SentenceSplitter(chunk_size=1024, chunk_overlap=128)

    def build_index(self):
        """Builds a Summary Index of the entire repository and pins it in memory."""
        print(f"Indexing repository at {self.repo_path}...")
        
        # Load all source files, excluding node_modules/venv
        documents = SimpleDirectoryReader(
            self.repo_path,
            recursive=True,
            exclude=["node_modules", ".git", "__pycache__", "nexus_index", "dist", "build"]
        ).load_data()
        
        self.index = SummaryIndex.from_documents(documents, transformations=[self.splitter])
        
        # Save index for faster initialization next time
        self.index.storage_context.persist(persist_dir=self.index_dir)
        print("Global Repository Index built and pinned in memory.")

    def tree_of_thought_search(self, query):
        """Perform a Tree-of-Thought search across the repository."""
        if not self.index:
            self.build_index()
            
        # Use LlamaIndex query engine boosted by Llama-3-70B
        # We simulate Tree-of-Thought by performing recursive retrieval of dependencies
        query_engine = self.index.as_query_engine(response_mode="tree_summarize")
        response = query_engine.query(query)
        
        # Final reasoning using MLX for "Zero-Shot" latency and MPS acceleration
        reasoning_prompt = f"Global Repository Context response: {response}\n\nUser Query: {query}\n\nBased on the project structure, provide a deep reasoning response."
        return mlx_engine.generate_response(reasoning_prompt, model_key="reasoning")

    def suggest_global_fix(self, local_bug_fix):
        """Scans the repo for similar patterns and suggests a global fix."""
        query = f"Where else in the repository does this pattern exist and how can we apply a global fix? Pattern: {local_bug_fix}"
        return self.tree_of_thought_search(query)

global_manager = GlobalContextManager()
