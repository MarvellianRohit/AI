import sys
import os
import time

# Add project root to path
sys.path.append(os.getcwd())

from backend.deep_research import deep_research_orchestrator

def test_deep_research():
    print("--- 🏁 Starting Deep Research Workflow Test 🏁 ---")
    topic = "Implementation of Secure Guardrails in Local LLM Architectures for M3 Max"
    
    print(f"Topic: {topic}")
    print("🚀 Triggering Deep Research Engine (Parallel RAG + Web + 70B Synthesis)...")
    
    start_time = time.time()
    response = ""
    
    # Run the generator
    for chunk in deep_research_orchestrator.run_deep_research(topic):
        print(chunk, end="", flush=True)
        response += chunk
        
    end_time = time.time()
    duration = end_time - start_time
    
    print("\n" + "="*50)
    print(f"Total Research Duration: {duration:.2f}s")
    print("="*50)
    
    # Verification
    if "Executive Summary" in response and "Conclusion" in response:
        print("✅ SUCCESS: Whitepaper structure detected.")
    else:
        print("❌ FAILED: Response structure is incomplete.")
        
    if "[Local:" in response or "[Web:" in response:
        print("✅ SUCCESS: Citations detected.")
    else:
        print("⚠️ WARNING: No explicit citations found in the synthesis.")

if __name__ == "__main__":
    test_deep_research()
