import io
import os
from PIL import Image
from backend.vision_processor import vision_processor

def generate_code_from_image(image_bytes):
    """
    Multimodal Vision Pipeline: Analyzes UI and generates React + FastAPI code.
    """
    try:
        # Save bytes to temporary file for MLX-VLM processing
        os.makedirs("temp", exist_ok=True)
        temp_path = "temp/vision_input.png"
        
        # Verify image validity
        img = Image.open(io.BytesIO(image_bytes))
        img.save(temp_path)
        
        # Trigger High-Performance MLX-VLM Inference (Sub-2s target)
        result = vision_processor.analyze_ui_to_code(temp_path)
        
        # Format as a comprehensive developer response with Artifacts for Canvas rendering
        response = f"## 🎨 DESIGN-TO-CODE ANALYSIS\n\n"
        response += f"### ⚛️ React Component (Tailwind)\n<artifact type=\"react\">\n```tsx\n{result['react_code']}\n```\n</artifact>\n\n"
        response += f"### 🐍 FastAPI Schema & Endpoint\n```python\n{result['fastapi_code']}\n```\n"
        
        yield response

    except Exception as e:
        yield f"Vision Pipeline Error: {str(e)}"
