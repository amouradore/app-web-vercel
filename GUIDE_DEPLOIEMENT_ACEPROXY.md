# Guide de Déploiement AceProxy sur Railway.app

## Prérequis
- Compte Railway.app (gratuit)
- GitHub account (pour connecter Railway)

## Étape 1 : Déployer AceProxy sur Railway

### 1.1 Créer un nouveau projet
1. Allez sur [Railway.app](https://railway.app/)
2. Cliquez sur **"New Project"**
3. Sélectionnez **"Deploy from Docker Image"**

### 1.2 Configurer l'image Docker

**⚠️ IMPORTANT - Images Docker Alternatives**

L'image `ikatson/docker-acestream-proxy` n'est plus accessible. Utilisez l'une de ces alternatives :

**Option 1 (Recommandée) :** `magnetikonline/acestream-server`
```
magnetikonline/acestream-server
```

**Option 2 :** `blaiseludvig/acestream-server`
```
blaiseludvig/acestream-server
```

**Configuration :**
- **Port** : `6878` (pour magnetikonline)
- **Variables d'environnement** : Aucune requise

### 1.3 Déployer
1. Cliquez sur **"Deploy"**
2. Attendez que le service démarre (2-3 minutes)
3. Railway va générer une URL publique

### 1.4 Récupérer l'URL du service
- Dans les paramètres du service, sous **"Settings"** → **"Domains"**
- L'URL sera du type : `https://your-service.railway.app`
- **Notez cette URL**, vous en aurez besoin pour le backend

## Étape 2 : Tester AceProxy

### Test avec VLC
1. Ouvrez VLC
2. Allez dans **"Media"** → **"Open Network Stream"**
3. Entrez l'URL : `https://your-service.railway.app/pid/HASH/stream.mp4`
   - Remplacez `HASH` par un hash AceStream valide (40 caractères)
   - Exemple : `eb6ffec065b26259ad3d1811e0bbb0a5332ed276`
4. Cliquez sur **"Play"**

Si le flux démarre, AceProxy fonctionne ! ✅

## Étape 3 : Configurer le Backend

### 3.1 Variable d'environnement
Ajoutez cette variable sur Render (backend) :
```
ACEPROXY_URL=https://your-service.railway.app
```

### 3.2 Code backend modifié
Le fichier `backend/app/main.py` sera automatiquement mis à jour pour utiliser cette URL.

## Étape 4 : Redéployer

1. Les modifications du backend seront poussées sur GitHub
2. Render redéploiera automatiquement
3. Testez l'application web

## Dépannage

### Le flux ne démarre pas
- Vérifiez que le hash AceStream est valide
- Attendez 10-20 secondes pour le buffering
- Vérifiez les logs Railway pour les erreurs

### Railway.app limite gratuite
- **500 heures/mois** d'exécution gratuite
- Largement suffisant pour tester et usage personnel
- Le service s'arrête après 5 min d'inactivité (redémarre automatiquement)

## Prochaines Étapes
Une fois AceProxy déployé et testé, passez à la configuration du backend.
