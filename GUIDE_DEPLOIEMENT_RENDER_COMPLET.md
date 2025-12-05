# 🚀 GUIDE COMPLET - DÉPLOIEMENT SUR RENDER

## ✅ Modifications Effectuées

### 1. Backend - Ajout du Proxy de Logos
✅ **Fichier modifié** : `backend/app/main.py`

**Nouveau endpoint** : `/api/proxy/logo?url=<encoded_url>`

**Fonctionnalités** :
- Proxifie les logos depuis plusieurs domaines (picon.pp.ua, i.ibb.co, GitHub)
- Résout les problèmes CORS
- Cache les images pendant 24h
- Sécurisé : liste blanche de domaines autorisés

### 2. Frontend - Utilisation du Proxy
✅ **Fichier modifié** : `webapp/src/App.js`

**Changements** :
- Les URLs de logos passent maintenant par le proxy backend
- Correction de la variable d'environnement (REACT_APP_API_URL)
- Application aux événements ET aux chaînes TV

---

## 📦 ÉTAPE 1 : Préparer le Backend

### 1.1 Vérifier les fichiers

```bash
# Vérifier que tous les fichiers sont présents
ls backend/
# Doit contenir :
# - Dockerfile
# - render.yaml
# - requirements.txt
# - start.sh
# - app/main.py
# - app/hls_converter.py
```

### 1.2 Tester localement (optionnel)

```bash
# Aller dans le dossier backend
cd backend

# Construire l'image Docker
docker build -t acestream-backend .

# Lancer le conteneur
docker run -p 8000:8000 acestream-backend

# Tester l'API
curl http://localhost:8000/
curl "http://localhost:8000/api/proxy/logo?url=https://i.ibb.co/yfV1Q8n/liga.png"
```

---

## 🌐 ÉTAPE 2 : Déployer sur Render

### 2.1 Créer un compte Render

1. Allez sur [render.com](https://render.com)
2. Inscrivez-vous gratuitement (avec GitHub recommandé)
3. Confirmez votre email

### 2.2 Connecter votre dépôt GitHub

1. Dans Render Dashboard, cliquez sur **"New +"**
2. Sélectionnez **"Web Service"**
3. Connectez votre compte GitHub
4. Sélectionnez le repository `app-web-vercel`

### 2.3 Configurer le service

**Configuration à saisir** :

| Paramètre | Valeur |
|-----------|--------|
| **Name** | `acestream-backend` (ou votre choix) |
| **Region** | `Frankfurt` (Europe) ou le plus proche |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime** | `Docker` |
| **Dockerfile Path** | `./Dockerfile` |
| **Docker Context** | `.` |
| **Plan** | `Free` |

**Variables d'environnement** :

```
PORT=8000
ACESTREAM_BASE_URL=http://127.0.0.1:6878
STORAGE_DIR=/app/storage
FFMPEG_ENABLED=true
FFMPEG_LOG_LEVEL=warning
```

### 2.4 Lancer le déploiement

1. Cliquez sur **"Create Web Service"**
2. Render va :
   - Cloner votre repo
   - Construire l'image Docker
   - Démarrer le service
3. ⏳ **Attendez 5-10 minutes** (premier déploiement)

### 2.5 Vérifier le déploiement

Une fois le statut **"Live"**, vous verrez l'URL :
```
https://acestream-backend-xxxx.onrender.com
```

**Tester l'API** :
```bash
# Santé du service
curl https://acestream-backend-xxxx.onrender.com/health

# API racine
curl https://acestream-backend-xxxx.onrender.com/

# Proxy de logo
curl "https://acestream-backend-xxxx.onrender.com/api/proxy/logo?url=https://i.ibb.co/yfV1Q8n/liga.png"
```

---

## 🎨 ÉTAPE 3 : Configurer le Frontend sur Vercel

### 3.1 Mettre à jour les variables d'environnement

#### Option A : Via le Dashboard Vercel (Recommandé)

1. Allez sur [vercel.com/dashboard](https://vercel.com/dashboard)
2. Sélectionnez votre projet
3. Allez dans **Settings → Environment Variables**
4. Ajoutez/modifiez :

```
REACT_APP_API_URL=https://acestream-backend-xxxx.onrender.com
```

**⚠️ IMPORTANT** : Remplacez `xxxx` par votre vraie URL Render !

5. Sélectionnez tous les environnements (Production, Preview, Development)
6. Cliquez sur **Save**

#### Option B : Via CLI

```bash
# Installer Vercel CLI si pas déjà fait
npm i -g vercel

# Se connecter
vercel login

# Aller dans le dossier webapp
cd webapp

# Ajouter la variable
vercel env add REACT_APP_API_URL
# Entrez l'URL : https://acestream-backend-xxxx.onrender.com
# Sélectionnez : Production, Preview, Development
```

### 3.2 Mettre à jour les fichiers locaux

```bash
# Mettre à jour webapp/.env.production
echo "REACT_APP_API_URL=https://acestream-backend-xxxx.onrender.com" > webapp/.env.production

# Mettre à jour .env à la racine
echo "REACT_APP_API_URL=https://acestream-backend-xxxx.onrender.com" > .env
```

### 3.3 Supprimer les anciennes variables (nettoyage)

**Dans `vercel.json` à la racine** :
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        }
      ]
    }
  ]
}
```

**Supprimer** la section `"env"` qui contenait l'ancienne URL Railway.

### 3.4 Redéployer sur Vercel

```bash
cd webapp
vercel --prod
```

Ou simplement **pousser sur GitHub** (déploiement automatique) :
```bash
git add .
git commit -m "fix: Configuration backend Render + proxy logos"
git push origin main
```

---

## 🧪 ÉTAPE 4 : Tester l'Application Complète

### 4.1 Ouvrir l'application

Allez sur votre URL Vercel :
```
https://votre-app.vercel.app
```

### 4.2 Vérifier les logos

1. **Ouvrez la console du navigateur** (F12 → Console)
2. **Vérifiez les requêtes réseau** (F12 → Network)
3. **Les logos doivent maintenant s'afficher** !

Les URLs de logos doivent ressembler à :
```
https://acestream-backend-xxxx.onrender.com/api/proxy/logo?url=https%3A%2F%2Fi.ibb.co%2FyfV1Q8n%2Fliga.png
```

### 4.3 Tester un flux

1. Sélectionnez une chaîne ou un événement
2. Cliquez sur **"Regarder"**
3. Le flux devrait démarrer (peut prendre 10-20 secondes)

---

## 🐛 DÉPANNAGE

### Problème 1 : Le backend ne démarre pas sur Render

**Symptômes** :
- Status "Deploy failed"
- Logs d'erreur dans Render

**Solutions** :
```bash
# Vérifier les logs dans Render Dashboard → Logs
# Vérifier que le Dockerfile est correct
cat backend/Dockerfile

# Tester localement
cd backend
docker build -t test-backend .
docker run -p 8000:8000 test-backend
```

### Problème 2 : Les logos ne s'affichent toujours pas

**Vérifier** :
1. La variable `REACT_APP_API_URL` est bien configurée sur Vercel
2. Le frontend a été redéployé après le changement
3. La console du navigateur pour les erreurs

**Test manuel** :
```javascript
// Dans la console du navigateur sur votre site Vercel
console.log(process.env.REACT_APP_API_URL);
// Devrait afficher : https://acestream-backend-xxxx.onrender.com
```

### Problème 3 : Le backend s'endort après 15 minutes

**C'est normal avec Render Free !**

**Solutions** :
1. **Accepter le délai** : Le backend redémarre en ~30 secondes
2. **Ping automatique** : Créer un service qui ping toutes les 10 minutes
3. **Passer à un plan payant** : 7$/mois pour un service toujours actif

**Script de ping (optionnel)** :
```javascript
// À ajouter dans webapp/src/App.js
useEffect(() => {
  // Ping le backend toutes les 10 minutes pour le garder actif
  const interval = setInterval(() => {
    fetch(`${API_BASE}/health`).catch(() => {});
  }, 10 * 60 * 1000); // 10 minutes
  
  return () => clearInterval(interval);
}, [API_BASE]);
```

### Problème 4 : CORS errors

**Si vous voyez** :
```
Access to fetch at '...' has been blocked by CORS policy
```

**Vérifier** :
1. Le backend est bien déployé et accessible
2. L'URL dans `REACT_APP_API_URL` est correcte (pas de slash final)
3. Le backend a bien les headers CORS (déjà configuré dans main.py)

---

## 📊 ARCHITECTURE FINALE

```
┌─────────────────────────────────────────────────────────┐
│            UTILISATEUR (Navigateur)                      │
└────────────────┬────────────────────────────────────────┘
                 │
                 │ HTTPS
                 ▼
┌─────────────────────────────────────────────────────────┐
│         FRONTEND (Vercel)                                │
│  https://votre-app.vercel.app                           │
│  - Affiche l'interface                                  │
│  - Charge les playlists depuis GitHub                  │
│  - Appelle le backend pour logos et streams            │
└────────────────┬────────────────────────────────────────┘
                 │
                 │ API Calls (REACT_APP_API_URL)
                 │ GET /api/proxy/logo?url=...
                 │ POST /api/play
                 │
┌────────────────▼────────────────────────────────────────┐
│      BACKEND (Render - Docker)                          │
│  https://acestream-backend-xxxx.onrender.com            │
│  - Proxifie les logos (résout CORS)                    │
│  - Lance AceStream Engine                              │
│  - Convertit les flux en HLS                           │
└────────────────┬────────────────────────────────────────┘
                 │
                 │ AceStream P2P Protocol
                 │
┌────────────────▼────────────────────────────────────────┐
│         RÉSEAU ACESTREAM                                │
│  - Peers P2P                                            │
│  - Contenu vidéo                                        │
└─────────────────────────────────────────────────────────┘
```

---

## ✅ CHECKLIST FINALE

### Backend (Render)
- [ ] Service créé sur Render
- [ ] Build réussi (statut "Live")
- [ ] URL obtenue : `https://acestream-backend-xxxx.onrender.com`
- [ ] Test : `curl https://acestream-backend-xxxx.onrender.com/health`
- [ ] Test proxy logo : `curl "https://acestream-backend-xxxx.onrender.com/api/proxy/logo?url=https://i.ibb.co/yfV1Q8n/liga.png"`

### Frontend (Vercel)
- [ ] Variable `REACT_APP_API_URL` configurée sur Vercel
- [ ] Fichier `.env.production` mis à jour localement
- [ ] Code poussé sur GitHub
- [ ] Déploiement automatique réussi
- [ ] Test : Ouvrir l'app et vérifier que les logos s'affichent

### Fonctionnalités
- [ ] Les logos des événements s'affichent
- [ ] Les logos des chaînes TV s'affichent
- [ ] Le streaming fonctionne (peut être lent au premier lancement)
- [ ] Pas d'erreurs CORS dans la console

---

## 🎯 PROCHAINES ÉTAPES (Optionnelles)

### 1. Optimisation des performances
- Ajouter un système de cache côté backend pour les logos
- Optimiser le démarrage d'AceStream Engine

### 2. APK Android
- Utiliser Capacitor (déjà configuré dans `webapp/android/`)
- Builder l'APK avec Android Studio

### 3. Amélioration UX
- Ajouter un loader pendant que le backend se réveille
- Afficher un message si le backend est en sleep

### 4. Monitoring
- Configurer des alertes sur Render
- Ajouter Google Analytics

---

## 📞 SUPPORT

Si vous rencontrez des problèmes :

1. **Vérifier les logs Render** : Dashboard → Logs
2. **Vérifier la console navigateur** : F12 → Console
3. **Tester les endpoints** :
   ```bash
   curl https://acestream-backend-xxxx.onrender.com/
   curl https://acestream-backend-xxxx.onrender.com/health
   ```

---

## 🎉 SUCCÈS !

Une fois tous les éléments cochés, votre application est **100% fonctionnelle** :
- ✅ Backend AceStream sur Render
- ✅ Frontend sur Vercel
- ✅ Logos affichés correctement
- ✅ Streaming sans installation AceStream

**Félicitations ! 🚀**
