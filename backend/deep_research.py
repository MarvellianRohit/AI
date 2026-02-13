import os
import concurrent.futures
from typing import List, Dict, Any
import requests
from bs4 import BeautifulSoup
from backend.rag import rag_service
from backend.mlx_engine import mlx_engine
from backend.trace_logger import trace_logger

class DeepResearchOrchestrator:
    def __init__(self):
        self.tavily_api_key = os.getenv("TAVILY_API_KEY", "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") # Mock/User Key
        self.max_parallel_scrapers = 16

    def _web_search(self, query: str) -> List[Dict[str, str]]:
        """Uses Tavily API to find technical sources."""
        print(f"🌐 [Research] Querying Tavily for: {query}")
        url = "https://api.tavily.com/search"
        payload = {
            "api_key": self.tavily_api_key,
            "query": query,
            "search_depth": "advanced",
            "include_answer": False,
            "max_results": 5
        }
        try:
            response = requests.post(url, json=payload, timeout=15)
            response.raise_for_status()
            return response.json().get("results", [])
        except Exception as e:
            print(f"⚠️ Search Error: {e}")
            return []

    def _scrape_url(self, url: str) -> str:
        """Hardware Saturation: Scrapes content in parallel."""
        try:
            headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'}
            resp = requests.get(url, headers=headers, timeout=10)
            resp.raise_for_status()
            soup = BeautifulSoup(resp.content, "html.parser")
            # Remove scripts and styles
            for script in soup(["script", "style"]):
                script.decompose()
            text = soup.get_text(separator=" ", strip=True)
            return text[:10000] # Limit per source
        except Exception as e:
            return f"Error scraping {url}: {str(e)}"

    def run_deep_research(self, topic: str):
        """Main orchestrator for Deep Research."""
        print(f"🧠 [Research] Starting Deep Research Session: {topic}")
        
        # 1. Parallel Data Gathering
        with concurrent.futures.ThreadPoolExecutor(max_workers=self.max_parallel_scrapers) as executor:
            # Task A: Local RAG
            local_future = executor.submit(self._gather_local_knowledge, topic)
            # Task B: Web Search
            search_results = self._web_search(topic)
            # Task C: Parallel Scraping
            scrape_futures = {executor.submit(self._scrape_url, res['url']): res['url'] for res in search_results}
            
            # Wait for local knowledge
            local_context = local_future.result()
            
            # Gather web knowledge
            web_context = ""
            for future in concurrent.futures.as_completed(scrape_futures):
                url = scrape_futures[future]
                try:
                    content = future.result()
                    web_context += f"\n--- SOURCE: {url} ---\n{content}\n"
                except Exception as e:
                    print(f"Scrape failed for {url}: {e}")

        # 2. Synthesis (100k+ Context Window)
        print("📑 [Research] Synthesizing Technical Whitepaper (70B Teacher)...")
        
        synthesis_prompt = f"""You are the Nexus-AI Principal Researcher. 
Generate a professional, detailed Technical Whitepaper on the topic: "{topic}"

Use the following combined context from local internal files and external web sources.
Ensure you cite the sources appropriately (e.g. [Local: file.py] or [Web: example.com]).

--- LOCAL KNOWLEDGE BASE ---
{local_context}

--- WEB RESEARCH DATA ---
{web_context}

--- TASK ---
Synthesize these sources into a formal 5-section Technical Whitepaper:
1. Executive Summary
2. Technical Architecture & Background
3. Deep Analysis (Compare Local vs. Web findings)
4. Hardware Optimization & Future Trends
5. Conclusion & Recommendations

Output must be in high-quality Markdown.
"""
        # MLX Optimization: Using the 'reasoning' (70B) model with extreme memory allocation
        # We target the 128GB unified memory pool for sub-second synthesis tokens.
        for chunk in mlx_engine.stream_chat(synthesis_prompt, model_key="reasoning", max_tokens=8192):
            yield chunk

    def _gather_local_knowledge(self, query: str) -> str:
        """Queries local ChromaDB and provides a summaries."""
        print("📁 [Research] Searching local Knowledge Items...")
        # Since RAGService.query is a generator, we collapse it
        context = ""
        for chunk in rag_service.query(query):
            if "🔍" not in chunk and "📂" not in chunk and "📍" not in chunk and "🤔" not in chunk and "💡" not in chunk:
                context += chunk
        return context

deep_research_orchestrator = DeepResearchOrchestrator()
