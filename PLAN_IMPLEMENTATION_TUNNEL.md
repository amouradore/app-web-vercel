# 🚀 PLAN D'IMPLÉMENTATION - TUNNEL CLOUDFLARE

## ✅ VOTRE CONFIGURATION

- 💻 **PC Windows** : Allumé 24/7
- 🌐 **Upload** : 26.64 Mbps (Excellent !)
- 📡 **AceStream Engine** : Installé
- 🎬 **FFmpeg** : 7.1 installé
- 🔐 **Tunnel** : Cloudflare (gratuit illimité)
- 🎨 **Frontend** : Vercel

---

## 📋 ÉTAPES D'IMPLÉMENTATION (30-45 minutes)

### ÉTAPE 1 : Installation Cloudflare Tunnel (10 min)
### ÉTAPE 2 : Configuration Backend (5 min)
### ÉTAPE 3 : Démarrage Services (5 min)
### ÉTAPE 4 : Configuration Frontend Vercel (10 min)
### ÉTAPE 5 : Tests et Validation (10 min)

---

## 🔧 ÉTAPE 1 : INSTALLATION CLOUDFLARE TUNNEL

### A. Télécharger cloudflared

1. Ouvrir PowerShell en **Administrateur**
2. Exécuter les commandes suivantes :

```powershell
# Créer dossier pour cloudflared
New-Item -ItemType Directory -Force -Path "C:\cloudflared"
cd C:\cloudflared

# Télécharger cloudflared pour Windows
Invoke-WebRequest -Uri "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe" -OutFile "cloudflared.exe"

# Ajouter au PATH (pour accès global)
$env:Path += ";C:\cloudflared"
[Environment]::SetEnvironmentVariable("Path", $env:Path + ";C:\cloudflared", [EnvironmentVariableTarget]::Machine)
```

### B. Authentification Cloudflare

```powershell
# Se connecter à Cloudflare (ouvre navigateur)
.\cloudflared.exe tunnel login
```

➡️ **Action** : Une page web s'ouvrira. Connectez-vous avec votre compte Cloudflare (créez-en un gratuitement si besoin).

### C. Créer le tunnel

```powershell
# Créer un tunnel nommé "iptv-app"
.\cloudflared.exe tunnel create iptv-app
```

➡️ Notez le **TUNNEL-ID** affiché (format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)

### D. Configurer le tunnel

Créer le fichier de configuration : `C:\cloudflared\config.yml`

```yaml
tunnel: VOTRE-TUNNEL-ID
credentials-file: C:\Users\VOTRE-USERNAME\.cloudflared\VOTRE-TUNNEL-ID.json

ingress:
  - hostname: iptv-app.VOTRE-DOMAINE.com
    service: http://localhost:8000
  - service: http_status:404
```

**OU pour un domaine Cloudflare automatique (trycloudflare.com)** :

```yaml
tunnel: VOTRE-TUNNEL-ID
credentials-file: C:\Users\VOTRE-USERNAME\.cloudflared\VOTRE-TUNNEL-ID.json

ingress:
  - service: http://localhost:8000
```

### E. Router le tunnel (obtenir URL publique)

```powershell
# Si vous avez un domaine Cloudflare
.\cloudflared.exe tunnel route dns iptv-app iptv-app.votre-domaine.com

# OU pour URL automatique (plus simple)
# L'URL sera affichée au démarrage du tunnel
```

---

## 🛠️ ÉTAPE 2 : CONFIGURATION BACKEND

Le backend est déjà configuré ! Je vais juste vérifier et ajuster si nécessaire.

### Vérification des ports AceStream

```powershell
# Tester si AceStream Engine tourne
Invoke-WebRequest -Uri "http://127.0.0.1:6878/webui/api/service?method=get_version" -UseBasicParsing
```

Si erreur ➡️ Démarrer AceStream Engine manuellement depuis le menu Démarrer.

---

## 🚀 ÉTAPE 3 : SCRIPTS DE DÉMARRAGE AUTOMATIQUE

Je vais créer les scripts PowerShell pour tout démarrer automatiquement.

---

## 🌐 ÉTAPE 4 : CONFIGURATION FRONTEND VERCEL

Une fois le tunnel démarré, vous obtiendrez une URL comme :
- `https://iptv-app.trycloudflare.com` (URL temporaire)
- `https://iptv-app.votre-domaine.com` (si domaine Cloudflare)

### Modifier la configuration Vercel

```bash
# webapp/.env.production
REACT_APP_API_URL=https://VOTRE-URL-TUNNEL.com
```

### Redéployer sur Vercel

```bash
cd webapp
vercel --prod
```

---

## ✅ ÉTAPE 5 : TESTS

1. **Tester le backend local** : http://localhost:8000/docs
2. **Tester via tunnel** : https://votre-url-tunnel.com/docs
3. **Tester frontend Vercel** : Vérifier affichage des chaînes et images
4. **Tester streaming** : Lancer une chaîne

---

## 📝 PROCHAINES ACTIONS IMMÉDIATES

1. Je vais créer les scripts de démarrage automatique
2. Je vais adapter le backend pour s'assurer qu'il fonctionne parfaitement
3. Je vais créer un guide de test étape par étape

**Voulez-vous que je commence par créer tous les scripts maintenant ?**
