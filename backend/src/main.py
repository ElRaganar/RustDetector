from fastapi import FastAPI, Request, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from contextlib import asynccontextmanager
from typing import List
from datetime import datetime, timezone
from pathlib import Path
import httpx
import uvicorn
import cv2
import numpy as np
import onnxruntime as ort
import base64
import platform
import psutil
from io import BytesIO
from PIL import Image

# ==========================================
# 1. AI CONFIGURATION & GLOBALS
# ==========================================
CLASS_DISPLAY = ["Slippage", "corrosion", "crack"]
CLASS_KEYS    = ["slippage", "corrosion", "crack"]

# High-contrast BGR colors for annotation
COLORS = {
    0: (0, 255, 255),   # Slippage  → Bright Yellow
    1: (0, 0, 255),     # Corrosion → Red
    2: (255, 0, 255),   # Crack     → Vibrant Magenta
}

INPUT_WIDTH  = 640
INPUT_HEIGHT = 640

ml_models  = {}
start_time = datetime.now(timezone.utc)   # recorded once at startup

# ==========================================
# 2. LIFESPAN: Load Model into RAM
# ==========================================
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Loading YOLO model into RAM...")
    try:
        backend_dir = Path(__file__).resolve().parent.parent
        model_path  = backend_dir / "model" / "best.onnx"

        session    = ort.InferenceSession(str(model_path), providers=["CPUExecutionProvider"])
        input_name = session.get_inputs()[0].name

        ml_models["yolo_session"] = session
        ml_models["input_name"]   = input_name
        print("✅ Model successfully loaded and ready for inference!")
    except Exception as e:
        print(f"❌ CRITICAL ERROR: Failed to load ONNX model: {e}")
        ml_models["yolo_session"] = None

    yield

    print("Shutting down and clearing RAM...")
    ml_models.clear()

# ==========================================
# 3. FASTAPI INITIALIZATION & CORS
# ==========================================
app = FastAPI(title="Rust Detection & Analytics API", lifespan=lifespan)

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
# 4. HEALTH STATUS ENDPOINT
#    Returns server time, uptime, system info,
#    and model load status.
# ==========================================
@app.get("/")
async def health_status():
    now     = datetime.now(timezone.utc)
    uptime  = now - start_time
    hours, remainder = divmod(int(uptime.total_seconds()), 3600)
    minutes, seconds = divmod(remainder, 60)

    model_loaded = ml_models.get("yolo_session") is not None

    # System resource snapshot
    cpu_percent = psutil.cpu_percent(interval=0.1)
    ram         = psutil.virtual_memory()

    return {
        "status":        "✅ Rust Detection API is running",
        "model_loaded":  model_loaded,
        "server_time_utc": now.strftime("%Y-%m-%d %H:%M:%S UTC"),
        "uptime":        f"{hours:02d}h {minutes:02d}m {seconds:02d}s",
        "started_at":    start_time.strftime("%Y-%m-%d %H:%M:%S UTC"),
        "system": {
            "platform":    platform.system(),
            "python":      platform.python_version(),
            "cpu_usage":   f"{cpu_percent}%",
            "ram_used":    f"{ram.used / (1024**3):.2f} GB",
            "ram_total":   f"{ram.total / (1024**3):.2f} GB",
            "ram_percent": f"{ram.percent}%",
        },
        "classes":       CLASS_DISPLAY,
        "input_size":    f"{INPUT_WIDTH}x{INPUT_HEIGHT}",
    }

# ==========================================
# 5. TRACKING / ANALYTICS ENDPOINT
#    Resolves the *real* public IP even when
#    the request arrives from localhost, by
#    asking an external "what-is-my-ip" API
#    on behalf of the server itself.
# ==========================================
class TrackingData(BaseModel):
    url:          str
    referrer:     str
    user_agent:   str
    screen_width: int
    screen_height: int
    language:     str
    timezone:     str
    timestamp:    str

# Internal helper ─ cached so we don't hammer the lookup API
_cached_server_ip: dict = {}

async def _resolve_public_ip(client_ip: str) -> str:
    """
    If the request comes from a loopback address (local dev),
    discover the server's own public IP and use that instead,
    so geo-lookup still returns real location data.
    """
    loopback = {"127.0.0.1", "::1", "localhost", "0.0.0.0"}
    if client_ip not in loopback:
        return client_ip

    # Return cached result to avoid repeated external calls
    if "ip" in _cached_server_ip:
        return _cached_server_ip["ip"]

    try:
        async with httpx.AsyncClient(timeout=5) as client:
            # ipify is a simple, reliable public-IP service
            resp = await client.get("https://api.ipify.org?format=json")
            if resp.status_code == 200:
                public_ip = resp.json().get("ip", client_ip)
                _cached_server_ip["ip"] = public_ip
                return public_ip
    except Exception as e:
        print(f"⚠️  Could not resolve public IP: {e}")

    return client_ip   # fall back to whatever we got


async def _geo_lookup(ip: str) -> dict:
    """Fetch geographic data for a given IP via ip-api.com."""
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            print(f"🔍 Fetching geo data for IP: {ip}")
            resp = await client.get(
                f"http://ip-api.com/json/{ip}",
                params={"fields": "status,country,regionName,city,zip,lat,lon,isp,org,as,query"}
            )
            print(f"📡 API Response Status: {resp.status_code}")
            if resp.status_code == 200:
                geo_data = resp.json()
                print(f"📍 Geo Data Received: {geo_data}")
                return geo_data
            else:
                print(f"⚠️  API returned status {resp.status_code}: {resp.text}")
    except Exception as e:
        print(f"⚠️  GeoIP lookup failed: {e}")
    return {}


@app.post("/api/track")
async def track_user(data: TrackingData, request: Request):
    raw_ip    = request.client.host
    client_ip = await _resolve_public_ip(raw_ip)
    geo       = await _geo_lookup(client_ip)

    analytics_record = {
        "ip_address": client_ip,
        "ip_raw":     raw_ip,          # keep original for debugging
        "geo": {
            "country":    geo.get("country",    "Unknown"),
            "region":     geo.get("regionName", "Unknown"),
            "city":       geo.get("city",       "Unknown"),
            "zip":        geo.get("zip",        "Unknown"),
            "isp":        geo.get("isp",        "Unknown"),
            "org":        geo.get("org",        "Unknown"),
            "latitude":   geo.get("lat"),
            "longitude":  geo.get("lon"),
        },
        "browser": data.model_dump(),
        "received_at": datetime.now(timezone.utc).isoformat(),
    }

    print("\n--- 📍 NEW VISITOR TRACKED ---")
    for k, v in analytics_record.items():
        print(f"  {k}: {v}")
    print("------------------------------\n")

    return {"status": "success", "message": "Telemetry recorded", "resolved_ip": client_ip}


# ==========================================
# 6. INFERENCE ENDPOINT (BATCH)
#


# ==========================================
@app.post("/api/predict")
def predict_batch(files: List[UploadFile] = File(...)):
    session    = ml_models.get("yolo_session")
    input_name = ml_models.get("input_name")

    if session is None:
        raise HTTPException(status_code=503, detail="Model is not loaded on the server.")

    try:
        batch_tensor         = []
        original_images_data = []

        # ── PREPROCESS BATCH ──────────────────────────────────────────────
        for file in files:
            image_bytes = file.file.read()
            img_pil     = Image.open(BytesIO(image_bytes)).convert("RGB")
            orig_np     = np.array(img_pil)
            original_h, original_w = orig_np.shape[:2]

            # Letterbox scaling: fit image inside INPUT_WIDTH × INPUT_HEIGHT
            scale_ratio    = min(INPUT_WIDTH / original_w, INPUT_HEIGHT / original_h)
            new_unpad_w    = int(round(original_w * scale_ratio))
            new_unpad_h    = int(round(original_h * scale_ratio))

            # Padding (equal on both sides → centred letterbox)
            dw = (INPUT_WIDTH  - new_unpad_w) / 2
            dh = (INPUT_HEIGHT - new_unpad_h) / 2

            img_resized = cv2.resize(orig_np, (new_unpad_w, new_unpad_h),
                                     interpolation=cv2.INTER_LINEAR)

            pad_top    = int(round(dh - 0.1))
            pad_bottom = int(round(dh + 0.1))
            pad_left   = int(round(dw - 0.1))
            pad_right  = int(round(dw + 0.1))

            img_padded = cv2.copyMakeBorder(
                img_resized, pad_top, pad_bottom, pad_left, pad_right,
                cv2.BORDER_CONSTANT, value=(114, 114, 114)
            )

            original_images_data.append({
                "image":    orig_np,
                "filename": file.filename,
                "ratio":    scale_ratio,
                "pad_left": pad_left,   # renamed from pad_w for clarity
                "pad_top":  pad_top,    # renamed from pad_h for clarity
                "width":    original_w,
                "height":   original_h,
            })

            img_data = np.array(img_padded, dtype=np.float32) / 255.0
            img_data = np.transpose(img_data, (2, 0, 1))   # HWC → CHW
            batch_tensor.append(img_data)

        batch_tensor        = np.stack(batch_tensor)
        predictions_batch   = session.run(None, {input_name: batch_tensor})[0]

        results             = []
        conf_threshold      = 0.25
        nms_threshold       = 0.45

        # ── POST-PROCESS BATCH ────────────────────────────────────────────
        for b in range(len(files)):
            pred = predictions_batch[b]

            # Squeeze any extra leading dimensions (e.g. [1, N, C] → [N, C])
            if pred.ndim != 2:
                pred = np.squeeze(pred)

            # Transpose if shape is [features, detections] → [detections, features]
            expected_cols = 4 + len(CLASS_DISPLAY)   # cx,cy,w,h + num_classes
            if pred.shape[0] in (expected_cols, 6):
                pred = pred.T

            is_end2end = (pred.shape[1] == 6)   # end-to-end YOLO: already has class_id column

            orig_data  = original_images_data[b]
            img_to_draw = cv2.cvtColor(orig_data["image"], cv2.COLOR_RGB2BGR)

            boxes, scores, class_ids = [], [], []

            for row in pred:
                if is_end2end:
                    cx, cy, w, h, max_score, class_id = row
                    if max_score < conf_threshold:
                        continue
                    class_id = int(class_id)
                else:
                    classes_scores = row[4:]
                    max_score      = np.amax(classes_scores)
                    if max_score < conf_threshold:
                        continue
                    class_id = int(np.argmax(classes_scores))
                    cx, cy, w, h = row[0], row[1], row[2], row[3]

                if class_id >= len(CLASS_DISPLAY):
                    continue

                # ── COORDINATE MAPPING (THE CRITICAL FIX) ──────────────
                # cx, cy, w, h are in padded-image space.
                # Step 1: remove letterbox padding from the centre coordinates.
                # Step 2: scale all four values back to original image pixels.
                # NOTE:  w and h have NO padding offset — only the ratio matters.
                orig_cx = (cx - orig_data["pad_left"]) / orig_data["ratio"]
                orig_cy = (cy - orig_data["pad_top"])  / orig_data["ratio"]
                orig_w  =  w                           / orig_data["ratio"]
                orig_h  =  h                           / orig_data["ratio"]
                # ────────────────────────────────────────────────────────

                x1 = int(orig_cx - orig_w / 2)
                y1 = int(orig_cy - orig_h / 2)
                x2 = int(orig_cx + orig_w / 2)
                y2 = int(orig_cy + orig_h / 2)

                # Clamp to image boundaries
                x1 = max(0, x1);  y1 = max(0, y1)
                x2 = min(orig_data["width"],  x2)
                y2 = min(orig_data["height"], y2)

                box_w = x2 - x1
                box_h = y2 - y1

                # Skip degenerate boxes
                if box_w <= 0 or box_h <= 0:
                    continue

                boxes.append([x1, y1, box_w, box_h])
                scores.append(float(max_score))
                class_ids.append(class_id)

            # Non-maximum suppression
            indices = cv2.dnn.NMSBoxes(boxes, scores, conf_threshold, nms_threshold)

            class_counts = {key: 0 for key in CLASS_KEYS}

            if len(indices) > 0:
                for i in indices.flatten():
                    x1, y1, bw, bh = boxes[i]
                    class_id   = class_ids[i]
                    class_name = CLASS_DISPLAY[class_id]
                    color      = COLORS.get(class_id, (0, 255, 0))

                    class_counts[CLASS_KEYS[class_id]] += 1

                    # Draw bounding box
                    cv2.rectangle(img_to_draw, (x1, y1), (x1 + bw, y1 + bh), color, 6)

                    # Draw label with background for readability
                    label      = f"{class_name}: {scores[i]:.2f}"
                    label_y    = max(y1 - 10, 15)
                    (tw, th), _ = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.7, 2)
                    cv2.rectangle(img_to_draw,
                                  (x1, label_y - th - 4),
                                  (x1 + tw + 4, label_y + 4),
                                  color, -1)           # filled background
                    cv2.putText(img_to_draw, label,
                                (x1 + 2, label_y),
                                cv2.FONT_HERSHEY_SIMPLEX, 0.7,
                                (0, 0, 0),              # black text on coloured bg
                                2)

            # Encode annotated image to base64 JPEG
            final_img_pil = Image.fromarray(cv2.cvtColor(img_to_draw, cv2.COLOR_BGR2RGB))
            buffer        = BytesIO()
            final_img_pil.save(buffer, format="JPEG", quality=92)
            encoded_image = base64.b64encode(buffer.getvalue()).decode("utf-8")

            results.append({
                "filename":       orig_data["filename"],
                "detections":     class_counts,
                "annotated_image": f"data:image/jpeg;base64,{encoded_image}",
            })

        return {"status": "success", "results": results}

    except Exception as e:
        print(f"❌ Inference Error: {e}")
        raise HTTPException(status_code=500, detail=f"Model Inference Error: {str(e)}")


# ── Run directly ──────────────────────────────────────────────────────────────
# uv run uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload

if __name__ == "__main__":
    uvicorn.run("src.main:app", host="0.0.0.0", port=8000, reload=True)