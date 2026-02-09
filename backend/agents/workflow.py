import os
import subprocess
from typing import TypedDict, List
from langgraph.graph import StateGraph, END
from backend.mlx_engine import mlx_engine
from backend.agents.tools import TOOLS

# Define Graph State
class AgentState(TypedDict):
    task: str
    plan: List[str]
    current_step: int
    code: str
    errors: str
    iterations: int
    finished: bool

# Nodes
def planner_node(state: AgentState):
    print("--- PLANNER ---")
    prompt = f"Plan a 5-step implementation for this task: {state['task']}\nReturn ONLY a numbered list."
    response = mlx_engine.generate_response(prompt, model_key="reasoning")
    steps = [line.strip() for line in response.split("\n") if line.strip() and line[0].isdigit()]
    return {"plan": steps[:5], "current_step": 0}

def executor_node(state: AgentState):
    print(f"--- EXECUTOR (Step {state['current_step']+1}) ---")
    step = state['plan'][state['current_step']]
    prompt = f"Task: {state['task']}\nCurrent Step: {step}\nPrevious Code/Error: {state['errors']}\nWrite the code for this step. Return ONLY the code."
    code = mlx_engine.generate_response(prompt, model_key="logic")
    
    # Save to scratchpad for review
    os.makedirs("scratchpad", exist_ok=True)
    temp_file = "scratchpad/current_dev.py"
    with open(temp_file, "w") as f:
        f.write(code)
    
    return {"code": code, "iterations": state['iterations'] + 1}

def reviewer_node(state: AgentState):
    print("--- REVIEWER ---")
    temp_file = "scratchpad/current_dev.py"
    
    # 1. Run Linter (Ruff)
    lint_result = subprocess.run(["ruff", "check", temp_file], capture_output=True, text=True)
    
    # 2. Run Test (Simple execution check or pytest)
    test_result = subprocess.run(["python3", temp_file], capture_output=True, text=True)
    
    if lint_result.returncode != 0 or test_result.returncode != 0:
        errors = f"LINT:\n{lint_result.stdout}\nTEST:\n{test_result.stderr}"
        print(f"Errors found: {errors}")
        return {"errors": errors, "finished": False}
    
    print("Review Passed!")
    return {"errors": "", "current_step": state['current_step'] + 1, "finished": state['current_step'] >= 4}

# Conditional Edges
def should_continue(state: AgentState):
    if state['finished']:
        return "end"
    if state['errors'] and state['iterations'] < 10:
        return "executor"
    return "executor"

# Build Graph
builder = StateGraph(AgentState)
builder.add_node("planner", planner_node)
builder.add_node("executor", executor_node)
builder.add_node("reviewer", reviewer_node)

builder.set_entry_point("planner")
builder.add_edge("planner", "executor")
builder.add_edge("executor", "reviewer")
builder.add_conditional_edges(
    "reviewer",
    should_continue,
    {
        "executor": "executor",
        "end": END
    }
)

nexus_workflow = builder.compile()

def run_nexus_workflow(task: str):
    inputs = {
        "task": task,
        "plan": [],
        "current_step": 0,
        "code": "",
        "errors": "",
        "iterations": 0,
        "finished": False
    }
    final_state = nexus_workflow.invoke(inputs)
    return final_state['code']
