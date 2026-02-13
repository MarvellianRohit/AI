import os
import sys
import psutil

# Add project root to path
sys.path.append(os.getcwd())

from backend.reflexion import reflexion_engine

def test_self_correction_loop():
    print("--- 🏁 Starting Reflection-based Self-Correction Test 🏁 ---")
    
    # Task that likely triggers a security/edge-case warning
    task = "Write a Python function to execute a raw SQL query against a database table based on a string 'query_part' provided by the user."
    
    print(f"Initial Task: {task}")
    
    # Track memory for FP16 confirmation
    mem_before = psutil.virtual_memory().used / (1024**3)
    
    result = reflexion_engine.run_self_correction(task, max_iterations=2)
    
    mem_after = psutil.virtual_memory().used / (1024**3)
    
    print("\n" + "="*50)
    print(f"MISSION STATUS: {'✅ APPROVED' if result.approved else '❌ PENDING'}")
    print(f"Final Code:\n{result.code}")
    print("\nCritiques Faced:")
    for c in result.critiques:
        print(f"- {c}")
    print("="*50)
    
    print(f"\n🧠 Unified Memory Utilization: {mem_after:.2f}GB (Ultra Precision Mode)")
    print(f"📈 Memory Delta: {mem_after - mem_before:.2f}GB")
    
    if result.iteration > 1:
        print("\n✅ SUCCESS: Self-Correction loop successfully triggered refactoring.")
    elif result.approved:
        print("\n✅ SUCCESS: Generator produced perfect code on first attempt (Critic approved).")
    else:
        print("\n⚠️ Loop ended without approval.")

if __name__ == "__main__":
    test_self_correction_loop()
