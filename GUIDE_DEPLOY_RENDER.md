# 🚀 Guide de Déploiement sur Render.com

## ✅ Pourquoi Render.com?

- ✅ **Gratuit** (750 heures/mois)
- ✅ Déploiement Docker automatique
- ✅ HTTPS inclus
- ✅ Interface simple
- ⚠️ Note: Hibernation après 15 min d'inactivité (redémarrage ~30 secondes)

---

## 📋 PRÉREQUIS

1. Un compte GitHub avec votre repository
2. Un compte Render.com (gratuit)

---

## 🎯 ÉTAPE PAR ÉTAPE

### **Étape 1: Créer un compte Render.com**

1. Aller sur **https://render.com**
2. Cliquer sur **"Get Started"**
3. S'inscrire avec GitHub (recommandé) ou email
4. Vérifier votre email

✅ **Compte créé!**

---

### **Étape 2: Préparer le repository**

Avant de déployer, assurez-vous que ces fichiers sont dans votre repository:

```
backend/
├── app/
│   └── main.py           ← Backend amélioré
├── Dockerfile            ← Configuration Docker
├── requirements.txt      ← Dépendances Python
└── *.m3u                 ← VOS PLAYLISTS (important!)
```

**Action requise:**
```bash
# Copier vos playlists M3U dans backend/
cp lista.m3u backend/
cp canales_acestream.m3u backend/
cp lista_web.m3u backend/

# Commit et push
git add backend/*.m3u
git commit -m "Ajouter playlists M3U pour déploiement"
git push
```

✅ **Repository prêt!**

---

### **Étape 3: Créer un nouveau Web Service**

1. **Dashboard Render** → Cliquer sur **"New +"**
2. Sélectionner **"Web Service"**

![New Web Service](https://render.com/docs/static/images/new-web-service.png)

✅ **Formulaire ouvert!**

---

### **Étape 4: Connecter votre Repository**

1. Cliquer sur **"Connect account"** (si pas déjà fait)
2. Autoriser Render à accéder à GitHub
3. Chercher votre repository: **amouradore/app-web-vercel**
4. Cliquer sur **"Connect"**

✅ **Repository connecté!**

---

### **Étape 5: Configurer le Service**

Remplir le formulaire avec ces informations:

#### **Paramètres de base:**

| Champ | Valeur |
|-------|--------|
| **Name** | `acestream-hls-backend` (ou votre choix) |
| **Region** | Choisir le plus proche (ex: Frankfurt, Oregon) |
| **Branch** | `main` (ou votre branche) |
| **Root Directory** | `backend` ⚠️ **IMPORTANT!** |

#### **Paramètres Build:**

| Champ | Valeur |
|-------|--------|
| **Runtime** | `Docker` |
| **Dockerfile Path** | `Dockerfile` |

#### **Instance Type:**

| Champ | Valeur |
|-------|--------|
| **Instance Type** | `Free` ✅ |

✅ **Configuration de base complète!**

---

### **Étape 6: Variables d'environnement**

Faire défiler jusqu'à **"Environment Variables"** et ajouter:

Cliquer sur **"Add Environment Variable"** et ajouter chacune:

| Key | Value |
|-----|-------|
| `ACESTREAM_BASE_URL` | `http://127.0.0.1:6878` |
| `STORAGE_DIR` | `/app/storage` |
| `PORT` | `10000` |

**Important:** Render utilise automatiquement le port 10000 pour les services gratuits.

✅ **Variables configurées!**

---

### **Étape 7: Déployer!**

1. Faire défiler jusqu'en bas
2. Cliquer sur **"Create Web Service"**
3. Attendre le déploiement (5-10 minutes la première fois)

Vous verrez:
```
=== Deploying...
=== Downloading...
=== Building...
=== Pushing...
=== Deploying...
=== Your service is live!
```

✅ **Backend déployé!**

---

### **Étape 8: Obtenir l'URL**

Une fois déployé, vous verrez en haut:

```
https://acestream-hls-backend.onrender.com
```

**Copier cette URL!** Vous en aurez besoin pour l'app.

✅ **URL obtenue!**

---

### **Étape 9: Tester le Backend**

#### Test 1: Vérifier que le backend est accessible
```bash
curl https://votre-app.onrender.com/
```

**Réponse attendue:**
```json
{
  "service": "AceStream → HLS Proxy",
  "version": "2.0.0",
  "features": [...]
}
```

#### Test 2: Lister les playlists
```bash
curl https://votre-app.onrender.com/api/playlists
```

#### Test 3: Obtenir les chaînes
```bash
curl https://votre-app.onrender.com/api/playlists/lista/channels
```

✅ **Backend fonctionnel!**

---

## 📱 CONFIGURER L'APP MOBILE

### **Étape 10: Configurer le Frontend**

```bash
cd webapp

# Créer le fichier .env
echo "REACT_APP_API_URL=https://votre-app.onrender.com" > .env

# Remplacer "votre-app.onrender.com" par votre URL réelle
```

Exemple:
```env
REACT_APP_API_URL=https://acestream-hls-backend.onrender.com
```

✅ **Frontend configuré!**

---

### **Étape 11: Tester Localement**

```bash
# Installer les dépendances
npm install

# Démarrer l'app
npm start
```

Ouvrir **http://localhost:3000**

**Vérifier:**
- ✅ Les playlists s'affichent
- ✅ Les chaînes se chargent
- ✅ La vidéo se lance

✅ **App testée!**

---

### **Étape 12: Créer l'APK Android**

```bash
# Build de production
npm run build

# Initialiser Capacitor (si pas déjà fait)
npx cap init
# App name: VotreNomApp
# App ID: com.votredomaine.app

# Ajouter Android
npx cap add android

# Synchroniser
npx cap sync

# Ouvrir Android Studio
npx cap open android
```

**Dans Android Studio:**
1. Menu: **Build → Build Bundle(s) / APK(s) → Build APK(s)**
2. Attendre la compilation
3. APK disponible dans: `android/app/build/outputs/apk/debug/app-debug.apk`

✅ **APK prêt!**

---

## ⚠️ LIMITATIONS DU PLAN GRATUIT RENDER

### Hibernation:
- Le service **hiberne après 15 minutes** d'inactivité
- **Redémarrage: ~30 secondes** à la première requête

### Solutions:

#### **Solution 1: Ping automatique (Recommandé)**

Créer un service gratuit qui ping votre backend toutes les 10 minutes:

**UptimeRobot (gratuit):**
1. Aller sur **https://uptimerobot.com**
2. Créer un compte
3. Ajouter un monitor:
   - Type: HTTP(s)
   - URL: `https://votre-app.onrender.com/`
   - Interval: 5 minutes
4. Sauvegarder

✅ **Plus d'hibernation!**

#### **Solution 2: Cron Job GitHub Actions**

Créer `.github/workflows/keep-alive.yml`:

```yaml
name: Keep Backend Alive
on:
  schedule:
    - cron: '*/10 * * * *'  # Toutes les 10 minutes
  workflow_dispatch:

jobs:
  ping:
    runs-on: ubuntu-latest
    steps:
      - name: Ping backend
        run: |
          curl https://votre-app.onrender.com/
```

#### **Solution 3: Upgrade au plan payant**

- **Starter Plan: $7/mois**
- Pas d'hibernation
- 512 MB RAM
- Redémarrages automatiques

---

## 🔧 MAINTENANCE

### Mettre à jour le backend:

```bash
# Modifier le code
git add .
git commit -m "Update backend"
git push
```

Render **redéploie automatiquement**! 🎉

### Voir les logs:

1. Dashboard Render
2. Cliquer sur votre service
3. Onglet **"Logs"**

### Redémarrer manuellement:

1. Dashboard Render
2. Cliquer sur votre service
3. **"Manual Deploy" → "Clear build cache & deploy"**

---

## 🐛 TROUBLESHOOTING

### ❌ "Build failed"

**Solution 1:** Vérifier que le Dockerfile est correct
```bash
# Tester localement
cd backend
docker build -t test .
```

**Solution 2:** Vérifier les logs dans Render

**Solution 3:** Vérifier que `Root Directory` = `backend`

---

### ❌ "Service Unavailable"

**Causes possibles:**
1. Service en cours de démarrage (attendre 30s)
2. Service en hibernation (ping pour réveiller)
3. Erreur dans le code (vérifier logs)

**Solution:**
```bash
# Tester avec curl
curl -v https://votre-app.onrender.com/
```

---

### ❌ "No playlists found"

**Solution:**
1. Vérifier que les fichiers `.m3u` sont dans `backend/`
2. Commit et push:
```bash
git add backend/*.m3u
git commit -m "Add playlists"
git push
```

---

### ❌ "CORS error"

**Solution:** Déjà configuré dans le code. Si problème persiste:
1. Vérifier les logs backend
2. Vérifier que l'URL dans `.env` est correcte

---

## 📊 COMPARAISON RENDER VS RAILWAY

| Fonctionnalité | Render | Railway |
|----------------|--------|---------|
| **Prix gratuit** | $0 | $0 |
| **Heures/mois** | 750h | 500h |
| **Hibernation** | ✅ Oui (15 min) | ❌ Non |
| **Redémarrage** | ~30s | Instantané |
| **RAM** | 512 MB | 500 MB |
| **Build time** | ~5 min | ~3 min |
| **Interface** | Simple | Moderne |
| **Recommandation** | Test/Dev | Production |

---

## ✅ CHECKLIST FINALE

- [ ] Compte Render créé
- [ ] Repository connecté
- [ ] Service configuré avec `Root Directory = backend`
- [ ] Variables d'environnement ajoutées
- [ ] Playlists M3U copiées dans backend/
- [ ] Déploiement réussi
- [ ] URL du backend obtenue
- [ ] Backend testé avec curl
- [ ] Frontend configuré avec l'URL
- [ ] App testée localement
- [ ] UptimeRobot configuré (anti-hibernation)
- [ ] APK construit et testé

**✅ Tout est prêt!**

---

## 🎉 RÉSULTAT FINAL

Vous avez maintenant:

✅ **Backend déployé gratuitement** sur Render.com  
✅ **URL publique HTTPS** pour votre API  
✅ **Conversion AceStream → HLS** fonctionnelle  
✅ **App mobile prête** à distribuer  
✅ **Aucune installation AceStream** requise pour l'utilisateur  

---

## 📞 BESOIN D'AIDE?

### Problème avec Render:
- Vérifier les logs dans le dashboard
- Tester localement avec Docker
- Consulter https://render.com/docs

### Problème avec l'app:
- Vérifier l'URL dans `.env`
- Tester le backend avec curl
- Consulter `SOLUTION_COMPLETE.md`

---

## 🚀 PROCHAINES ÉTAPES

1. ✅ Tester avec plusieurs utilisateurs
2. ✅ Configurer UptimeRobot (anti-hibernation)
3. ✅ Personnaliser l'interface de l'app
4. ✅ Distribuer l'APK!

---

**Félicitations! Votre backend est déployé sur Render! 🎊**

Si tout fonctionne bien et que vous voulez éviter l'hibernation, pensez à:
- Configurer UptimeRobot (gratuit)
- OU upgrader au plan Starter ($7/mois)
