
![Screenshot 2026-04-04 at 9 57 37 AM](https://github.com/user-attachments/assets/03e27a9b-2044-4488-898c-4cc025dcb3c3)
![Screenshot 2026-04-04 at 9 58 01 AM](https://github.com/user-attachments/assets/8ac4a034-0455-4c06-a11d-4d4a4732b6f2)
![Screenshot 2026-04-04 at 9 59 18 AM](https://github.com/user-attachments/assets/37faf0d4-d288-4b39-8b0f-d24fc4042331)
![Screenshot 2026-04-04 at 10 09 58 AM](https://github.com/user-attachments/assets/8e455723-a5d1-48c7-883b-69d80284badd)

<div style="font-family: Arial, sans-serif; line-height:1.6;">

<h1 style="text-align:center; margin-bottom: 0.25rem;">RustDetector</h1>
<p style="text-align:center; color:#555; margin-top:0;">
Full-stack rust/corrosion detection from images — React + Vite frontend, FastAPI + ONNX backend.
</p>

<hr>

<h2>Overview</h2>
<p>
RustDetector is a full-stack web app for detecting rust/corrosion-related defects from images.
The frontend is built with <b>React + Vite + React Router</b>, and the backend is a <b>FastAPI</b> service that runs a
<b>YOLO ONNX</b> model via <b>ONNX Runtime</b>.
</p>

<hr>

<h2>Repo layout</h2>
<ul>
  <li><code>frontend/</code>: React UI (auth via Clerk)</li>
  <li><code>backend/</code>: FastAPI API + model loader (<code>backend/model/best.onnx</code>)</li>
  <li><code>docker-compose.yml</code>: runs frontend on <code>5173</code> and backend on <code>8000</code></li>
</ul>

<hr>

<h2>Quickstart (Docker)</h2>

<h3>1) Set frontend env vars</h3>
<p>Create <code>frontend/.env</code>:</p>
<pre style="background:#f6f8fa;padding:10px;border-radius:5px;overflow:auto;">
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key
# Optional (defaults to http://localhost:8000):
# VITE_API_BASE_URL=http://localhost:8000
</pre>

<h3>2) Build + run</h3>
<p>From the repo root:</p>
<pre style="background:#f6f8fa;padding:10px;border-radius:5px;overflow:auto;">
docker compose up --build
</pre>

<h3>3) Open the app</h3>
<ul>
  <li>Frontend: <code>http://localhost:5173</code></li>
  <li>Backend: <code>http://localhost:8000</code></li>
</ul>

<p>Stop containers with <code>Ctrl+C</code>, then:</p>
<pre style="background:#f6f8fa;padding:10px;border-radius:5px;overflow:auto;">
docker compose down
</pre>

<hr>

<h2>Local development (no Docker)</h2>

<h3>Backend (FastAPI)</h3>
<p>From <code>backend/</code>:</p>
<pre style="background:#f6f8fa;padding:10px;border-radius:5px;overflow:auto;">
uv sync
uv run uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload
</pre>

<p>If <code>uv</code> has cache permission issues:</p>
<pre style="background:#f6f8fa;padding:10px;border-radius:5px;overflow:auto;">
UV_CACHE_DIR=/tmp/uv-cache uv run uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload
</pre>

<h3>Frontend (Vite)</h3>
<p>From <code>frontend/</code>:</p>
<pre style="background:#f6f8fa;padding:10px;border-radius:5px;overflow:auto;">
npm install
npm run dev -- --host
</pre>

<hr>

<h2>Frontend routes (React Router)</h2>
<p>Defined in <code>frontend/src/App.tsx</code>:</p>

<table style="border-collapse: collapse; width:100%;">
  <tr style="background:#f5f5f5;">
    <th style="border:1px solid #ddd;padding:8px;text-align:left;">Path</th>
    <th style="border:1px solid #ddd;padding:8px;text-align:left;">Page/component</th>
    <th style="border:1px solid #ddd;padding:8px;text-align:left;">Auth required</th>
  </tr>
  <tr>
    <td style="border:1px solid #ddd;padding:8px;"><code>/</code></td>
    <td style="border:1px solid #ddd;padding:8px;">Landing</td>
    <td style="border:1px solid #ddd;padding:8px;">No</td>
  </tr>
  <tr>
    <td style="border:1px solid #ddd;padding:8px;"><code>/sign-in</code></td>
    <td style="border:1px solid #ddd;padding:8px;">Clerk Sign In UI</td>
    <td style="border:1px solid #ddd;padding:8px;">No</td>
  </tr>
  <tr>
    <td style="border:1px solid #ddd;padding:8px;"><code>/sign-up</code></td>
    <td style="border:1px solid #ddd;padding:8px;">Clerk Sign Up UI</td>
    <td style="border:1px solid #ddd;padding:8px;">No</td>
  </tr>
  <tr>
    <td style="border:1px solid #ddd;padding:8px;"><code>/dashboard</code></td>
    <td style="border:1px solid #ddd;padding:8px;">Dashboard</td>
    <td style="border:1px solid #ddd;padding:8px;">Yes</td>
  </tr>
  <tr>
    <td style="border:1px solid #ddd;padding:8px;"><code>/dashboard/scans</code></td>
    <td style="border:1px solid #ddd;padding:8px;">Recent scans</td>
    <td style="border:1px solid #ddd;padding:8px;">Yes</td>
  </tr>
  <tr>
    <td style="border:1px solid #ddd;padding:8px;"><code>/dashboard/fileselector</code></td>
    <td style="border:1px solid #ddd;padding:8px;">File selector</td>
    <td style="border:1px solid #ddd;padding:8px;">Yes</td>
  </tr>
  <tr>
    <td style="border:1px solid #ddd;padding:8px;"><code>/dashboard/camera</code></td>
    <td style="border:1px solid #ddd;padding:8px;">Camera capture</td>
    <td style="border:1px solid #ddd;padding:8px;">Yes</td>
  </tr>
  <tr>
    <td style="border:1px solid #ddd;padding:8px;"><code>/results</code></td>
    <td style="border:1px solid #ddd;padding:8px;">Results page</td>
    <td style="border:1px solid #ddd;padding:8px;">No (currently unprotected)</td>
  </tr>
</table>

<hr>

<h2>Backend API</h2>
<p>The backend runs on <code>http://localhost:8000</code> by default.</p>

<h3><code>POST /api/predict</code></h3>
<ul>
  <li>Multipart form upload; repeat the <code>files</code> field for multiple images.</li>
  <li>Returns per-image <code>detections</code> and an <code>annotated_image</code> data URL.</li>
</ul>

<h3><code>POST /api/track</code></h3>
<ul>
  <li>Receives basic telemetry (page, referrer, browser data).</li>
  <li>The server attempts a GeoIP lookup for the caller IP.</li>
</ul>

<hr>

<h2>Notes / troubleshooting</h2>
<ul>
  <li><b>Missing Clerk key</b>: the app shows a “Missing Clerk Publishable Key” screen if <code>VITE_CLERK_PUBLISHABLE_KEY</code> is not set.</li>
  <li><b>Model file</b>: the backend loads <code>backend/model/best.onnx</code> on startup; if it’s missing the API will return <code>503</code> on <code>/api/predict</code>.</li>
  <li><b>CORS</b>: backend currently allows <code>http://localhost:5173</code> and <code>http://localhost:3000</code>.</li>
</ul>

<hr>

</div>
