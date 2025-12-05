# 🚀 DÉPLOIEMENT RENDER - MAINTENANT

## ✅ CLI Installé - Prochaines Étapes

Vous venez d'installer le Render CLI. Voici exactement ce qu'il faut faire maintenant.

---

## 📋 ÉTAPE 1 : Vérifier l'Installation (30 secondes)

### Dans votre terminal, tapez :

```bash
render --version
```

**Résultat attendu :**
```
render version x.x.x
```

✅ **Si vous voyez ça, c'est bon !**

❌ **Si erreur "command not found" :**
```bash
# Essayez de réinstaller
npm install -g @render/cli
```

---

## 📋 ÉTAPE 2 : Configurer le CLI (1 minute)

### ⚠️ IMPORTANT : Sécurité d'abord

Avant de continuer, assurez-vous que :
- [ ] Vous avez **révoqué** l'ancienne clé API (celle que vous avez partagée)
- [ ] Vous avez créé une **nouvelle** clé API

### Comment obtenir une nouvelle clé :

```
1. Allez sur https://dashboard.render.com
2. Avatar > Account Settings
3. API Keys (menu gauche)
4. "Create API Key"
5. Nom : "CLI Deployment New"
6. Copiez la nouvelle clé (elle commence par rnd_...)
```

### Configurer le CLI avec votre nouvelle clé :

```bash
render config
```

**Vous verrez :**
```
Enter your Render API key:
```

**Collez votre NOUVELLE clé** (Ctrl+V ou clic droit pour coller)

**Appuyez sur Entrée**

✅ **Configuration saved!**

---

## 📋 ÉTAPE 3 : Se Placer dans le Bon Dossier (10 secondes)

```bash
cd backend
```

**Vérifier que vous êtes au bon endroit :**

```bash
ls
```

**Vous devriez voir :**
```
Dockerfile
render.yaml
requirements.txt
app/
```

✅ **Si vous voyez ces fichiers, c'est bon !**

---

## 📋 ÉTAPE 4 : Déployer ! (5-10 minutes)

### Lancer le déploiement :

```bash
render deploy
```

**Ce que vous allez voir :**

```
==> Deploying from render.yaml
==> Creating service: acestream-backend
==> Building Docker image...
==> Installing dependencies...
==> Installing AceStream Engine...
==> Starting service...
```

**Cela prend 5-10 minutes** ⏱️

**C'est normal !** Le build Docker prend du temps la première fois.

---

## 📋 ÉTAPE 5 : Suivre le Déploiement (Optionnel)

### Dans un autre terminal, suivez les logs :

```bash
render logs -f
```

**Vous verrez :**
```
[build] Step 1/10 : FROM python:3.11
[build] Step 2/10 : WORKDIR /app
...
[service] Starting FastAPI server...
[service] Server started on port 8000
```

**Appuyez sur Ctrl+C pour quitter les logs** (le service continue de tourner)

---

## 📋 ÉTAPE 6 : Obtenir l'URL du Service (30 secondes)

### Une fois le déploiement terminé :

```bash
render services list
```

**Résultat :**
```
NAME                  ID            TYPE    STATUS    URL
acestream-backend     srv-xxxxx     web     live      https://acestream-backend-xxxx.onrender.com
```

**Copiez l'URL !** (celle qui se termine par `.onrender.com`)

---

## 📋 ÉTAPE 7 : Tester le Backend (1 minute)

### Tester avec curl :

```bash
curl https://acestream-backend-xxxx.onrender.com/health
```

⚠️ **Remplacez `xxxx` par votre vraie URL !**

**Résultat attendu :**
```json
{
  "status": "healthy",
  "service": "acestream-hls-proxy",
  "acestream": "ready"
}
```

✅ **Si vous voyez ça, votre backend fonctionne !**

### Ou testez dans votre navigateur :

Ouvrez :
```
https://acestream-backend-xxxx.onrender.com/health
```

---

## 📋 ÉTAPE 8 : Configurer le Frontend (2 minutes)

### Créer le fichier .env :

```bash
cd ../webapp
echo "REACT_APP_API_URL=https://acestream-backend-xxxx.onrender.com" > .env
```

⚠️ **Remplacez `xxxx` par votre URL Render !**

### Vérifier le fichier :

```bash
cat .env
```

**Devrait afficher :**
```
REACT_APP_API_URL=https://acestream-backend-xxxx.onrender.com
```

---

## 📋 ÉTAPE 9 : Tester l'Application Complète (2 minutes)

### Lancer le frontend :

```bash
npm start
```

**Le navigateur devrait s'ouvrir automatiquement sur http://localhost:3000**

### Tester un flux :

1. Choisissez un événement ou une chaîne
2. Cliquez sur "▶ Regarder"
3. Le lecteur devrait s'ouvrir
4. La vidéo devrait charger (peut prendre 20-30 secondes)

✅ **Si ça marche, félicitations !**

---

## 📋 ÉTAPE 10 : Déployer le Frontend sur Vercel (Optionnel - 5 min)

### Si vous voulez mettre le frontend en ligne :

```bash
npm run build
npx vercel --prod
```

**Suivez les instructions de Vercel**

---

## ✅ CHECKLIST COMPLÈTE

- [ ] CLI installé (`render --version`)
- [ ] Ancienne clé API révoquée
- [ ] Nouvelle clé API créée
- [ ] CLI configuré (`render config`)
- [ ] Dans le dossier `backend/`
- [ ] Déploiement lancé (`render deploy`)
- [ ] Déploiement terminé (5-10 min)
- [ ] URL du service copiée
- [ ] Backend testé (`curl .../health`)
- [ ] Frontend configuré (`.env`)
- [ ] Application testée en local
- [ ] Frontend déployé sur Vercel (optionnel)

---

## ⚠️ PROBLÈMES COURANTS

### Problème 1 : "Authentication failed"

**Solution :**
```bash
render config
# Entrez à nouveau votre clé API
```

### Problème 2 : "render.yaml not found"

**Solution :**
```bash
# Vérifiez que vous êtes dans backend/
pwd
cd backend
ls render.yaml
```

### Problème 3 : "Build failed"

**Solution :**
```bash
# Vérifiez les logs
render logs -f

# Vérifiez le Dockerfile
cat Dockerfile
```

### Problème 4 : Backend ne répond pas

**Raison :** Le service dort après 15 min d'inactivité (plan gratuit)

**Solution :**
- Première requête : attendez 30 secondes
- Le service se réveille automatiquement

### Problème 5 : AceStream ne fonctionne pas

**Raison :** Render peut limiter le P2P

**Solutions :**
1. Vérifier les logs : `render logs -f`
2. Essayer Replit (plus flexible)
3. Self-hosting sur votre PC

---

## 🎉 SUCCÈS !

Si tout fonctionne :
- ✅ Backend gratuit sur Render (0€)
- ✅ 750h/mois (= 24/7)
- ✅ Application sans installation AceStream
- ✅ Utilisateurs peuvent regarder les flux

---

## 📞 BESOIN D'AIDE ?

**Si vous êtes bloqué, dites-moi :**
- À quelle étape êtes-vous ?
- Quel message d'erreur voyez-vous ?
- Que dit la commande `render logs -f` ?

---

## 🚀 PROCHAINES ÉTAPES

Maintenant que le CLI est installé, exécutez ces commandes :

```bash
# 1. Configurer le CLI
render config

# 2. Aller dans backend
cd backend

# 3. Déployer
render deploy

# 4. Suivre les logs (dans un autre terminal)
render logs -f
```

**Dites-moi quand vous avez fait chaque étape !**
