# 🚀 DÉPLOIEMENT RAPIDE - RENDER + VERCEL

## ✅ Modifications Terminées !

Tous les fichiers ont été modifiés pour corriger le problème d'affichage des logos.

---

## 📋 ÉTAPE 1 : Commit et Push

```bash
# Ajouter tous les fichiers modifiés
git add .

# Commit avec un message clair
git commit -m "fix: Ajout proxy logos backend + correction variables environnement"

# Push vers GitHub
git push origin main
```

---

## 🌐 ÉTAPE 2 : Déployer le Backend sur Render

### 2.1 Créer un compte
1. Allez sur **https://render.com**
2. **Sign Up** avec GitHub (recommandé)
3. Autorisez l'accès à votre repository

### 2.2 Créer le Web Service
1. Cliquez sur **"New +"** → **"Web Service"**
2. Sélectionnez votre repository `app-web-vercel`
3. Configurez :

| Paramètre | Valeur |
|-----------|--------|
| **Name** | `acestream-backend` |
| **Region** | `Frankfurt` (ou le plus proche) |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime** | `Docker` |
| **Dockerfile Path** | `./Dockerfile` |
| **Plan** | `Free` |

### 2.3 Variables d'environnement (optionnel)
Les valeurs par défaut dans le Dockerfile suffisent, mais vous pouvez ajouter :
```
PORT=8000
ACESTREAM_BASE_URL=http://127.0.0.1:6878
STORAGE_DIR=/app/storage
FFMPEG_ENABLED=true
```

### 2.4 Lancer le Build
1. Cliquez sur **"Create Web Service"**
2. ⏳ Attendez 5-10 minutes
3. Notez l'URL : `https://acestream-backend-xxxx.onrender.com`

### 2.5 Vérifier
```bash
# Tester l'API
curl https://acestream-backend-xxxx.onrender.com/health

# Tester le proxy logo
curl "https://acestream-backend-xxxx.onrender.com/api/proxy/logo?url=https://i.ibb.co/yfV1Q8n/liga.png"
```

---

## 🎨 ÉTAPE 3 : Configurer Vercel

### 3.1 Ajouter la variable d'environnement

#### Via Dashboard (Recommandé)
1. Allez sur **https://vercel.com/dashboard**
2. Sélectionnez votre projet
3. **Settings** → **Environment Variables**
4. Ajoutez :
   - **Name** : `REACT_APP_API_URL`
   - **Value** : `https://acestream-backend-xxxx.onrender.com`
   - ⚠️ **SANS slash final !**
5. Sélectionnez tous les environnements
6. **Save**

#### Via CLI (Alternatif)
```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Aller dans webapp
cd webapp

# Ajouter la variable
vercel env add REACT_APP_API_URL production
# Entrez : https://acestream-backend-xxxx.onrender.com
```

### 3.2 Redéployer
Le redéploiement se fera automatiquement si vous avez poussé sur GitHub, sinon :

```bash
cd webapp
vercel --prod
```

---

## 🧪 ÉTAPE 4 : Tester l'Application

### 4.1 Ouvrir l'app
Allez sur votre URL Vercel : `https://votre-app.vercel.app`

### 4.2 Vérifier les logos
1. **F12** → **Console** : Pas d'erreurs CORS
2. **F12** → **Network** : Requêtes vers `/api/proxy/logo` réussies
3. Les logos doivent s'afficher !

### 4.3 Tester un stream
1. Cliquez sur un événement ou une chaîne
2. Cliquez sur **"Regarder"**
3. Le flux devrait démarrer (peut prendre 10-30 secondes au premier lancement)

---

## ✅ CHECKLIST FINALE

### Backend Render
- [ ] Service créé et "Live"
- [ ] URL notée : `https://acestream-backend-xxxx.onrender.com`
- [ ] Test health : `curl .../health` → OK
- [ ] Test proxy : `curl .../api/proxy/logo?url=...` → retourne une image

### Frontend Vercel
- [ ] Variable `REACT_APP_API_URL` ajoutée
- [ ] App redéployée automatiquement
- [ ] Logos visibles sur l'application
- [ ] Pas d'erreurs CORS dans la console

---

## 🐛 DÉPANNAGE RAPIDE

### Problème : Backend ne démarre pas
**Solution** : Vérifier les logs dans Render Dashboard → Logs

### Problème : Logos toujours invisibles
**Solution** : 
1. Vérifier que `REACT_APP_API_URL` est bien configuré sur Vercel
2. Vérifier dans la console : `console.log(process.env.REACT_APP_API_URL)`
3. Forcer un rebuild sur Vercel

### Problème : Backend s'endort après 15 min
**C'est normal avec le plan Free !** Le backend redémarre automatiquement en ~30 secondes.

**Optionnel** : Ajouter un ping automatique dans `webapp/src/App.js` :
```javascript
useEffect(() => {
  const interval = setInterval(() => {
    fetch(`${API_BASE}/health`).catch(() => {});
  }, 10 * 60 * 1000); // Ping toutes les 10 minutes
  return () => clearInterval(interval);
}, [API_BASE]);
```

---

## 📞 RESSOURCES

### Documentation créée
- ✅ `ANALYSE_COMPLETE_PROJET.md` - Analyse détaillée
- ✅ `GUIDE_DEPLOIEMENT_RENDER_COMPLET.md` - Guide détaillé
- ✅ `RESUME_MODIFICATIONS.md` - Liste des modifications
- ✅ `DEPLOIEMENT_RENDER_ETAPES_RAPIDES.md` - Ce guide

### URLs Importantes
- **Render Dashboard** : https://dashboard.render.com
- **Vercel Dashboard** : https://vercel.com/dashboard
- **GitHub Repo** : https://github.com/amouradore/app-web-vercel

---

## 🎉 SUCCÈS !

Une fois toutes les étapes terminées, votre application sera 100% fonctionnelle :
- ✅ Logos affichés correctement
- ✅ Streaming AceStream sans installation
- ✅ Déployé gratuitement sur Render + Vercel

**Bon streaming ! 📺🚀**
