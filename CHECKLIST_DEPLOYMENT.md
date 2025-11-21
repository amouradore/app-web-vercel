# ✅ Checklist de Déploiement Render.com

## 📋 SUIVEZ VOTRE PROGRESSION

Cochez les cases au fur et à mesure que vous avancez!

---

## 🎯 PHASE 1: PRÉPARATION (5 minutes)

### Étape 1.1: Vérifier les prérequis
- [ ] Compte GitHub créé
- [ ] Repository `app-web-vercel` accessible
- [ ] Git installé sur votre ordinateur

### Étape 1.2: Préparer les playlists
- [ ] Fichiers `.m3u` identifiés (lista.m3u, canales_acestream.m3u, etc.)
- [ ] Playlists copiées dans le dossier `backend/`
- [ ] Commande exécutée:
  ```bash
  cp *.m3u backend/
  git add backend/*.m3u
  git commit -m "Add M3U playlists"
  git push
  ```
- [ ] Push vers GitHub réussi

✅ **Phase 1 terminée!**

---

## 🚀 PHASE 2: DÉPLOIEMENT RENDER (15 minutes)

### Étape 2.1: Créer le compte Render
- [ ] Aller sur https://render.com
- [ ] Cliquer "Get Started for Free"
- [ ] S'inscrire avec GitHub
- [ ] Email vérifié

### Étape 2.2: Créer le Web Service
- [ ] Cliquer "New +" dans Render
- [ ] Sélectionner "Web Service"
- [ ] Repository connecté

### Étape 2.3: Configuration du service
- [ ] **Name:** `acestream-backend` (ou votre choix)
- [ ] **Region:** Frankfurt ou Oregon sélectionné
- [ ] **Branch:** `main` sélectionné
- [ ] **Root Directory:** `backend` ⚠️ **TRÈS IMPORTANT!**
- [ ] **Runtime:** Docker détecté
- [ ] **Instance Type:** Free sélectionné

### Étape 2.4: Variables d'environnement
- [ ] Variable 1 ajoutée: `ACESTREAM_BASE_URL` = `http://127.0.0.1:6878`
- [ ] Variable 2 ajoutée: `STORAGE_DIR` = `/app/storage`
- [ ] Variable 3 ajoutée: `PORT` = `10000`
- [ ] **3 variables au total** confirmées

### Étape 2.5: Lancer le déploiement
- [ ] Bouton "Create Web Service" cliqué
- [ ] Logs de build visibles
- [ ] Message "Your service is live!" affiché
- [ ] **URL du backend copiée:** `https://_________________.onrender.com`

✅ **Phase 2 terminée!**

---

## 🧪 PHASE 3: TESTS (5 minutes)

### Étape 3.1: Tester le backend
- [ ] Commande exécutée:
  ```bash
  curl https://VOTRE-URL.onrender.com/
  ```
- [ ] Réponse JSON reçue avec `"service": "AceStream → HLS Proxy"`

### Étape 3.2: Tester les playlists
- [ ] Commande exécutée:
  ```bash
  curl https://VOTRE-URL.onrender.com/api/playlists
  ```
- [ ] Liste des playlists visible

### Étape 3.3: Tester les chaînes
- [ ] Commande exécutée:
  ```bash
  curl https://VOTRE-URL.onrender.com/api/playlists/lista/channels
  ```
- [ ] Chaînes affichées avec hash AceStream

✅ **Phase 3 terminée!**

---

## 📱 PHASE 4: CONFIGURATION APP (5 minutes)

### Étape 4.1: Configurer le frontend
- [ ] Commande exécutée:
  ```bash
  cd webapp
  ```
- [ ] Fichier `.env` créé avec:
  ```
  REACT_APP_API_URL=https://VOTRE-URL.onrender.com
  ```
- [ ] URL du backend vérifiée (sans `/` à la fin)

### Étape 4.2: Installer les dépendances
- [ ] Commande exécutée:
  ```bash
  npm install
  ```
- [ ] Installation réussie (sans erreurs)

### Étape 4.3: Tester l'application
- [ ] Commande exécutée:
  ```bash
  npm start
  ```
- [ ] App ouverte sur http://localhost:3000
- [ ] Playlists visibles dans l'interface
- [ ] Chaînes chargées après sélection
- [ ] Vidéo se lance (test avec une chaîne)

✅ **Phase 4 terminée!**

---

## 🎁 PHASE 5: OPTIMISATIONS (Optionnel - 5 minutes)

### Étape 5.1: Configurer UptimeRobot (éviter hibernation)
- [ ] Compte créé sur https://uptimerobot.com
- [ ] Monitor ajouté avec URL du backend
- [ ] Intervalle: 5 minutes
- [ ] Monitor actif

### Étape 5.2: Vérifier les logs
- [ ] Dashboard Render ouvert
- [ ] Onglet "Logs" consulté
- [ ] Aucune erreur critique visible

✅ **Phase 5 terminée!**

---

## 📦 PHASE 6: BUILD APK (10 minutes)

### Étape 6.1: Build de production
- [ ] Commande exécutée:
  ```bash
  npm run build
  ```
- [ ] Build réussi (dossier `build/` créé)

### Étape 6.2: Initialiser Capacitor
- [ ] Commande exécutée:
  ```bash
  npx cap init
  ```
- [ ] **App name** fourni
- [ ] **App ID** fourni (format: com.votredomaine.app)

### Étape 6.3: Ajouter Android
- [ ] Commande exécutée:
  ```bash
  npx cap add android
  ```
- [ ] Dossier `android/` créé

### Étape 6.4: Synchroniser
- [ ] Commande exécutée:
  ```bash
  npx cap sync
  ```
- [ ] Synchronisation réussie

### Étape 6.5: Ouvrir Android Studio
- [ ] Commande exécutée:
  ```bash
  npx cap open android
  ```
- [ ] Android Studio ouvert
- [ ] Projet chargé sans erreurs

### Étape 6.6: Builder l'APK
- [ ] Menu: Build → Build Bundle(s) / APK(s) → Build APK(s)
- [ ] Compilation réussie
- [ ] APK trouvé dans: `android/app/build/outputs/apk/debug/`
- [ ] **APK copié** vers un emplacement accessible

✅ **Phase 6 terminée!**

---

## 🧪 PHASE 7: TEST FINAL (5 minutes)

### Étape 7.1: Installer l'APK sur téléphone
- [ ] APK transféré sur téléphone Android
- [ ] Sources inconnues autorisées
- [ ] APK installé

### Étape 7.2: Tester l'application
- [ ] App ouverte sur téléphone
- [ ] Playlists visibles
- [ ] Chaîne sélectionnée
- [ ] Vidéo se lance
- [ ] Streaming fonctionne
- [ ] Aucun message "Installer AceStream" ✅

✅ **Phase 7 terminée!**

---

## 🎉 DÉPLOIEMENT COMPLET!

### Récapitulatif:

- [ ] ✅ Backend déployé sur Render.com
- [ ] ✅ URL publique HTTPS fonctionnelle
- [ ] ✅ Playlists M3U accessibles
- [ ] ✅ Conversion AceStream → HLS opérationnelle
- [ ] ✅ Application web testée
- [ ] ✅ APK Android créé
- [ ] ✅ APK testé sur téléphone
- [ ] ✅ Streaming fonctionne SANS installation AceStream

---

## 📊 RÉSULTAT FINAL

**Pour l'utilisateur:**
✅ Installe UNIQUEMENT votre APK
✅ AUCUNE installation supplémentaire
✅ Expérience simple et fluide

**Pour vous:**
✅ Solution gratuite (plan Render Free)
✅ Automatisée et maintenable
✅ Prête à distribuer

---

## 📞 EN CAS DE PROBLÈME

### ❌ Une case n'est pas cochée?

Retournez à la section correspondante dans:
- `RENDER_ETAPE_PAR_ETAPE.md` - Guide détaillé
- `GUIDE_DEPLOY_RENDER.md` - Troubleshooting complet

### ❌ Erreur pendant le déploiement?

Consultez la section "TROUBLESHOOTING" dans:
- `GUIDE_DEPLOY_RENDER.md`

### ❌ L'app ne fonctionne pas?

Vérifiez:
1. Backend accessible: `curl https://VOTRE-URL.onrender.com/`
2. `.env` correct: `cat webapp/.env`
3. Logs Render: Dashboard → Votre service → Logs

---

## 🎯 PROCHAINES ÉTAPES

Une fois toutes les cases cochées:

- [ ] Personnaliser l'interface (logo, couleurs)
- [ ] Tester avec plusieurs utilisateurs
- [ ] Créer documentation utilisateur
- [ ] Distribuer l'APK!

---

## 💾 SAUVEGARDER CETTE CHECKLIST

**Conseils:**
1. Imprimez cette checklist
2. OU cochez directement dans le fichier
3. OU créez un fichier `MA_CHECKLIST.md` personnel

---

## 🏆 SCORE DE PROGRESSION

Comptez vos cases cochées:

- **0-20 cases:** 🟡 Démarrage
- **21-40 cases:** 🟠 En cours
- **41-60 cases:** 🟢 Presque fini
- **61+ cases:** 🏆 TERMINÉ!

**Votre score:** ____ / 61+

---

**Bon déploiement! Vous êtes sur la bonne voie! 🚀**

*Dernière mise à jour: 2024*
