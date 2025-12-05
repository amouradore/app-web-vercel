# 🚀 DÉPLOIEMENT RENDER AVEC CLI (Plus Rapide!)

## 🎯 Avantages du CLI

- ✅ Plus rapide que l'interface web
- ✅ Configuration automatique
- ✅ Reproductible
- ✅ Une seule commande pour tout déployer

**Temps total : 5 minutes au lieu de 10 !**

---

## 📋 PRÉREQUIS

1. Node.js installé sur votre PC
2. Compte GitHub (déjà fait)
3. Compte Render (on va le créer)

---

## 🚀 ÉTAPE 1 : Créer un Compte Render (2 min)

### Via Navigateur (une seule fois)

```
1. Allez sur https://render.com
2. "Get Started" → "Continue with GitHub"
3. Autorisez l'accès
```

✅ **Aucune carte requise**

---

## 🔑 ÉTAPE 2 : Obtenir la Clé API Render (2 min)

### 1. Dans Render Dashboard

```
1. Cliquez sur votre avatar (en haut à droite)
2. Account Settings
3. API Keys (dans le menu gauche)
4. Create API Key
5. Nom : "CLI Deployment"
6. Copiez la clé (elle commence par "rnd_...")
```

⚠️ **Important : Copiez cette clé, elle ne sera affichée qu'une fois !**

---

## 💻 ÉTAPE 3 : Installer Render CLI (1 min)

### Option A : Via npm (Recommandé)

```bash
npm install -g @render/cli
```

### Option B : Via Homebrew (Mac)

```bash
brew tap render/tools
brew install render
```

### Option C : Via Script (Linux/Mac)

```bash
curl -sL https://render.com/install.sh | bash
```

### Vérifier l'installation

```bash
render --version
```

Vous devriez voir : `render version x.x.x`

---

## 🔐 ÉTAPE 4 : Configurer le CLI (1 min)

### Se connecter avec la clé API

```bash
render config
```

Entrez votre clé API quand demandé (celle copiée à l'étape 2).

**Ou directement :**

```bash
export RENDER_API_KEY=rnd_votre_cle_ici
```

---

## 📝 ÉTAPE 5 : Vérifier render.yaml (Déjà Créé)

J'ai déjà créé le fichier `backend/render.yaml` pour vous !

Vérifiez qu'il contient :

```yaml
services:
  - type: web
    name: acestream-backend
    runtime: docker
    dockerfilePath: ./Dockerfile
    dockerContext: .
    plan: free
    region: frankfurt
    envVars:
      - key: ACESTREAM_BASE_URL
        value: http://127.0.0.1:6878
      - key: STORAGE_DIR
        value: /app/storage
      - key: PORT
        value: 8000
      - key: PYTHON_VERSION
        value: "3.11"
    healthCheckPath: /health
```

✅ **C'est déjà bon !**

---

## 🚀 ÉTAPE 6 : Déployer en 1 Commande ! (5-10 min)

### Déployer depuis le dossier backend

```bash
cd backend
render deploy
```

Le CLI va :
1. ✅ Lire `render.yaml`
2. ✅ Créer le service sur Render
3. ✅ Configurer les variables d'environnement
4. ✅ Lancer le build Docker
5. ✅ Déployer automatiquement

**Attendez 5-10 minutes pour le build.**

---

## 📊 ÉTAPE 7 : Suivre le Déploiement

### Voir les logs en temps réel

```bash
render logs -f
```

Vous verrez :
```
==> Cloning repository...
==> Building Docker image...
==> Installing dependencies...
==> Starting service...
✅ Deploy successful!
```

---

## 🌐 ÉTAPE 8 : Obtenir l'URL

### Lister vos services

```bash
render services list
```

Vous verrez :
```
NAME                  ID              TYPE    STATUS    URL
acestream-backend     srv-xxxxx       web     live      https://acestream-backend-xxxx.onrender.com
```

**Copiez l'URL !**

---

## ✅ ÉTAPE 9 : Tester le Backend

### Test rapide avec curl

```bash
curl https://acestream-backend-xxxx.onrender.com/health
```

Résultat attendu :
```json
{
  "status": "healthy",
  "service": "acestream-hls-proxy"
}
```

✅ **Si vous voyez ça, c'est bon !**

---

## 🎨 ÉTAPE 10 : Configurer le Frontend

### Créer le fichier .env

```bash
cd ../webapp
echo "REACT_APP_API_URL=https://acestream-backend-xxxx.onrender.com" > .env
```

⚠️ **Remplacez `xxxx` par votre vraie URL !**

### Tester en local

```bash
npm start
```

Ouvrez http://localhost:3000 et testez !

---

## 📋 RÉCAPITULATIF DES COMMANDES

### Installation et Configuration

```bash
# 1. Installer le CLI
npm install -g @render/cli

# 2. Configurer avec votre clé API
render config

# 3. Déployer
cd backend
render deploy

# 4. Suivre les logs
render logs -f

# 5. Lister les services
render services list

# 6. Obtenir les infos d'un service
render services get acestream-backend
```

---

## 🛠️ COMMANDES UTILES

### Voir les logs en temps réel

```bash
render logs -f
```

### Redéployer après modifications

```bash
cd backend
render deploy
```

### Voir l'état du service

```bash
render services get acestream-backend
```

### Supprimer le service

```bash
render services delete acestream-backend
```

### Mettre à jour une variable d'environnement

```bash
render env set ACESTREAM_BASE_URL=http://127.0.0.1:6878 -s acestream-backend
```

---

## ⚠️ RÉSOLUTION DE PROBLÈMES

### Erreur : "Authentication failed"

**Solution :**
```bash
render config
# Entrez à nouveau votre clé API
```

### Erreur : "render.yaml not found"

**Solution :**
```bash
# Assurez-vous d'être dans le dossier backend
cd backend
ls render.yaml  # Vérifier que le fichier existe
```

### Le build échoue

**Solution :**
```bash
# Vérifier les logs
render logs -f

# Vérifier que Dockerfile existe
ls Dockerfile

# Vérifier le contenu de render.yaml
cat render.yaml
```

### Service ne démarre pas

**Solution :**
```bash
# Vérifier le statut
render services get acestream-backend

# Vérifier les logs
render logs -f

# Redéployer
render deploy
```

---

## 🎯 AVANTAGES DU CLI vs Interface Web

| Aspect | CLI | Interface Web |
|--------|-----|---------------|
| **Vitesse** | 🟢 5 min | 🟡 10 min |
| **Automatisation** | 🟢 1 commande | 🟡 Plusieurs clics |
| **Reproductible** | 🟢 Oui | 🟡 Non |
| **Logs** | 🟢 Temps réel dans terminal | 🟡 Via navigateur |
| **Multi-services** | 🟢 Facile | 🟡 Répétitif |

---

## 📚 DOCUMENTATION RENDER CLI

### Commandes principales

```bash
# Aide générale
render help

# Aide pour une commande
render deploy --help

# Version
render --version

# Configuration
render config

# Services
render services list
render services get <service-name>
render services delete <service-name>

# Déploiement
render deploy
render deploy --service <service-name>

# Logs
render logs
render logs -f  # Follow (temps réel)
render logs --tail 100  # Dernières 100 lignes

# Variables d'environnement
render env list -s <service-name>
render env set KEY=value -s <service-name>
render env unset KEY -s <service-name>
```

---

## 🚀 SCRIPT AUTOMATIQUE COMPLET

### Créer un script de déploiement

Créez `deploy_render.sh` :

```bash
#!/bin/bash

echo "🚀 Déploiement sur Render..."

# Vérifier que le CLI est installé
if ! command -v render &> /dev/null; then
    echo "❌ Render CLI n'est pas installé"
    echo "Installez-le avec : npm install -g @render/cli"
    exit 1
fi

# Aller dans le dossier backend
cd backend || exit 1

# Déployer
echo "📦 Déploiement en cours..."
render deploy

# Attendre un peu
sleep 5

# Obtenir l'URL
echo ""
echo "🌐 Obtention de l'URL..."
render services list

echo ""
echo "✅ Déploiement terminé !"
echo "📝 Copiez l'URL ci-dessus et configurez le frontend"
echo ""
echo "Configuration du frontend :"
echo "cd ../webapp"
echo "echo 'REACT_APP_API_URL=https://votre-url.onrender.com' > .env"
```

### Rendre le script exécutable

```bash
chmod +x deploy_render.sh
```

### Exécuter

```bash
./deploy_render.sh
```

---

## 💡 ASTUCE : Déploiement Automatique sur Commit

### Activer le déploiement auto dans render.yaml

```yaml
services:
  - type: web
    name: acestream-backend
    runtime: docker
    dockerfilePath: ./Dockerfile
    dockerContext: .
    plan: free
    region: frankfurt
    autoDeploy: true  # ← Ajouter cette ligne
    branch: main      # ← Branche à surveiller
    envVars:
      - key: ACESTREAM_BASE_URL
        value: http://127.0.0.1:6878
      # ... reste de la config
```

Maintenant, chaque push sur `main` redéploie automatiquement !

---

## 📊 CHECKLIST CLI

- [ ] Compte Render créé via navigateur
- [ ] Clé API créée et copiée
- [ ] Render CLI installé (`render --version`)
- [ ] CLI configuré avec la clé API (`render config`)
- [ ] Dans le dossier `backend`
- [ ] Fichier `render.yaml` vérifié
- [ ] Commande `render deploy` exécutée
- [ ] Build terminé (5-10 min)
- [ ] URL du service obtenue (`render services list`)
- [ ] Backend testé (`curl .../health`)
- [ ] Frontend configuré (`.env` avec l'URL)
- [ ] Application testée en local

---

## 🎉 RÉSULTAT FINAL

Avec le CLI, vous avez :
- ✅ Déploiement en **5 minutes** au lieu de 10
- ✅ Une seule commande : `render deploy`
- ✅ Logs en temps réel dans le terminal
- ✅ Configuration reproductible (render.yaml)
- ✅ Redéploiement facile après modifications

**Total : 0€ - Aucune carte requise**

---

## 📞 PRÊT À COMMENCER ?

**Commencez par :**

1. Créer votre compte sur https://render.com (GitHub)
2. Obtenir votre clé API
3. Installer le CLI : `npm install -g @render/cli`
4. Configurer : `render config`
5. Déployer : `cd backend && render deploy`

**Dites-moi quand vous êtes prêt ou si vous avez besoin d'aide ! 🚀**
