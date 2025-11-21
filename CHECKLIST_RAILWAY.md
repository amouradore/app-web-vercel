# ✅ Checklist Railway - Déploiement Simplifié

## 📋 SUIVEZ VOTRE PROGRESSION

Cochez au fur et à mesure! ✓

---

## 🎯 PHASE 1: PRÉPARATION (5 minutes)

### Étape 1.1: Vérifier les prérequis
- [ ] Compte GitHub actif
- [ ] Repository `app-web-vercel` accessible
- [ ] Git installé localement

### Étape 1.2: Préparer les playlists M3U
- [ ] Fichiers `.m3u` identifiés
- [ ] Commande exécutée:
  ```bash
  cp *.m3u backend/
  ```
- [ ] Vérification:
  ```bash
  ls backend/*.m3u
  ```
- [ ] Push vers GitHub:
  ```bash
  git add backend/*.m3u
  git commit -m "Add M3U playlists for Railway"
  git push
  ```

✅ **Phase 1 terminée!**

---

## 🚀 PHASE 2: DÉPLOIEMENT RAILWAY (10 minutes)

### Étape 2.1: Créer le compte
- [ ] Aller sur https://railway.app
- [ ] Cliquer "Login"
- [ ] Choisir "Login with GitHub"
- [ ] Autoriser Railway
- [ ] Dashboard visible

### Étape 2.2: Créer le projet
- [ ] Cliquer "New Project"
- [ ] Sélectionner "Deploy from GitHub repo"
- [ ] Repository connecté

### Étape 2.3: Déploiement automatique
- [ ] Repository `app-web-vercel` sélectionné
- [ ] Déploiement lancé automatiquement
- [ ] Build en cours (logs visibles)

### Étape 2.4: Configurer Root Directory
- [ ] Service créé visible dans le projet
- [ ] Cliquer sur le service
- [ ] Onglet "Settings" ouvert
- [ ] Section "Build" trouvée
- [ ] **Root Directory:** `backend` ⚠️
- [ ] Sauvegardé (redéploiement automatique)

### Étape 2.5: Variables d'environnement
- [ ] Onglet "Variables" ouvert
- [ ] Variable 1: `ACESTREAM_BASE_URL` = `http://127.0.0.1:6878`
- [ ] Variable 2: `STORAGE_DIR` = `/app/storage`
- [ ] Variable 3: `PORT` = `${{PORT}}` ⚠️
- [ ] **Total: 3 variables** confirmées

### Étape 2.6: Attendre le déploiement
- [ ] Message "Building..." visible
- [ ] Build terminé (vert)
- [ ] Status: "Active" ou "Running"
- [ ] Déploiement réussi! 🟢

### Étape 2.7: Générer le domaine
- [ ] Onglet "Settings" → Section "Networking"
- [ ] Bouton "Generate Domain" cliqué
- [ ] **URL générée:** `https://____________.up.railway.app`
- [ ] URL copiée 📋

✅ **Phase 2 terminée!**

---

## 🧪 PHASE 3: TESTS (5 minutes)

### Étape 3.1: Test backend
- [ ] Commande exécutée:
  ```bash
  curl https://VOTRE-URL.up.railway.app/
  ```
- [ ] Réponse JSON reçue
- [ ] `"service": "AceStream → HLS Proxy"` visible

### Étape 3.2: Test playlists
- [ ] Commande exécutée:
  ```bash
  curl https://VOTRE-URL.up.railway.app/api/playlists
  ```
- [ ] Liste des playlists visible
- [ ] Vos playlists apparaissent

### Étape 3.3: Test chaînes
- [ ] Commande exécutée:
  ```bash
  curl https://VOTRE-URL.up.railway.app/api/playlists/lista/channels
  ```
- [ ] Chaînes affichées
- [ ] Hash AceStream visible

✅ **Phase 3 terminée!**

---

## 📱 PHASE 4: CONFIGURATION APP (5 minutes)

### Étape 4.1: Créer fichier .env
- [ ] Terminal ouvert dans `webapp/`
- [ ] Commande exécutée:
  ```bash
  echo "REACT_APP_API_URL=https://VOTRE-URL.up.railway.app" > .env
  ```
- [ ] URL Railway correcte (sans `/` final)
- [ ] Fichier `.env` vérifié:
  ```bash
  cat .env
  ```

### Étape 4.2: Installer dépendances
- [ ] Commande exécutée:
  ```bash
  npm install
  ```
- [ ] Installation réussie

### Étape 4.3: Tester localement
- [ ] Commande exécutée:
  ```bash
  npm start
  ```
- [ ] App ouverte sur http://localhost:3000
- [ ] Playlists visibles
- [ ] Chaînes chargées
- [ ] Vidéo se lance (test)
- [ ] **Pas de délai!** ✅ (merci Railway)

✅ **Phase 4 terminée!**

---

## 📦 PHASE 5: BUILD APK (10 minutes)

### Étape 5.1: Build production
- [ ] Commande exécutée:
  ```bash
  npm run build
  ```
- [ ] Build réussi
- [ ] Dossier `build/` créé

### Étape 5.2: Initialiser Capacitor
- [ ] Commande exécutée:
  ```bash
  npx cap init
  ```
- [ ] App name fourni
- [ ] App ID fourni (com.votredomaine.app)

### Étape 5.3: Ajouter Android
- [ ] Commande exécutée:
  ```bash
  npx cap add android
  ```
- [ ] Dossier `android/` créé

### Étape 5.4: Synchroniser
- [ ] Commande exécutée:
  ```bash
  npx cap sync
  ```
- [ ] Synchronisation réussie

### Étape 5.5: Ouvrir Android Studio
- [ ] Commande exécutée:
  ```bash
  npx cap open android
  ```
- [ ] Android Studio ouvert
- [ ] Projet chargé

### Étape 5.6: Builder APK
- [ ] Menu: Build → Build APK
- [ ] Compilation réussie
- [ ] APK trouvé dans: `android/app/build/outputs/apk/debug/`
- [ ] APK copié vers emplacement accessible

✅ **Phase 5 terminée!**

---

## 🧪 PHASE 6: TEST FINAL (5 minutes)

### Étape 6.1: Installer APK
- [ ] APK transféré sur téléphone
- [ ] Sources inconnues autorisées (si nécessaire)
- [ ] APK installé

### Étape 6.2: Tester sur mobile
- [ ] App ouverte
- [ ] Playlists affichées
- [ ] Chaîne sélectionnée
- [ ] Vidéo lancée
- [ ] Streaming fonctionne
- [ ] **Démarrage instantané** ✅ (Railway sans hibernation!)
- [ ] **Aucun message "Installer AceStream"** ✅

✅ **Phase 6 terminée!**

---

## 🎉 DÉPLOIEMENT COMPLET!

### Récapitulatif Final:

- [ ] ✅ Backend Railway déployé
- [ ] ✅ URL HTTPS fonctionnelle
- [ ] ✅ Playlists M3U accessibles
- [ ] ✅ Conversion AceStream → HLS opérationnelle
- [ ] ✅ **Pas d'hibernation** (avantage Railway!)
- [ ] ✅ Application testée localement
- [ ] ✅ APK Android créé
- [ ] ✅ APK testé sur téléphone
- [ ] ✅ Streaming **instantané** sans délai

---

## 📊 SCORE DE PROGRESSION

Comptez vos cases cochées:

- **0-15:** 🟡 Démarrage
- **16-30:** 🟠 Moitié
- **31-45:** 🟢 Presque fini
- **46+:** 🏆 **TERMINÉ!**

**Votre score:** ____ / 50+

---

## 💰 USAGE RAILWAY

### Monitorer:

```
Dashboard → Project → Usage

Heures utilisées: __ / 500h
Reste: __ heures ce mois
```

### Si vous approchez 500h:

**Option A:** Optimiser usage
**Option B:** Upgrade à $5/mois (illimité)

---

## 🎯 AVANTAGES OBTENUS

✅ **Pas d'hibernation** = Pas d'attente  
✅ **Interface moderne** Railway  
✅ **Auto-déploiement** sur push  
✅ **Logs en temps réel**  
✅ **Moins cher** si upgrade  

---

## 🚀 PROCHAINES ÉTAPES

Une fois tout coché:

- [ ] Personnaliser interface (logo, couleurs)
- [ ] Tester avec plusieurs utilisateurs
- [ ] Documenter pour utilisateurs
- [ ] Distribuer APK!
- [ ] Monitorer usage Railway

---

## 🆘 EN CAS DE PROBLÈME

### Une case non cochée?

Retournez à:
- `RAILWAY_ETAPE_PAR_ETAPE.md` - Guide détaillé
- `RAILWAY_AIDE_MEMOIRE.md` - Config rapide

### Erreur pendant déploiement?

Vérifiez:
1. Root Directory = `backend`
2. Variables (3 au total)
3. Logs Railway
4. Playlists dans `backend/`

---

## 📈 OPTIMISATIONS FUTURES

- [ ] Configurer domaine personnalisé
- [ ] Ajouter monitoring (logs)
- [ ] Optimiser qualité HLS
- [ ] Ajouter cache intelligent
- [ ] Support multi-qualité

---

## 🏆 FÉLICITATIONS!

Si toutes les cases sont cochées:

🎉 **Votre solution est 100% opérationnelle!**

**Résultat:**
- Backend gratuit Railway
- Streaming sans installation AceStream
- Démarrage instantané (pas d'hibernation)
- App mobile prête à distribuer

---

**Excellent travail! Vous pouvez maintenant distribuer votre app! 🚀**

*Temps total estimé: ~40 minutes*
*Date de complétion: ___________*
