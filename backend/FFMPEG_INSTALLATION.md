# 🎬 Installation FFmpeg pour Render

## ✅ Statut actuel

FFmpeg est **déjà inclus** dans le Dockerfile du backend. L'installation se fait automatiquement lors du déploiement sur Render.

## 📦 Ce qui est installé

### Dans le Dockerfile (`backend/Dockerfile`)

```dockerfile
RUN apt-get update && apt-get install -y \
    ffmpeg \
    wget \
    curl \
    net-tools \
    libpython3.9 \
    procps \
    && rm -rf /var/lib/apt/lists/*
```

### Vérifications incluses

1. **Version de FFmpeg**
2. **Support H.264** (codec vidéo)
3. **Support AAC** (codec audio)
4. **Format HLS** (HTTP Live Streaming)

## 🚀 Comment ça fonctionne sur Render

### 1. Build automatique avec Docker

Render utilise le `Dockerfile` qui :
- Installe FFmpeg depuis les dépôts Ubuntu
- Vérifie que tous les codecs nécessaires sont disponibles
- Configure l'environnement pour la conversion HLS

### 2. Vérification au démarrage

Le script `start.sh` vérifie FFmpeg au démarrage :

```bash
echo "🔍 Vérification de FFmpeg..."
if command -v ffmpeg &> /dev/null; then
    FFMPEG_VERSION=$(ffmpeg -version | head -n1)
    echo "✅ $FFMPEG_VERSION"
else
    echo "❌ ERREUR: FFmpeg n'est pas installé!"
    exit 1
fi
```

## 📋 Variables d'environnement (render.yaml)

```yaml
envVars:
  - key: FFMPEG_ENABLED
    value: "true"
  - key: FFMPEG_LOG_LEVEL
    value: "warning"
```

## 🔧 Utilisation de FFmpeg dans le code

### Dans `backend/app/hls_converter.py`

FFmpeg est utilisé pour :
1. **Convertir les flux AceStream** (MPEG-TS) en HLS
2. **Créer des segments** (.ts files)
3. **Générer des playlists** (.m3u8)

Exemple de commande FFmpeg utilisée :

```python
ffmpeg_cmd = [
    'ffmpeg',
    '-i', acestream_url,           # Input: flux AceStream
    '-c:v', 'copy',                # Copy video codec (pas de réencodage)
    '-c:a', 'copy',                # Copy audio codec
    '-f', 'hls',                   # Format HLS
    '-hls_time', '2',              # Segments de 2 secondes
    '-hls_list_size', '6',         # Garder 6 segments
    '-hls_flags', 'delete_segments', # Supprimer anciens segments
    output_path
]
```

## 🧪 Tester FFmpeg localement

### Avec Docker

```bash
# Build l'image
cd backend
docker build -t acestream-backend .

# Vérifier FFmpeg dans le container
docker run acestream-backend ffmpeg -version
```

### Sans Docker (Linux/MacOS)

```bash
# Installer FFmpeg
sudo apt-get install ffmpeg  # Ubuntu/Debian
brew install ffmpeg          # MacOS

# Vérifier
ffmpeg -version
ffmpeg -codecs | grep h264
ffmpeg -codecs | grep aac
```

## 📊 Codecs et formats supportés

### Codecs vidéo
- ✅ H.264 (AVC) - Le plus courant pour le streaming
- ✅ H.265 (HEVC) - Haute efficacité
- ✅ MPEG-2 - Utilisé par AceStream

### Codecs audio
- ✅ AAC - Standard pour HLS
- ✅ MP3 - Compatibilité
- ✅ AC3 - Audio surround

### Formats de sortie
- ✅ HLS (.m3u8 + .ts) - Pour le streaming web
- ✅ MPEG-TS - Format brut d'AceStream
- ✅ MP4 - Pour téléchargement (optionnel)

## 🐛 Dépannage

### Problème : FFmpeg non trouvé

**Solution :** Vérifier le Dockerfile et rebuild :
```bash
docker build --no-cache -t acestream-backend .
```

### Problème : Codec H.264 manquant

**Solution :** Installer `libavcodec-extra` :
```dockerfile
RUN apt-get install -y ffmpeg libavcodec-extra
```

### Problème : Conversion lente

**Solutions :**
1. Utiliser `-c:v copy` (pas de réencodage)
2. Réduire la taille des segments HLS
3. Augmenter les ressources CPU sur Render

## 📝 Logs FFmpeg

Pour voir les logs FFmpeg en production :

```bash
# Sur Render Dashboard
# Aller dans Logs → Filtrer par "ffmpeg"
```

Les logs montreront :
- Début de conversion
- Format détecté
- Codecs utilisés
- Erreurs éventuelles

## 🎯 Performance sur Render

### Plan Free
- ✅ FFmpeg fonctionne
- ⚠️ CPU limité (conversion peut être lente)
- ⚠️ Timeout après 15 min d'inactivité

### Optimisations
1. **Copy codecs** au lieu de réencoder
2. **Segments courts** (2-4 secondes)
3. **Nettoyage automatique** des anciens segments

## 📚 Resources

- [FFmpeg Documentation](https://ffmpeg.org/documentation.html)
- [HLS Specification](https://datatracker.ietf.org/doc/html/rfc8216)
- [Render Docker Deployment](https://render.com/docs/docker)

---

**✅ FFmpeg est prêt à l'emploi sur Render !**

Aucune configuration supplémentaire n'est nécessaire. Le déploiement Docker gère tout automatiquement.
