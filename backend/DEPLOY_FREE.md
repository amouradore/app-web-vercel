# 🚀 Déploiement Gratuit - Guide Complet

## ✅ Solution Sans Installation AceStream

Ce backend convertit automatiquement les flux AceStream en HLS, permettant la lecture directe dans le navigateur **SANS installer AceStream** sur l'appareil de l'utilisateur.

---

## 📋 Options de Déploiement Gratuit

### **Option 1: Railway.app** ⭐ RECOMMANDÉE
- ✅ **500 heures gratuites/mois**
- ✅ Déploiement Docker automatique
- ✅ HTTPS inclus
- ✅ Variables d'environnement faciles

#### Étapes de déploiement:

1. **Créer un compte sur [Railway.app](https://railway.app)**

2. **Cliquer sur "New Project" → "Deploy from GitHub repo"**

3. **Connecter votre repository GitHub**

4. **Configurer les variables d'environnement:**
   ```
   ACESTREAM_BASE_URL=http://localhost:6878
   STORAGE_DIR=/app/storage
   HLS_PUBLIC_BASE=https://votre-app.railway.app/hls
   ```

5. **Railway détectera automatiquement le Dockerfile et déploiera!**

6. **URL de votre backend:** `https://votre-app.railway.app`

---

### **Option 2: Render.com**
- ✅ Gratuit (avec limitations)
- ✅ Déploiement Docker
- ⚠️ Peut hiberner après inactivité

#### Étapes:

1. **Créer un compte sur [Render.com](https://render.com)**

2. **New → Web Service → Connect repository**

3. **Configurer:**
   - **Docker Command:** Automatique
   - **Instance Type:** Free
   - **Environment Variables:** (même que Railway)

---

### **Option 3: Fly.io**
- ✅ Gratuit avec limitations
- ✅ Support Docker complet

```bash
# Installer flyctl
curl -L https://fly.io/install.sh | sh

# Se connecter
fly auth login

# Déployer
cd backend
fly launch
```

---

## 🔧 Configuration Post-Déploiement

### 1. **Copier les Playlists M3U**

Assurez-vous que vos fichiers `.m3u` sont dans le dossier `backend/`:

```
backend/
├── app/
│   └── main.py
├── lista.m3u          ← Vos playlists ici
├── canales_acestream.m3u
├── Dockerfile
└── requirements.txt
```

### 2. **Tester l'API**

Une fois déployé, testez:

```bash
# Lister les playlists
curl https://votre-app.railway.app/api/playlists

# Obtenir les chaînes
curl https://votre-app.railway.app/api/playlists/lista/channels

# Démarrer un stream
curl -X POST https://votre-app.railway.app/api/play \
  -H "Content-Type: application/json" \
  -d '{"hash": "ACESTREAM_HASH_ICI"}'
```

---

## 📱 Configurer le Frontend (App Mobile)

### Mettre à jour l'URL du backend:

**Fichier:** `webapp/src/services/streamApi.js`

```javascript
const API_URL = 'https://votre-app.railway.app';

export const getPlaylists = async () => {
  const response = await fetch(`${API_URL}/api/playlists`);
  return response.json();
};

export const getChannels = async (playlistName) => {
  const response = await fetch(`${API_URL}/api/playlists/${playlistName}/channels`);
  return response.json();
};

export const playChannel = async (acestreamHash) => {
  const response = await fetch(`${API_URL}/api/play`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ hash: acestreamHash })
  });
  return response.json();
};
```

---

## ⚠️ Limitations du Plan Gratuit

### Railway.app:
- **500h/mois** (~16h/jour)
- **500 MB RAM**
- **1 GB stockage**

### Render.com:
- **750h/mois**
- Hiberne après **15 min d'inactivité**
- Redémarrage lent (~30s)

### Solutions:
1. **Ping régulier** pour éviter l'hibernation
2. **Utiliser plusieurs services** (rotation)
3. **Upgrade au plan payant** ($5-10/mois)

---

## 🔐 Sécurité

### 1. Ajouter une authentification (optionnel):

```python
# Dans backend/app/main.py
from fastapi import Header

API_KEY = os.getenv("API_KEY", "votre-cle-secrete")

@app.post("/api/play")
def play_acestream_channel(request: dict, x_api_key: str = Header(...)):
    if x_api_key != API_KEY:
        raise HTTPException(status_code=401, detail="Unauthorized")
    # ... reste du code
```

### 2. Limiter les requêtes (rate limiting):

```bash
pip install slowapi
```

```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter

@app.post("/api/play")
@limiter.limit("5/minute")
def play_acestream_channel(request: Request, body: dict):
    # ...
```

---

## 🎯 Architecture Finale

```
┌─────────────────┐
│  Mobile App     │
│  (Android/iOS)  │
└────────┬────────┘
         │ HTTPS
         ▼
┌─────────────────┐
│  Backend Cloud  │
│  (Railway/      │
│   Render)       │
│                 │
│  ┌───────────┐  │
│  │ FastAPI   │  │
│  │ + FFmpeg  │  │
│  │ + AceEng. │  │
│  └───────────┘  │
└────────┬────────┘
         │ HLS Stream
         ▼
┌─────────────────┐
│  Video Player   │
│  (Native HLS)   │
└─────────────────┘
```

---

## 📊 Monitoring

### Vérifier la santé du service:

```bash
curl https://votre-app.railway.app/
```

Réponse attendue:
```json
{
  "service": "AceStream → HLS Proxy",
  "version": "2.0.0",
  "features": [
    "M3U Playlist Parsing",
    "AceStream → HLS Conversion",
    "No Client Installation Required"
  ]
}
```

---

## 🆘 Troubleshooting

### Problème: "AceStream Engine not responding"
**Solution:** Vérifier que le container AceStream est bien démarré

### Problème: "FFmpeg error"
**Solution:** Vérifier les logs du backend

### Problème: "Playlist not found"
**Solution:** Vérifier que les fichiers .m3u sont bien dans le backend

---

## 📈 Prochaines Étapes

1. ✅ Déployer le backend sur Railway/Render
2. ✅ Configurer l'app mobile avec l'URL du backend
3. ✅ Tester la lecture de quelques chaînes
4. ✅ Builder l'APK Android avec Capacitor
5. ✅ Distribuer l'application!

---

## 💡 Conseils d'Optimisation

1. **Cache intelligent:** Les sessions HLS sont mises en cache
2. **Cleanup automatique:** Les anciens flux sont supprimés après 2h
3. **Compression:** FFmpeg optimise automatiquement les flux
4. **Multi-qualité:** Possibilité d'ajouter plusieurs qualités HLS

---

**🎉 Félicitations! Votre solution est maintenant 100% sans installation AceStream côté client!**
