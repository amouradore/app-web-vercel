# Dockerfile pour Railway - Pointe vers backend/
FROM python:3.11-slim

# Installer dépendances système
RUN apt-get update && apt-get install -y \
    ffmpeg \
    wget \
    curl \
    net-tools \
    && rm -rf /var/lib/apt/lists/*

# Installer AceStream Engine
RUN wget -q -O - http://dl.acestream.org/linux/acestream_3.1.49_ubuntu_20.04_x86_64.tar.gz | tar -xz -C /opt/ \
    && ln -s /opt/acestream.engine/acestream-engine /usr/local/bin/acestream-engine || echo "AceStream installation skipped"

WORKDIR /app

# Copier les fichiers depuis backend/
COPY backend/requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/app /app/app
COPY backend/*.m3u /app/

# Créer les répertoires de stockage
RUN mkdir -p /app/storage/hls /root/.ACEStream

# Variables d'environnement
ENV ACESTREAM_BASE_URL=http://127.0.0.1:6878
ENV STORAGE_DIR=/app/storage

EXPOSE 8000

# Script de démarrage
CMD bash -c "acestream-engine --client-console &> /dev/null & sleep 5 && uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"
