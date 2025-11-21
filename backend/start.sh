#!/bin/bash
set -e

echo "🚀 Démarrage du backend AceStream → HLS"

# Démarrer AceStream Engine en arrière-plan
echo "📡 Démarrage d'AceStream Engine..."
if command -v acestream-engine &> /dev/null; then
    acestream-engine --client-console &> /var/log/acestream.log &
    ACESTREAM_PID=$!
    echo "✅ AceStream Engine démarré (PID: $ACESTREAM_PID)"
else
    echo "⚠️  AceStream Engine non trouvé, utilisation de l'engine externe"
fi

# Attendre que AceStream soit prêt
echo "⏳ Attente de AceStream (max 30s)..."
for i in {1..30}; do
    if curl -s http://127.0.0.1:6878/webui/api/service?method=get_version > /dev/null 2>&1; then
        echo "✅ AceStream Engine prêt!"
        break
    fi
    sleep 1
done

# Démarrer FastAPI
echo "🌐 Démarrage de l'API FastAPI sur le port ${PORT}..."
exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT}
