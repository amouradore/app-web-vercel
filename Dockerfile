# Dockerfile pour Railway - Copie depuis backend/
FROM python:3.11-slim

# Installer dépendances système
RUN apt-get update && apt-get install -y \
    ffmpeg \
    wget \
    curl \
    net-tools \
    && rm -rf /var/lib/apt/lists/*

# Installer AceStream Engine (optionnel, peut échouer)
RUN wget -q -O - http://dl.acestream.org/linux/acestream_3.1.49_ubuntu_20.04_x86_64.tar.gz | tar -xz -C /opt/ || echo "AceStream download skipped" && \
    ln -s /opt/acestream.engine/acestream-engine /usr/local/bin/acestream-engine 2>/dev/null || echo "AceStream link skipped"

WORKDIR /app

# Copier requirements.txt
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Créer structure app/
RUN mkdir -p app

# Copier le code Python dans app/
COPY backend/app/main.py app/
COPY backend/app/__init__.py app/ 2>/dev/null || touch app/__init__.py

# Copier les playlists M3U
COPY backend/*.m3u .

# Créer les répertoires de stockage
RUN mkdir -p storage/hls /root/.ACEStream

# Variables d'environnement
ENV ACESTREAM_BASE_URL=http://127.0.0.1:6878
ENV STORAGE_DIR=/app/storage
ENV PYTHONPATH=/app

EXPOSE 8000

# Script de démarrage avec uvicorn
CMD bash -c "if command -v acestream-engine >/dev/null 2>&1; then acestream-engine --client-console &> /dev/null & sleep 5; fi && uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"
