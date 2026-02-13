import sys
import os

# Add project root to path
sys.path.append(os.getcwd())

from backend.mlx_engine import mlx_engine

def test_triage_routing():
    print("--- 🏁 Starting Backend Triage Test 🏁 ---")
    
    ui_request = "Make the submit button blue and add a hover scale effect."
    complex_request = "Design a distributed database schema for a global social media platform."
    
    print(f"Request A (UI): {ui_request}")
    classification_a = mlx_engine.triage(ui_request)
    print(f"Result A: {classification_a} (Expected: SIMPLE)\n")
    
    print(f"Request B (Architectural): {complex_request}")
    classification_b = mlx_engine.triage(complex_request)
    print(f"Result B: {classification_b} (Expected: COMPLEX)\n")

    if classification_a == "SIMPLE" and classification_b == "COMPLEX":
        print("✅ Triage logic verified: UI tweaks correctly routed to turbo model.")
    else:
        print("❌ Triage logic failed to distinguish request types correctly.")

if __name__ == "__main__":
    test_triage_routing()
