#!/bin/bash
set -e

echo "🔧 Build script pour Render - Installation FFmpeg"

# Mise à jour des paquets
echo "📦 Mise à jour des paquets..."
apt-get update

# Installation de FFmpeg et dépendances
echo "🎬 Installation de FFmpeg..."
apt-get install -y \
    ffmpeg \
    libavcodec-extra \
    libavformat-dev \
    libavutil-dev \
    libswscale-dev \
    wget \
    curl \
    procps \
    net-tools

# Nettoyage
echo "🧹 Nettoyage..."
apt-get clean
rm -rf /var/lib/apt/lists/*

# Vérification de FFmpeg
echo "✅ Vérification de l'installation FFmpeg..."
ffmpeg -version

echo ""
echo "📋 Codecs disponibles (H.264):"
ffmpeg -codecs 2>/dev/null | grep h264 || echo "⚠️ H.264 non trouvé"

echo ""
echo "📋 Codecs disponibles (AAC):"
ffmpeg -codecs 2>/dev/null | grep aac || echo "⚠️ AAC non trouvé"

echo ""
echo "📋 Formats disponibles (HLS):"
ffmpeg -formats 2>/dev/null | grep hls || echo "⚠️ HLS non trouvé"

# Installation des dépendances Python
echo ""
echo "🐍 Installation des dépendances Python..."
pip install --no-cache-dir -r requirements.txt

echo ""
echo "✅ Build terminé avec succès!"
