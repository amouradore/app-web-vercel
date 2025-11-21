# 🚀 DÉPLOIEMENT RAPIDE - Railway + Vercel

## 🎯 Objectif
Déployer votre application pour que les utilisateurs puissent regarder les chaînes **SANS installer AceStream**.

---

## ✅ Ce qui a été corrigé

### Backend (`backend/`)
- ✅ **Installation d'AceStream Engine** dans le Dockerfile
- ✅ **API `/api/play`** retourne maintenant une vraie URL de stream
- ✅ **API `/api/health/acestream`** pour vérifier l'état du moteur
- ✅ **Conversion P2P → HTTP** directement sur Railway

### Frontend (`webapp/`)
- ✅ **Correction de l'écran noir** - Le player reçoit maintenant la bonne URL
- ✅ **Support du backend Railway** - Utilise `REACT_APP_API_URL`
- ✅ **Gestion d'erreurs améliorée**

---

## 🚀 DÉPLOIEMENT EN 3 ÉTAPES

### Méthode 1 : Script Automatique (Recommandé)

```powershell
# Exécuter le script de déploiement
.\deploy_complete.ps1
```

Le script va :
1. ✅ Vérifier Git
2. ✅ Pousser les modifications vers GitHub
3. ✅ Vous guider pour Railway
4. ✅ Vous guider pour Vercel

### Méthode 2 : Manuelle

#### Étape 1 : Pousser vers GitHub

```bash
# Copier les playlists dans backend/
cp lista.m3u backend/
cp canales_acestream.m3u backend/
cp lista_web.m3u backend/

# Ajouter les fichiers
git add backend/
git add webapp/src/UnifiedStreamPlayer.js
git add GUIDE_DEPLOIEMENT_COMPLET.md

# Commit
git commit -m "✨ Backend avec AceStream Engine pour Railway"

# Push
git push origin main
```

#### Étape 2 : Déployer sur Railway

1. **Aller sur** https://railway.app/dashboard
2. **Créer un projet** → Deploy from GitHub repo
3. **Configurer :**
   - Root Directory: `backend`
   - Variables d'environnement:
     ```
     PORT=8000
     ACESTREAM_BASE_URL=http://127.0.0.1:6878
     STORAGE_DIR=/app/storage
     ```
4. **Generate Domain** et copier l'URL

#### Étape 3 : Déployer sur Vercel

1. **Aller sur** https://vercel.com/dashboard
2. **Import Project** → Sélectionner votre repo
3. **Configurer :**
   - Framework: Create React App
   - Root Directory: `webapp`
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Environment Variable:
     ```
     REACT_APP_API_URL = [VOTRE_URL_RAILWAY]
     ```
4. **Deploy!**

---

## 🧪 TESTER LE DÉPLOIEMENT

### Test Backend Railway

```powershell
# Script de test automatique
.\test_backend_railway.ps1 -BackendUrl "https://votre-projet.up.railway.app"
```

Ou manuellement :

```bash
# Test 1: Health check
curl https://votre-projet.up.railway.app/

# Test 2: AceStream Engine
curl https://votre-projet.up.railway.app/api/health/acestream

# Test 3: Playlists
curl https://votre-projet.up.railway.app/api/playlists

# Test 4: Conversion
curl -X POST https://votre-projet.up.railway.app/api/play \
  -H "Content-Type: application/json" \
  -d '{"hash": "f5ad210d79c48a97a978a8b0bdfd7ba20436e6b0"}'
```

### Test Frontend Vercel

1. Ouvrir votre URL Vercel (ex: `https://votre-app.vercel.app`)
2. Sélectionner une chaîne
3. Cliquer sur **"🌐 Navigateur"**
4. Le stream devrait démarrer **SANS installer AceStream** ! ✅

---

## 📊 ARCHITECTURE

```
┌──────────────────────────────────────────────────┐
│  UTILISATEUR                                      │
│  (Navigateur - Aucune installation requise)      │
└────────────────┬─────────────────────────────────┘
                 │
                 │ Frontend React
                 ↓
┌──────────────────────────────────────────────────┐
│  VERCEL (Frontend)                                │
│  - Interface web                                  │
│  - Liste des chaînes                              │
│  - Player vidéo                                   │
└────────────────┬─────────────────────────────────┘
                 │
                 │ API: POST /api/play
                 ↓
┌──────────────────────────────────────────────────┐
│  RAILWAY (Backend FastAPI)                        │
│  - Reçoit le hash AceStream                       │
│  - Contacte AceStream Engine local                │
│  - Retourne l'URL du stream HTTP                  │
└────────────────┬─────────────────────────────────┘
                 │
                 │ Conversion P2P → HTTP
                 ↓
┌──────────────────────────────────────────────────┐
│  ACESTREAM ENGINE (sur Railway)                   │
│  - Télécharge depuis réseau P2P                   │
│  - Convertit en flux HTTP                         │
│  - Diffuse le stream                              │
└────────────────┬─────────────────────────────────┘
                 │
                 │ Stream HTTP
                 ↓
┌──────────────────────────────────────────────────┐
│  UTILISATEUR                                      │
│  ✅ Regarde le match dans le navigateur!          │
└──────────────────────────────────────────────────┘
```

---

## 🔍 TROUBLESHOOTING

### ❌ "Backend ne répond pas"

```bash
# Vérifier les logs Railway
railway logs --tail

# Chercher "AceStream Engine démarré" dans les logs
```

**Solution :** Attendre 2-3 minutes que le backend démarre complètement.

### ❌ "Écran noir dans le player"

**Causes possibles :**
1. AceStream Engine encore en démarrage (attendre 30s)
2. Variable d'environnement `REACT_APP_API_URL` mal configurée
3. CORS bloqué

**Solution :**
```bash
# Vérifier que Vercel a bien la variable d'environnement
# Aller sur Vercel → Settings → Environment Variables
# Vérifier REACT_APP_API_URL = https://votre-backend.up.railway.app
```

### ❌ "Stream not loading"

**Vérifier :**
```bash
# Tester le backend directement
curl https://votre-backend.up.railway.app/api/health/acestream
```

**Si status = "starting"** → Attendre 1-2 minutes que AceStream démarre

**Si status = "healthy"** → Le problème vient du hash AceStream (pas de seeders)

### ❌ "No playlists found"

**Solution :**
```bash
# Copier les playlists dans backend/
cp *.m3u backend/

# Commit et push
git add backend/*.m3u
git commit -m "Add playlists"
git push

# Railway va redéployer automatiquement
```

---

## 📁 FICHIERS IMPORTANTS

```
projet/
├── backend/
│   ├── Dockerfile          ← ✅ MODIFIÉ (AceStream Engine)
│   ├── app/main.py         ← ✅ MODIFIÉ (API play améliorée)
│   ├── requirements.txt    ← ✅ MODIFIÉ (ajout httpx)
│   ├── start.sh            ← Script de démarrage
│   └── *.m3u               ← Vos playlists
├── webapp/
│   ├── src/
│   │   ├── UnifiedStreamPlayer.js  ← ✅ MODIFIÉ (corrigé)
│   │   └── services/streamApi.js   ← API client
│   └── .env.production     ← À créer avec URL Railway
├── deploy_complete.ps1     ← ✅ NOUVEAU (script de déploiement)
├── test_backend_railway.ps1 ← ✅ NOUVEAU (script de test)
├── GUIDE_DEPLOIEMENT_COMPLET.md ← Documentation complète
└── DEPLOIEMENT_RAPIDE.md   ← Ce fichier
```

---

## ✅ CHECKLIST

### Avant le déploiement
- [ ] Git installé
- [ ] Compte GitHub avec repository
- [ ] Fichiers .m3u disponibles

### Déploiement Backend (Railway)
- [ ] Compte Railway créé
- [ ] Repository connecté
- [ ] Root Directory = `backend`
- [ ] Variables d'environnement configurées
- [ ] Domaine généré
- [ ] Backend répond (test curl)
- [ ] AceStream Engine démarre (logs)

### Déploiement Frontend (Vercel)
- [ ] Compte Vercel créé
- [ ] Repository connecté
- [ ] Root Directory = `webapp`
- [ ] Variable `REACT_APP_API_URL` configurée
- [ ] Build réussi
- [ ] Domaine généré

### Test Final
- [ ] Ouvrir l'app Vercel
- [ ] Sélectionner une chaîne
- [ ] Cliquer sur "🌐 Navigateur"
- [ ] Stream démarre SANS installer AceStream
- [ ] Vidéo se lit correctement

---

## 🎉 RÉSULTAT FINAL

Après le déploiement réussi :
- ✅ **Backend Railway** : Convertit AceStream en HTTP
- ✅ **Frontend Vercel** : Interface web moderne
- ✅ **Utilisateurs** : Regardent les matchs SANS installation !
- ✅ **Gratuit** : Railway 500h/mois + Vercel illimité
- ✅ **Rapide** : Pas d'hibernation comme Render

---

## 📞 COMMANDES UTILES

```bash
# Déploiement automatique
.\deploy_complete.ps1

# Test backend
.\test_backend_railway.ps1 -BackendUrl "https://votre-backend.up.railway.app"

# Logs Railway
railway logs --tail

# Rebuild Vercel
cd webapp && vercel --prod

# Status
git status
```

---

## 📚 DOCUMENTATION COMPLÈTE

Pour plus de détails, consultez :
- **GUIDE_DEPLOIEMENT_COMPLET.md** - Guide étape par étape détaillé
- **RAILWAY_ETAPE_PAR_ETAPE.md** - Guide spécifique Railway
- **COMMENCEZ_ICI_RAILWAY.md** - Vue d'ensemble Railway

---

## 🆘 BESOIN D'AIDE ?

1. **Vérifier les logs Railway** : https://railway.app/dashboard → Votre projet → Deployments → Logs
2. **Tester le backend** : `.\test_backend_railway.ps1`
3. **Consulter** : `GUIDE_DEPLOIEMENT_COMPLET.md`

---

**🚀 Prêt à déployer ? Exécutez : `.\deploy_complete.ps1`**
