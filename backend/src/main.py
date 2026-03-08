from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
import httpx
import uvicorn

app = FastAPI(title="Rust Detection API")

# 1. CORS Configuration
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

# 2. Pydantic Model
class TrackingData(BaseModel):
    url: str
    referrer: str
    user_agent: str
    screen_width: int
    screen_height: int
    language: str
    timezone: str
    timestamp: str

# 3. Analytics Router
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

@app.get("/")
def read_root():
    return {"message": "Rust Detection API is running. Send tracking data to /api/track"}

# --- RUN THE SERVER ---
if __name__ == "__main__":
    # The string "main:app" tells uvicorn to look in main.py for the 'app' variable
    # reload=True automatically restarts the server when you save changes
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)