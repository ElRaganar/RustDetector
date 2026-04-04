# Use lightweight Python image
FROM python:3.11-slim

# Environment settings
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set working directory
WORKDIR /app

# Install system dependencies (needed for OpenCV, etc.)
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Copy dependency files
COPY pyproject.toml uv.lock ./

# Install uv
RUN pip install --no-cache-dir uv

# Install dependencies (creates .venv)
RUN uv sync --frozen --no-dev

# Copy project files
COPY src ./src
COPY model ./model

# Expose port
EXPOSE 8000

# ✅ IMPORTANT: run inside uv environment
CMD ["uv", "run", "uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]