<div style="font-family: Arial, sans-serif; line-height:1.6;">

<h1 style="text-align:center;">RustDetector Frontend: Pages and Routing</h1>

<p>
This document details the frontend page structure and routing within the RustDetector application.
The application utilizes <b>React Router DOM</b> for navigation, providing a seamless user experience across different functionalities.
</p>

<hr>

<h2>Core Routing (<code>src/App.tsx</code>)</h2>

<p>
The <code>App.tsx</code> file serves as the central hub for defining the application's routes. It manages navigation between various pages and authenticated states.
</p>

<table style="border-collapse: collapse; width:100%;">
<tr style="background:#f5f5f5;">
<th style="border:1px solid #ddd;padding:8px;">Path</th>
<th style="border:1px solid #ddd;padding:8px;">Component(s)</th>
<th style="border:1px solid #ddd;padding:8px;">Authentication Required</th>
</tr>

<tr>
<td style="border:1px solid #ddd;padding:8px;">/</td>
<td style="border:1px solid #ddd;padding:8px;">Landing</td>
<td style="border:1px solid #ddd;padding:8px;">No</td>
</tr>

<tr>
<td style="border:1px solid #ddd;padding:8px;">/sign-in/*</td>
<td style="border:1px solid #ddd;padding:8px;">SignIn (redirects to /dashboard)</td>
<td style="border:1px solid #ddd;padding:8px;">No</td>
</tr>

<tr>
<td style="border:1px solid #ddd;padding:8px;">/sign-up/*</td>
<td style="border:1px solid #ddd;padding:8px;">SignUp (redirects to /dashboard)</td>
<td style="border:1px solid #ddd;padding:8px;">No</td>
</tr>

<tr>
<td style="border:1px solid #ddd;padding:8px;">/dashboard</td>
<td style="border:1px solid #ddd;padding:8px;">Dashboard</td>
<td style="border:1px solid #ddd;padding:8px;">Yes</td>
</tr>

<tr>
<td style="border:1px solid #ddd;padding:8px;">/dashboard/scans</td>
<td style="border:1px solid #ddd;padding:8px;">RecentScans</td>
<td style="border:1px solid #ddd;padding:8px;">Yes</td>
</tr>

<tr>
<td style="border:1px solid #ddd;padding:8px;">/dashboard/fileselector</td>
<td style="border:1px solid #ddd;padding:8px;">FileSelector</td>
<td style="border:1px solid #ddd;padding:8px;">Yes</td>
</tr>

<tr>
<td style="border:1px solid #ddd;padding:8px;">/dashboard/dragdrop</td>
<td style="border:1px solid #ddd;padding:8px;">DragandDrop</td>
<td style="border:1px solid #ddd;padding:8px;">Yes</td>
</tr>

<tr>
<td style="border:1px solid #ddd;padding:8px;">/dashboard/camera</td>
<td style="border:1px solid #ddd;padding:8px;">CameraCapture</td>
<td style="border:1px solid #ddd;padding:8px;">Yes</td>
</tr>

<tr>
<td style="border:1px solid #ddd;padding:8px;">/dashboard/results</td>
<td style="border:1px solid #ddd;padding:8px;">Result</td>
<td style="border:1px solid #ddd;padding:8px;">Yes</td>
</tr>

</table>

<hr>

<h2>Page Components (<code>src/pages/</code>)</h2>

<p>
The <code>src/pages</code> directory contains the main components representing different views and user interactions.
</p>

<h3>Top-Level Pages</h3>

<ul>
<li><b>Landing.tsx</b> – Entry point for unauthenticated users.</li>
<li><b>AIProcessingScreen.tsx</b> – Displays a loading screen while the AI processes uploaded images.</li>
<li><b>ResultPage.tsx</b> – Displays detailed rust detection results.</li>
</ul>

<h3>Dashboard Sub-Pages (<code>src/pages/dashboard/</code>)</h3>

<ul>
<li><b>Dashboard.tsx</b> – Main dashboard container.</li>
<li><b>RecentScans.tsx</b> – Displays user's past rust detection scans.</li>
<li><b>StatsPanel.tsx</b> – Shows statistical data related to scans.</li>
<li><b>UploadCard.tsx</b> – Interface for uploading images.</li>
</ul>

<h3>Image Upload / Capture Pages</h3>

<ul>
<li>ChooseUpload.tsx</li>
<li>FileSelector.tsx</li>
<li>DragandDrop.tsx</li>
<li>CameraPermission.tsx</li>
<li>CameraCapture.tsx</li>
<li>CameraReview.tsx</li>
<li>ImageValidation.tsx</li>
<li>ImagepreviewPanel.tsx</li>
<li>ProgressScreen.tsx</li>
</ul>

<h3>Other Components</h3>

<ul>
<li>Header.tsx</li>
<li>FileCard.tsx</li>
<li>DropZone.tsx</li>
<li>DropZoneContent.tsx</li>
<li>Scancard.tsx</li>
<li>SummaryBar.tsx</li>
<li>browsefile.tsx</li>
<li>cameracard.tsx</li>
</ul>

<hr>

<h2>Authentication Flow</h2>

<p>
The application uses <b>Clerk</b> for authentication.
</p>

<ul>
<li>Users sign in through <code>/sign-in</code></li>
<li>Users sign up through <code>/sign-up</code></li>
<li>After successful authentication, they are redirected to <code>/dashboard</code></li>
<li>All <code>/dashboard/*</code> routes require authentication</li>
</ul>

<hr>

<h2>Navigation Example</h2>

<ol>
<li>User visits <b>Landing Page</b></li>
<li>User clicks <b>Sign In</b> and logs in</li>
<li>User is redirected to <b>Dashboard</b></li>
<li>User uploads an image via file selector, drag & drop, or camera</li>
<li>The AI processes the image</li>
<li>Results appear on the <b>Results Page</b></li>
</ol>

<hr>

<h2>Development</h2>

<ul>
<li>Add new routes inside <code>App.tsx</code></li>
<li>Protect dashboard routes with authentication</li>
<li>Place page components inside <code>src/pages</code></li>
<li>Use subfolders for related features</li>
</ul>

<hr>

<h2>Conclusion</h2>

<p>
This routing structure provides a clear and organized way to manage application navigation.
The modular design of components ensures scalability and maintainability.
</p>

<hr>

<h2>Running Locally</h2>

<h3>Prerequisites</h3>

<ul>
<li>Node.js + npm</li>
<li>Python 3.11+</li>
<li>uv (Python package manager)</li>
</ul>

<hr>

<h3>Frontend Setup (Vite)</h3>

<p>From the repository root:</p>

<pre style="background:#f6f8fa;padding:10px;border-radius:5px;">
npm install
</pre>

<p>Create a <code>.env</code> file:</p>

<pre style="background:#f6f8fa;padding:10px;border-radius:5px;">
VITE_CLERK_PUBLISHABLE_KEY=pk_test_yourkey
</pre>

<p>Start development server:</p>

<pre style="background:#f6f8fa;padding:10px;border-radius:5px;">
npm run dev
</pre>

<p>Open in browser:</p>

<pre style="background:#f6f8fa;padding:10px;border-radius:5px;">
http://localhost:5173/
</pre>

<p><b>Note:</b> Run the command from the repository root so Vite loads the environment variables.</p>

<hr>

<h3>Backend Setup (FastAPI)</h3>

<pre style="background:#f6f8fa;padding:10px;border-radius:5px;">
cd backend
uv sync
uv run uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload
</pre>

<p>Backend runs at:</p>

<pre style="background:#f6f8fa;padding:10px;border-radius:5px;">
http://localhost:8000
</pre>

<hr>

<h3>Common Issues</h3>

<h4>Clerk Authentication Error</h4>

<ul>
<li>Ensure <code>.env</code> exists in repository root</li>
<li>Add full Clerk publishable key</li>
<li>Restart frontend server</li>
</ul>

<h4>ONNX Model Path Issue</h4>

<p>Windows path:</p>

<pre style="background:#f6f8fa;padding:10px;border-radius:5px;">
model\\best.onnx
</pre>

<p>Replace with:</p>

<pre style="background:#f6f8fa;padding:10px;border-radius:5px;">
model/best.onnx
</pre>

<p>Or use Python <code>pathlib</code> for cross-platform compatibility.</p>

<hr>

<<<<<<< HEAD
</div>
=======
</div>
>>>>>>> 88975d9d177efb42dc1a18b273e55601b2205972
