import sys
import os
import time

# Add project root to path
sys.path.append(os.getcwd())

from backend.agents.mission_commander import mission_commander
from backend.agents.multi_agent_loop import mission_orchestrator

def test_dual_agent_mission():
    print("--- 🏁 Starting Dual-Agent Mission Test 🏁 ---")
    goal = "Build a CI/CD pipeline for Nexus-AI including a User Auth module and Terraform deployment to GCP."
    
    print(f"Mission Goal: {goal}")
    print("🚀 Initializing Mission Commander (Gemini 3 Flash)...")
    
    # 1. Plan
    tasks = mission_commander.create_task_list(goal)
    print(f"🎖️ Mission Tasks: {len(tasks)} items identified.")
    
    # 2. Execute Orchestrator Loop
    print("\n🚀 Starting Mission Orchestrator (100GB Zero-Latency Pinning)...")
    
    for log in mission_orchestrator.execute_mission(tasks):
        print(log, end="", flush=True)

    print("\n--- 🏁 Mission Loop Finished 🏁 ---")

if __name__ == "__main__":
    # Clean up temp files
    if os.path.exists("backend/temp_verify.py"):
        os.remove("backend/temp_verify.py")
        
    test_dual_agent_mission()
