# Guide d'utilisation du CLI Render

## ✅ Installation réussie !

Vous avez installé le CLI Render avec succès ! Voici comment l'utiliser.

## 🔐 Première étape : Authentification

Avant toute chose, vous devez vous connecter à votre compte Render :

```bash
render login
```

Cette commande va :
1. Ouvrir votre navigateur
2. Vous demander de vous connecter à Render
3. Générer un token CLI
4. Sauvegarder le token localement

## 📋 Commandes principales du CLI Render

### 1. Aide générale
```bash
render --help
```

### 2. Voir toutes les commandes disponibles
```bash
render
```

### 3. Gestion des services

#### Lister vos services
```bash
render services list
```

#### Déployer un service
```bash
render services deploy
```

#### Redémarrer un service
```bash
render services restart
```

#### Voir les détails d'un service
```bash
render services get <service-id>
```

### 4. Gestion des déploiements

#### Créer un nouveau déploiement
```bash
render deploy
```

#### Lister les déploiements
```bash
render deploys list
```

### 5. Logs en temps réel

#### Voir les logs d'un service
```bash
render logs
```

#### Filtrer les logs
```bash
render logs --filter "error"
```

### 6. Gestion des bases de données

#### Ouvrir une session psql
```bash
render psql
```

### 7. Gestion des workspaces

#### Lister les workspaces
```bash
render workspaces list
```

#### Changer de workspace
```bash
render workspace set
```

### 8. Jobs ponctuels

#### Exécuter un job ponctuel
```bash
render jobs run
```

## 🚀 Workflow typique de déploiement

### Déploiement initial

1. **Connectez-vous** :
   ```bash
   render login
   ```

2. **Sélectionnez votre workspace** :
   ```bash
   render workspace set
   ```

3. **Créez un nouveau service** (via l'interface web d'abord)

4. **Déployez depuis le CLI** :
   ```bash
   render deploy
   ```

### Déploiements suivants

```bash
# Simplement pousser votre code et déclencher un déploiement
git push origin main
render deploy
```

## 🔍 Mode non-interactif (pour CI/CD)

Pour utiliser le CLI dans des scripts automatisés :

### 1. Créez une API key sur Render.com

1. Allez sur https://dashboard.render.com/
2. Cliquez sur votre profil → Account Settings
3. Allez dans "API Keys"
4. Créez une nouvelle clé

### 2. Définissez la variable d'environnement

```bash
export RENDER_API_KEY="votre-api-key"
```

### 3. Utilisez les commandes avec des flags

```bash
# Déployer un service spécifique
render services deploy --service-id srv-xxxxx

# Voir les logs d'un service spécifique
render logs --service-id srv-xxxxx
```

## 📚 Exemples pratiques

### Exemple 1 : Déployer après un push Git

```bash
#!/bin/bash
# deploy.sh

# Pousser le code
git add .
git commit -m "Update application"
git push origin main

# Déclencher le déploiement
render deploy
```

### Exemple 2 : Surveiller les logs en continu

```bash
# Voir les logs en temps réel
render logs --tail
```

### Exemple 3 : Redémarrer un service

```bash
# Redémarrer le service
render services restart

# Vérifier les logs après redémarrage
render logs --tail
```

## ⚙️ Configuration locale

Le CLI Render stocke sa configuration dans :
- **Linux/WSL** : `~/.config/render/config.yaml`
- **macOS** : `~/Library/Application Support/render/config.yaml`
- **Windows** : `%APPDATA%\render\config.yaml`

## 🆘 Dépannage

### Erreur : "command not found"

Si `render` n'est pas reconnu, vérifiez :

1. **Le CLI est-il installé ?**
   ```bash
   which render
   ```

2. **Ajoutez-le au PATH** (si nécessaire) :
   ```bash
   # Ajoutez cette ligne à votre ~/.bashrc ou ~/.zshrc
   export PATH="$PATH:/chemin/vers/render"
   ```

### Erreur : "unauthorized"

Reconnectez-vous :
```bash
render login
```

### Voir la version du CLI

```bash
render --version
```

## 🔗 Ressources utiles

- **Documentation officielle** : https://render.com/docs/cli
- **GitHub du CLI** : https://github.com/render-oss/cli
- **Dashboard Render** : https://dashboard.render.com/
- **API Render** : https://api-docs.render.com/

## 💡 Astuces

1. **Utilisez l'autocomplétion** : Le CLI supporte l'autocomplétion dans la plupart des shells

2. **Mode interactif** : La plupart des commandes peuvent être exécutées sans arguments pour un mode interactif

3. **Aide contextuelle** : Ajoutez `--help` à n'importe quelle commande pour voir les options disponibles
   ```bash
   render services --help
   render deploy --help
   ```

4. **Format de sortie** : Certaines commandes supportent différents formats de sortie
   ```bash
   render services list --output json
   ```

## 🎯 Prochaines étapes

1. ✅ Connectez-vous : `render login`
2. ✅ Explorez vos services : `render services list`
3. ✅ Déployez votre application : `render deploy`
4. ✅ Surveillez les logs : `render logs --tail`

---

**Note** : Le CLI Render est très récent (décembre 2024), donc de nouvelles fonctionnalités sont ajoutées régulièrement. Consultez la documentation officielle pour les dernières mises à jour.
