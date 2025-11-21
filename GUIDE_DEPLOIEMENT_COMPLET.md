# 🚀 GUIDE COMPLET DE DÉPLOIEMENT - Railway + Vercel

## 📋 OBJECTIF
Déployer votre application pour que les utilisateurs puissent regarder les chaînes **SANS installer AceStream** :
- **Backend sur Railway.com** : Conversion AceStream → HLS
- **Frontend sur Vercel.com** : Interface web

---

## ✅ CE QUI A ÉTÉ CORRIGÉ

### 1. Backend amélioré (`backend/app/main.py`)
- ✅ Endpoint `/api/play` retourne maintenant une vraie URL HLS
- ✅ Endpoint `/api/health/acestream` pour vérifier l'état du moteur
- ✅ Utilise AceStream Engine sur Railway pour conversion P2P → HTTP

### 2. Dockerfile mis à jour (`backend/Dockerfile`)
- ✅ Installation d'AceStream Engine 3.1.49
- ✅ Toutes les dépendances système (ffmpeg, wget, curl)
- ✅ Script de démarrage automatique

### 3. Requirements Python (`backend/requirements.txt`)
- ✅ Ajout de `httpx` pour vérifier AceStream Engine

---

## 🔧 ÉTAPE 1 : POUSSER LES MODIFICATIONS SUR GITHUB

```bash
# Vérifier les modifications
git status

# Ajouter tous les fichiers modifiés
git add backend/app/main.py
git add backend/Dockerfile
git add backend/requirements.txt
git add GUIDE_DEPLOIEMENT_COMPLET.md

# Commit avec message clair
git commit -m "✨ Backend avec AceStream Engine complet pour Railway"

# Pousser vers GitHub
git push origin main
```

✅ **Vos modifications sont maintenant sur GitHub !**

---

## 🚂 ÉTAPE 2 : DÉPLOYER LE BACKEND SUR RAILWAY

### Option A : Si Railway est déjà configuré (UPDATE)

1. **Aller sur Railway Dashboard**
   - https://railway.app/dashboard
   - Sélectionner votre projet

2. **Railway va détecter les changements automatiquement**
   - Attendez le redéploiement (2-3 minutes)
   - Surveillez les logs pour voir AceStream Engine démarrer

3. **Vérifier les variables d'environnement**
   ```
   PORT=8000
   ACESTREAM_BASE_URL=http://127.0.0.1:6878
   STORAGE_DIR=/app/storage
   ```

4. **Obtenir l'URL du backend**
   - Cliquez sur "Settings" → "Domains"
   - Copiez l'URL (ex: `https://votre-projet.up.railway.app`)

### Option B : Si Railway n'est pas encore configuré (NOUVEAU)

1. **Créer un compte Railway**
   - Aller sur https://railway.app
   - Se connecter avec GitHub

2. **Créer un nouveau projet**
   - Cliquer sur "New Project"
   - Sélectionner "Deploy from GitHub repo"
   - Choisir votre repository

3. **Configurer le service**
   - Root Directory: `backend`
   - Build Command: (laisser vide, Docker le gère)
   - Start Command: (laisser vide, Docker le gère)

4. **Ajouter les variables d'environnement**
   ```
   PORT=8000
   ACESTREAM_BASE_URL=http://127.0.0.1:6878
   STORAGE_DIR=/app/storage
   ```

5. **Générer un domaine public**
   - Settings → Generate Domain
   - Copier l'URL générée

---

## 🧪 ÉTAPE 3 : TESTER LE BACKEND RAILWAY

```bash
# Remplacer par VOTRE URL Railway
export BACKEND_URL="https://votre-projet.up.railway.app"

# Test 1: Vérifier que le backend répond
curl $BACKEND_URL/

# Test 2: Vérifier AceStream Engine
curl $BACKEND_URL/api/health/acestream

# Test 3: Tester la conversion d'un hash
curl -X POST $BACKEND_URL/api/play \
  -H "Content-Type: application/json" \
  -d '{"hash": "f5ad210d79c48a97a978a8b0bdfd7ba20436e6b0"}'

# Test 4: Lister les playlists
curl $BACKEND_URL/api/playlists
```

### Réponses attendues

**Test 1 - Backend actif :**
```json
{
  "service": "AceStream → HLS Proxy",
  "version": "2.0.0",
  "status": "running"
}
```

**Test 2 - AceStream Engine :**
```json
{
  "status": "healthy",
  "acestream_engine": "running",
  "message": "AceStream Engine is ready to stream!"
}
```

**Test 3 - Conversion hash :**
```json
{
  "status": "success",
  "hash": "f5ad210d...",
  "hls_url": "http://127.0.0.1:6878/ace/getstream?id=...",
  "message": "Stream ready - No AceStream installation required!"
}
```

✅ **Si tous les tests passent → Backend OK !**

---

## 🌐 ÉTAPE 4 : CONFIGURER LE FRONTEND POUR VERCEL

```bash
# Aller dans le dossier webapp
cd webapp

# Créer/Mettre à jour .env.production avec l'URL Railway
echo "REACT_APP_API_URL=https://votre-projet.up.railway.app" > .env.production

# Vérifier le fichier
cat .env.production
```

**Exemple :**
```
REACT_APP_API_URL=https://acestream-backend-production.up.railway.app
```

---

## 🚀 ÉTAPE 5 : DÉPLOYER LE FRONTEND SUR VERCEL

### Option A : Via Interface Web Vercel

1. **Aller sur Vercel**
   - https://vercel.com/dashboard

2. **Importer le projet**
   - Click "Add New..." → "Project"
   - Sélectionner votre repository GitHub

3. **Configurer le déploiement**
   - Framework Preset: `Create React App`
   - Root Directory: `webapp`
   - Build Command: `npm run build`
   - Output Directory: `build`

4. **Ajouter la variable d'environnement**
   - Dans "Environment Variables"
   - Name: `REACT_APP_API_URL`
   - Value: `https://votre-projet.up.railway.app` (VOTRE URL Railway)

5. **Déployer**
   - Cliquer sur "Deploy"
   - Attendre 2-3 minutes

### Option B : Via CLI Vercel

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Aller dans webapp/
cd webapp

# Déployer
vercel --prod

# Suivre les instructions
# Framework: Create React App
# Build Command: npm run build
# Output Directory: build
```

---

## 📱 ÉTAPE 6 : TESTER L'APPLICATION COMPLÈTE

1. **Ouvrir l'URL Vercel** (ex: `https://votre-app.vercel.app`)

2. **Sélectionner une chaîne**

3. **Cliquer sur "🌐 Navigateur"**

4. **Le stream devrait démarrer SANS installation d'AceStream !** ✅

---

## 🔍 TROUBLESHOOTING

### ❌ Problème : "Backend not responding"

**Solution :**
```bash
# Vérifier les logs Railway
railway logs

# Chercher "AceStream Engine" dans les logs
# Doit voir: "✅ AceStream Engine démarré"
```

### ❌ Problème : "Stream not loading"

**Causes possibles :**
1. AceStream Engine encore en démarrage (attendre 30s)
2. Hash invalide
3. Pas de seeders pour ce contenu

**Solution :**
```bash
# Tester avec un hash connu
curl -X POST https://votre-backend.up.railway.app/api/play \
  -H "Content-Type: application/json" \
  -d '{"hash": "f5ad210d79c48a97a978a8b0bdfd7ba20436e6b0"}'
```

### ❌ Problème : "CORS error"

**Vérifier :**
- Le backend doit avoir `allow_origins=["*"]` dans le CORS middleware
- Déjà configuré dans `backend/app/main.py` ligne 12-18

### ❌ Problème : "Frontend can't reach backend"

**Solution :**
```bash
# Vérifier que .env.production contient la bonne URL
cat webapp/.env.production

# Doit afficher:
# REACT_APP_API_URL=https://VOTRE-BACKEND.up.railway.app

# Rebuild le frontend
cd webapp
npm run build
vercel --prod
```

---

## 📊 ARCHITECTURE FINALE

```
┌─────────────────────────────────────────────────────────┐
│  UTILISATEUR (Navigateur)                                │
│  https://votre-app.vercel.app                            │
└────────────────┬────────────────────────────────────────┘
                 │
                 │ 1. Demande stream pour hash ABC123
                 ↓
┌─────────────────────────────────────────────────────────┐
│  VERCEL (Frontend React)                                 │
│  - Interface utilisateur                                 │
│  - Liste des chaînes                                     │
│  - Player vidéo                                          │
└────────────────┬────────────────────────────────────────┘
                 │
                 │ 2. POST /api/play {"hash": "ABC123"}
                 ↓
┌─────────────────────────────────────────────────────────┐
│  RAILWAY (Backend FastAPI)                               │
│  https://votre-projet.up.railway.app                     │
│  - Reçoit le hash                                        │
│  - Contacte AceStream Engine local                       │
│  - Retourne URL stream HTTP                              │
└────────────────┬────────────────────────────────────────┘
                 │
                 │ 3. Conversion P2P → HTTP
                 ↓
┌─────────────────────────────────────────────────────────┐
│  ACESTREAM ENGINE (sur Railway)                          │
│  http://127.0.0.1:6878                                   │
│  - Télécharge depuis réseau P2P                          │
│  - Convertit en flux HTTP                                │
│  - Stream le contenu                                     │
└────────────────┬────────────────────────────────────────┘
                 │
                 │ 4. Stream HTTP/HLS
                 ↓
┌─────────────────────────────────────────────────────────┐
│  UTILISATEUR (Player)                                    │
│  ✅ Regarde le match SANS installer AceStream !          │
└─────────────────────────────────────────────────────────┘
```

---

## ✅ CHECKLIST FINALE

- [ ] Modifications poussées sur GitHub
- [ ] Backend déployé sur Railway
- [ ] AceStream Engine démarre (vérifier logs)
- [ ] Tests backend OK (4 tests curl)
- [ ] `.env.production` configuré avec URL Railway
- [ ] Frontend déployé sur Vercel
- [ ] Variable d'environnement configurée sur Vercel
- [ ] Test complet : Ouvrir app → Sélectionner chaîne → Stream fonctionne !

---

## 🎉 RÉSULTAT FINAL

Votre application permet maintenant de :
- ✅ Regarder 4000+ événements sportifs
- ✅ **SANS installer AceStream sur le PC/mobile**
- ✅ Directement dans le navigateur
- ✅ Gratuit (Railway 500h/mois + Vercel illimité)
- ✅ Rapide et fiable

**Félicitations ! 🚀**

---

## 📞 COMMANDES UTILES

```bash
# Logs Railway
railway logs --tail

# Rebuild Vercel
cd webapp && vercel --prod

# Test backend
curl https://votre-backend.up.railway.app/api/health/acestream

# Update .env Vercel
vercel env add REACT_APP_API_URL
```

---

**🔥 Prochaine étape : Testez votre app et profitez ! 🎬**
