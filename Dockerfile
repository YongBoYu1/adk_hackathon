# NHL Live Commentary System - Cloud Run Dockerfile
# Optimized for Google Cloud Run deployment with AI workloads

FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Install system dependencies for audio processing and AI workloads
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    ffmpeg \
    libsndfile1 \
    portaudio19-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better Docker layer caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create necessary directories
RUN mkdir -p data/live data/static data/sequential_agent_v3_outputs audio_output

# Set Python path to include all necessary modules
ENV PYTHONPATH=/app:/app/src:/app/src/agents:/app/src/board:/app/src/data:/app/src/pipeline:/app/web_client_demo

# Expose port (Cloud Run will inject PORT env var)
EXPOSE 8080

# Use environment variable for port with fallback
ENV PORT=8080

# Health check is handled by Cloud Run's built-in probes
# No need for Docker HEALTHCHECK in Cloud Run environment

# Run the application with gunicorn for production
CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 --timeout 300 --keep-alive 2 --max-requests 1000 --max-requests-jitter 100 main:app