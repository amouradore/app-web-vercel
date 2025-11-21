# 🚀 GUIDE RAPIDE - Démarrage en 5 Minutes

## ✅ CE QUI A ÉTÉ FAIT

Votre projet a été **complètement transformé**:

### Avant:
❌ L'utilisateur devait installer AceStream sur son téléphone  
❌ Configuration compliquée  
❌ Dépendances lourdes  

### Maintenant:
✅ **AUCUNE installation AceStream** requise côté utilisateur  
✅ Backend cloud gratuit convertit AceStream → HLS  
✅ Lecture native comme YouTube  
✅ Vos playlists M3U fonctionnent directement  

---

## 🎯 DÉPLOIEMENT EN 3 ÉTAPES

### **Étape 1: Déployer le Backend (5 min)**

#### Option Facile: Railway.app

1. **Aller sur [railway.app](https://railway.app)** et créer un compte

2. **Cliquer "New Project" → "Deploy from GitHub repo"**

3. **Sélectionner votre repository**

4. **Railway va détecter automatiquement le Dockerfile**

5. **Ajouter ces variables d'environnement:**
   ```
   ACESTREAM_BASE_URL=http://127.0.0.1:6878
   STORAGE_DIR=/app/storage
   ```

6. **Attendre 3-5 min** ⏳

7. **Copier l'URL:** `https://votre-app.railway.app`

✅ **Votre backend est en ligne!**

---

### **Étape 2: Configurer l'App (2 min)**

1. **Créer le fichier `.env` dans `webapp/`:**
   ```bash
   cd webapp
   echo "REACT_APP_API_URL=https://votre-app.railway.app" > .env
   ```

2. **Installer et démarrer:**
   ```bash
   npm install
   npm start
   ```

3. **Ouvrir http://localhost:3000**

✅ **Vous pouvez maintenant tester l'app!**

---

### **Étape 3: Créer l'APK Android (5 min)**

1. **Build de production:**
   ```bash
   npm run build
   ```

2. **Initialiser Capacitor:**
   ```bash
   npx cap init
   # App name: VotreNomApp
   # App ID: com.votredomaine.app
   ```

3. **Ajouter Android:**
   ```bash
   npx cap add android
   npx cap sync
   ```

4. **Ouvrir Android Studio:**
   ```bash
   npx cap open android
   ```

5. **Builder l'APK:**
   - Menu: **Build → Build APK**
   - APK dans: `android/app/build/outputs/apk/debug/`

✅ **Votre APK est prêt à distribuer!**

---

## 🧪 TESTER RAPIDEMENT

### Test 1: Backend
```bash
curl https://votre-app.railway.app/
```

Réponse attendue:
```json
{
  "service": "AceStream → HLS Proxy",
  "version": "2.0.0"
}
```

### Test 2: Lister les playlists
```bash
curl https://votre-app.railway.app/api/playlists
```

### Test 3: Obtenir les chaînes
```bash
curl https://votre-app.railway.app/api/playlists/lista/channels
```

### Test 4: Démarrer un stream
```bash
curl -X POST https://votre-app.railway.app/api/play \
  -H "Content-Type: application/json" \
  -d '{"hash": "VOTRE_HASH_ACESTREAM"}'
```

---

## 📱 UTILISATION FINALE

### Pour vos utilisateurs:

1. **Télécharger l'APK**
2. **Installer** (autoriser sources inconnues)
3. **Ouvrir l'app**
4. **Choisir une playlist**
5. **Regarder un match!** 🎉

**PAS D'INSTALLATION ACESTREAM REQUISE!**

---

## 💰 COÛTS

### **100% GRATUIT avec Railway:**
- 500 heures/mois
- ~16 heures/jour
- Suffisant pour usage personnel/test

### **Si vous dépassez:**
- Plan Hobby: $5/mois
- Usage illimité

---

## 📂 FICHIERS IMPORTANTS

```
backend/
├── app/main.py           ← Backend amélioré (M3U + HLS)
├── Dockerfile            ← Configuration Docker
├── Dockerfile.complete   ← Version avec AceStream intégré
├── start.sh             ← Script de démarrage
├── railway.json         ← Config Railway
└── DEPLOY_FREE.md       ← Guide détaillé

webapp/
├── src/
│   ├── services/streamApi.js      ← API mise à jour
│   ├── UnifiedStreamPlayer.js     ← Nouveau lecteur
│   └── HLSPlayer.js               ← Lecteur HLS
└── .env                           ← Configuration (à créer)

SOLUTION_COMPLETE.md      ← Documentation complète
GUIDE_RAPIDE.md          ← Ce fichier
```

---

## ⚡ COMMANDES UTILES

### Backend local (Docker):
```bash
docker-compose up
```

### App web locale:
```bash
cd webapp
npm start
```

### Build APK:
```bash
cd webapp
npm run build
npx cap sync
npx cap open android
```

### Tester l'API:
```bash
# Santé
curl http://localhost:8000/

# Playlists
curl http://localhost:8000/api/playlists

# Chaînes
curl http://localhost:8000/api/playlists/lista/channels
```

---

## 🎯 CHECKLIST DE DÉPLOIEMENT

- [ ] Backend déployé sur Railway/Render
- [ ] URL du backend copiée
- [ ] Fichier `.env` créé avec l'URL
- [ ] App web testée localement
- [ ] APK construit
- [ ] APK testé sur un téléphone
- [ ] Distribuer aux utilisateurs! 🎉

---

## 🆘 PROBLÈMES COURANTS

### ❌ "Backend not found"
**Solution:** Vérifier l'URL dans `.env`

### ❌ "AceStream error"
**Solution:** Vérifier que le hash est valide

### ❌ "Stream timeout"
**Solution:** Le flux AceStream peut être hors ligne

### ❌ "CORS error"
**Solution:** Déjà configuré, vérifier que le backend est bien déployé

---

## 📈 PROCHAINES ÉTAPES

Après avoir tout testé:

1. **Personnaliser l'interface** de l'app
2. **Ajouter votre logo**
3. **Choisir les playlists** à inclure
4. **Tester sur plusieurs téléphones**
5. **Distribuer l'APK!**

---

## 🎉 RÉSUMÉ

Vous avez maintenant:
- ✅ Backend cloud GRATUIT
- ✅ App mobile sans dépendance AceStream
- ✅ Conversion automatique AceStream → HLS
- ✅ Vos playlists M3U intégrées
- ✅ APK prêt à distribuer

**L'utilisateur installe UNIQUEMENT votre APK!**

---

## 📞 AIDE SUPPLÉMENTAIRE

Pour plus de détails, consultez:
- **`SOLUTION_COMPLETE.md`** - Documentation complète
- **`backend/DEPLOY_FREE.md`** - Guide de déploiement détaillé

**Bon déploiement! 🚀**
