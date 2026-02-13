import json
import re
from typing import List, Dict, Any, Optional, Generator
from backend.mlx_engine import mlx_engine
from backend.system_tools import system_tools

class OperatorAgent:
    def __init__(self):
        self.model_key = "reasoning" # Llama-3-70B
        self.pending_command: Optional[Dict[str, str]] = None # {command: str, explanation: str}
        self.is_approved: bool = False

    def run_goal(self, goal: str) -> Generator[str, None, None]:
        """
        ReAct Loop: 
        1. Think about the goal.
        2. Propose a tool call (Action).
        3. If it's a shell command, explain and wait for approval.
        4. Execute action (if approved or non-shell).
        5. Observe result and repeat.
        """
        context = f"High-level Goal: {goal}\n\n"
        
        for iteration in range(10): # Max 10 steps to prevent infinite loops
            prompt = f"""You are the Nexus-AI System Operator. 
Your goal is: "{goal}"

You have access to the following tools:
1. `exec_shell(command)`: Run a terminal command.
2. `read_file_tree()`: See the current directory structure.
Use the following EXACT format for every step. Do NOT skip the Action block.

Example Step:
Thought: I need to check the folder structure before creating the directory.
Action: {{"tool": "read_file_tree", "args": {{}}, "explanation": "Seeing current files to avoid name collisions."}}
Observation: index.html, backend/

Example Final Answer:
Thought: I have completed all steps.
Final Answer: Done

Your current task is: "{goal}"
--- CONTEXT ---
{context}
"""
            response = mlx_engine.generate_response(prompt, model_key=self.model_key)
            yield f"🧠 [Operator Thought]\n{self._extract_thought(response)}\n"
            
            action = self._parse_action(response)
            if not action:
                yield "✅ Goal reached or no further actions needed."
                break
            
            explanation = action.get("explanation", "No explanation provided.")
            tool_name = action.get("tool")
            tool_args = action.get("args", {})

            if tool_name == "exec_shell":
                cmd = tool_args.get("command")
                yield f"🛡️ [Sandbox Request] Permission to run: `{cmd}`\nRationale: {explanation}\n"
                
                # In a real streaming scenario, we would pause here and wait for the server
                # to call `approve_command()`. For this implementation, we'll wait for the signal.
                self.pending_command = {"command": cmd, "explanation": explanation}
                
                # We yield a special token so the server knows to stop and wait
                yield f"__WAIT_FOR_APPROVAL__:{cmd}"
                return # Exit the generator to wait for next trigger

            # Execute non-shell or previously approved shell actions here
            observation = self._execute_action(tool_name, tool_args)
            yield f"📝 [Observation]\n{observation}\n"
            context += f"Action: {json.dumps(action)}\nObservation: {observation}\n\n"

    def approve_command(self, approved: bool) -> str:
        """Called by the server when user provides Y/N."""
        if not self.pending_command:
            return "No command pending."
            
        cmd = self.pending_command["command"]
        self.pending_command = None
        
        if approved:
            print(f"✅ [Approval] Running: {cmd}")
            success, output = system_tools.exec_shell(cmd)
            return f"Command Success: {success}\nOutput: {output}"
        else:
            return "Command BLOCKED by user."

    def _parse_action(self, text: str) -> Optional[Dict[str, Any]]:
        try:
            match = re.search(r'Action:\s*(\{.*\})', text, re.DOTALL)
            if match:
                return json.loads(match.group(1))
        except:
            return None
        return None

    def _extract_thought(self, text: str) -> str:
        match = re.search(r'Thought:(.*?)(Action:|Observation:|$)', text, re.DOTALL)
        return match.group(1).strip() if match else "Thinking..."

    def _execute_action(self, name: str, args: Dict[str, Any]) -> str:
        if name == "read_file_tree":
            return system_tools.read_file_tree()
        elif name == "git_manager":
            success, output = system_tools.git_manager(args.get("action"), args.get("message"))
            return f"Git Success: {success}\nOutput: {output}"
        return "Unknown tool or Action requires manual approval."

operator_agent = OperatorAgent()
