# 📋 Instructions de Migration

## 🎯 Objectif

Migrer de l'ancienne application (qui nécessite AceStream installé) vers la nouvelle solution (streaming HLS sans installation).

---

## 🔄 Deux Options de Migration

### **Option 1: Migration Progressive** (Recommandée)

Gardez l'ancienne version et testez la nouvelle en parallèle.

#### Dans `webapp/src/index.js`, modifiez:

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';           // Ancienne version
import NewApp from './NewApp';     // Nouvelle version
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));

// Basculer entre ancienne et nouvelle version
const USE_NEW_APP = true; // Mettre à true pour tester la nouvelle version

root.render(
  <React.StrictMode>
    {USE_NEW_APP ? <NewApp /> : <App />}
  </React.StrictMode>
);

reportWebVitals();
```

**Avantages:**
- ✅ Testez la nouvelle version facilement
- ✅ Revenez à l'ancienne si besoin
- ✅ Pas de risque de casser l'existant

---

### **Option 2: Remplacement Direct**

Remplacez complètement l'ancienne version.

#### Dans `webapp/src/App.js`, remplacez tout le contenu par:

```javascript
import React from 'react';
import ChannelList from './ChannelList';
import './App.css';

/**
 * App principale - Streaming IPTV sans installation AceStream
 */
function App() {
  return (
    <div className="App">
      <ChannelList />
    </div>
  );
}

export default App;
```

**Avantages:**
- ✅ Solution propre et simple
- ✅ Moins de fichiers à maintenir

**Inconvénients:**
- ⚠️ Perte de l'ancienne fonctionnalité

---

## 🚀 Étapes de Migration

### Étape 1: Vérifier les dépendances

```bash
cd webapp
npm install
```

### Étape 2: Configurer le backend

Créer le fichier `.env`:

```bash
echo "REACT_APP_API_URL=https://votre-backend.railway.app" > .env
```

Remplacez `https://votre-backend.railway.app` par l'URL réelle de votre backend déployé.

### Étape 3: Tester localement

#### A. Démarrer le backend (dans un terminal):

```bash
# Option 1: Avec Docker
docker-compose up

# Option 2: Sans Docker
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

#### B. Démarrer le frontend (dans un autre terminal):

```bash
cd webapp
npm start
```

#### C. Ouvrir http://localhost:3000

### Étape 4: Vérifier le fonctionnement

1. **Vérifier que les playlists s'affichent**
2. **Sélectionner une playlist**
3. **Choisir une chaîne**
4. **Cliquer sur "Regarder"**
5. **Vérifier que la vidéo se lance**

---

## 📱 Build pour Production

### Étape 1: Build de l'app

```bash
cd webapp
npm run build
```

### Étape 2: Préparer pour Capacitor (APK Android)

```bash
# Si Capacitor n'est pas déjà configuré
npx cap init

# Nom de l'app: VotreNomApp
# App ID: com.votredomaine.app

# Ajouter Android
npx cap add android

# Synchroniser
npx cap sync

# Ouvrir dans Android Studio
npx cap open android
```

### Étape 3: Builder l'APK

Dans Android Studio:
1. **Build → Build Bundle(s) / APK(s) → Build APK(s)**
2. Attendre la compilation
3. APK disponible dans: `android/app/build/outputs/apk/debug/app-debug.apk`

---

## 🔧 Configuration Avancée

### Personnaliser l'interface

Modifier `webapp/src/App.css` pour:
- Changer les couleurs
- Modifier le layout
- Personnaliser les boutons

### Ajouter votre logo

1. Remplacer `webapp/public/logo192.png` et `webapp/public/logo512.png`
2. Mettre à jour `webapp/public/manifest.json`:

```json
{
  "short_name": "Votre App",
  "name": "Votre Application IPTV",
  "icons": [
    {
      "src": "logo192.png",
      "type": "image/png",
      "sizes": "192x192"
    },
    {
      "src": "logo512.png",
      "type": "image/png",
      "sizes": "512x512"
    }
  ]
}
```

### Configurer les playlists

Les playlists sont automatiquement détectées depuis le backend.

Pour ajouter/modifier des playlists:
1. Placer vos fichiers `.m3u` dans `backend/`
2. Redéployer le backend
3. Les nouvelles playlists apparaîtront automatiquement

---

## 🐛 Troubleshooting

### Problème: "Backend not available"

**Solution:**
1. Vérifier que le backend est déployé
2. Vérifier l'URL dans `.env`
3. Tester avec: `curl https://votre-backend.railway.app/`

### Problème: "No playlists found"

**Solution:**
1. Vérifier que les fichiers `.m3u` sont dans `backend/`
2. Vérifier les logs du backend
3. Tester l'API: `curl https://votre-backend.railway.app/api/playlists`

### Problème: "Stream fails to start"

**Solution:**
1. Vérifier que le hash AceStream est valide
2. Vérifier les logs du backend
3. Essayer un autre flux

### Problème: CORS errors

**Solution:**
Le backend est déjà configuré pour accepter toutes les origines. Si le problème persiste:
1. Vérifier que le backend est bien accessible
2. Vérifier la console du navigateur pour l'erreur exacte

---

## 📊 Comparaison Ancien vs Nouveau

| Fonctionnalité | Ancienne App | Nouvelle App |
|---------------|--------------|--------------|
| Installation AceStream | ✅ Requise | ❌ Non requise |
| Lecture dans navigateur | ❌ Non | ✅ Oui (HLS natif) |
| Compatibilité mobile | ⚠️ Limitée | ✅ Complète |
| Backend requis | ❌ Non | ✅ Oui (gratuit) |
| Qualité streaming | ⚠️ Variable | ✅ Optimisée |
| Configuration utilisateur | ⚠️ Complexe | ✅ Simple |

---

## 🎯 Prochaines Étapes

Après migration réussie:

1. ✅ Tester sur plusieurs appareils
2. ✅ Collecter les retours utilisateurs
3. ✅ Ajuster l'interface si nécessaire
4. ✅ Distribuer l'APK final

---

## 💡 Conseils

### Pour le développement:
- Utilisez l'**Option 1** (migration progressive)
- Testez les deux versions en parallèle
- Gardez l'ancienne version comme backup

### Pour la production:
- Utilisez l'**Option 2** (remplacement direct)
- Distribuez uniquement la nouvelle version
- Simplifiez le code en supprimant l'ancien

---

## 📞 Support

Si vous rencontrez des problèmes:

1. Consultez `SOLUTION_COMPLETE.md`
2. Vérifiez `GUIDE_RAPIDE.md`
3. Testez l'API manuellement avec curl
4. Vérifiez les logs du backend

**Bonne migration! 🚀**
