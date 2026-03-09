from fastapi import FastAPI, Request, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from contextlib import asynccontextmanager
from typing import List
from datetime import datetime
import httpx
import uvicorn
import cv2
import numpy as np
import onnxruntime as ort
import base64
from io import BytesIO
from PIL import Image

# ==========================================
# 1. AI CONFIGURATION & GLOBALS
# ==========================================
# We match the ONNX metadata exactly, using lowercase for consistency
CLASSES = ["corrosion", "slippage", "corrosion", "crack"]

COLORS = {
    0: (200, 0, 0),     # corrosion
    1: (255, 100, 0),   # slippage
    2: (200, 0, 0),     # corrosion (duplicate handled)
    3: (0, 255, 255)    # crack
}
INPUT_WIDTH = 640
INPUT_HEIGHT = 640

# Global dictionary to hold our model in RAM
ml_models = {}

# ==========================================
# 2. LIFESPAN: Load Model into RAM on Startup
# ==========================================
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Loading YOLO11 model into RAM...")
    try:
        # Load the model once here
        session = ort.InferenceSession("model\\best.onnx", providers=['CPUExecutionProvider'])
        
        # Get input name dynamically
        model_inputs = session.get_inputs()
        input_name = model_inputs[0].name
        
        # Store in our global dictionary
        ml_models["yolo_session"] = session
        ml_models["input_name"] = input_name
        print("Model successfully loaded and ready for inference!")
    except Exception as e:
        print(f"CRITICAL ERROR: Failed to load ONNX model: {e}")
        ml_models["yolo_session"] = None
    
    yield # The server runs while yielding here, handling requests
    
    # Clean up when the server shuts down
    print("Shutting down and clearing RAM...")
    ml_models.clear()

# ==========================================
# 3. FASTAPI INITIALIZATION & CORS
# ==========================================
app = FastAPI(title="Rust Detection & Analytics API", lifespan=lifespan)

# cors here this will be replace with the domain when we are working in the production
origins = [
    "http://localhost:5173",  
    "http://localhost:3000",  
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# 4. TRACKING / ANALYTICS ENDPOINT
# ==========================================
class TrackingData(BaseModel):
    url: str
    referrer: str
    user_agent: str
    screen_width: int
    screen_height: int
    language: str
    timezone: str
    timestamp: str

@app.post("/api/track")
async def track_user(data: TrackingData, request: Request):
    client_ip = request.client.host
    
    if client_ip in ["127.0.0.1", "::1", "localhost"]:
        client_ip = "8.8.8.8" 

    geo_data = {}
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"http://ip-api.com/json/{client_ip}")
            if response.status_code == 200:
                geo_data = response.json()
    except Exception as e:
        print(f"GeoIP Lookup failed: {e}")

    analytics_record = {
        "ip_address": client_ip,
        "location": {
            "country": geo_data.get("country", "Unknown"),
            "region": geo_data.get("regionName", "Unknown"),
            "city": geo_data.get("city", "Unknown"),
            "isp": geo_data.get("isp", "Unknown"),
            "latitude": geo_data.get("lat"),
            "longitude": geo_data.get("lon"),
        },
        "browser_data": data.model_dump(),
        "received_at": datetime.utcnow().isoformat()
    }
    
    print("\n--- NEW VISITOR TRACKED ---")
    print(analytics_record)
    print("---------------------------\n")
    
    return {"status": "success", "message": "Telemetry securely recorded"}

# ==========================================
# 5. INFERENCE ENDPOINT (BATCH + CONCURRENT)
# ==========================================
# Using standard `def` ensures FastAPI runs this in a background thread pool,
# allowing concurrent requests from multiple users without blocking the server.
@app.post("/api/predict")
def predict_batch(files: List[UploadFile] = File(...)):
    session = ml_models.get("yolo_session")
    input_name = ml_models.get("input_name")
    
    if session is None:
        raise HTTPException(status_code=503, detail="Model is not loaded on the server.")

    batch_tensor = []
    original_images_data = []

    # --- PREPROCESS BATCH ---
    for file in files:
        image_bytes = file.file.read()
        img_pil = Image.open(BytesIO(image_bytes)).convert("RGB")
        
        orig_np = np.array(img_pil)
        original_h, original_w = orig_np.shape[:2]
        original_images_data.append({
            "image": orig_np, 
            "width": original_w, 
            "height": original_h,
            "filename": file.filename
        })

        img_resized = img_pil.resize((INPUT_WIDTH, INPUT_HEIGHT), Image.Resampling.BILINEAR)
        img_data = np.array(img_resized, dtype=np.float32) / 255.0
        img_data = np.transpose(img_data, (2, 0, 1)) 
        batch_tensor.append(img_data)

    batch_tensor = np.stack(batch_tensor)

    # --- INFERENCE ---
    outputs = session.run(None, {input_name: batch_tensor})
    predictions_batch = outputs[0]
    
    results = []
    conf_threshold = 0.5
    nms_threshold = 0.4

    # --- POST-PROCESS BATCH ---
    for b in range(len(files)):
        predictions = predictions_batch[b].T 
        orig_data = original_images_data[b]
        
        # Copy to avoid modifying the original array reference multiple times
        img_to_draw = orig_data["image"].copy() 
        orig_w = orig_data["width"]
        orig_h = orig_data["height"]

        boxes, scores, class_ids = [], [], []

        for row in predictions:
            classes_scores = row[4:]
            max_score = np.amax(classes_scores)
            
            if max_score >= conf_threshold:
                class_id = np.argmax(classes_scores)
                
                # Center X, Center Y, Width, Height
                x, y, w, h = row[0], row[1], row[2], row[3]
                
                x = int((x / INPUT_WIDTH) * orig_w)
                y = int((y / INPUT_HEIGHT) * orig_h)
                w = int((w / INPUT_WIDTH) * orig_w)
                h = int((h / INPUT_HEIGHT) * orig_h)
                
                left = int(x - w / 2)
                top = int(y - h / 2)
                
                boxes.append([left, top, w, h])
                scores.append(float(max_score))
                class_ids.append(class_id)

        indices = cv2.dnn.NMSBoxes(boxes, scores, conf_threshold, nms_threshold)
        class_counts = {cls: 0 for cls in CLASSES}

        if len(indices) > 0:
            for i in indices.flatten():
                box = boxes[i]
                left, top, w, h = box[0], box[1], box[2], box[3]
                class_id = class_ids[i]
                class_name = CLASSES[class_id]
                color = COLORS.get(class_id, (0, 255, 0))

                class_counts[class_name] += 1

                cv2.rectangle(img_to_draw, (left, top), (left + w, top + h), color, 3)
                label = f"{class_name}: {scores[i]:.2f}"
                cv2.putText(img_to_draw, label, (left, max(top - 10, 15)), cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)

        final_img_pil = Image.fromarray(img_to_draw)
        buffer = BytesIO()
        final_img_pil.save(buffer, format="JPEG")
        encoded_image = base64.b64encode(buffer.getvalue()).decode('utf-8')

        results.append({
            "filename": orig_data["filename"],
            "detections": class_counts,
            "annotated_image": f"data:image/jpeg;base64,{encoded_image}"
        })

    return {"status": "success", "results": results}

@app.get("/")
def read_root():
    return {"message": "Rust Detection API is running. Models loaded in RAM."}


# uv run uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload
#  use this code if you want to run this from cmd -- make sure the path is backend folder with the virtual env enable for  this one

# few important thing to remember here is  in the fastapi m-- here main is the name of the file and the app is the name that we defined here above
# app = FastAPI(title="Rust Detection & Analytics API", lifespan=lifespan)
 
# ==========================================
# 6. RUN THE SERVER
# ==========================================
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)