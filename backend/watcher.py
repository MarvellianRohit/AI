import os
import re
import time
from pathlib import Path

ARTIFACT_DIR = "/Users/rohitchandra/Documents/AI/generative-studio/src"
WATCH_FILE = "/Users/rohitchandra/Documents/AI/backend/current_response.txt"

def parse_and_write_artifacts(text):
    # Regex to find <artifact type="react">...</artifact>
    pattern = r'<artifact type="react">(.*?)</artifact>'
    matches = re.findall(pattern, text, re.DOTALL)
    
    for i, content in enumerate(matches):
        # Extract the code from markdown block if present
        code_match = re.search(r'```(?:tsx|jsx|html)?\n(.*?)\n```', content, re.DOTALL)
        code = code_match.group(1) if code_match else content.strip()
        
        # Write to the Vite playground
        target_file = os.path.join(ARTIFACT_DIR, "App.tsx") # Currently single-file focus for HMR
        with open(target_file, "w") as f:
            f.write(code)
        print(f"✅ HMR: Artifact written to {target_file}")

if __name__ == "__main__":
    print("👀 Artifact Watcher Active...")
    last_size = 0
    while True:
        if os.path.exists(WATCH_FILE):
                current_size = os.path.getsize(WATCH_FILE)
                if current_size != last_size:
                    with open(WATCH_FILE, "r") as f:
                        parse_and_write_artifacts(f.read())
                    last_size = current_size
        time.sleep(0.5)
