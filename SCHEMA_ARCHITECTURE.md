# 🏗️ SCHÉMA D'ARCHITECTURE DÉTAILLÉ

## 📐 Vue d'ensemble du système

```
┌───────────────────────────────────────────────────────────────────────────┐
│                          UTILISATEUR FINAL                                 │
│  (Aucune installation AceStream requise !)                                │
└───────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
           ┌────────▼────────┐           ┌─────────▼──────────┐
           │  Navigateur Web │           │   Application      │
           │  Chrome/Firefox │           │   Mobile (APK)     │
           │  Safari/Edge    │           │   Android          │
           └────────┬────────┘           └─────────┬──────────┘
                    │                               │
                    └───────────────┬───────────────┘
                                    │ HTTPS
                    ┌───────────────▼────────────────┐
                    │    FRONTEND (React/Capacitor)  │
                    │  - Interface utilisateur       │
                    │  - Sélection chaînes/événements│
                    │  - Lecteur vidéo HLS.js        │
                    │  - Gestion playlists M3U       │
                    └───────────────┬────────────────┘
                                    │ REST API (JSON)
                    ┌───────────────▼────────────────┐
                    │     BACKEND (FastAPI)          │
                    │  - API REST endpoints          │
                    │  - Parsing M3U                 │
                    │  - Orchestration streaming     │
                    │  - Serveur de segments HLS     │
                    └───────────────┬────────────────┘
                         │                    │
                         │                    │
            ┌────────────▼──────────┐  ┌──────▼────────────────┐
            │  AceStream Engine     │  │      FFmpeg           │
            │  - Client P2P         │  │  - Conversion         │
            │  - Téléchargement     │  │    MPEG-TS → HLS      │
            │  - Stream MPEG-TS     │  │  - Segmentation       │
            │  - Port 6878          │  │  - Génération .m3u8   │
            └────────────┬──────────┘  └──────┬────────────────┘
                         │                    │
                         └──────────┬─────────┘
                                    │
                    ┌───────────────▼────────────────┐
                    │   Stockage Temporaire          │
                    │   /app/storage/hls/{hash}/     │
                    │   - playlist.m3u8              │
                    │   - segment_000.ts             │
                    │   - segment_001.ts             │
                    │   - segment_002.ts (...)       │
                    └────────────────────────────────┘
```

---

## 🔄 FLUX DE DONNÉES COMPLET

### Scénario: Utilisateur regarde "LaLiga TV"

```
ÉTAPE 1: SÉLECTION DE LA CHAÎNE
════════════════════════════════════════════════════════════

┌─────────┐  1. Clique sur "LaLiga TV"
│ User    ├──────────────────────────────────────┐
└─────────┘                                      │
                                                 ▼
                                    ┌────────────────────────┐
                                    │  Frontend React        │
                                    │  État: selectedChannel │
                                    │  Hash: d65257bb...     │
                                    └────────────────────────┘


ÉTAPE 2: DEMANDE DE STREAMING AU BACKEND
════════════════════════════════════════════════════════════

┌─────────────────────────┐
│  Frontend React         │
│  services/streamApi.js  │
└──────────┬──────────────┘
           │
           │ POST /api/play
           │ Content-Type: application/json
           │ Body: { "hash": "d65257bb7856e13b718df1dfe65ee482d90dd384" }
           │
           ▼
┌─────────────────────────┐
│  Backend FastAPI        │
│  app/main.py            │
│  @app.post("/api/play") │
└──────────┬──────────────┘
           │
           │ 1. Valide le hash (min 32 caractères)
           │ 2. Détermine le type de backend (Linux/Docker)
           │ 3. Prépare l'URL de réponse
           │
           ▼
    Retourne JSON:
    {
      "status": "success",
      "hash": "d65257bb...",
      "stream_url": "https://backend.com/api/stream/d65257bb.../playlist.m3u8",
      "hls_url": "https://backend.com/api/stream/d65257bb.../playlist.m3u8",
      "type": "hls_conversion",
      "backend": "railway_ffmpeg"
    }


ÉTAPE 3: DEMANDE DE LA PLAYLIST HLS
════════════════════════════════════════════════════════════

┌─────────────────────────┐
│  Frontend React         │
│  HLS.js / ReactPlayer   │
└──────────┬──────────────┘
           │
           │ GET /api/stream/d65257bb.../playlist.m3u8
           │
           ▼
┌─────────────────────────────────────────────────────────┐
│  Backend FastAPI                                        │
│  @app.get("/api/stream/{hash}/playlist.m3u8")          │
└──────────┬──────────────────────────────────────────────┘
           │
           │ 1. Vérifie si playlist existe
           │    ├─ OUI → Retourne fichier existant
           │    └─ NON → Lance conversion FFmpeg
           │
           ▼
┌──────────────────────────────────────────────────────────┐
│  Vérification: /app/storage/hls/d65257bb.../playlist.m3u8│
└──────────┬───────────────────────────────────────────────┘
           │
           │ Fichier non trouvé
           │
           ▼


ÉTAPE 4: DÉMARRAGE DE LA CONVERSION FFMPEG
════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────┐
│  Backend - Connexion à AceStream Engine                │
└──────────┬──────────────────────────────────────────────┘
           │
           │ URL: http://127.0.0.1:6878/ace/getstream?id=d65257bb...
           │
           ▼
┌─────────────────────────────────────────────────────────┐
│  AceStream Engine (Port 6878)                          │
│  - Analyse le hash                                      │
│  - Cherche les peers P2P                               │
│  - Commence le téléchargement                          │
│  - Retourne flux MPEG-TS en continu                    │
└──────────┬──────────────────────────────────────────────┘
           │
           │ Stream MPEG-TS (video/mp2t)
           │ ────────────────────────────────→
           │
           ▼
┌─────────────────────────────────────────────────────────┐
│  FFmpeg - Commande de conversion                       │
│                                                         │
│  ffmpeg -i http://127.0.0.1:6878/ace/getstream?id=...  │
│         -c:v copy        # Copie vidéo (pas encodage)  │
│         -c:a copy        # Copie audio (pas encodage)  │
│         -f hls           # Format de sortie: HLS       │
│         -hls_time 4      # Segments de 4 secondes     │
│         -hls_list_size 10 # Garde 10 segments         │
│         -hls_flags delete_segments+append_list         │
│         -hls_segment_filename segment_%03d.ts          │
│         playlist.m3u8                                  │
│                                                         │
└──────────┬──────────────────────────────────────────────┘
           │
           │ Génère les fichiers:
           │
           ▼
┌─────────────────────────────────────────────────────────┐
│  /app/storage/hls/d65257bb.../                         │
│  ├─ playlist.m3u8                                      │
│  ├─ segment_000.ts  (4 secondes de vidéo)             │
│  ├─ segment_001.ts  (4 secondes de vidéo)             │
│  ├─ segment_002.ts  (4 secondes de vidéo)             │
│  └─ ...                                                │
└─────────────────────────────────────────────────────────┘


ÉTAPE 5: RETOUR DE LA PLAYLIST AU FRONTEND
════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────┐
│  Backend FastAPI                                        │
│  Détecte que playlist.m3u8 existe maintenant           │
└──────────┬──────────────────────────────────────────────┘
           │
           │ FileResponse(playlist.m3u8)
           │ Content-Type: application/vnd.apple.mpegurl
           │ Access-Control-Allow-Origin: *
           │
           │ Contenu du fichier:
           │ ───────────────────────────────────────
           │ #EXTM3U
           │ #EXT-X-VERSION:3
           │ #EXT-X-TARGETDURATION:4
           │ #EXT-X-MEDIA-SEQUENCE:0
           │ #EXTINF:4.0,
           │ segment_000.ts
           │ #EXTINF:4.0,
           │ segment_001.ts
           │ #EXTINF:4.0,
           │ segment_002.ts
           │ ───────────────────────────────────────
           │
           ▼
┌─────────────────────────────────────────────────────────┐
│  Frontend - HLS.js                                      │
│  - Parse playlist.m3u8                                  │
│  - Détecte 3 segments disponibles                      │
│  - Commence le téléchargement séquentiel                │
└─────────────────────────────────────────────────────────┘


ÉTAPE 6: TÉLÉCHARGEMENT DES SEGMENTS VIDÉO
════════════════════════════════════════════════════════════

┌─────────────────────────┐
│  Frontend HLS.js        │
└──────────┬──────────────┘
           │
           │ GET /api/stream/d65257bb.../segment_000.ts
           │
           ▼
┌─────────────────────────┐
│  Backend FastAPI        │
│  Sert le fichier .ts    │
└──────────┬──────────────┘
           │
           │ FileResponse(segment_000.ts)
           │ Content-Type: video/mp2t
           │ 4 secondes de vidéo encodée
           │
           ▼
┌─────────────────────────┐
│  Frontend HLS.js        │
│  - Décode le segment    │
│  - Ajoute au buffer     │
│  - Lecture vidéo        │
└─────────────────────────┘
           │
           │ Répète pour segment_001.ts, segment_002.ts...
           │
           ▼
┌─────────────────────────┐
│  Utilisateur            │
│  🎥 Regarde la vidéo !  │
└─────────────────────────┘


ÉTAPE 7: STREAMING CONTINU
════════════════════════════════════════════════════════════

FFmpeg continue de générer segments...
├─ segment_003.ts  ✓
├─ segment_004.ts  ✓
├─ segment_005.ts  ✓
└─ ...

HLS.js rafraîchit playlist.m3u8 toutes les 4 secondes
├─ Détecte nouveaux segments
├─ Télécharge automatiquement
└─ Lecture fluide continue

Segments anciens sont supprimés automatiquement
(garde seulement les 10 derniers = 40 secondes de buffer)
```

---

## 🗂️ STRUCTURE DES DONNÉES

### Format des Playlists M3U (Input)

```m3u
#EXTM3U

#EXTINF:-1 tvg-id="laliga" tvg-logo="https://example.com/laliga.png" group-title="Deportes",LaLiga TV
acestream://d65257bb7856e13b718df1dfe65ee482d90dd384

#EXTINF:-1 tvg-id="champions" tvg-logo="https://example.com/ucl.png" group-title="Deportes",UEFA Champions League
http://127.0.0.1:6878/ace/getstream?id=a7b7f1e2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8

#EXTINF:-1 tvg-id="premier" tvg-logo="https://example.com/epl.png" group-title="Deportes",Premier League
https://acestream.me/embed/f9e8d7c6b5a4938271605f4e3d2c1b0a9
```

### Format API Backend (Output)

**Response de /api/playlists/{name}/channels:**
```json
{
  "channels": [
    {
      "name": "LaLiga TV",
      "logo": "https://example.com/laliga.png",
      "id": "laliga",
      "group": "Deportes",
      "acestream_hash": "d65257bb7856e13b718df1dfe65ee482d90dd384",
      "original_url": "acestream://d65257bb7856e13b718df1dfe65ee482d90dd384"
    }
  ],
  "total": 1,
  "cached": false
}
```

**Response de /api/play:**
```json
{
  "status": "success",
  "hash": "d65257bb7856e13b718df1dfe65ee482d90dd384",
  "stream_url": "https://backend.onrender.com/api/stream/d65257bb.../playlist.m3u8",
  "hls_url": "https://backend.onrender.com/api/stream/d65257bb.../playlist.m3u8",
  "type": "hls_conversion",
  "backend": "railway_ffmpeg",
  "message": "HLS stream ready via Railway - No AceStream installation required!"
}
```

### Format HLS Playlist (Intermédiaire)

**playlist.m3u8:**
```m3u8
#EXTM3U
#EXT-X-VERSION:3
#EXT-X-TARGETDURATION:4
#EXT-X-MEDIA-SEQUENCE:0
#EXTINF:4.000000,
segment_000.ts
#EXTINF:4.000000,
segment_001.ts
#EXTINF:4.000000,
segment_002.ts
#EXTINF:4.000000,
segment_003.ts
```

---

## 🔐 SÉCURITÉ ET PERFORMANCE

### CORS (Cross-Origin Resource Sharing)

```python
# Backend - app/main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],           # Permet tous domaines (Vercel, etc.)
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600                   # Cache preflight 1 heure
)
```

**Pourquoi important ?**
- Frontend (vercel.app) et Backend (onrender.com) sont sur domaines différents
- Sans CORS, le navigateur bloque les requêtes
- Headers permettent la communication cross-domain

### Cache et Performance

**Cache Playlist M3U (Backend):**
```python
m3u_cache: Dict[str, List[Dict]] = {}

# Première requête: Parse le fichier M3U (lent)
# Requêtes suivantes: Retourne depuis cache (rapide)
```

**Cache Segments HLS (Navigateur):**
```http
Cache-Control: public, max-age=31536000
```
- Segments .ts sont immutables une fois créés
- Navigateur peut les garder en cache 1 an
- Réduit la bande passante

**Gestion Mémoire (FFmpeg):**
```bash
-hls_flags delete_segments+append_list
-hls_list_size 10
```
- Garde seulement 10 segments (40 secondes)
- Supprime automatiquement les anciens
- Prévient le remplissage du disque

### Load Balancing (Futur)

```
┌─────────┐
│ User 1  │──┐
└─────────┘  │
             │    ┌──────────────┐
┌─────────┐  ├───►│ Load Balancer│
│ User 2  │──┤    │  (Nginx)     │
└─────────┘  │    └──────┬───────┘
             │           │
┌─────────┐  │           ├──────► Backend 1 (AceStream Engine 1)
│ User 3  │──┘           │
└─────────┘              ├──────► Backend 2 (AceStream Engine 2)
                         │
                         └──────► Backend 3 (AceStream Engine 3)
```

---

## 🎨 COMPOSANTS FRONTEND EN DÉTAIL

### UnifiedStreamPlayer - Composant Principal

```javascript
État du composant:
┌─────────────────────────────────────────────┐
│ streamUrl: null                             │  ← URL de la playlist HLS
│ isEmbed: false                              │  ← Mode iframe ou HLS natif
│ isLoading: true                             │  ← État de chargement
│ error: null                                 │  ← Message d'erreur
│ statusMessage: "Initialisation..."         │  ← Message utilisateur
│ backendReady: false                         │  ← Backend disponible ?
└─────────────────────────────────────────────┘

Cycle de vie:
1. useEffect() se déclenche quand channel change
2. initStream() async:
   ├─ checkBackendHealth() → Vérifie API
   ├─ playChannel(hash) → Demande stream
   └─ setStreamUrl(url) → Configure lecteur
3. ReactPlayer se charge avec l'URL HLS
4. HLS.js télécharge et lit les segments
5. Vidéo s'affiche à l'utilisateur
```

### ImprovedWebPlayer - Fallback

```javascript
Méthodes alternatives si backend indisponible:
┌────────────────────────────────────────┐
│ 1. Nouvelle Fenêtre                    │
│    → window.open(acestream.me)         │
│                                        │
│ 2. Lien Direct                         │
│    → acestream://hash                  │
│                                        │
│ 3. Copie Hash                          │
│    → clipboard.writeText(hash)         │
│                                        │
│ 4. Instructions                        │
│    → Guide step-by-step                │
└────────────────────────────────────────┘

Utilisé quand:
- Backend hors ligne
- Erreur de conversion
- Timeout FFmpeg
- Préférence utilisateur
```

---

## 📱 APPLICATION MOBILE (APK)

### Architecture Capacitor

```
┌─────────────────────────────────────────┐
│        Application Android APK          │
│  ┌───────────────────────────────────┐  │
│  │      Capacitor WebView            │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │   React App (Bundlé)        │  │  │
│  │  │   - HTML + CSS + JS         │  │  │
│  │  │   - Même code que Web       │  │  │
│  │  │   - HLS.js intégré          │  │  │
│  │  └─────────────────────────────┘  │  │
│  │                                   │  │
│  │  Capacitor Native APIs:           │  │
│  │  - Notifications                  │  │
│  │  - File System                    │  │
│  │  - Device Info                    │  │
│  └───────────────────────────────────┘  │
│                                         │
│  Android System:                        │
│  - Video Decoder (Hardware)             │
│  - Network Stack                        │
│  - Storage                              │
└─────────────────────────────────────────┘
```

### Build Process

```bash
1. npm run build
   └─> Crée webapp/build/ (HTML, CSS, JS)

2. npx cap sync android
   ├─> Copie build/ vers android/app/src/main/assets/public/
   └─> Met à jour capacitor.config.json

3. npx cap open android
   └─> Ouvre Android Studio

4. Build > Build Bundle/APK > Build APK
   ├─> Compile code Java/Kotlin
   ├─> Package assets (React app)
   ├─> Signe l'APK
   └─> Génère app-debug.apk ou app-release.apk
```

### Configuration

**capacitor.config.json:**
```json
{
  "appId": "com.souabni.app",
  "appName": "AceStream Viewer",
  "webDir": "build",
  "server": {
    "url": "https://votre-backend.onrender.com",
    "cleartext": true,
    "androidScheme": "https"
  },
  "android": {
    "allowMixedContent": true,
    "backgroundColor": "#000000"
  }
}
```

**AndroidManifest.xml (auto-généré):**
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

<application
    android:usesCleartextTraffic="true"
    android:hardwareAccelerated="true">
    
    <activity
        android:name=".MainActivity"
        android:configChanges="orientation|screenSize">
    </activity>
</application>
```

---

## 🔧 DÉPLOIEMENT DOCKER

### Dockerfile Multi-Stage

```dockerfile
# ============================================
# STAGE 1: Base Image avec Dépendances
# ============================================
FROM python:3.11-slim AS base

# Installer dépendances système
RUN apt-get update && apt-get install -y \
    ffmpeg \              # Conversion vidéo
    wget \                # Téléchargement
    curl \                # Health checks
    net-tools \           # Debugging réseau
    procps \              # Monitoring processus
    && rm -rf /var/lib/apt/lists/*

# Vérifier FFmpeg
RUN ffmpeg -version && \
    ffmpeg -codecs | grep h264 && \
    ffmpeg -codecs | grep aac

# ============================================
# STAGE 2: AceStream Engine
# ============================================
FROM base AS acestream

# Télécharger et installer AceStream Engine
RUN wget -q -O - \
    http://dl.acestream.org/linux/acestream_3.1.49_ubuntu_20.04_x86_64.tar.gz \
    | tar -xz -C /opt/

# Créer symlink pour faciliter l'utilisation
RUN ln -s /opt/acestream.engine/acestream-engine \
          /usr/local/bin/acestream-engine

# ============================================
# STAGE 3: Application Python
# ============================================
FROM acestream AS app

WORKDIR /app

# Copier et installer dépendances Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copier code application
COPY app/ ./app/
COPY *.m3u ./

# Créer répertoires de stockage
RUN mkdir -p /app/storage/hls /root/.ACEStream

# Variables d'environnement
ENV ACESTREAM_BASE_URL=http://127.0.0.1:6878
ENV STORAGE_DIR=/app/storage
ENV PORT=8000
ENV PYTHONUNBUFFERED=1

EXPOSE 8000

# Script de démarrage
COPY start.sh .
RUN chmod +x start.sh

CMD ["./start.sh"]
```

### Script de Démarrage (start.sh)

```bash
#!/bin/bash
set -e

echo "🚀 Démarrage du backend AceStream → HLS"

# ============================================
# 1. Vérifier FFmpeg
# ============================================
echo "🔍 Vérification de FFmpeg..."
if command -v ffmpeg &> /dev/null; then
    FFMPEG_VERSION=$(ffmpeg -version | head -n1)
    echo "✅ $FFMPEG_VERSION"
else
    echo "❌ ERREUR: FFmpeg n'est pas installé!"
    exit 1
fi

# ============================================
# 2. Démarrer AceStream Engine
# ============================================
echo "📡 Démarrage d'AceStream Engine..."
if command -v acestream-engine &> /dev/null; then
    # Démarrer en arrière-plan
    acestream-engine --client-console &> /var/log/acestream.log &
    ACESTREAM_PID=$!
    echo "✅ AceStream Engine démarré (PID: $ACESTREAM_PID)"
    
    # Attendre que AceStream soit prêt (max 30s)
    echo "⏳ Attente de AceStream (max 30s)..."
    for i in {1..30}; do
        if curl -s http://127.0.0.1:6878/webui/api/service?method=get_version > /dev/null 2>&1; then
            echo "✅ AceStream Engine prêt!"
            break
        fi
        sleep 1
    done
else
    echo "⚠️  AceStream Engine non trouvé, utilisation de l'engine externe"
fi

# ============================================
# 3. Démarrer FastAPI
# ============================================
echo "🌐 Démarrage de l'API FastAPI sur le port ${PORT}..."
exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT}
```

---

## 📊 MONITORING ET LOGS

### Logs Backend

```bash
# Docker logs
docker logs -f container_name

# Logs AceStream
tail -f /var/log/acestream.log

# Logs FFmpeg (STDERR)
# Visible dans les logs Docker
```

### Health Checks

```bash
# Backend API
curl http://localhost:8000/health
# → {"status": "healthy", "service": "acestream-hls-proxy"}

# AceStream Engine
curl http://localhost:6878/webui/api/service?method=get_version
# → {"result": {"version": "3.1.49", ...}}

# FFmpeg
ffmpeg -version
# → ffmpeg version 4.4.2-0ubuntu0.22.04.1
```

### Métriques (Futur)

```python
# À implémenter avec Prometheus
metrics = {
    "active_streams": 5,
    "total_requests": 1234,
    "average_latency_ms": 150,
    "ffmpeg_processes": 3,
    "storage_used_mb": 850,
    "bandwidth_mbps": 25.4
}
```

---

## 🎯 RÉSUMÉ TECHNIQUE

| Composant | Technologie | Rôle |
|-----------|------------|------|
| **Frontend** | React + HLS.js | Interface + Lecteur vidéo |
| **API** | FastAPI (Python) | Orchestration backend |
| **P2P Client** | AceStream Engine | Téléchargement streams |
| **Convertisseur** | FFmpeg | MPEG-TS → HLS |
| **Stockage** | Filesystem | Segments HLS temporaires |
| **Mobile** | Capacitor | Wrapper natif Android |
| **Déploiement** | Docker | Conteneurisation |
| **Hosting** | Render/Railway | Cloud gratuit |

**Flux de données:** 
`AceStream P2P → MPEG-TS → FFmpeg → HLS Segments → Frontend → Utilisateur`

**Latence totale:** ~10-15 secondes (HLS standard)

**Compatibilité:** Tous navigateurs modernes + Android + iOS (PWA)

**Performance:** Pas de ré-encodage = CPU faible, bande passante = 1:1 avec stream

---

🎉 **Architecture complète et opérationnelle !**
