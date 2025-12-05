#!/bin/bash
# Script rapide de vérification FFmpeg

echo "======================================"
echo "🎬 Vérification rapide de FFmpeg"
echo "======================================"

# Vérifier si FFmpeg est installé
if ! command -v ffmpeg &> /dev/null; then
    echo "❌ FFmpeg n'est pas installé!"
    exit 1
fi

# Version
echo ""
echo "📦 Version:"
ffmpeg -version | head -n1

# Codecs importants
echo ""
echo "📋 Codecs vidéo (H.264):"
ffmpeg -codecs 2>/dev/null | grep "h264" | head -n1

echo ""
echo "📋 Codecs audio (AAC):"
ffmpeg -codecs 2>/dev/null | grep " aac " | head -n1

# Formats
echo ""
echo "📋 Format HLS:"
ffmpeg -formats 2>/dev/null | grep "hls" | head -n1

# Test simple
echo ""
echo "🧪 Test de génération vidéo (5 sec)..."
mkdir -p /tmp/ffmpeg_verify
ffmpeg -f lavfi -i testsrc=duration=5:size=320x240:rate=10 \
       -f lavfi -i sine=frequency=1000:duration=5 \
       -c:v libx264 -preset ultrafast \
       -c:a aac \
       -t 5 \
       -y /tmp/ffmpeg_verify/test.mp4 \
       -loglevel error

if [ -f "/tmp/ffmpeg_verify/test.mp4" ]; then
    SIZE=$(stat -f%z "/tmp/ffmpeg_verify/test.mp4" 2>/dev/null || stat -c%s "/tmp/ffmpeg_verify/test.mp4" 2>/dev/null)
    echo "✅ Test réussi! Fichier créé: ${SIZE} bytes"
    rm -rf /tmp/ffmpeg_verify
else
    echo "❌ Échec du test"
    exit 1
fi

echo ""
echo "======================================"
echo "✅ FFmpeg fonctionne correctement!"
echo "======================================"
