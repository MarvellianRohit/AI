import sys
import os
import time

# Add project root to path
sys.path.append(os.getcwd())

from backend.operator import operator_agent

def test_system_operator():
    print("--- 🏁 Starting System Operator Test 🏁 ---")
    goal = "Create a directory named 'operator_test_dir', go inside it, and initialize a git repo."
    
    print(f"Goal: {goal}")
    print("🚀 Triggering Operator Agent (Llama-3-70B + Safety Sandbox)...")
    
    # 1. Start the goal (Generator)
    generator = operator_agent.run_goal(goal)
    
    try:
        while True:
            chunk = next(generator)
            print(chunk, end="", flush=True)
            
            # Check for wait signal
            if "__WAIT_FOR_APPROVAL__" in chunk:
                cmd = chunk.split(":")[1]
                print(f"\n[TEST] Simulated Approval Signal for: {cmd}")
                
                # 2. Approve the command
                time.sleep(1)
                observation = operator_agent.approve_command(approved=True)
                print(f"\n📝 [Observation from Approval]\n{observation}")
                
                # Note: In the real server, the generator would need to be re-triggered 
                # or maintained. For this script, we'll continue the loop if we can,
                # but typically a ReAct loop with approvals is multi-turn over API.
    except StopIteration:
        print("\n--- 🏁 Test Loop Finished 🏁 ---")

if __name__ == "__main__":
    # Clean up previous tests
    if os.path.exists("operator_test_dir"):
        import shutil
        shutil.rmtree("operator_test_dir")
        
    test_system_operator()
