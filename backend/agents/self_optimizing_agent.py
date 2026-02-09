import requests
import json
import time
import os

SERVER_URL = "http://localhost:8080/api/generate"
STUDIO_WRITE_URL = "http://localhost:8080/api/studio/write"
ITERATIONS = 3

class RSILoop:
    def __init__(self, feature_name):
        self.feature_name = feature_name
        self.history = []

    def log_to_studio(self, content):
        """Streams the current state to the Nexus Canvas for live visualization."""
        try:
            requests.post(STUDIO_WRITE_URL, json={"content": content})
        except Exception as e:
            print(f"⚠️ Failed to stream to studio: {e}")

    def generate(self, prompt, role="Author"):
        print(f"🚀 [{role}] Thinking...")
        payload = {
            "prompt": prompt,
            "model_key": "reasoning"
        }
        
        # Retry logic for initial connection
        max_retries = 10
        for i in range(max_retries):
            try:
                # High timeout for 70B deep reasoning
                response = requests.post(SERVER_URL, json=payload, timeout=1200)
                response.raise_for_status()
                return response.json().get("result", "")
            except (requests.exceptions.ConnectionError, requests.exceptions.HTTPError) as e:
                print(f"📡 Server not ready (Attempt {i+1}/{max_retries}). Waiting 10s...")
                time.sleep(10)
        
        raise ConnectionError("Server failed to respond after multiple retries.")

    def run(self):
        print(f"🔥 Starting Recursive Self-Improvement for: {self.feature_name}")
        
        # Initial Draft
        author_prompt = f"Author: Create a full-stack, production-ready implementation of: {self.feature_name}. \nInclude React (Tailwind) frontend and FastAPI backend. Wrap the code in <artifact type=\"react\"> tags."
        current_code = self.generate(author_prompt)
        self.log_to_studio(current_code)
        
        for i in range(ITERATIONS):
            print(f"\n🔄 --- CYCLE {i+1} / {ITERATIONS} ---")
            
            # Critic Turn (70B Red-Team)
            critic_prompt = f"Critic (Red-Team): Perform a deep audit of the following implementation of {self.feature_name}.\nIdentify exactly 3 weaknesses in Performance, Security, and Scalability.\nCode:\n{current_code}"
            audit = self.generate(critic_prompt, role="Critic")
            print(f"🔎 Audit Result:\n{audit}")
            
            # Refinement Turn
            refine_prompt = f"Author: Rewrite the implementation of {self.feature_name} to address these 3 weaknesses identified by the Critic:\n{audit}\n\nMaintain all existing feature requirements. Wrap the final code in <artifact type=\"react\"> tags."
            current_code = self.generate(refine_prompt, role="Author")
            
            # Show evolution in Canvas
            self.log_to_studio(f"### Cycle {i+1} Refinement\n{current_code}")
        
        print(f"🏆 RSI Loop Complete. Final God-Mode implementation pushed to Canvas.")
        return current_code

if __name__ == "__main__":
    # Placeholder: In a real run, this would be passed from the UI
    FEATURE = os.environ.get("RSI_FEATURE", "Real-time Distributed Event Bus with Vector Store")
    loop = RSILoop(FEATURE)
    loop.run()
