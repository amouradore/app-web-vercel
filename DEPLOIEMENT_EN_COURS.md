# 🚀 DÉPLOIEMENT EN COURS

## ✅ Connexion Render Réussie !

Votre CLI est maintenant connecté à votre compte Render.

---

## 📋 MAINTENANT : Déployer le Backend

### Commande 1 : Aller dans le dossier backend

```bash
cd backend
```

### Commande 2 : Vérifier les fichiers

```bash
ls
```

**Vous devriez voir :**
- Dockerfile
- render.yaml
- requirements.txt
- app/ (dossier)

✅ **Si vous voyez ces fichiers, continuez !**

---

## 🚀 Commande 3 : DÉPLOYER

```bash
render deploy
```

---

## ⏱️ CE QUI VA SE PASSER (5-10 minutes)

### Étape 1 : Lecture de la configuration
```
==> Deploying from render.yaml
==> Found service: acestream-backend
```

### Étape 2 : Création du service
```
==> Creating web service: acestream-backend
==> Region: Frankfurt
==> Plan: Free
```

### Étape 3 : Build Docker (5-8 minutes)
```
==> Building Docker image...
[build] Step 1/15: FROM python:3.11
[build] Step 2/15: WORKDIR /app
[build] Step 3/15: COPY requirements.txt .
[build] Step 4/15: RUN pip install -r requirements.txt
[build] Step 5/15: Installing AceStream Engine...
...
[build] Image built successfully
```

### Étape 4 : Déploiement
```
==> Deploying service...
==> Service is live!
```

### Étape 5 : URL du service
```
✅ Your service is live at:
   https://acestream-backend-xxxx.onrender.com
```

---

## 📊 PENDANT LE DÉPLOIEMENT

### Vous pouvez suivre les logs dans un autre terminal :

**Ouvrez un 2ème terminal et tapez :**

```bash
render logs -f
```

**Cela affichera les logs en temps réel.**

**Pour arrêter les logs : Ctrl+C** (le service continue de tourner)

---

## ⚠️ MESSAGES NORMAUX À IGNORER

Pendant le build, vous pourrez voir :

```
WARNING: Running pip as root...
```
**→ C'est normal dans Docker**

```
debconf: unable to initialize frontend...
```
**→ C'est normal, ignorez**

```
Setting up acestream-engine...
```
**→ Parfait ! AceStream s'installe**

---

## ✅ SUCCÈS : Ce que vous verrez à la fin

```
==> Deploy successful!
==> Service URL: https://acestream-backend-xxxx.onrender.com
==> Status: live
```

**Copiez cette URL !** Vous en aurez besoin pour configurer le frontend.

---

## ❌ EN CAS D'ERREUR

### Erreur : "render.yaml not found"

**Solution :**
```bash
# Vérifiez que vous êtes dans backend/
pwd
ls render.yaml

# Si vous êtes au mauvais endroit
cd backend
render deploy
```

### Erreur : "Authentication failed"

**Solution :**
```bash
render config
# Entrez à nouveau votre clé API
```

### Erreur : "Out of memory"

**Cause :** Le plan gratuit a 512MB RAM

**Solutions :**
1. Attendez que le build se termine (il peut réessayer)
2. Simplifiez le Dockerfile si possible
3. Essayez de redéployer : `render deploy`

### Le build prend trop de temps (>15 min)

**C'est normal la première fois !** AceStream Engine est lourd.

**Patience, cela peut prendre jusqu'à 10-15 minutes.**

---

## 📋 APRÈS LE DÉPLOIEMENT

### 1. Obtenir l'URL

```bash
render services list
```

### 2. Tester le backend

```bash
curl https://votre-url.onrender.com/health
```

### 3. Configurer le frontend

```bash
cd ../webapp
echo "REACT_APP_API_URL=https://votre-url.onrender.com" > .env
```

### 4. Tester l'application

```bash
npm start
```

---

## 🎯 RÉSUMÉ DES COMMANDES

```bash
# 1. Aller dans backend
cd backend

# 2. Déployer (attendez 5-10 min)
render deploy

# 3. Obtenir l'URL (après déploiement)
render services list

# 4. Tester
curl https://votre-url.onrender.com/health

# 5. Configurer frontend
cd ../webapp
echo "REACT_APP_API_URL=https://votre-url.onrender.com" > .env

# 6. Tester l'application
npm start
```

---

## 💬 TENEZ-MOI AU COURANT

**Dites-moi :**
- **"Déploiement lancé"** → Super ! Attendez 5-10 min
- **"Build en cours"** → Parfait, patience !
- **"Déploiement terminé"** → Donnez-moi l'URL, on teste !
- **"Erreur : [message]"** → Je vous aide

---

## ⏱️ TEMPS ESTIMÉ

- **Build Docker :** 5-8 minutes
- **Installation AceStream :** 2-3 minutes
- **Démarrage service :** 1 minute
- **TOTAL :** ~10 minutes

**Soyez patient, c'est normal ! ☕**

---

**Exécutez maintenant :**
```bash
cd backend
render deploy
```

**Et dites-moi quand le déploiement commence ! 🚀**
