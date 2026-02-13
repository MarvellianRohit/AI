import os
from typing import Dict, Any
from backend.mlx_engine import mlx_engine

class VisionProcessor:
    def analyze_ui_to_code(self, image_path: str) -> Dict[str, str]:
        """
        Analyzes a UI screenshot and returns React + Tailwind and FastAPI code.
        """
        print(f"🖼️ [Vision] Analyzing UI Layout: {image_path}")
        
        prompt = """Analyze this UI screenshot. 
1. Identify the layout hierarchy (Header, Sidebar, Main Content).
2. List key components (Buttons, Inputs, Cards, Tables).
3. Generate a complete React component using Tailwind CSS that replicates this design.
4. Generate a FastAPI Pydantic schema and a POST endpoint that would support the data submission for this UI.

Format your output as:
---REACT---
[React Code]
---FASTAPI---
[FastAPI Code]
"""
        
        response = mlx_engine.generate_vision_response(prompt, image_path)
        
        # Parse the response
        parts = response.split("---FASTAPI---")
        react_part = parts[0].replace("---REACT---", "").strip()
        fastapi_part = parts[1].strip() if len(parts) > 1 else ""
        
        return {
            "react_code": react_part,
            "fastapi_code": fastapi_part
        }

vision_processor = VisionProcessor()
