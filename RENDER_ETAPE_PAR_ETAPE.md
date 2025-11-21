# 🎯 Render.com - Guide Pas à Pas Simplifié

## 🚀 DÉPLOIEMENT EN 10 MINUTES

---

## ✅ AVANT DE COMMENCER

### Vérifier que vous avez:
- [ ] Compte GitHub avec le repository
- [ ] Fichiers `.m3u` dans le dossier `backend/`

### Si vos playlists ne sont PAS dans `backend/`, faites:

```bash
# Copier vos playlists
cp lista.m3u backend/
cp canales_acestream.m3u backend/
cp lista_web.m3u backend/

# Push vers GitHub
git add backend/*.m3u
git commit -m "Add M3U playlists"
git push
```

---

## 📋 ÉTAPES DE DÉPLOIEMENT

### **ÉTAPE 1: Créer un compte Render** ⏱️ 2 minutes

1. Aller sur: **https://render.com**
2. Cliquer: **"Get Started for Free"**
3. Choisir: **"Sign up with GitHub"** (recommandé)
4. Autoriser Render à accéder à GitHub
5. Vérifier votre email

✅ **Compte créé!**

---

### **ÉTAPE 2: Créer un nouveau service** ⏱️ 1 minute

1. Sur le dashboard Render, cliquer: **"New +"** (en haut à droite)
2. Sélectionner: **"Web Service"**

✅ **Page de configuration ouverte!**

---

### **ÉTAPE 3: Connecter votre repository** ⏱️ 1 minute

**Option A: Si le repository apparaît dans la liste**
- Chercher: `app-web-vercel` ou votre nom de repo
- Cliquer: **"Connect"** à côté du nom

**Option B: Si le repository n'apparaît pas**
- Cliquer: **"Connect account"** (en bas)
- Autoriser l'accès à tous les repositories
- Revenir et sélectionner votre repo

✅ **Repository connecté!**

---

### **ÉTAPE 4: Configuration du service** ⏱️ 3 minutes

Remplir le formulaire **EXACTEMENT** comme ceci:

#### Section "Settings"

```
Name: acestream-backend
     (ou votre choix, sans espaces)

Region: Frankfurt (EU Central)
        (ou Oregon si vous préférez USA)

Branch: main
        (ou master selon votre repo)

Root Directory: backend
                ⚠️ TRÈS IMPORTANT!
```

#### Section "Build Settings"

```
Runtime: Docker
         (devrait être auto-détecté)

Dockerfile Path: Dockerfile
                 (devrait être auto-détecté)
```

#### Section "Plan"

```
Instance Type: Free
               ✅ Gratuit (750h/mois)
```

✅ **Configuration de base OK!**

---

### **ÉTAPE 5: Variables d'environnement** ⏱️ 2 minutes

Faire défiler jusqu'à la section **"Environment Variables"**

Cliquer sur **"Add Environment Variable"** et ajouter **UNE PAR UNE**:

#### Variable 1:
```
Key:   ACESTREAM_BASE_URL
Value: http://127.0.0.1:6878
```

#### Variable 2:
```
Key:   STORAGE_DIR
Value: /app/storage
```

#### Variable 3:
```
Key:   PORT
Value: 10000
```

**Vérifier que vous avez bien les 3 variables!**

✅ **Variables configurées!**

---

### **ÉTAPE 6: Lancer le déploiement** ⏱️ 5-10 minutes

1. Faire défiler jusqu'en bas
2. Cliquer sur le gros bouton: **"Create Web Service"**
3. **ATTENDRE** pendant que Render:
   - Télécharge votre code
   - Build l'image Docker
   - Démarre le service

Vous verrez des logs défiler:
```
==> Cloning from https://github.com/...
==> Downloading...
==> Building...
==> Pushing...
==> Starting service...
==> Your service is live at https://...
```

**Attendre jusqu'à voir:** `Your service is live!`

✅ **Déploiement terminé!**

---

### **ÉTAPE 7: Copier l'URL** ⏱️ 10 secondes

En haut de la page, vous verrez une URL comme:
```
https://acestream-backend-xxxx.onrender.com
```

**COPIER CETTE URL COMPLÈTE!**

Exemple:
```
https://acestream-backend-a1b2.onrender.com
```

✅ **URL obtenue!**

---

### **ÉTAPE 8: Tester le backend** ⏱️ 30 secondes

Ouvrir un terminal et tester:

```bash
# Remplacer par VOTRE URL
curl https://acestream-backend-a1b2.onrender.com/
```

**Réponse attendue:**
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

**Si vous voyez ça → ✅ Backend fonctionne!**

**Si erreur → Voir section "Problèmes" en bas**

---

## 📱 CONFIGURER L'APPLICATION

### **ÉTAPE 9: Configurer l'app mobile** ⏱️ 1 minute

```bash
# Aller dans le dossier webapp
cd webapp

# Créer le fichier .env
echo "REACT_APP_API_URL=https://VOTRE-URL.onrender.com" > .env
```

**REMPLACER** `VOTRE-URL.onrender.com` par votre URL réelle!

Exemple:
```bash
echo "REACT_APP_API_URL=https://acestream-backend-a1b2.onrender.com" > .env
```

✅ **App configurée!**

---

### **ÉTAPE 10: Tester l'app** ⏱️ 2 minutes

```bash
# Installer les dépendances (si pas déjà fait)
npm install

# Démarrer l'app
npm start
```

**L'app devrait s'ouvrir sur:** `http://localhost:3000`

**Tester:**
1. Les playlists s'affichent? ✅
2. Les chaînes se chargent? ✅
3. La vidéo se lance? ✅

**Si tout fonctionne → ✅ Tout est prêt!**

---

## 🎉 FÉLICITATIONS!

Votre backend est déployé et fonctionnel!

**Vous avez maintenant:**
- ✅ Backend gratuit sur Render
- ✅ URL publique HTTPS
- ✅ Conversion AceStream → HLS
- ✅ App fonctionnelle

---

## 🚨 SI VOUS AVEZ DES PROBLÈMES

### ❌ Problème 1: "Build failed"

**Vérifier:**
1. Que `Root Directory` = `backend` (exactement)
2. Que les playlists `.m3u` sont bien dans `backend/`

**Solution:**
```bash
# Vérifier localement
cd backend
ls *.m3u  # Devrait lister vos playlists

# Si pas de playlists:
cp ../lista.m3u .
git add *.m3u
git commit -m "Add playlists"
git push
```

Puis dans Render: **Manual Deploy → Clear build cache & deploy**

---

### ❌ Problème 2: "Service unavailable"

**Cause:** Service en hibernation (normal après 15 min d'inactivité)

**Solution:** Attendre 30 secondes et réessayer

**OU configurer UptimeRobot (voir ci-dessous)**

---

### ❌ Problème 3: "No playlists found"

**Vérifier:**
```bash
curl https://VOTRE-URL.onrender.com/api/playlists
```

**Si vide:**
1. Les playlists ne sont pas dans le backend
2. Copier les playlists et redéployer:

```bash
cp lista.m3u backend/
git add backend/*.m3u
git commit -m "Add M3U files"
git push
```

Render redéploie automatiquement.

---

### ❌ Problème 4: "CORS error" dans l'app

**Vérifier:**
1. Que l'URL dans `.env` est correcte
2. Que l'URL commence par `https://`
3. Qu'il n'y a pas de `/` à la fin

**Exemple correct:**
```
REACT_APP_API_URL=https://acestream-backend-a1b2.onrender.com
```

**Exemple incorrect:**
```
REACT_APP_API_URL=https://acestream-backend-a1b2.onrender.com/  ❌ (slash final)
```

---

## ⚡ ÉVITER L'HIBERNATION (OPTIONNEL)

Le service Render gratuit hiberne après 15 minutes. Voici comment l'éviter:

### **Solution: UptimeRobot (Gratuit)** ⏱️ 3 minutes

1. Aller sur: **https://uptimerobot.com**
2. Créer un compte (gratuit)
3. Dashboard → **"Add New Monitor"**
4. Remplir:
   ```
   Monitor Type: HTTP(s)
   Friendly Name: AceStream Backend
   URL: https://VOTRE-URL.onrender.com/
   Monitoring Interval: 5 minutes
   ```
5. Cliquer: **"Create Monitor"**

✅ **Plus d'hibernation!** Le service sera pingé toutes les 5 minutes.

---

## 📱 CRÉER L'APK ANDROID

Maintenant que tout fonctionne, créez l'APK:

```bash
# Dans le dossier webapp
cd webapp

# Build de production
npm run build

# Initialiser Capacitor (si pas déjà fait)
npx cap init

# Quand demandé:
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
- Menu: **Build → Build Bundle(s) / APK(s) → Build APK(s)**
- Attendre la compilation
- APK dans: `android/app/build/outputs/apk/debug/app-debug.apk`

✅ **APK prêt à distribuer!**

---

## ✅ CHECKLIST FINALE

- [ ] Compte Render créé
- [ ] Service créé avec `Root Directory = backend`
- [ ] Variables d'environnement ajoutées (3 variables)
- [ ] Déploiement réussi (message "Your service is live")
- [ ] URL du backend copiée
- [ ] Backend testé avec curl (réponse JSON OK)
- [ ] Fichier `.env` créé dans webapp/
- [ ] App testée localement (playlists visibles)
- [ ] UptimeRobot configuré (optionnel mais recommandé)
- [ ] APK construit

**✅ Si tout est coché → TERMINÉ!**

---

## 🎯 RÉSUMÉ DES COMMANDES

```bash
# 1. Préparer les playlists
cp *.m3u backend/
git add backend/*.m3u
git commit -m "Add playlists"
git push

# 2. Après déploiement Render, configurer l'app
cd webapp
echo "REACT_APP_API_URL=https://VOTRE-URL.onrender.com" > .env

# 3. Tester
npm install
npm start

# 4. Builder l'APK
npm run build
npx cap sync
npx cap open android
```

---

## 📞 AIDE RAPIDE

### Voir les logs Render:
1. Dashboard Render
2. Cliquer sur votre service
3. Onglet **"Logs"**

### Redémarrer le service:
1. Dashboard Render
2. Cliquer sur votre service
3. **"Manual Deploy" → "Clear build cache & deploy"**

### Tester les endpoints:
```bash
# Backend
curl https://VOTRE-URL.onrender.com/

# Playlists
curl https://VOTRE-URL.onrender.com/api/playlists

# Chaînes
curl https://VOTRE-URL.onrender.com/api/playlists/lista/channels
```

---

## 🎉 C'EST TOUT!

Votre solution est maintenant **100% fonctionnelle**!

**L'utilisateur final:**
- ✅ Installe UNIQUEMENT votre APK
- ✅ AUCUNE installation AceStream
- ✅ Streaming direct comme YouTube

**Félicitations! 🎊**

---

**Besoin d'aide supplémentaire? Consultez:**
- `GUIDE_DEPLOY_RENDER.md` - Version détaillée
- `SOLUTION_COMPLETE.md` - Documentation complète
- `GUIDE_RAPIDE.md` - Vue d'ensemble
