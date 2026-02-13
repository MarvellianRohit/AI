from typing import List, Dict, Any
from backend.search_service import search_service

class MissionCommander:
    def __init__(self):
        self.model = "gemini-3-flash"

    def create_task_list(self, mission_goal: str) -> List[Dict[str, Any]]:
        """
        Decomposes a mission goal into a structured task list using Gemini Flash.
        """
        print(f"🎖️ [Commander] Planning Mission: {mission_goal}")
        
        prompt = f"""You are the Nexus-AI Mission Commander. 
Decompose the following high-level mission into a set of specialized tasks for two agents:
1. Agent A (Developer): Backend logic, API design, Auth modules.
2. Agent B (SRE): Infrastructure, Deployment (Terraform), CI/CD (GitHub Actions), Containerization.

Mission: "{mission_goal}"

Return the task list as a JSON array of objects:
[
  {{"id": 1, "agent": "A", "task": "Task description", "description": "Details"}},
  {{"id": 2, "agent": "B", "task": "Task description", "description": "Details"}}
]
Return ONLY the JSON.
"""
        # Call chat_stream and aggregate chunks
        response = ""
        for chunk in search_service.chat_stream(prompt):
            if "⚡" not in chunk: # Filter out status prefix if present
                response += chunk
        
        try:
            import json
            import re
            # Extract JSON from potential markdown markers
            match = re.search(r'\[.*\]', response, re.DOTALL)
            if match:
                return json.loads(match.group(0))
        except Exception as e:
            print(f"Commander Parsing Error: {e}\nResponse was: {response}")
            
        # Fallback tasks if parsing fails
        return [
            {"id": 1, "agent": "A", "task": "User Auth Logic", "description": "Implement core backend logic for user authentication."},
            {"id": 2, "agent": "B", "task": "Terraform GCP Deployment", "description": "Create Terraform scripts to deploy the auth module to Google Cloud."},
            {"id": 3, "agent": "B", "task": "Setup GitHub Actions", "description": "Configure CI/CD pipeline with GitHub Actions."}
        ]

mission_commander = MissionCommander()
