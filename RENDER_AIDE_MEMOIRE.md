# 📝 Render.com - Aide-Mémoire Rapide

## ⚡ CONFIGURATION RAPIDE

### 🔧 Paramètres du Service

```
Name:           acestream-backend
Region:         Frankfurt (EU Central)
Branch:         main
Root Directory: backend          ⚠️ IMPORTANT!
Runtime:        Docker
Instance Type:  Free
```

### 🔑 Variables d'Environnement (3 variables)

```
ACESTREAM_BASE_URL = http://127.0.0.1:6878
STORAGE_DIR        = /app/storage
PORT               = 10000
```

---

## ✅ CHECKLIST AVANT DÉPLOIEMENT

```bash
# 1. Vérifier que les playlists sont dans backend/
ls backend/*.m3u

# 2. Si non, les copier:
cp *.m3u backend/
git add backend/*.m3u
git commit -m "Add playlists"
git push
```

---

## 🧪 TESTS RAPIDES

```bash
# Remplacer VOTRE-URL par votre URL réelle

# Test 1: Backend
curl https://VOTRE-URL.onrender.com/

# Test 2: Playlists
curl https://VOTRE-URL.onrender.com/api/playlists

# Test 3: Chaînes
curl https://VOTRE-URL.onrender.com/api/playlists/lista/channels
```

---

## 📱 CONFIGURER L'APP

```bash
cd webapp

# Créer .env (remplacer VOTRE-URL)
echo "REACT_APP_API_URL=https://VOTRE-URL.onrender.com" > .env

# Tester
npm install
npm start
```

---

## 🚨 DÉPANNAGE RAPIDE

### Build failed?
```bash
# Vérifier Root Directory = backend
# Vérifier que les .m3u sont dans backend/
ls backend/*.m3u
```

### Service unavailable?
```
Attendre 30 secondes (réveil de l'hibernation)
```

### No playlists found?
```bash
cp *.m3u backend/
git add backend/*.m3u
git commit -m "Add playlists"
git push
```

### CORS error?
```bash
# Vérifier .env
cat webapp/.env

# Doit être:
REACT_APP_API_URL=https://VOTRE-URL.onrender.com
# (sans / à la fin)
```

---

## ⏱️ TEMPS ESTIMÉ

- Création compte: 2 min
- Configuration: 3 min
- Déploiement: 5-10 min
- Tests: 2 min
- **TOTAL: ~15 minutes**

---

## 🔗 LIENS UTILES

- Render Dashboard: https://dashboard.render.com
- UptimeRobot (anti-hibernation): https://uptimerobot.com
- Documentation complète: `GUIDE_DEPLOY_RENDER.md`

---

## 💡 COMMANDES UTILES

```bash
# Voir les logs Render
Dashboard → Votre Service → Logs

# Redémarrer
Dashboard → Manual Deploy → Clear build cache & deploy

# Build APK
cd webapp
npm run build
npx cap sync
npx cap open android
```

---

**Gardez ce fichier ouvert pendant le déploiement! 📋**
