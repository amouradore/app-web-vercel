# Backend Dockerfile (POC)
FROM python:3.11-slim

# ffmpeg pour HLS
RUN apt-get update && apt-get install -y ffmpeg && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

COPY app /app/app

# storage pour HLS
RUN mkdir -p /app/storage/hls
VOLUME ["/app/storage"]

ENV ACESTREAM_BASE_URL=http://localhost:6878
ENV STORAGE_DIR=/app/storage
ENV PORT=8000

EXPOSE 8000

# Démarrer AceStream Engine en arrière-plan et FastAPI
CMD bash -c "acestream-engine --client-console &> /dev/null & sleep 5 && uvicorn app.main:app --host 0.0.0.0 --port ${PORT}"
