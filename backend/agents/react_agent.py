import json
from backend.mlx_engine import mlx_engine
from backend.agents.tools import TOOLS

class ReActAgent:
    def __init__(self):
        self.model_key = "logic" # DeepSeek-Coder-V2

    def run(self, user_input):
        system_prompt = """You are an autonomous agent using a ReAct (Reason + Act) strategy.
You have access to the following tools:
- terminal_run(command): Run shell commands.
- file_search(query): Search local 4TB index.
- web_browse(query): Search the web.

Format:
Thought: <thinking process>
Action: <tool_name>(<arguments>)
Observation: <result of the action>
... (repeat if necessary)
Final Answer: <your final response>

Always start with Thought. Use JSON format for Action arguments.
"""
        prompt = f"{system_prompt}\nUser: {user_input}\n"
        
        for _ in range(5): # Max iterations
            response = mlx_engine.generate_response(prompt, model_key=self.model_key)
            print(f"Agent Response: {response}")
            
            if "Final Answer:" in response:
                return response.split("Final Answer:")[-1].strip()
            
            if "Action:" in response:
                try:
                    action_line = [l for l in response.split("\n") if "Action:" in l][0]
                    tool_call = action_line.replace("Action:", "").strip()
                    tool_name = tool_call.split("(")[0]
                    args_str = tool_call.split("(")[1].split(")")[0]
                    
                    if tool_name in TOOLS:
                        observation = TOOLS[tool_name](args_str)
                        prompt += f"{response}\nObservation: {observation}\n"
                    else:
                        prompt += f"{response}\nObservation: Tool {tool_name} not found.\n"
                except Exception as e:
                    prompt += f"{response}\nObservation: Error parsing action: {str(e)}\n"
            else:
                break
        
        return response

react_agent = ReActAgent()
