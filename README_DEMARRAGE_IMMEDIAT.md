# ⚡ DÉMARRAGE IMMÉDIAT - 4 COMMANDES

## 🎯 Votre Situation : PARFAITE ✅

Vous avez **TOUT** ce qu'il faut :
- ✅ PC Windows 24/7 
- ✅ 26.64 Mbps upload (excellent !)
- ✅ AceStream Engine installé
- ✅ FFmpeg 7.1 installé

---

## 🚀 DÉMARREZ EN 4 COMMANDES (30 minutes)

### Ouvrez PowerShell dans ce dossier

#### 1️⃣ Test (2 min)
```powershell
.\test_local_setup.ps1
```
✅ Vérifie que tout est prêt

---

#### 2️⃣ Installation Cloudflare (10 min)

**⚠️ IMPORTANT : Clic-droit → "Exécuter en tant qu'administrateur"**

```powershell
.\install_cloudflared.ps1
```

Ce script va :
- Télécharger cloudflared
- Ouvrir votre navigateur pour connexion Cloudflare
- Créer le tunnel automatiquement

**Créez un compte Cloudflare gratuit si nécessaire** : https://dash.cloudflare.com/sign-up

---

#### 3️⃣ Démarrage Serveur (5 min)
```powershell
.\start_server_tunnel.ps1
```

**3 fenêtres PowerShell vont s'ouvrir - NE LES FERMEZ PAS !**

Dans la fenêtre "Cloudflare Tunnel", vous verrez :
```
https://xxxx-yyyy-zzzz.trycloudflare.com
```

**📝 NOTEZ CETTE URL** (vous en aurez besoin à l'étape suivante)

---

#### 4️⃣ Configuration Vercel (10 min)
```powershell
.\configure_vercel.ps1
```

Le script va demander l'URL du tunnel → **Collez l'URL notée ci-dessus**

Puis déployez sur Vercel :
```powershell
cd webapp
npm install -g vercel
vercel login
vercel --prod
```

---

## ✅ C'EST TOUT !

Votre application est maintenant :
- 🌐 **Accessible sur Web** : `https://votre-app.vercel.app`
- 📱 **Fonctionnel sur mobile** : Même URL
- ✅ **Images affichées** : Problème CORS résolu
- ✅ **Streaming OK** : AceStream sans installation

---

## 🧪 TESTER

1. **Ouvrir** : `https://votre-app.vercel.app`
2. **Vérifier** : Les chaînes et logos s'affichent
3. **Cliquer** : Play sur une chaîne
4. **Regarder** : Le flux démarre 🎬

---

## 📖 Documentation Complète

- **Guide détaillé** : `GUIDE_DEMARRAGE_RAPIDE.md`
- **Architecture** : `ANALYSE_NOUVEAU_PLAN.md`
- **Récapitulatif** : `RECAP_FINAL_IMPLEMENTATION.md`

---

## 🆘 Problème ?

### PowerShell bloque l'exécution ?
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### AceStream ne démarre pas ?
```powershell
Start-Process "C:\Program Files\ACEStream\ace_engine.exe"
```

### FFmpeg introuvable ?
```powershell
ffmpeg -version
# Si erreur : télécharger depuis https://ffmpeg.org/download.html
```

---

## 🎯 COMMENCEZ MAINTENANT !

```powershell
.\test_local_setup.ps1
```

**GO ! 🚀**
