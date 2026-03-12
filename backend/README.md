so i am using uv to manage the backend here -- if you want to run this backend server then all you need to do is get
## - powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"

run this command from the powershell then run close it

cd here to this rustdetector/backend then -- do this in terminal
# uv sync

that all then its going to manage all the dependecy that we have here

## Run (dev)

From `backend/`:

```bash
uv run uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload
```

If `uv` fails to initialize its cache (permissions), set a writable cache dir:

```bash
UV_CACHE_DIR=/tmp/uv-cache uv run uvicorn src.main:app --host 127.0.0.1 --port 8000 --reload
```
