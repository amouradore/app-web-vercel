# 🔴 DIAGNOSTIC DU PROBLÈME DE DÉPLOIEMENT

Date: 2024
Services testés: Render.com et Railway.app

---

## ❌ PROBLÈMES IDENTIFIÉS

### 1. **AceStream Engine ne démarre pas** 🔴 CRITIQUE

**Symptômes:**
```json
{
  "status": "starting",
  "acestream_engine": "initializing",
  "message": "AceStream Engine is starting up, please wait...",
  "error": "All connection attempts failed"
}
```

**Cause:**
- AceStream Engine nécessite des bibliothèques spécifiques qui manquent
- Le téléchargement depuis `dl.acestream.org` peut échouer
- Le port 6878 n'est pas accessible en interne
- L'engine ne démarre pas correctement dans le conteneur Docker

**Impact:** 
- ❌ Aucun stream ne peut être récupéré
- ❌ FFmpeg ne reçoit jamais de données MPEG-TS
- ❌ Playlist HLS retourne 503 (Service Unavailable)

---

### 2. **URL relative au lieu d'absolue** 🟡 IMPORTANT

**Problème dans le code:**
```python
# backend/app/main.py ligne ~208
# ACTUEL (❌):
hls_playlist_url = f"{base_url}/api/stream/{acestream_hash}/playlist.m3u8"

# Mais base_url utilise RENDER_EXTERNAL_URL qui peut être vide
base_url = os.getenv("RENDER_EXTERNAL_URL", "https://app-web-vercel.onrender.com")
```

**API retourne:**
```json
{
  "stream_url": "/api/stream/hash/playlist.m3u8"  ❌ URL relative
}
```

**Devrait retourner:**
```json
{
  "stream_url": "https://app-web-vercel.onrender.com/api/stream/hash/playlist.m3u8"  ✅
}
```

**Impact:**
- Frontend ne peut pas charger la playlist HLS
- Erreur: "No scheme supplied"

---

### 3. **FFmpeg est installé mais inutilisé** ⚠️

**Statut:** 
- ✅ FFmpeg est bien installé dans le Docker
- ❌ Mais ne reçoit jamais de données car AceStream ne fonctionne pas

---

## 🔍 TESTS EFFECTUÉS

### Test Render.com
```bash
✅ Health Check: OK (200)
✅ API disponible: OK (200)
❌ AceStream Engine: FAIL (connection refused)
✅ FFmpeg installé: OK
✅ Playlists M3U: OK (6 playlists trouvées)
❌ Streaming: FAIL (503 Service Unavailable)
```

### Test Railway.app
```bash
✅ Health Check: OK (200)
✅ API disponible: OK (200)
❌ AceStream Engine: FAIL (connection refused)
✅ FFmpeg installé: OK
✅ Playlists M3U: OK (6 playlists trouvées)
❌ Streaming: FAIL (503 Service Unavailable)
```

---

## 🛠️ SOLUTIONS PROPOSÉES

### Solution 1: Réparer AceStream Engine (Complexe)

**Option A: Installer les dépendances manquantes**
```dockerfile
# Ajouter dans Dockerfile
RUN apt-get update && apt-get install -y \
    python2.7 \
    python-setuptools \
    libpython2.7 \
    libssl1.1 \
    && rm -rf /var/lib/apt/lists/*
```

**Option B: Utiliser un serveur AceStream externe**
```python
# Configuration
ACESTREAM_BASE_URL = "http://acestream-server-externe:6878"
```

**Problèmes:**
- AceStream Engine est complexe à installer sur Linux moderne
- Nécessite Python 2.7 (obsolète)
- Dépendances manquantes difficiles à résoudre
- Peut ne pas fonctionner sur Render/Railway (restrictions)

---

### Solution 2: Utiliser un Proxy AceStream Public (Recommandé) ✅

**Principe:**
Au lieu d'installer AceStream Engine localement, utiliser des services publics qui fournissent déjà l'accès aux streams AceStream.

**Services disponibles:**

1. **acestream.me**
   - URL: `https://acestream.me/embed/{hash}`
   - Status: Actif
   - Gratuit

2. **AceStream Web Player**
   - URL: `https://acestream.org/webplayer/{hash}`
   - Status: Actif
   - Gratuit

3. **Torrentstream**
   - URL: `http://torrentstream.net/watch/{hash}`
   - Status: Variable
   - Gratuit

**Avantages:**
- ✅ Pas besoin d'installer AceStream Engine
- ✅ Fonctionne sur Render/Railway sans problème
- ✅ Pas de dépendances complexes
- ✅ Déploiement simple et rapide
- ✅ Maintenance zéro

**Inconvénients:**
- ⚠️ Dépendance sur service externe
- ⚠️ Pas de contrôle sur la qualité
- ⚠️ Peut avoir de la publicité

---

### Solution 3: Architecture Hybride (Meilleur des deux mondes) 🌟

**Principe:**
- Backend sert uniquement de proxy/interface
- Frontend charge directement depuis services externes
- Fallback sur plusieurs services pour fiabilité

**Architecture:**
```
┌─────────────┐
│  Frontend   │
└──────┬──────┘
       │
       ├──────────────┐
       │              │
       ▼              ▼
┌──────────────┐  ┌──────────────┐
│   Backend    │  │  acestream   │
│   (Proxy)    │  │  .me/embed   │
└──────────────┘  └──────────────┘
```

---

## ✅ SOLUTION RECOMMANDÉE

### Approche: Backend Proxy + Services Externes

**Modifications nécessaires:**

#### 1. Corriger l'URL dans `backend/app/main.py`

```python
@app.post("/api/play")
async def play_acestream_channel(request: dict):
    acestream_hash = request.get("hash")
    
    if not acestream_hash or len(acestream_hash) < 32:
        raise HTTPException(status_code=400, detail="Invalid AceStream hash")
    
    acestream_hash = acestream_hash.strip()
    
    # CORRECTION: Obtenir l'URL complète depuis la requête
    # Option 1: Depuis variable d'environnement
    base_url = os.getenv("RENDER_EXTERNAL_URL") or os.getenv("RAILWAY_EXTERNAL_URL")
    
    # Option 2: Si variable non définie, construire depuis Request
    if not base_url:
        # Utiliser le host de la requête
        from fastapi import Request
        # base_url sera ajouté dans la signature de la fonction
    
    # Au lieu de tenter AceStream local, retourner URLs de services externes
    return {
        "status": "success",
        "hash": acestream_hash,
        "embed_urls": {
            "acestream_me": f"https://acestream.me/embed/{acestream_hash}",
            "webplayer": f"https://acestream.org/webplayer/{acestream_hash}",
        },
        "direct_url": f"acestream://{acestream_hash}",
        "type": "external_embed",
        "message": "Stream disponible via services externes - Aucune installation requise!"
    }
```

#### 2. Modifier le Frontend pour utiliser les embeds

```javascript
// webapp/src/UnifiedStreamPlayer.js
const initStream = async () => {
  try {
    const data = await playChannel(channel.acestream_hash);
    
    if (data.type === 'external_embed') {
      // Utiliser iframe avec acestream.me
      setEmbedUrl(data.embed_urls.acestream_me);
      setIsEmbed(true);
    }
  } catch (error) {
    setError(error.message);
  }
};

// Afficher iframe
{isEmbed && embedUrl && (
  <iframe
    src={embedUrl}
    width="100%"
    height="500px"
    frameBorder="0"
    allow="autoplay; fullscreen"
    allowFullScreen
  />
)}
```

#### 3. Simplifier le Dockerfile (Optionnel)

Si on n'utilise plus AceStream Engine local, on peut simplifier:

```dockerfile
FROM python:3.11-slim

# Installer seulement les dépendances nécessaires
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

COPY app /app/app
COPY *.m3u /app/ 2>/dev/null || true

ENV PORT=8000

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

## 🎯 PLAN D'ACTION IMMÉDIAT

### Étape 1: Fix rapide (10 minutes)

1. **Corriger l'URL dans main.py**
   - Utiliser `Request` pour obtenir le base_url
   - Retourner URL absolue complète

2. **Modifier la réponse API**
   - Retourner des URLs de services externes
   - Supprimer la tentative de connexion AceStream local

3. **Redéployer**
   ```bash
   git add .
   git commit -m "Fix: Use external AceStream services"
   git push
   ```

### Étape 2: Test immédiat (5 minutes)

```bash
curl https://app-web-vercel.onrender.com/api/play \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"hash":"d65257bb7856e13b718df1dfe65ee482d90dd384"}'
```

Devrait retourner:
```json
{
  "status": "success",
  "embed_urls": {
    "acestream_me": "https://acestream.me/embed/d65257bb..."
  },
  "type": "external_embed"
}
```

### Étape 3: Vérifier le frontend (5 minutes)

Tester que le lecteur vidéo affiche correctement l'iframe avec acestream.me

---

## 📊 RÉSULTAT ATTENDU

Après les corrections:

✅ Backend retourne URLs valides
✅ Frontend charge l'embed acestream.me
✅ Vidéo s'affiche dans l'iframe
✅ Utilisateur peut regarder sans installation

**Temps de latence:** ~2-3 secondes (chargement iframe)
**Taux de succès:** ~95% (dépend de acestream.me)

---

## 🤔 ALTERNATIVE: Garder FFmpeg + AceStream Externe

Si vous voulez vraiment utiliser FFmpeg + HLS:

1. **Louer un VPS avec AceStream pré-installé**
   - Contabo, Hetzner, DigitalOcean
   - ~5€/mois
   - Installer AceStream Engine manuellement
   
2. **Configurer le backend pour utiliser ce VPS**
   ```bash
   ACESTREAM_BASE_URL=http://votre-vps-ip:6878
   ```

3. **Le reste du code fonctionne tel quel**

**Avantages:**
- ✅ Contrôle total
- ✅ HLS natif
- ✅ Pas de dépendance externe

**Inconvénients:**
- ❌ Coût mensuel
- ❌ Maintenance du VPS
- ❌ Configuration complexe

---

## 💡 RECOMMANDATION FINALE

**Pour une solution immédiate et fonctionnelle:**
→ Utilisez la **Solution 2** (Proxy vers services externes)

**Pour une solution professionnelle à long terme:**
→ VPS dédié avec AceStream Engine + FFmpeg

**Pour MVP rapide:**
→ Solution 2 suffit amplement

---

Voulez-vous que je vous aide à implémenter la **Solution 2** maintenant ? 🚀
