# ==========================================
# Stage 1: Build the React Frontend
# ==========================================
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend

# Copy dependency configuration and install packages
COPY frontend/package.json ./
RUN npm install

# Copy source and build static assets
COPY frontend/ ./
RUN npm run build

# ==========================================
# Stage 2: Build the FastAPI Backend & Serve
# ==========================================
FROM python:3.10-slim AS backend-runner
WORKDIR /app

# Install system dependencies (gcc etc.) if needed for scikit-learn
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy backend requirements and install Python packages
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend files
COPY backend/ ./backend

# Copy the built frontend static assets from Stage 1
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Expose port (Hugging Face default is 7860)
EXPOSE 7860

# Command to launch the Uvicorn server, using the PORT env variable if present, defaulting to 7860
CMD ["sh", "-c", "uvicorn backend.main:app --host 0.0.0.0 --port ${PORT:-7860}"]
