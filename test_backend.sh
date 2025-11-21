#!/bin/bash

# Script de test du backend
# Teste toutes les fonctionnalités de l'API

echo "🧪 Test du Backend AceStream → HLS"
echo "=================================="
echo ""

# Couleurs pour l'affichage
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# URL du backend (modifier si nécessaire)
BACKEND_URL="${1:-http://localhost:8000}"

echo "🔗 Backend URL: $BACKEND_URL"
echo ""

# Test 1: Vérifier que le backend est accessible
echo "Test 1: Backend Health Check"
echo "----------------------------"
response=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/")
if [ "$response" -eq 200 ]; then
    echo -e "${GREEN}✅ Backend accessible${NC}"
    curl -s "$BACKEND_URL/" | python3 -m json.tool
else
    echo -e "${RED}❌ Backend inaccessible (HTTP $response)${NC}"
    exit 1
fi
echo ""

# Test 2: Lister les playlists
echo "Test 2: Lister les playlists"
echo "----------------------------"
response=$(curl -s -w "\n%{http_code}" "$BACKEND_URL/api/playlists")
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

if [ "$http_code" -eq 200 ]; then
    echo -e "${GREEN}✅ Playlists récupérées${NC}"
    echo "$body" | python3 -m json.tool
    
    # Extraire le nom de la première playlist pour les tests suivants
    PLAYLIST_NAME=$(echo "$body" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data['playlists'][0]['name'] if data.get('playlists') else '')" 2>/dev/null)
else
    echo -e "${RED}❌ Erreur lors de la récupération des playlists (HTTP $http_code)${NC}"
    PLAYLIST_NAME=""
fi
echo ""

# Test 3: Récupérer les chaînes d'une playlist
if [ -n "$PLAYLIST_NAME" ]; then
    echo "Test 3: Récupérer les chaînes de '$PLAYLIST_NAME'"
    echo "----------------------------"
    PLAYLIST_NAME_CLEAN=$(echo "$PLAYLIST_NAME" | sed 's/.m3u$//')
    response=$(curl -s -w "\n%{http_code}" "$BACKEND_URL/api/playlists/$PLAYLIST_NAME_CLEAN/channels")
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" -eq 200 ]; then
        echo -e "${GREEN}✅ Chaînes récupérées${NC}"
        
        # Afficher le nombre de chaînes
        channel_count=$(echo "$body" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('total', len(data.get('channels', []))))" 2>/dev/null)
        echo "Nombre de chaînes: $channel_count"
        
        # Afficher les 3 premières chaînes
        echo ""
        echo "Premières chaînes:"
        echo "$body" | python3 -c "
import sys, json
data = json.load(sys.stdin)
channels = data.get('channels', [])
for i, ch in enumerate(channels[:3]):
    print(f\"{i+1}. {ch.get('name', 'N/A')} - Hash: {ch.get('acestream_hash', 'N/A')[:10]}...\")
" 2>/dev/null
        
        # Extraire un hash pour le test suivant
        ACESTREAM_HASH=$(echo "$body" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data['channels'][0]['acestream_hash'] if data.get('channels') else '')" 2>/dev/null)
    else
        echo -e "${RED}❌ Erreur lors de la récupération des chaînes (HTTP $http_code)${NC}"
        echo "$body"
        ACESTREAM_HASH=""
    fi
    echo ""
else
    echo -e "${YELLOW}⚠️  Test 3 ignoré (pas de playlist disponible)${NC}"
    echo ""
fi

# Test 4: Démarrer un stream (si un hash est disponible)
if [ -n "$ACESTREAM_HASH" ]; then
    echo "Test 4: Démarrer un stream"
    echo "----------------------------"
    echo "Hash AceStream: ${ACESTREAM_HASH:0:20}..."
    
    response=$(curl -s -w "\n%{http_code}" -X POST "$BACKEND_URL/api/play" \
        -H "Content-Type: application/json" \
        -d "{\"hash\": \"$ACESTREAM_HASH\"}")
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" -eq 200 ]; then
        echo -e "${GREEN}✅ Stream démarré${NC}"
        echo "$body" | python3 -m json.tool
        
        # Extraire l'ID de session
        SESSION_ID=$(echo "$body" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('session_id', ''))" 2>/dev/null)
        HLS_URL=$(echo "$body" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('hls_url', ''))" 2>/dev/null)
        
        echo ""
        echo "Session ID: $SESSION_ID"
        echo "HLS URL: $HLS_URL"
    else
        echo -e "${RED}❌ Erreur lors du démarrage du stream (HTTP $http_code)${NC}"
        echo "$body"
        SESSION_ID=""
    fi
    echo ""
    
    # Test 5: Vérifier le statut du stream
    if [ -n "$SESSION_ID" ]; then
        echo "Test 5: Vérifier le statut du stream"
        echo "----------------------------"
        sleep 2 # Attendre un peu
        
        response=$(curl -s -w "\n%{http_code}" "$BACKEND_URL/api/streams/$SESSION_ID")
        http_code=$(echo "$response" | tail -n1)
        body=$(echo "$response" | sed '$d')
        
        if [ "$http_code" -eq 200 ]; then
            echo -e "${GREEN}✅ Statut récupéré${NC}"
            echo "$body" | python3 -m json.tool
        else
            echo -e "${RED}❌ Erreur lors de la vérification du statut (HTTP $http_code)${NC}"
            echo "$body"
        fi
        echo ""
        
        # Test 6: Arrêter le stream
        echo "Test 6: Arrêter le stream"
        echo "----------------------------"
        
        response=$(curl -s -w "\n%{http_code}" -X DELETE "$BACKEND_URL/api/streams/$SESSION_ID")
        http_code=$(echo "$response" | tail -n1)
        body=$(echo "$response" | sed '$d')
        
        if [ "$http_code" -eq 200 ]; then
            echo -e "${GREEN}✅ Stream arrêté${NC}"
            echo "$body" | python3 -m json.tool
        else
            echo -e "${RED}❌ Erreur lors de l'arrêt du stream (HTTP $http_code)${NC}"
            echo "$body"
        fi
        echo ""
    else
        echo -e "${YELLOW}⚠️  Tests 5 et 6 ignorés (pas de session active)${NC}"
        echo ""
    fi
else
    echo -e "${YELLOW}⚠️  Tests 4, 5 et 6 ignorés (pas de hash AceStream disponible)${NC}"
    echo ""
fi

# Résumé
echo "=================================="
echo "🎉 Tests terminés!"
echo ""
echo "📝 Résumé:"
echo "  - Backend: ${GREEN}✅ Accessible${NC}"
if [ -n "$PLAYLIST_NAME" ]; then
    echo "  - Playlists: ${GREEN}✅ Fonctionnel${NC}"
else
    echo "  - Playlists: ${YELLOW}⚠️  Aucune playlist trouvée${NC}"
fi
if [ -n "$ACESTREAM_HASH" ]; then
    echo "  - Chaînes: ${GREEN}✅ Fonctionnel${NC}"
else
    echo "  - Chaînes: ${YELLOW}⚠️  Aucune chaîne trouvée${NC}"
fi
if [ -n "$SESSION_ID" ]; then
    echo "  - Streaming: ${GREEN}✅ Fonctionnel${NC}"
else
    echo "  - Streaming: ${YELLOW}⚠️  Non testé${NC}"
fi
echo ""

# Recommendations
echo "💡 Prochaines étapes:"
echo "  1. Si des playlists sont manquantes, copiez vos fichiers .m3u dans backend/"
echo "  2. Tester l'interface web: cd webapp && npm start"
echo "  3. Configurer l'URL du backend dans webapp/.env"
echo "  4. Builder l'APK Android avec Capacitor"
echo ""
echo "📚 Documentation: GUIDE_RAPIDE.md"
