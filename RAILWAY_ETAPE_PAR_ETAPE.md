# 🚀 Railway.app - Guide Pas à Pas Simplifié

## ✅ EXCELLENT CHOIX!

Railway est **parfait** pour votre app de streaming:
- ✅ Pas d'hibernation
- ✅ Démarrage instantané
- ✅ Interface moderne
- ✅ 500h/mois gratuit (~16h/jour)

---

## 📋 AVANT DE COMMENCER

### Vérifier que vous avez:
- [ ] Compte GitHub avec votre repository
- [ ] Fichiers `.m3u` prêts

### Préparer les playlists:

```bash
# Copier vos playlists dans backend/
cp lista.m3u backend/
cp canales_acestream.m3u backend/
cp lista_web.m3u backend/

# Push vers GitHub
git add backend/*.m3u
git commit -m "Add M3U playlists for Railway"
git push
```

✅ **Prêt à déployer!**

---

## 🚀 DÉPLOIEMENT EN 10 ÉTAPES

### **ÉTAPE 1: Créer un compte Railway** ⏱️ 2 minutes

1. Aller sur: **https://railway.app**
2. Cliquer: **"Login"** (en haut à droite)
3. Choisir: **"Login with GitHub"** (recommandé)
4. Autoriser Railway à accéder à GitHub
5. Vous êtes sur le dashboard!

✅ **Compte créé!**

---

### **ÉTAPE 2: Créer un nouveau projet** ⏱️ 30 secondes

1. Sur le dashboard, cliquer: **"New Project"**
2. Sélectionner: **"Deploy from GitHub repo"**

✅ **Mode de déploiement sélectionné!**

---

### **ÉTAPE 3: Sélectionner votre repository** ⏱️ 30 secondes

**Option A: Si le repository apparaît**
- Chercher: `app-web-vercel` ou votre nom de repo
- Cliquer dessus

**Option B: Si le repository n'apparaît pas**
- Cliquer: **"Configure GitHub App"**
- Autoriser l'accès à votre repository
- Revenir et sélectionner le repo

✅ **Repository connecté!**

---

### **ÉTAPE 4: Configuration automatique** ⏱️ 10 secondes

Railway **détecte automatiquement**:
- ✅ Le Dockerfile dans `backend/`
- ✅ La configuration Docker
- ✅ Pas besoin de configurer manuellement!

Railway commence le déploiement **IMMÉDIATEMENT**!

✅ **Déploiement lancé!**

---

### **ÉTAPE 5: Configurer les variables d'environnement** ⏱️ 2 minutes

**Pendant que ça build**, configurer les variables:

1. Cliquer sur votre service (il apparaît dans le projet)
2. Onglet: **"Variables"**
3. Cliquer: **"New Variable"**

#### Ajouter ces 3 variables:

**Variable 1:**
```
ACESTREAM_BASE_URL = http://127.0.0.1:6878
```

**Variable 2:**
```
STORAGE_DIR = /app/storage
```

**Variable 3:**
```
PORT = ${{PORT}}
```
⚠️ **Important:** Utiliser exactement `${{PORT}}` (Railway l'assigne automatiquement)

✅ **Variables configurées!**

---

### **ÉTAPE 6: Configurer le Root Directory** ⏱️ 1 minute

**TRÈS IMPORTANT:** Railway doit savoir que le Dockerfile est dans `backend/`

1. Rester dans l'onglet **"Settings"**
2. Chercher la section: **"Build"** ou **"Service"**
3. Trouver: **"Root Directory"**
4. Entrer: `backend`
5. Cliquer: **"Save"** ou **"Update"**

⚠️ **Ceci va redéclencher le build - c'est normal!**

✅ **Root Directory configuré!**

---

### **ÉTAPE 7: Attendre le déploiement** ⏱️ 5-8 minutes

Railway va:
1. **Clone** votre repository
2. **Build** l'image Docker
3. **Deploy** le service
4. **Start** le backend

Vous verrez des logs:
```
Building...
Building docker image...
Successfully built image
Starting...
Deployment live!
```

**Attendre le message:** `Deployment live!` 🟢

✅ **Déploiement terminé!**

---

### **ÉTAPE 8: Générer un domaine public** ⏱️ 30 secondes

1. Cliquer sur votre service
2. Onglet: **"Settings"**
3. Section: **"Networking"** ou **"Domains"**
4. Cliquer: **"Generate Domain"**

Railway va créer une URL comme:
```
https://votre-projet.up.railway.app
```

**COPIER CETTE URL!** 📋

✅ **URL obtenue!**

---

### **ÉTAPE 9: Tester le backend** ⏱️ 1 minute

```bash
# Remplacer par VOTRE URL
curl https://votre-projet.up.railway.app/
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
  ],
  "endpoints": {
    "playlists": "/api/playlists",
    "channels": "/api/playlists/{name}/channels",
    "play": "/api/play (POST)",
    "streams": "/api/streams (POST)"
  }
}
```

**Si vous voyez ça → ✅ Backend fonctionne parfaitement!**

#### Tests supplémentaires:

```bash
# Lister les playlists
curl https://votre-projet.up.railway.app/api/playlists

# Voir les chaînes
curl https://votre-projet.up.railway.app/api/playlists/lista/channels
```

✅ **Backend testé et fonctionnel!**

---

### **ÉTAPE 10: Configurer l'application mobile** ⏱️ 1 minute

```bash
# Aller dans le dossier webapp
cd webapp

# Créer le fichier .env avec VOTRE URL Railway
echo "REACT_APP_API_URL=https://votre-projet.up.railway.app" > .env
```

**Exemple:**
```bash
echo "REACT_APP_API_URL=https://acestream-backend-production.up.railway.app" > .env
```

✅ **App configurée!**

---

## 🧪 TESTER L'APPLICATION

### Démarrer l'app localement:

```bash
# Dans le dossier webapp

# Installer les dépendances (si pas déjà fait)
npm install

# Démarrer l'app
npm start
```

**L'app s'ouvre sur:** `http://localhost:3000`

### Vérifier:

1. ✅ **Playlists s'affichent?**
2. ✅ **Chaînes se chargent?**
3. ✅ **Vidéo se lance?**
4. ✅ **Pas de délai de 30 secondes?** (grâce à Railway!)

**Si tout fonctionne → 🎉 PARFAIT!**

---

## 🎉 FÉLICITATIONS!

Votre backend est déployé sur Railway et fonctionne!

**Vous avez maintenant:**
- ✅ Backend gratuit sur Railway
- ✅ URL publique HTTPS
- ✅ Conversion AceStream → HLS
- ✅ **Pas d'hibernation** = Démarrage instantané
- ✅ App fonctionnelle

---

## 📊 MONITORER VOTRE USAGE

### Voir la consommation:

1. Dashboard Railway
2. Votre projet
3. Section: **"Usage"**

Vous verrez:
```
Heures utilisées: XX / 500h
Reste: XX heures ce mois
```

**500h/mois = ~16h/jour**

### Si vous approchez la limite:

**Option A: Optimiser**
- Arrêter le service quand pas utilisé
- Déployer uniquement quand nécessaire

**Option B: Upgrade ($5/mois)**
- Usage illimité
- Parfait pour production

---

## 🎯 AVANTAGES RAILWAY (que vous avez maintenant!)

✅ **Pas d'hibernation**
- Utilisateur clique → Vidéo démarre immédiatement
- Pas de 30 secondes d'attente

✅ **Interface moderne**
- Dashboard clair
- Logs en temps réel
- Métriques détaillées

✅ **Déploiement automatique**
- Push vers GitHub → Railway redéploie
- Pas de configuration manuelle

✅ **Moins cher si upgrade**
- $5/mois vs $7 chez Render
- Usage illimité

---

## 📱 CRÉER L'APK ANDROID

Maintenant que tout fonctionne:

```bash
# Dans le dossier webapp

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
- Menu: **Build → Build Bundle(s) / APK(s) → Build APK(s)**
- APK dans: `android/app/build/outputs/apk/debug/app-debug.apk`

✅ **APK prêt à distribuer!**

---

## 🔧 MAINTENANCE

### Mettre à jour le backend:

```bash
# Modifier votre code
git add .
git commit -m "Update backend"
git push
```

**Railway redéploie automatiquement!** 🎉

### Voir les logs:

1. Dashboard Railway
2. Cliquer sur votre service
3. Onglet: **"Deployments"**
4. Cliquer sur le déploiement actif
5. **Logs en temps réel**

### Redémarrer le service:

1. Dashboard Railway
2. Votre service
3. Onglet: **"Settings"**
4. Bouton: **"Restart"**

---

## 🚨 PROBLÈMES COURANTS

### ❌ Problème 1: "Build failed"

**Vérifier:**
1. Que `Root Directory = backend`
2. Que les playlists `.m3u` sont dans `backend/`

**Solution:**
```bash
# Vérifier localement
cd backend
ls *.m3u

# Si manquant:
cp ../lista.m3u .
git add *.m3u
git commit -m "Add playlists"
git push
```

---

### ❌ Problème 2: "Service not responding"

**Vérifier:**
1. Que le service est démarré (vert dans Railway)
2. Que le domaine est bien généré
3. Les logs pour voir les erreurs

**Solution:**
```bash
# Tester avec curl
curl -v https://votre-projet.up.railway.app/
```

---

### ❌ Problème 3: "No playlists found"

**Vérifier:**
```bash
curl https://votre-projet.up.railway.app/api/playlists
```

**Si vide:**
```bash
# Les playlists ne sont pas dans backend/
cp *.m3u backend/
git add backend/*.m3u
git commit -m "Add M3U files"
git push
```

---

### ❌ Problème 4: "PORT variable error"

**Vérifier** que la variable PORT est:
```
PORT = ${{PORT}}
```

Pas `10000` ou autre valeur fixe!

---

## ✅ CHECKLIST FINALE

- [ ] Compte Railway créé
- [ ] Projet créé depuis GitHub
- [ ] Root Directory = `backend`
- [ ] 3 variables d'environnement ajoutées
- [ ] Déploiement réussi (vert)
- [ ] Domaine généré
- [ ] Backend testé avec curl
- [ ] App configurée avec l'URL
- [ ] App testée localement
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

# 2. Après déploiement Railway, configurer l'app
cd webapp
echo "REACT_APP_API_URL=https://votre-projet.up.railway.app" > .env

# 3. Tester
npm install
npm start

# 4. Builder l'APK
npm run build
npx cap sync
npx cap open android
```

---

## 📞 LIENS UTILES

- **Dashboard Railway:** https://railway.app/dashboard
- **Documentation Railway:** https://docs.railway.app
- **Status Railway:** https://status.railway.app

---

## 🎉 C'EST TOUT!

Votre solution est maintenant **100% fonctionnelle** avec Railway!

**Avantages que vous avez:**
- ✅ Pas d'hibernation (vs Render)
- ✅ Démarrage instantané
- ✅ Interface moderne
- ✅ Moins cher si upgrade ($5 vs $7)

**Félicitations! 🎊**

---

**Besoin d'aide? Consultez:**
- `RAILWAY_AIDE_MEMOIRE.md` - Configuration rapide
- `COMPARAISON_RAILWAY_VS_RENDER.md` - Pourquoi Railway est mieux
- `SOLUTION_COMPLETE.md` - Documentation complète
