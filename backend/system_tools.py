import os
import subprocess
from typing import List, Dict, Any, Tuple, Optional

class SystemTools:
    @staticmethod
    def exec_shell(command: str) -> Tuple[bool, str]:
        """Runs a terminal command and returns (success, output)."""
        print(f"🖥️ [System] Executing: {command}")
        try:
            result = subprocess.run(
                command, 
                shell=True, 
                capture_output=True, 
                text=True, 
                cwd=os.getcwd()
            )
            if result.returncode == 0:
                return True, result.stdout
            else:
                return False, result.stderr
        except Exception as e:
            return False, str(e)

    @staticmethod
    def read_file_tree(startpath: str = ".") -> str:
        """Generates a recursive directory structure map."""
        tree = []
        for root, dirs, files in os.walk(startpath):
            # Skip hidden and ignored dirs
            dirs[:] = [d for d in dirs if not d.startswith('.') and d not in ['node_modules', 'dist', '__pycache__']]
            level = root.replace(startpath, '').count(os.sep)
            indent = ' ' * 4 * level
            tree.append(f"{indent}{os.path.basename(root)}/")
            sub_indent = ' ' * 4 * (level + 1)
            for f in files:
                if not f.startswith('.'):
                    tree.append(f"{sub_indent}{f}")
        return "\n".join(tree)

    @staticmethod
    def git_manager(action: str, message: Optional[str] = None) -> Tuple[bool, str]:
        """Handles basic git operations: init, commit, push."""
        actions = {
            "init": "git init",
            "add": "git add .",
            "commit": f'git commit -m "{message}"' if message else 'git commit -m "Auto-commit from Nexus-AI"',
            "push": "git push origin main",
            "status": "git status"
        }
        
        cmd = actions.get(action)
        if not cmd:
            return False, "Invalid git action"
            
        return SystemTools.exec_shell(cmd)

system_tools = SystemTools()
