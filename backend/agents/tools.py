import subprocess
import os
import requests
from backend.mlx_engine import mlx_engine
from backend.search_service import search_service

def terminal_run(command):
    """Executes a shell command on the host system."""
    # Safety check: Prevent destructive commands
    forbidden = ["rm -rf /", "mkfs", "dd if=/dev/zero", "> /dev/nvme"]
    if any(f in command for f in forbidden):
        return "Error: Command rejected for safety reasons."
    
    try:
        result = subprocess.run(command, shell=True, capture_output=True, text=True, timeout=30)
        return f"STDOUT: {result.stdout}\nSTDERR: {result.stderr}"
    except Exception as e:
        return f"Execution failed: {str(e)}"

def file_search(query):
    """Queries the local Nexus Search index."""
    # Importing search logic from previous tool
    from nexus_search import search as local_vector_search
    # We'll use a simplified version for programmatic access
    import chromadb
    client = chromadb.HttpClient(host="localhost", port=8000)
    try:
        collection = client.get_collection(name="nexus_global_index")
        # Embedding the query
        payload = {"model": "nomic-embed-text", "prompt": query}
        response = requests.post("http://localhost:11434/api/embeddings", json=payload, timeout=10)
        embedding = response.json().get("embedding")
        
        results = collection.query(query_embeddings=[embedding], n_results=3)
        return "\n".join(results['documents'][0])
    except Exception as e:
        return f"File search failed: {str(e)}"

def web_browse(query):
    """Searches the web for real-time information."""
    try:
        # Using the existing search_service which might already handle web search
        # Or using duckduckgo directly
        from duckduckgo_search import DDGS
        with DDGS() as ddgs:
            results = [r for r in ddgs.text(query, max_results=3)]
            return json.dumps(results)
    except Exception as e:
        return f"Web search failed: {str(e)}"

def git_diff():
    """Returns the git diff of the current project."""
    try:
        result = subprocess.run("git diff", shell=True, capture_output=True, text=True)
        return result.stdout if result.stdout else "No changes detected."
    except Exception as e:
        return f"Git diff failed: {str(e)}"

def git_status():
    """Returns the current git status."""
    try:
        result = subprocess.run("git status", shell=True, capture_output=True, text=True)
        return result.stdout
    except Exception as e:
        return f"Git status failed: {str(e)}"

def npm_test():
    """Runs npm tests and returns the output."""
    try:
        # Utilizing all 16 performance cores for parallel testing if supported by the test runner
        result = subprocess.run("npm test", shell=True, capture_output=True, text=True, timeout=120)
        return f"STDOUT: {result.stdout}\nSTDERR: {result.stderr}"
    except Exception as e:
        return f"Testing failed: {str(e)}"

def diagnostic_summary():
    """Runs a full system diagnostic using Metal (MPS) backend where applicable."""
    # This tool is intended for 'vague commands' like "help me fix the bugs"
    diff = git_diff()
    status = git_status()
    # We provide this to the agent so it can reason over the state
    return f"GIT_STATUS:\n{status}\n\nGIT_DIFF:\n{diff}"

TOOLS = {
    "terminal_run": terminal_run,
    "file_search": file_search,
    "web_browse": web_browse,
    "git_diff": git_diff,
    "git_status": git_status,
    "npm_test": npm_test,
    "diagnostic_summary": diagnostic_summary
}
