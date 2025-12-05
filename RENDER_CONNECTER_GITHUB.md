# 🔗 CONNECTER VOTRE PROJET GITHUB À RENDER

## 🎯 Vous Avez Raison !

Avant de déployer avec le CLI, il faut que Render puisse accéder à votre repository GitHub.

---

## 📋 MÉTHODE 1 : Via l'Interface Web (RECOMMANDÉ - Plus Simple)

### Étape 1 : Aller sur Render Dashboard

```
https://dashboard.render.com
```

### Étape 2 : Connecter GitHub

```
1. Cliquez sur "New +" (en haut à droite)
2. Sélectionnez "Web Service"
3. Vous verrez "Connect a repository"
```

### Étape 3 : Autoriser l'accès à votre repo

```
1. Cliquez "Connect GitHub" (si pas déjà fait)
2. Dans la popup GitHub :
   - Autorisez Render à accéder à vos repos
   - Sélectionnez "All repositories" ou juste "app-web-vercel"
3. Cliquez "Install & Authorize"
```

### Étape 4 : Sélectionner votre repository

```
1. Cherchez "app-web-vercel" dans la liste
2. Cliquez "Connect"
```

### Étape 5 : Configuration du Service

Maintenant configurez :

```
Name:           acestream-backend
Region:         Frankfurt (EU Central)
Branch:         main
Root Directory: backend          ⚠️ IMPORTANT !
Runtime:        Docker
Instance Type:  Free
```

### Étape 6 : Variables d'Environnement

Ajoutez :
```
ACESTREAM_BASE_URL = http://127.0.0.1:6878
STORAGE_DIR        = /app/storage
PORT               = 8000
PYTHON_VERSION     = 3.11
```

### Étape 7 : Créer le Service

```
Cliquez "Create Web Service"
```

**Le déploiement va commencer automatiquement !** (5-10 min)

---

## 📋 MÉTHODE 2 : Via le CLI (Plus Technique)

### Si vous voulez vraiment utiliser le CLI uniquement :

### Étape 1 : Vérifier que votre code est sur GitHub

```bash
# Vérifier l'URL de votre repo
git remote -v
```

**Devrait afficher :**
```
origin  https://github.com/amouradore/app-web-vercel.git (fetch)
origin  https://github.com/amouradore/app-web-vercel.git (push)
```

### Étape 2 : S'assurer que tout est push

```bash
# Voir le statut
git status

# S'assurer que render.yaml est bien présent
cd backend
ls render.yaml

# Si des modifications ne sont pas push
git add .
git commit -m "Add render.yaml configuration"
git push origin main
```

### Étape 3 : Déployer avec le CLI

```bash
cd backend
render deploy
```

**MAIS** : Le CLI va quand même vous demander de lier le repo via l'interface web la première fois !

---

## 🎯 MA RECOMMANDATION

### **Utilisez la Méthode 1 (Interface Web) pour la première connexion**

**Pourquoi ?**
- ✅ Plus simple
- ✅ Plus visuel
- ✅ Vous voyez exactement ce qui se passe
- ✅ Vous pouvez vérifier la configuration

**Ensuite, pour les redéploiements futurs, vous pourrez utiliser le CLI.**

---

## 📋 ÉTAPES COMPLÈTES (Interface Web)

### 1. Ouvrir Render Dashboard

```
https://dashboard.render.com
```

### 2. Créer un Web Service

```
Cliquez "New +" → "Web Service"
```

### 3. Connecter GitHub (si pas déjà fait)

```
"Connect GitHub" → Autorisez l'accès
```

### 4. Sélectionner le Repository

```
Cherchez : "app-web-vercel"
Cliquez : "Connect"
```

### 5. Configuration

```
Name:           acestream-backend
Region:         Frankfurt
Branch:         main
Root Directory: backend         ⚠️ IMPORTANT
Runtime:        Docker
Plan:           Free
```

### 6. Variables d'Environnement

```
ACESTREAM_BASE_URL = http://127.0.0.1:6878
STORAGE_DIR        = /app/storage
PORT               = 8000
PYTHON_VERSION     = 3.11
```

### 7. Créer

```
"Create Web Service"
```

### 8. Attendre le Build (5-10 min)

Le déploiement démarre automatiquement !

---

## ✅ APRÈS LE DÉPLOIEMENT

### Obtenir l'URL

Dans le dashboard Render, vous verrez :
```
https://acestream-backend-xxxx.onrender.com
```

### Tester

```bash
curl https://acestream-backend-xxxx.onrender.com/health
```

### Configurer le Frontend

```bash
cd webapp
echo "REACT_APP_API_URL=https://acestream-backend-xxxx.onrender.com" > .env
npm start
```

---

## 🔄 POUR LES PROCHAINS DÉPLOIEMENTS

### Une fois le service créé via l'interface web, vous pourrez utiliser le CLI :

```bash
# Redéployer après modifications
cd backend
render deploy

# Voir les logs
render logs -f

# Voir le statut
render services list
```

---

## 📊 COMPARAISON DES MÉTHODES

| Aspect | Interface Web | CLI |
|--------|---------------|-----|
| **Première fois** | ✅ Facile | ❌ Nécessite web d'abord |
| **Visuel** | ✅ Oui | ❌ Non |
| **Rapide** | ✅ 10 clics | 🟡 1 commande (après config) |
| **Redéploiements** | 🟡 Via web | ✅ Très rapide (CLI) |

---

## 🎯 CE QUE VOUS DEVEZ FAIRE MAINTENANT

### Option A : Interface Web (Recommandé)

```
1. Allez sur https://dashboard.render.com
2. "New +" → "Web Service"
3. Connectez votre repo GitHub "app-web-vercel"
4. Configurez comme ci-dessus
5. "Create Web Service"
6. Attendez 5-10 min
```

**→ Consultez : RENDER_ETAPES_RAPIDES.md**

### Option B : CLI (Après avoir connecté via web)

Si vous avez déjà créé le service via web :

```bash
cd backend
render deploy
```

---

## 💬 QUELLE MÉTHODE PRÉFÉREZ-VOUS ?

**Répondez :**
- **"Interface Web"** → Je vous guide pas à pas
- **"CLI"** → On connecte d'abord via web, puis CLI
- **"Les deux"** → On fait via web maintenant, CLI pour plus tard

---

**Je recommande : Utilisez l'interface web pour créer le service la première fois. C'est plus visuel et plus simple ! 🎯**

**Que voulez-vous faire ?**
