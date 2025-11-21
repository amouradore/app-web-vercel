# Backend Dockerfile - Avec AceStream Engine intégré
FROM python:3.11-slim

# Installer les dépendances système incluant FFmpeg pour conversion HLS
RUN apt-get update && apt-get install -y \
    ffmpeg \
    wget \
    curl \
    net-tools \
    libpython3.9 \
    && rm -rf /var/lib/apt/lists/* \
    && ffmpeg -version

# Installer AceStream Engine
RUN wget -q -O - http://dl.acestream.org/linux/acestream_3.1.49_ubuntu_20.04_x86_64.tar.gz | tar -xz -C /opt/ \
    && ln -s /opt/acestream.engine/acestream-engine /usr/local/bin/acestream-engine

WORKDIR /app

# Copier requirements et installer dépendances Python
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copier le code de l'application
COPY app /app/app

# Copier les playlists M3U
COPY *.m3u /app/ 2>/dev/null || true

# Créer les répertoires de stockage
RUN mkdir -p /app/storage/hls /root/.ACEStream

# Variables d'environnement
ENV ACESTREAM_BASE_URL=http://127.0.0.1:6878
ENV STORAGE_DIR=/app/storage
ENV PORT=8000

EXPOSE 8000

# Copier le script de démarrage
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

# Démarrer avec le script
CMD ["/app/start.sh"]
