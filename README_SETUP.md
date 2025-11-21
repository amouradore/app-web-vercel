# 🎬 Application de Streaming - Guide d'Installation et Utilisation

## 🚀 Nouvelles Fonctionnalités

✨ **Lecteur vidéo intégré** - Regardez directement dans le navigateur !
✨ **Deux modes de lecture** - Navigateur ou AceStream traditionnel
✨ **Interface améliorée** - Boutons clairs et intuitifs
✨ **Gestion d'erreurs** - Messages explicites si AceStream n'est pas disponible

## 📋 Prérequis

### Logiciels requis :
- Python 3.7+ 
- Node.js 14+
- npm
- AceStream Engine (pour le streaming)

### AceStream Engine :
- Télécharger depuis : https://www.acestream.org/
- Installer et démarrer l'application
- S'assurer qu'il fonctionne sur le port 6878

## 🔧 Installation

### 1. Cloner le projet
```bash
git clone https://github.com/amouradore/app-web-vercel
cd app-web-vercel
```

### 2. Installer les dépendances Python
```bash
pip install -r requirements.txt
```

### 3. Installer les dépendances React
```bash
cd webapp
npm install
cd ..
```

## 🚀 Démarrage

### Option 1 : Script de démarrage automatique (Recommandé)
```bash
python start_app.py
```

### Option 2 : Démarrage manuel

#### Terminal 1 - Serveur Proxy :
```bash
python proxy_server.py
```

#### Terminal 2 - Build React (optionnel) :
```bash
cd webapp
npm run build
cd ..
```

L'application sera accessible sur : **http://localhost:8000**

## 🎮 Utilisation

### Modes de lecture :

1. **🌐 Navigateur** : 
   - Lecture directe dans le navigateur
   - Nécessite AceStream Engine en cours d'exécution
   - Lecteur vidéo intégré avec contrôles

2. **🚀 AceStream** :
   - Lance l'application AceStream traditionnelle
   - Fonctionne même sans le serveur proxy
   - Interface AceStream native

### Navigation :

- **Événements à venir** : Matches de sport en direct
- **LIVE TV** : Chaînes TV groupées par catégorie
- Cliquez sur un groupe TV pour voir les chaînes individuelles

## 🔍 Fonctionnalités Techniques

### Serveur Proxy Flask :
- Routes API pour vérifier la disponibilité des streams
- Streaming proxy pour les contenus AceStream
- CORS configuré pour React
- Gestion d'erreurs appropriée

### Application React :
- Lecteur vidéo React Player intégré
- Interface responsive Bootstrap
- Gestion d'états pour le streaming
- Messages d'erreur informatifs

### API Endpoints :
- `GET /api/stream/info/<stream_id>` - Vérifier la disponibilité
- `GET /api/stream/play/<stream_id>` - Stream proxy
- `GET /` - Application React

## 🐛 Dépannage

### "Stream non disponible" :
1. Vérifier qu'AceStream Engine est installé
2. S'assurer qu'AceStream fonctionne (icône dans la barre des tâches)
3. Tester l'URL : http://127.0.0.1:6878/ace/getstream?id=TEST

### Erreurs de CORS :
- Le serveur proxy inclut les headers CORS appropriés
- Utiliser http://localhost:8000 au lieu de 127.0.0.1

### Build React échoue :
- Vérifier que Node.js et npm sont installés
- Supprimer node_modules et reinstaller : `rm -rf node_modules && npm install`

## 📱 Responsive Design

L'application est optimisée pour :
- Desktop (large screen)
- Tablettes 
- Smartphones
- Lecteur vidéo adaptatif

## 🔒 Sécurité

- CORS configuré pour les domaines autorisés
- Validation des IDs de stream
- Gestion sécurisée des erreurs
- Pas de stockage de données sensibles

## 🤝 Contribution

Pour contribuer au projet :
1. Fork le repository
2. Créer une branche feature
3. Commit les changements
4. Push et créer une Pull Request

---

**Note** : Cette application nécessite AceStream Engine pour fonctionner. Le lecteur web est une interface pour AceStream, pas un remplacement complet.