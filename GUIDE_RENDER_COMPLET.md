# 🚀 GUIDE COMPLET : Déployer sur Render.com

## 🎯 Ce Que Nous Allons Faire

Déployer votre backend AceStream sur Render.com **GRATUITEMENT** (aucune carte requise).

**Durée totale : 10-15 minutes**

---

## ✅ Prérequis

- [x] Compte GitHub (vous l'avez : https://github.com/amouradore/app-web-vercel)
- [x] Une adresse email
- [ ] Compte Render.com (on va le créer ensemble)

---

## 📋 ÉTAPE 1 : Créer un Compte Render (2 minutes)

### 1. Ouvrez votre navigateur

Allez sur : **https://render.com**

### 2. Inscrivez-vous avec GitHub

```
1. Cliquez sur "Get Started" ou "Sign Up"
2. Cliquez sur "Continue with GitHub"
3. Autorisez Render à accéder à votre compte GitHub
4. Confirmez votre email si demandé
```

**✅ Aucune carte bancaire requise !**

### 3. Vous êtes sur le Dashboard

Vous devriez voir : "Welcome to Render" avec un bouton "New +"

---

## 📋 ÉTAPE 2 : Préparer le Repo GitHub (3 minutes)

### Important : Vérifier les fichiers

Avant de déployer, vérifions que votre repo a les bons fichiers.

#### Fichiers Nécessaires (déjà présents)

✅ `backend/Dockerfile`
✅ `backend/requirements.txt`
✅ `backend/app/main.py`

#### Créer un fichier render.yaml (Optionnel mais Recommandé)

Je vais créer ce fichier pour vous maintenant...

---

## 📋 ÉTAPE 3 : Connecter GitHub à Render (2 minutes)

### 1. Dans Render Dashboard

```
1. Cliquez sur "New +" (en haut à droite)
2. Sélectionnez "Web Service"
```

### 2. Connecter votre Repository

```
1. Vous verrez "Connect a repository"
2. Cherchez : "app-web-vercel"
3. Cliquez sur "Connect"
```

**Si vous ne voyez pas votre repo :**
```
1. Cliquez sur "Configure GitHub Access"
2. Autorisez l'accès au repo "app-web-vercel"
3. Retournez et rafraîchissez
```

---

## 📋 ÉTAPE 4 : Configurer le Service (3 minutes)

### Configuration du Service

Remplissez les champs suivants :

#### 1. Name (Nom)
```
acestream-backend
```
(ou n'importe quel nom que vous voulez)

#### 2. Region (Région)
```
Frankfurt (EU Central) - RECOMMANDÉ pour l'Europe
```
Ou choisissez la région la plus proche de vous.

#### 3. Branch (Branche)
```
main
```
(ou master si c'est votre branche principale)

#### 4. Root Directory (IMPORTANT)
```
backend
```
⚠️ **Très important !** Votre code backend est dans le dossier `backend/`

#### 5. Runtime (Environnement)
```
Docker
```
✅ Render détectera automatiquement votre Dockerfile

#### 6. Instance Type (Type d'instance)
```
Free
```
✅ Sélectionnez le plan gratuit (750 heures/mois)

---

## 📋 ÉTAPE 5 : Variables d'Environnement (2 minutes)

### Ajouter les Variables

Descendez jusqu'à "Environment Variables" et ajoutez :

#### Variable 1
```
Key:   ACESTREAM_BASE_URL
Value: http://127.0.0.1:6878
```

#### Variable 2
```
Key:   STORAGE_DIR
Value: /app/storage
```

#### Variable 3
```
Key:   PORT
Value: 8000
```

#### Variable 4 (Important pour Render)
```
Key:   PYTHON_VERSION
Value: 3.11
```

---

## 📋 ÉTAPE 6 : Déployer ! (5-10 minutes)

### 1. Cliquez sur "Create Web Service"

Render va :
1. ✅ Cloner votre repository
2. ✅ Construire l'image Docker
3. ✅ Installer AceStream Engine
4. ✅ Démarrer le service

**Cela prend 5-10 minutes la première fois.**

### 2. Suivre les Logs

Vous verrez les logs en temps réel :
```
==> Cloning from GitHub...
==> Building Docker image...
==> Installing dependencies...
==> Starting service...
==> Your service is live!
```

### 3. Obtenir l'URL

Une fois terminé, vous verrez :
```
✅ Your service is live at https://acestream-backend-xxxx.onrender.com
```

**Copiez cette URL !** Vous en aurez besoin pour configurer le frontend.

---

## 📋 ÉTAPE 7 : Tester le Backend (2 minutes)

### 1. Ouvrir l'URL dans votre navigateur

```
https://acestream-backend-xxxx.onrender.com
```

Vous devriez voir un message du backend.

### 2. Tester l'API Health

```
https://acestream-backend-xxxx.onrender.com/health
```

Vous devriez voir une réponse JSON.

### 3. Tester avec curl (Optionnel)

```bash
curl https://acestream-backend-xxxx.onrender.com/health
```

---

## 📋 ÉTAPE 8 : Configurer le Frontend (3 minutes)

### 1. Modifier le fichier .env

Dans votre dossier `webapp/`, créez ou modifiez `.env` :

```bash
cd webapp
echo "REACT_APP_API_URL=https://acestream-backend-xxxx.onrender.com" > .env
```

**Remplacez `xxxx` par votre URL Render !**

### 2. Tester en Local

```bash
npm start
```

Ouvrez http://localhost:3000 et testez un flux !

---

## 📋 ÉTAPE 9 : Déployer le Frontend sur Vercel (5 minutes)

### 1. Build le Frontend

```bash
cd webapp
npm run build
```

### 2. Déployer sur Vercel

```bash
npx vercel --prod
```

Ou via l'interface Vercel :
```
1. Allez sur vercel.com
2. Connectez votre GitHub
3. Importez "app-web-vercel"
4. Root Directory: "webapp"
5. Environment Variables:
   REACT_APP_API_URL=https://acestream-backend-xxxx.onrender.com
6. Deploy!
```

---

## 📋 ÉTAPE 10 : Compiler l'APK Android (Optionnel)

### 1. Synchroniser avec Capacitor

```bash
cd webapp
npx cap sync
```

### 2. Ouvrir Android Studio

```bash
npx cap open android
```

### 3. Build APK

Dans Android Studio :
```
Build > Build Bundle(s) / APK(s) > Build APK(s)
```

L'APK sera dans : `webapp/android/app/build/outputs/apk/debug/`

---

## ✅ VÉRIFICATIONS FINALES

### Checklist

- [ ] Backend Render déployé et accessible
- [ ] URL du backend copiée
- [ ] Frontend configuré avec l'URL du backend
- [ ] Frontend testé en local
- [ ] Frontend déployé sur Vercel (optionnel)
- [ ] APK compilé (optionnel)

---

## ⚠️ PROBLÈMES POTENTIELS

### Problème 1 : "Service Sleeping"

**Symptôme :** Le backend met 30 secondes à répondre après inactivité.

**Cause :** Le plan gratuit de Render dort après 15 minutes d'inactivité.

**Solution :**
- Première requête : attendez 30 secondes
- Ou utilisez un service de "keep-alive" (ping toutes les 10 minutes)

### Problème 2 : "AceStream Engine Not Ready"

**Symptôme :** Le backend démarre mais AceStream ne fonctionne pas.

**Cause :** Render peut bloquer P2P ou les processus en arrière-plan.

**Solutions :**
1. Vérifier les logs Render pour les erreurs AceStream
2. Essayer Replit (plus flexible)
3. Passer au self-hosting

### Problème 3 : "Build Failed"

**Symptôme :** L'image Docker ne se construit pas.

**Solutions :**
1. Vérifier que Root Directory = "backend"
2. Vérifier que Dockerfile existe dans backend/
3. Consulter les logs de build

### Problème 4 : "Out of Memory"

**Symptôme :** Le service crash avec "OOM" (Out Of Memory).

**Cause :** Le plan gratuit a 512MB RAM (peut être insuffisant pour AceStream).

**Solutions :**
1. Optimiser la configuration AceStream
2. Essayer avec moins de connexions simultanées
3. Passer à un plan payant (7$/mois pour 512MB → 2GB)

---

## 💡 OPTIMISATIONS

### Keep-Alive (Empêcher le Service de Dormir)

Créez un fichier `keep-alive.js` :

```javascript
// Ping le serveur toutes les 10 minutes
setInterval(() => {
  fetch('https://acestream-backend-xxxx.onrender.com/health')
    .then(() => console.log('✅ Keep-alive ping'))
    .catch(() => console.log('❌ Keep-alive failed'));
}, 10 * 60 * 1000); // 10 minutes
```

Déployez ce script sur Vercel avec une fonction serverless.

---

## 📊 COMPARAISON : Render vs Autres

| Critère | Render | Oracle Cloud | VPS Payant |
|---------|--------|--------------|------------|
| **Coût** | 0€ | 0€ | 5-10€/mois |
| **Carte requise** | ❌ | ✅ | ✅ |
| **Setup** | 10 min | 1h | 30 min |
| **RAM** | 512MB | 24GB | 2-4GB |
| **Sleep** | ✅ Oui (15 min) | ❌ Non | ❌ Non |
| **P2P** | 🟡 Limité | ✅ Oui | ✅ Oui |

---

## 🎯 PROCHAINES ÉTAPES

### Si Render Fonctionne Bien
✅ Vous avez votre solution gratuite !
- Backend : Render.com (gratuit)
- Frontend : Vercel (gratuit)
- **Total : 0€**

### Si AceStream Ne Fonctionne Pas sur Render
Options :
1. **Essayer Replit** (plus flexible)
2. **Self-hosting** sur votre PC (95% succès)
3. **Solution Hybride** avec proxies publics

---

## 📞 BESOIN D'AIDE ?

### Problème avec Render
- Consultez les logs dans le dashboard Render
- Vérifiez que Root Directory = "backend"
- Vérifiez les variables d'environnement

### AceStream Ne Fonctionne Pas
- C'est normal, Render peut limiter P2P
- Essayez Replit ou self-hosting

### Autres Questions
- Demandez-moi !

---

## 🎉 FÉLICITATIONS !

Si tout fonctionne, vous avez maintenant :
- ✅ Backend gratuit sur Render
- ✅ Frontend gratuit sur Vercel
- ✅ Application sans installation AceStream côté utilisateur
- ✅ **Coût total : 0€**

---

**Êtes-vous prêt à commencer ? Suivez les étapes ci-dessus ! 🚀**

**Dites-moi quand vous avez fini chaque étape, je vous aide si vous bloquez !**
