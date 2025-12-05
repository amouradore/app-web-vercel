# 🚀 GUIDE DE DÉMARRAGE RAPIDE

## ✅ Votre Configuration
- 💻 PC Windows (24/7)
- 🌐 Upload : 26.64 Mbps
- 📡 AceStream Engine : Installé
- 🎬 FFmpeg 7.1 : Installé
- 🔐 Tunnel : Cloudflare
- 🎨 Frontend : Vercel

---

## 📋 ÉTAPES (30-45 minutes)

### 🧪 ÉTAPE 0 : Test de Configuration (5 min)

Vérifiez que tout est prêt avant de commencer :

```powershell
.\test_local_setup.ps1
```

✅ Ce script vérifie :
- AceStream Engine est actif
- FFmpeg est installé et accessible
- Python et dépendances sont prêtes
- Fichiers M3U sont présents

---

### 📥 ÉTAPE 1 : Installation Cloudflare Tunnel (10 min)

**Exécutez en tant qu'Administrateur** :

```powershell
.\install_cloudflared.ps1
```

Ce script va :
1. ✅ Télécharger `cloudflared.exe`
2. ✅ L'ajouter au PATH Windows
3. ✅ Ouvrir une page pour vous connecter à Cloudflare
4. ✅ Créer un tunnel nommé "iptv-app"
5. ✅ Générer le fichier `config.yml`

**Notes importantes** :
- Créez un compte Cloudflare gratuit si vous n'en avez pas : https://dash.cloudflare.com/sign-up
- Autorisez l'accès quand la page s'ouvre dans le navigateur
- Le Tunnel ID sera automatiquement configuré

---

### 🚀 ÉTAPE 2 : Démarrage du Serveur (5 min)

Lancez tous les services d'un coup :

```powershell
.\start_server_tunnel.ps1
```

Ce script va :
1. ✅ Vérifier et démarrer AceStream Engine (si nécessaire)
2. ✅ Démarrer le backend FastAPI sur `http://localhost:8000`
3. ✅ Démarrer le tunnel Cloudflare

**3 fenêtres PowerShell vont s'ouvrir** :
- 🖥️ Backend FastAPI
- 🌐 Cloudflare Tunnel
- 📋 Résumé

**⚠️ IMPORTANT** : Ne fermez pas ces fenêtres !

**Dans la fenêtre du tunnel**, vous verrez une ligne comme :

```
https://iptv-app-xyz.trycloudflare.com
```

➡️ **NOTEZ CETTE URL** (vous en aurez besoin pour l'étape suivante)

---

### 🧪 ÉTAPE 3 : Test du Backend (5 min)

Testez que tout fonctionne :

#### Test 1 : API Docs
Ouvrez dans votre navigateur :
```
https://VOTRE-URL-TUNNEL.trycloudflare.com/docs
```

Vous devriez voir la documentation interactive de l'API (Swagger UI).

#### Test 2 : AceStream Health Check
Dans l'API Docs, testez l'endpoint :
```
GET /api/health/acestream
```

Vous devriez voir :
```json
{
  "status": "healthy",
  "acestream_engine": "running",
  "message": "AceStream Engine is ready to stream!"
}
```

#### Test 3 : Liste des playlists
Testez :
```
GET /api/playlists
```

Vous devriez voir la liste de vos fichiers M3U.

✅ Si tous ces tests passent, le backend fonctionne parfaitement !

---

### ⚙️ ÉTAPE 4 : Configuration Vercel (10 min)

Configurez le frontend avec l'URL du tunnel :

```powershell
.\configure_vercel.ps1
```

Ce script va :
1. Demander l'URL de votre tunnel
2. Créer `webapp/.env.production` (pour Vercel)
3. Créer `webapp/.env.local` (pour tests locaux)
4. Afficher les instructions de déploiement

**Puis, déployez sur Vercel** :

#### Option A : Via CLI (Recommandé)

```powershell
# Installer Vercel CLI (une seule fois)
npm install -g vercel

# Se connecter
vercel login

# Déployer
cd webapp
vercel --prod
```

#### Option B : Via Interface Web

1. Allez sur https://vercel.com
2. Connectez-vous avec GitHub
3. Cliquez sur "New Project"
4. Importez votre repository
5. Configurez :
   - **Root Directory** : `webapp`
   - **Build Command** : `npm run build`
   - **Output Directory** : `build`
6. Dans **Environment Variables**, ajoutez :
   - `REACT_APP_API_URL` = `https://votre-tunnel.trycloudflare.com`
7. Cliquez sur "Deploy"

---

### ✅ ÉTAPE 5 : Test Final (5 min)

Une fois Vercel déployé, testez l'application complète :

1. **Ouvrir l'application Vercel** :
   ```
   https://votre-app.vercel.app
   ```

2. **Vérifier l'affichage** :
   - ✅ Les chaînes s'affichent
   - ✅ Les logos/images apparaissent
   - ✅ Pas d'erreur CORS

3. **Lancer une chaîne** :
   - Cliquez sur "Play"
   - Le flux devrait démarrer

4. **Tester depuis mobile** :
   - Ouvrez l'URL Vercel depuis votre téléphone
   - Testez le streaming

✅ **Si tout fonctionne, félicitations ! Votre système est opérationnel.**

---

## 🔄 UTILISATION QUOTIDIENNE

### Démarrage automatique

À chaque fois que vous allumez votre PC, exécutez simplement :

```powershell
.\start_server_tunnel.ps1
```

**Ou** configurez le démarrage automatique (voir ci-dessous).

---

## ⚙️ CONFIGURATION DÉMARRAGE AUTOMATIQUE WINDOWS

Pour que le serveur démarre automatiquement au démarrage de Windows :

### Méthode 1 : Tâche planifiée (Recommandé)

1. Ouvrez **Planificateur de tâches** (Rechercher "Task Scheduler")
2. Cliquez sur **"Créer une tâche..."**
3. **Onglet Général** :
   - Nom : `IPTV Server Startup`
   - Cochez : `Exécuter avec les privilèges maximums`
   - Cochez : `Exécuter même si l'utilisateur n'est pas connecté`
4. **Onglet Déclencheurs** :
   - Nouveau
   - Commencer la tâche : `Au démarrage`
5. **Onglet Actions** :
   - Nouveau
   - Action : `Démarrer un programme`
   - Programme : `powershell.exe`
   - Arguments : `-ExecutionPolicy Bypass -File "C:\chemin\vers\start_server_tunnel.ps1"`
   - Démarrer dans : `C:\chemin\vers\votre\projet`
6. Enregistrer

### Méthode 2 : Dossier Démarrage

1. Créez un raccourci de `start_server_tunnel.ps1`
2. Appuyez sur `Win + R`, tapez `shell:startup`
3. Placez le raccourci dans ce dossier

---

## 🛠️ DÉPANNAGE

### Problème 1 : AceStream Engine ne démarre pas

**Solution** :
```powershell
# Vérifier si AceStream est installé
Test-Path "C:\Program Files\ACEStream\ace_engine.exe"

# Démarrer manuellement
Start-Process "C:\Program Files\ACEStream\ace_engine.exe"
```

### Problème 2 : Backend ne démarre pas

**Solution** :
```powershell
# Vérifier les dépendances
cd backend
pip install -r requirements.txt

# Démarrer manuellement
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### Problème 3 : Tunnel ne se connecte pas

**Solution** :
```powershell
# Tester la connexion
cd C:\cloudflared
.\cloudflared.exe tunnel list

# Réauthentifier si nécessaire
.\cloudflared.exe tunnel login
```

### Problème 4 : Images ne s'affichent pas sur Vercel

**Vérifications** :
1. Le backend est accessible via l'URL tunnel
2. L'endpoint `/api/proxy/logo` fonctionne
3. La variable `REACT_APP_API_URL` est correcte dans Vercel

**Test** :
```
https://VOTRE-TUNNEL.trycloudflare.com/api/proxy/logo?url=https://example.com/logo.png
```

### Problème 5 : Tunnel URL change à chaque redémarrage

**Solution** : Créer un tunnel nommé avec domaine fixe

```powershell
cd C:\cloudflared

# Si vous avez un domaine Cloudflare
.\cloudflared.exe tunnel route dns iptv-app votre-sous-domaine.votre-domaine.com

# Sinon, utilisez un tunnel temporaire et mettez à jour Vercel à chaque redémarrage
```

---

## 📊 MONITORING

### Vérifier l'état des services

```powershell
# AceStream Engine
Invoke-WebRequest -Uri "http://127.0.0.1:6878/webui/api/service?method=get_version"

# Backend FastAPI
Invoke-WebRequest -Uri "http://localhost:8000/health"

# Tunnel (depuis l'extérieur)
Invoke-WebRequest -Uri "https://VOTRE-TUNNEL.trycloudflare.com/health"
```

### Logs

- **Backend** : Consultez la fenêtre PowerShell du backend
- **Tunnel** : Consultez la fenêtre PowerShell du tunnel
- **AceStream** : Logs dans `%APPDATA%\ACEStream\logs`

---

## 🔒 SÉCURITÉ

### Recommandations

1. ✅ **Pare-feu** : Le tunnel Cloudflare est chiffré (HTTPS)
2. ✅ **IP privée** : Votre IP publique n'est pas exposée
3. ⚠️ **Accès** : Toute personne avec l'URL tunnel peut accéder à l'API
4. 🔐 **Amélioration** : Ajoutez une authentification si nécessaire

### Ajouter une authentification basique (Optionnel)

Modifiez `backend/app/main.py` pour ajouter un API key :

```python
from fastapi import Security, HTTPException
from fastapi.security import APIKeyHeader

API_KEY = "votre-cle-secrete-ici"
api_key_header = APIKeyHeader(name="X-API-Key")

def verify_api_key(api_key: str = Security(api_key_header)):
    if api_key != API_KEY:
        raise HTTPException(status_code=403, detail="Invalid API Key")
    return api_key

# Protéger les endpoints
@app.get("/api/protected", dependencies=[Depends(verify_api_key)])
def protected_route():
    return {"message": "Access granted"}
```

---

## 📈 AMÉLIORATIONS FUTURES

### 1. Domaine personnalisé

Si vous avez un domaine Cloudflare :
```powershell
cloudflared tunnel route dns iptv-app iptv.votre-domaine.com
```

➡️ URL fixe : `https://iptv.votre-domaine.com`

### 2. Cache Redis (optionnel)

Pour améliorer les performances :
```powershell
# Installer Redis sur Windows
# Ajouter cache Redis pour les playlists M3U
```

### 3. CDN pour les logos

Héberger les logos sur un CDN gratuit (Cloudinary, ImgBB) pour réduire la charge.

---

## 📞 AIDE

Si vous rencontrez des problèmes :

1. ✅ Exécutez `.\test_local_setup.ps1` pour diagnostiquer
2. ✅ Vérifiez les logs dans les fenêtres PowerShell
3. ✅ Testez les endpoints individuellement dans `/docs`
4. ✅ Consultez les fichiers de documentation :
   - `ANALYSE_NOUVEAU_PLAN.md`
   - `PLAN_IMPLEMENTATION_TUNNEL.md`

---

## 🎉 FÉLICITATIONS !

Vous avez maintenant un système de streaming IPTV fonctionnel :
- ✅ Sans frais d'hébergement
- ✅ Sans installation côté utilisateur
- ✅ Accessible web et mobile
- ✅ Images et logos fonctionnels
- ✅ Streaming AceStream transparent

**Profitez de votre application ! 📺🎬**
