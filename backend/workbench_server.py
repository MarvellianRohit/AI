import os
import subprocess
import time
import shutil
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

class WorkbenchHandler(FileSystemEventHandler):
    def __init__(self, src_dir, dest_dir):
        self.src_dir = src_dir
        self.dest_dir = dest_dir

    def on_modified(self, event):
        if not event.is_directory and event.src_path.endswith('.jsx'):
            print(f"Syncing change: {event.src_path}")
            shutil.copy(event.src_path, os.path.join(self.dest_dir, "App.jsx"))

class WorkbenchServer:
    def __init__(self):
        self.workspace_root = "/Users/rohitchandra/Documents/AI/scratchpad/workbench"
        self.vite_project = os.path.join(self.workspace_root, "vite-app")
        self.src_sync = os.path.join(self.workspace_root, "current_ui.jsx")
        self.vite_src = os.path.join(self.vite_project, "src/App.jsx")
        self.process = None

    def setup_vite(self):
        """Initializes a minimal Vite + React project."""
        if not os.path.exists(self.vite_project):
            os.makedirs(self.workspace_root, exist_ok=True)
            print("Creating Vite project...")
            subprocess.run(["npm", "create", "vite@latest", "vite-app", "--", "--template", "react"], cwd=self.workspace_root, shell=True)
            subprocess.run(["npm", "install", "-D", "tailwindcss", "postcss", "autoprefixer"], cwd=self.vite_project, shell=True)
            subprocess.run(["npx", "tailwindcss", "init", "-p"], cwd=self.vite_project, shell=True)
            
            # Configure Tailwind
            with open(os.path.join(self.vite_project, "tailwind.config.js"), 'w') as f:
                f.write('/** @type {import(\'tailwindcss\').Config} */\nexport default { content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"], theme: { extend: {} }, plugins: [] }')
            
            with open(os.path.join(self.vite_project, "src/index.css"), 'w') as f:
                f.write('@tailwind base;\n@tailwind components;\n@tailwind utilities;')

    def start(self):
        self.setup_vite()
        print("Starting Vite dev server on port 3000...")
        self.process = subprocess.Popen(["npm", "run", "dev", "--", "--port", "3000"], cwd=self.vite_project, shell=True)
        
        # Start Watcher
        event_handler = WorkbenchHandler(self.workspace_root, os.path.join(self.vite_project, "src"))
        observer = Observer()
        observer.schedule(event_handler, self.workspace_root, recursive=False)
        observer.start()
        
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            observer.stop()
            self.process.terminate()
        observer.join()

if __name__ == "__main__":
    server = WorkbenchServer()
    server.start()
