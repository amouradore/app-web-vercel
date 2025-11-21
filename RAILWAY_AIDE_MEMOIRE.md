# 📝 Railway.app - Aide-Mémoire Rapide

## ⚡ CONFIGURATION RAPIDE

### 🔧 Paramètres du Service

```
Deploy from:    GitHub repo
Repository:     app-web-vercel
Root Directory: backend          ⚠️ IMPORTANT!
Auto-deploy:    Activé (par défaut)
```

### 🔑 Variables d'Environnement (3 variables)

```
ACESTREAM_BASE_URL = http://127.0.0.1:6878
STORAGE_DIR        = /app/storage
PORT               = ${{PORT}}    ⚠️ Exactement comme ça!
```

---

## ✅ CHECKLIST AVANT DÉPLOIEMENT

```bash
# 1. Vérifier que les playlists sont dans backend/
ls backend/*.m3u

# 2. Si non, les copier:
cp *.m3u backend/
git add backend/*.m3u
git commit -m "Add playlists for Railway"
git push
```

---

## 🚀 DÉPLOIEMENT EXPRESS

```
1. https://railway.app → Login with GitHub
2. New Project → Deploy from GitHub repo
3. Sélectionner: app-web-vercel
4. Attendre auto-deploy (5-8 min)
5. Settings → Networking → Generate Domain
6. Copier l'URL!
```

---

## 🧪 TESTS RAPIDES

```bash
# Remplacer VOTRE-URL par votre URL Railway

# Test 1: Backend
curl https://VOTRE-URL.up.railway.app/

# Test 2: Playlists
curl https://VOTRE-URL.up.railway.app/api/playlists

# Test 3: Chaînes
curl https://VOTRE-URL.up.railway.app/api/playlists/lista/channels
```

---

## 📱 CONFIGURER L'APP

```bash
cd webapp

# Créer .env (remplacer VOTRE-URL)
echo "REACT_APP_API_URL=https://VOTRE-URL.up.railway.app" > .env

# Tester
npm install
npm start
```

---

## 🎯 CONFIGURATION CRITIQUE

### Root Directory (OBLIGATOIRE):

```
Service → Settings → Build Section
Root Directory: backend
```

### Variables d'environnement:

```
Service → Variables → New Variable

1. ACESTREAM_BASE_URL = http://127.0.0.1:6878
2. STORAGE_DIR = /app/storage
3. PORT = ${{PORT}}
```

### Générer le domaine:

```
Service → Settings → Networking
Generate Domain → Copier l'URL
```

---

## 🚨 DÉPANNAGE RAPIDE

### Build failed?
```bash
# Vérifier Root Directory = backend
# Vérifier que les .m3u sont dans backend/
ls backend/*.m3u
```

### Variables manquantes?
```
Service → Variables
Vérifier les 3 variables
PORT doit être: ${{PORT}}
```

### Domain pas généré?
```
Settings → Networking → Generate Domain
Attendre 10-30 secondes
```

### Backend ne répond pas?
```bash
# Vérifier les logs
Service → Deployments → Dernier déploiement → View Logs

# Tester l'URL
curl -v https://VOTRE-URL.up.railway.app/
```

---

## 📊 MONITORER L'USAGE

```
Dashboard → Project → Usage tab

Heures utilisées: XX / 500h
Reste: XX heures

500h/mois = ~16h/jour
```

---

## 🔄 REDÉPLOYER

### Automatique:
```bash
git push
# Railway redéploie automatiquement
```

### Manuel:
```
Service → Deployments → Redeploy
```

### Redémarrer:
```
Service → Settings → Restart
```

---

## 📝 LOGS EN TEMPS RÉEL

```
Service → Deployments → Click on active deployment
Logs s'affichent en temps réel
```

---

## ⏱️ TEMPS ESTIMÉ

- Création compte: 1 min
- Configuration: 2 min
- Déploiement: 5-8 min
- Tests: 2 min
- **TOTAL: ~10 minutes**

---

## 🔗 LIENS ESSENTIELS

- **Dashboard:** https://railway.app/dashboard
- **Docs:** https://docs.railway.app
- **Status:** https://status.railway.app

---

## 💡 COMMANDES UTILES

```bash
# Build APK
cd webapp
npm run build
npx cap sync
npx cap open android

# Voir les logs Railway
# Directement dans le dashboard (temps réel)

# Mettre à jour
git add .
git commit -m "Update"
git push
# Auto-redeploy!
```

---

## 🎯 AVANTAGES RAILWAY

✅ **Pas d'hibernation** (vs Render)
✅ **Deploy automatique** sur push
✅ **Logs en temps réel**
✅ **Interface moderne**
✅ **Moins cher** ($5/mois vs $7)

---

## 🚀 PROCHAINES ÉTAPES

```
1. ✅ Backend déployé
2. ✅ App testée
3. ✅ APK construit
4. 🎊 Distribuer!
```

---

**Gardez ce fichier ouvert pendant le déploiement! 📋**
