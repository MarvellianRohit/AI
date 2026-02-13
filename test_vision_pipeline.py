import os
import sys
import time
import requests
from PIL import Image, ImageDraw

# Add project root to path
sys.path.append(os.getcwd())

def test_vision_pipeline():
    print("--- 🏁 Starting Multimodal Vision Pipeline Test 🏁 ---")
    
    # 1. Create a mock UI screenshot
    os.makedirs("temp", exist_ok=True)
    img_path = "temp/mock_ui.png"
    img = Image.new('RGB', (800, 600), color=(30, 30, 30))
    d = ImageDraw.Draw(img)
    # Draw a mock login card
    d.rectangle([250, 150, 550, 450], fill=(50, 50, 50), outline=(100, 100, 255), width=2)
    d.text((320, 200), "LOGIN", fill=(255, 255, 255))
    img.save(img_path)
    
    print(f"Created mock UI at {img_path}")
    
    # 2. Trigger Vision Pipeline
    from backend.vision import generate_code_from_image
    
    with open(img_path, 'rb') as f:
        img_bytes = f.read()
    
    start_time = time.time()
    print("🚀 Triggering Llama-3.2-Vision (MLX Metal Backend)...")
    
    response = ""
    for chunk in generate_code_from_image(img_bytes):
        response += chunk
        
    end_time = time.time()
    duration = end_time - start_time
    
    print("\n" + "="*50)
    print(response)
    print("="*50)
    
    print(f"\n⚡ Inference Duration: {duration:.2f}s")
    
    if duration < 5.0: # 2s is the target, but first load might take longer
        print("✅ SUCCESS: Vision Pipeline is highly responsive.")
    else:
        print("⚠️ Vision Pipeline took longer than expected.")
        
    if "react" in response.lower() and "fastapi" in response.lower():
        print("✅ SUCCESS: Code generation successful for both frontend and backend.")
    else:
        print("❌ FAILED: Missing requested code components.")

if __name__ == "__main__":
    test_vision_pipeline()
