# 🚀 GUIDE RAPIDE - DÉMARRAGE DU SYSTÈME

## ✅ ÉTAT ACTUEL

**Backend:** ✅ Opérationnel (http://localhost:8000)  
**Frontend:** ⏳ En démarrage (http://localhost:4143)  
**AceStream:** ✅ Running (Port 6878)

---

## 🎬 UTILISATION (Une fois le frontend prêt)

### Étape 1: Ouvrir l'Application
```
http://localhost:4143
```

### Étape 2: Choisir une Chaîne
- Vous verrez la liste des 43 chaînes sportives
- Exemples: DAZN 1 FHD, Sky Sport, ESPN 3

### Étape 3: Lancer le Stream
1. **Cliquez** sur une chaîne
2. **Cliquez** sur le bouton vert **"Navigateur"**
3. **Attendez** 10-30 secondes (connexion P2P)
4. **La vidéo démarre !** 🎉

---

## ⏱️ TEMPS D'ATTENTE NORMAUX

| Action | Temps |
|--------|-------|
| Démarrage Backend | 5 secondes |
| Démarrage Frontend | 30-60 secondes |
| Premier Stream | 15-30 secondes |
| Streams suivants | 10-20 secondes |

---

## 🔧 RELANCER LES SERVICES

### Si vous avez fermé les fenêtres PowerShell:

**Option 1: Script automatique**
```powershell
.\tmp_rovodev_RELANCER_TOUT.ps1
```

**Option 2: Manuellement**

**Backend:**
```powershell
cd backend
.\.venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --port 8000
```

**Frontend:**
```powershell
cd webapp
npm start
```

---

## 📊 VÉRIFIER L'ÉTAT

### Backend
```powershell
curl http://localhost:8000/health
```
Devrait retourner: `{"status":"healthy"}`

### Frontend
```powershell
curl http://localhost:4143
```
Devrait retourner: code HTML de l'app React

### AceStream
```powershell
curl http://127.0.0.1:6878/webui/api/service?method=get_version
```
Devrait retourner: version 3.2.8

---

## 🐛 DÉPANNAGE RAPIDE

### Frontend ne démarre pas
```powershell
cd webapp
npm install
npm start
```

### Backend erreur
```powershell
cd backend
pip install -r requirements.txt
```

### AceStream ne répond pas
- Fermer complètement AceStream
- Relancer ace_engine.exe

---

## 📝 FICHIERS IMPORTANTS

### Documentation Complète
- **tmp_rovodev_INSTRUCTIONS_FINALES.md** - Guide de test
- **tmp_rovodev_STATUS.md** - Statut actuel
- **LISEZ_MOI_TESTS_REUSSIS.md** - Résumé complet

### Scripts Utiles
- **tmp_rovodev_RELANCER_TOUT.ps1** - Relance tout
- **tmp_rovodev_test_acestream_direct.ps1** - Test AceStream

---

## ✅ CHECKLIST AVANT DE TESTER

- [ ] Backend accessible (http://localhost:8000/health)
- [ ] Frontend accessible (http://localhost:4143)
- [ ] AceStream Engine running (port 6878)
- [ ] 2 fenêtres PowerShell ouvertes (backend + frontend)

---

## 🎯 CE QUI DEVRAIT SE PASSER

### Quand vous testez un stream:

1. **Clic "Navigateur"** → Lecteur s'affiche en noir
2. **Message:** "Préparation du flux vidéo..."
3. **Message:** "Attente des segments vidéo..."
4. **Message:** "Conversion en cours sur le serveur..."
5. **Après 10-30s:** 🎬 **VIDÉO DÉMARRE !**

### Pendant le streaming:
- Contrôles: Play, Pause, Volume
- Barre de progression
- Plein écran possible
- **Aucune installation AceStream côté utilisateur !**

---

## 🚀 DÉPLOIEMENT EN PRODUCTION

### Une fois validé localement:

**Option 1: Render.com (Recommandé)**
1. Push sur GitHub
2. Créer service Web sur Render.com
3. Sélectionner dossier `backend`
4. Type: Docker
5. Déployer !

**Option 2: Railway.app**
Similar à Render, utilise `backend/railway.json`

**Le code est maintenant compatible Windows ET Linux !**

---

## 📞 BESOIN D'AIDE ?

### Si un stream ne démarre pas:

1. **Vérifier les logs backend** (fenêtre PowerShell)
2. **Vérifier console navigateur** (F12)
3. **Tester AceStream direct:**
   ```powershell
   Start-Process "http://127.0.0.1:6878/webui/player/HASH_ICI"
   ```
4. **Essayer une autre chaîne** (certains flux peuvent être hors ligne)

---

**🎉 Le système est prêt ! Attendez que le frontend finisse de compiler et testez ! 🎉**

**⏳ Vous verrez "Compiled successfully!" dans la fenêtre PowerShell du frontend quand c'est prêt.**
