# Guide de déploiement sur Render (Interface Web)

## 🎯 Pourquoi utiliser l'interface web ?

L'interface web de Render est :
- ✅ Plus simple et intuitive
- ✅ Pas de problèmes d'installation CLI
- ✅ Déploiement automatique via Git
- ✅ Configuration visuelle facile

## 📋 Prérequis

1. ✅ Compte Render (vous l'avez déjà créé lors du login CLI)
2. ✅ Dépôt Git (GitHub, GitLab, ou Bitbucket)
3. ✅ Fichier `render.yaml` (vous l'avez déjà dans `/backend`)

## 🚀 Étapes de déploiement

### Étape 1 : Préparer votre code

Votre backend a déjà un fichier `render.yaml` configuré :

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

### Étape 2 : Pousser votre code sur Git

Si ce n'est pas déjà fait :

```bash
# Dans PowerShell ou WSL
cd C:\Users\DELL\Desktop\git\app2

# Initialiser Git (si nécessaire)
git init

# Ajouter tous les fichiers
git add .

# Commit
git commit -m "Prêt pour déploiement Render"

# Ajouter le remote (remplacez par votre URL GitHub)
git remote add origin https://github.com/votre-username/votre-repo.git

# Pousser
git push -u origin main
```

### Étape 3 : Créer un service sur Render

1. **Allez sur le Dashboard Render** :
   - URL : https://dashboard.render.com/

2. **Cliquez sur "New +"** → **"Blueprint"**

3. **Connectez votre dépôt Git** :
   - Sélectionnez GitHub/GitLab/Bitbucket
   - Autorisez Render à accéder à vos dépôts
   - Sélectionnez le dépôt `app2`

4. **Configurez le Blueprint** :
   - Render détectera automatiquement votre `render.yaml`
   - Vérifiez que le chemin pointe vers `/backend/render.yaml`
   - Cliquez sur **"Apply"**

### Étape 4 : Configuration automatique

Render va :
1. ✅ Lire votre `render.yaml`
2. ✅ Créer le service `acestream-backend`
3. ✅ Configurer Docker
4. ✅ Définir les variables d'environnement
5. ✅ Démarrer le déploiement

### Étape 5 : Surveiller le déploiement

1. **Voir les logs en temps réel** :
   - Cliquez sur votre service
   - Allez dans l'onglet "Logs"

2. **Vérifier le statut** :
   - Le service devrait passer de "Building" → "Live"

3. **Obtenir l'URL** :
   - Une fois déployé, Render vous donnera une URL publique
   - Format : `https://acestream-backend.onrender.com`

## 🔄 Déploiements automatiques

Une fois configuré, chaque fois que vous poussez du code sur Git :

```bash
git add .
git commit -m "Mise à jour"
git push origin main
```

Render déploiera automatiquement les changements ! 🎉

## ⚙️ Configuration avancée (Optionnel)

### Ajouter des variables d'environnement

1. Allez dans votre service sur le Dashboard
2. Cliquez sur "Environment"
3. Ajoutez vos variables :
   - `ACESTREAM_BASE_URL`
   - `STORAGE_DIR`
   - `PORT`
   - etc.

### Changer le plan

1. Allez dans "Settings"
2. Sous "Instance Type", changez de `free` à un plan payant si nécessaire

### Configurer un domaine personnalisé

1. Allez dans "Settings"
2. Sous "Custom Domain", ajoutez votre domaine

## 🆘 Dépannage

### Le build échoue

- Vérifiez les logs dans l'onglet "Logs"
- Assurez-vous que votre `Dockerfile` est correct
- Vérifiez que toutes les dépendances sont dans `requirements.txt`

### Le service ne démarre pas

- Vérifiez le `healthCheckPath` dans `render.yaml`
- Assurez-vous que votre application écoute sur le port défini par `$PORT`
- Vérifiez les logs pour les erreurs

### Variables d'environnement manquantes

- Ajoutez-les manuellement dans le Dashboard
- Ou mettez-les à jour dans `render.yaml`

## 📚 Ressources

- **Dashboard** : https://dashboard.render.com/
- **Documentation** : https://render.com/docs
- **Blueprints** : https://render.com/docs/infrastructure-as-code

## 🎯 Alternative : Déploiement manuel (sans Git)

Si vous ne voulez pas utiliser Git :

1. **Créez un service manuellement** :
   - Cliquez sur "New +" → "Web Service"
   - Sélectionnez "Docker"
   
2. **Uploadez votre code** :
   - Utilisez l'option "Deploy from a Git repository"
   - Ou utilisez l'API Render pour uploader directement

## ✅ Checklist de déploiement

- [ ] Code poussé sur Git
- [ ] Compte Render créé
- [ ] Dépôt connecté à Render
- [ ] Blueprint appliqué
- [ ] Service en cours de build
- [ ] Service déployé et "Live"
- [ ] URL publique obtenue
- [ ] Application testée

---

**Note** : L'interface web est la méthode recommandée par Render pour la plupart des utilisateurs. Le CLI est principalement utile pour l'automatisation et les scripts CI/CD.
