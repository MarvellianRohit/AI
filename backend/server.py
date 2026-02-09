from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import uvicorn
import asyncio
import os
import json

# Import backend modules
from backend.rag import rag_service
from backend.ingest import ingest_documents
from backend.agents.workflow import run_nexus_workflow
from backend.vision import generate_code_from_image
from backend.search_service import search_service
from backend.architect.agent import architect_agent
from backend.architect.ingest import ingest_codebase

# --- Data Models (Must be defined before use) ---
class ChatRequest(BaseModel):
    message: str
    use_mlx: bool = False

class AgentRequest(BaseModel):
    feature: str

# --- App Initialization ---
app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static Files (Social Media Assets)
os.makedirs("backend/static/social", exist_ok=True)
app.mount("/static/social", StaticFiles(directory="backend/static/social"), name="social")

# --- Routes ---

@app.get("/")
def read_root():    
    return {"status": "Nexus-AI Server Running"}

# 1. Nexus-AI Supercharged Chat
class AdvancedChatRequest(BaseModel):
    message: str
    turbo: bool = False
    use_mlx: bool = True
    self_correct: bool = False
    polish_ui: bool = False
    current_code: str = ""
    use_global_context: bool = False

class DebugRequest(BaseModel):
    file_path: str
    test_command: str

class GlobalSearchRequest(BaseModel):
    query: str

class GenericGenerateRequest(BaseModel):
    prompt: str
    model_key: str = "reasoning"
    max_tokens: int = 2048

class ArtifactWriteRequest(BaseModel):
    content: str
    is_complete: bool = False

@app.post("/api/studio/write")
async def write_artifact(request: ArtifactWriteRequest):
    output_path = "/Users/rohitchandra/Documents/AI/backend/current_response.txt"
    mode = "w" if not request.is_complete else "w" # We overwrite for simpler HMR parsing
    with open(output_path, mode) as f:
        f.write(request.content)
    return {"status": "success"}

@app.post("/api/generate")
async def generic_generate(request: GenericGenerateRequest):
    from backend.mlx_engine import mlx_engine
    result = mlx_engine.generate_response(request.prompt, model_key=request.model_key)
    return {"result": result}

@app.post("/api/chat")
async def chat(request: AdvancedChatRequest):
    # Load User Profile
    profile_path = "backend/user_profile.json"
    user_context = ""
    if os.path.exists(profile_path):
        with open(profile_path, 'r') as f:
            profile = json.load(f)
            user_context = f"User Profile: {json.dumps(profile)}\n\n"

    system_prompt = f"{user_context}You are Nexus-AI, a high-performance assistant. Use deep reasoning for complex tasks.\n\n" \
                    "IMPORTANT: When generating UI components, HTML, or React code, always wrap the code block in specialized <artifact> tags.\n" \
                    "Example:\n<artifact type=\"react\">\n```tsx\n...\n```\n</artifact>\n" \
                    "The frontend will render these artifacts in a dedicated Canvas."
    
    if request.use_global_context:
        from backend.agents.global_context import global_manager
        result = global_manager.tree_of_thought_search(request.message)
        return StreamingResponse(iter([result]), media_type="text/plain")

    if request.polish_ui:
        from backend.mlx_engine import mlx_engine
        result = mlx_engine.ui_polish(request.current_code, request.message)
        return StreamingResponse(iter([result]), media_type="text/plain")
    
    if request.self_correct:
        from backend.agents.workflow import run_nexus_workflow
        # This is a block-and-return for now, ideally streamed
        result = run_nexus_workflow(request.message)
        return StreamingResponse(iter([result]), media_type="text/plain")

    full_prompt = f"{system_prompt}\nUser: {request.message}\nAssistant:"

    async def generate():
        try:
            if request.use_mlx:
                from backend.mlx_engine import mlx_engine
                # Use the Dynamic Model Router for intelligent triage
                for chunk in mlx_engine.routed_stream(request.message, system_prompt=system_prompt):
                    yield chunk
            else:
                # Fallback to existing RAG service
                for chunk in rag_service.query(request.message):
                    yield chunk
        except Exception as e:
            yield f"Error: {str(e)}"

    return StreamingResponse(generate(), media_type="text/plain")

# 2. General Assistant (Gemini Pro)
@app.post("/api/general/chat")
async def general_chat(request: ChatRequest):
    async def generate():
        try:
            # Using Gemini Pro Service
            for chunk in search_service.chat_stream(request.message):
                yield chunk
        except Exception as e:
            yield f"Error: {str(e)}"

    return StreamingResponse(generate(), media_type="text/plain")

# 3. RAG Ingest
@app.post("/api/ingest")
async def ingest():
    try:
        result = ingest_documents()
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 4. Agent Workforce
@app.post("/api/agents/generate")
async def generate_agent(request: AgentRequest):
    async def run_workflow():
        try:
            result = run_nexus_workflow(request.feature)
            yield f"Workflow Complete: {result}"
        except Exception as e:
            yield f"Error: {str(e)}"

    return StreamingResponse(run_workflow(), media_type="text/plain")

# 5. Vision Projector
@app.post("/api/vision/generate")
async def vision_generate(file: UploadFile = File(...)):
    async def process_vision():
        try:
            contents = await file.read()
            # Stream the response from the vision model
            for chunk in generate_code_from_image(contents):
                yield chunk
        except Exception as e:
            yield f"Error: {str(e)}"

    return StreamingResponse(process_vision(), media_type="text/plain")

    return StreamingResponse(process_vision(), media_type="text/plain")

# 6. Nexus Architect
@app.post("/api/architect/ingest")
async def architect_ingest_route():
    try:
        result = ingest_codebase()
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/architect/audit")
async def architect_audit_route():
    async def generate_report():
        try:
            for chunk in architect_agent.run_audit():
                yield chunk
        except Exception as e:
            yield f"Error: {str(e)}"
            
    return StreamingResponse(generate_report(), media_type="text/plain")

# 7. Nexus Researcher
class ResearchRequest(BaseModel):
    query: str

@app.post("/api/researcher/run")
async def run_research(request: ResearchRequest):
    """
    Executes the Nexus Researcher agent.
    """
    # Lazy import to avoid potential circular dependency issues during startup
    from backend.researcher.agent import run_researcher
    try:
        report = run_researcher(request.query)
        return {"status": "success", "report": report}
    except Exception as e:
        return {"status": "error", "message": str(e)}

# 8. Nexus Creator (Video based Blog)
@app.post("/api/creator/upload")
async def creator_upload(file: UploadFile = File(...)):
    """
    Processes a video file: Transcribe (Whisper) -> Blog (Llama-3).
    """
    import shutil
    from backend.creator.transcribe import transcribe_video
    from backend.creator.blog_generator import generate_blog_post, save_to_docs

    try:
        # 1. Save File
        upload_dir = "uploads"
        os.makedirs(upload_dir, exist_ok=True)
        file_location = f"{upload_dir}/{file.filename}"
        
        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # 2. Transcribe
        transcription = transcribe_video(file_location)
        
        # 3. Generate Blog
        blog_content = generate_blog_post(transcription)
        
        # 4. Save to /docs
        saved_path = save_to_docs(blog_content, filename=f"blog_{file.filename}.md")
        
        return {
            "status": "success", 
            "transcription": transcription[:500] + "...", 
            "blog_content": blog_content,
            "saved_path": saved_path
        }
    except Exception as e:
        return {"status": "error", "message": f"Creator Flow Failed: {str(e)}"}

# 9. Graph-RAG Impact Analysis
class GraphRequest(BaseModel):
    question: str

@app.post("/api/graph/impact")
async def graph_impact_route(request: GraphRequest):
    """
    Analyzes system impact using Neo4j Knowledge Graph.
    """
    from backend.graph.query import GraphRAG
    rag = GraphRAG()
    try:
        answer = rag.run_query(request.question)
        return {"status": "success", "answer": answer}
    except Exception as e:
        return {"status": "error", "message": f"Graph Query Failed: {str(e)}"}
    finally:
        rag.close()

# 10. Autonomous Social Media Agent
class SocialRequest(BaseModel):
    feature_desc: str

@app.post("/api/agents/social")
async def social_agent_route(request: SocialRequest):
    """
    Generates multi-modal social media content via SDXL, Whisper, and Llama-3.
    """
    from backend.agents.social_media import SocialMediaAgent
    agent = SocialMediaAgent()
    try:
        results = agent.run_autonomous_flow(request.feature_desc)
        return {"status": "success", "results": results}
    except Exception as e:
        return {"status": "error", "message": f"Social Agent Failed: {str(e)}"}

@app.post("/api/debug")
async def debug_endpoint(request: DebugRequest):
    from backend.agents.debugger import debugger_agent
    success, message = debugger_agent.debug_file(request.file_path, request.test_command)
    return {"success": success, "message": message}

@app.post("/api/global_search")
async def global_search_endpoint(request: GlobalSearchRequest):
    from backend.agents.global_context import global_manager
    result = global_manager.tree_of_thought_search(request.query)
    return {"result": result}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8080)
