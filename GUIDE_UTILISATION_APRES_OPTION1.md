# 🎉 Guide d'Utilisation - Application Sans Installation AceStream

## ✅ Ce Qui a Été Fait

Votre application a été **entièrement modifiée** pour ne plus nécessiter l'installation d'AceStream côté utilisateur ! 

### Changements Principaux :
- ❌ **Supprimé** : Tous les liens `acestream://` 
- ❌ **Supprimé** : Tous les lecteurs obsolètes (12+ composants)
- ❌ **Supprimé** : Le bouton "🚀 AceStream" qui nécessitait l'installation
- ✅ **Ajouté** : Un seul bouton "▶ Regarder" qui utilise toujours le backend
- ✅ **Simplifié** : Interface utilisateur plus claire et directe

---

## 🏗️ Architecture Actuelle

```
📱 Utilisateur (APK Android / Navigateur Web)
        ↓
🌐 Frontend React (webapp/)
        ↓ API REST
🔧 Backend FastAPI (backend/app/main.py)
        ↓ Port 6878
🎥 AceStream Engine (sur votre serveur)
        ↓ P2P
🌍 Réseau AceStream
```

**Important** : L'utilisateur final ne voit que le frontend et n'a rien à installer !

---

## 🚀 Comment Tester en Local

### 1. Démarrer le Backend (Terminal 1)

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

**Note** : AceStream Engine doit tourner sur `127.0.0.1:6878` (voir section suivante)

### 2. Démarrer le Frontend (Terminal 2)

```bash
cd webapp
npm install
npm start
```

Ouvre automatiquement `http://localhost:3000`

### 3. Installer AceStream Engine (Si pas déjà fait)

**Sur Windows :**
1. Télécharger : http://acestream.org/
2. Installer AceStream Desktop
3. Le moteur démarre automatiquement sur le port 6878

**Sur Linux (pour serveur) :**
```bash
# Voir backend/Dockerfile pour l'installation automatique
wget -q -O - http://dl.acestream.org/linux/acestream_3.1.49_ubuntu_20.04_x86_64.tar.gz | tar -xz -C /opt/
/opt/acestream.engine/acestream-engine --client-console
```

### 4. Tester l'Application

1. Ouvrez `http://localhost:3000`
2. Choisissez un événement ou une chaîne
3. Cliquez sur "▶ Regarder"
4. Le lecteur devrait s'ouvrir et charger le flux via le backend

---

## 📱 Compiler l'APK Android

### Prérequis
- Node.js installé
- Android Studio installé
- Java JDK 11+ installé

### Étapes

```bash
cd webapp

# 1. Configurer l'URL du backend
echo "REACT_APP_API_URL=https://votre-backend-url.com" > .env

# 2. Build de production
npm run build

# 3. Synchroniser avec Capacitor
npx cap sync

# 4. Ouvrir dans Android Studio
npx cap open android
```

Dans Android Studio :
- `Build > Build Bundle(s) / APK(s) > Build APK(s)`
- L'APK sera dans `webapp/android/app/build/outputs/apk/debug/`

---

## 🌐 Déployer le Backend sur un Serveur

### Option A : VPS Cloud (Recommandé)

**Providers suggérés :**
- Hetzner (5€/mois) - Bon rapport qualité/prix
- DigitalOcean (6$/mois)
- Vultr (6$/mois)
- Contabo (4€/mois) - Très économique

**Configuration minimale :**
- 2 CPU cores
- 4 GB RAM
- 50 GB SSD
- Ubuntu 20.04 ou 22.04

### Étapes de Déploiement

```bash
# 1. Se connecter au VPS
ssh root@votre-ip

# 2. Installer Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# 3. Cloner votre repo
git clone https://github.com/amouradore/app-web-vercel.git
cd app-web-vercel/backend

# 4. Build et lancer le container
docker build -t acestream-backend .
docker run -d -p 8000:8000 --name acestream-api acestream-backend

# 5. Vérifier que ça tourne
curl http://localhost:8000/health
```

### Configuration du Firewall

```bash
# Ouvrir le port 8000
ufw allow 8000
ufw enable
```

### Configurer un Nom de Domaine (Optionnel mais Recommandé)

1. Acheter un domaine (ex: Namecheap, OVH)
2. Créer un enregistrement A pointant vers l'IP du VPS
3. Installer Nginx comme reverse proxy :

```bash
apt install nginx certbot python3-certbot-nginx

# Créer la config Nginx
cat > /etc/nginx/sites-available/acestream <<EOF
server {
    listen 80;
    server_name votre-domaine.com;
    
    location / {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Activer le site
ln -s /etc/nginx/sites-available/acestream /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx

# Installer SSL (HTTPS)
certbot --nginx -d votre-domaine.com
```

---

## 🔧 Configuration Finale

### 1. Mettre à Jour l'URL du Backend dans le Frontend

**Fichier** : `webapp/.env`
```env
REACT_APP_API_URL=https://votre-domaine.com
```

Ou si pas de domaine :
```env
REACT_APP_API_URL=http://votre-ip-vps:8000
```

### 2. Rebuild le Frontend

```bash
cd webapp
npm run build
npx cap sync
```

### 3. Recompiler l'APK avec la nouvelle configuration

```bash
npx cap open android
# Build > Build APK
```

---

## 📊 Test de l'Application Complète

### Checklist de Test

- [ ] Le backend répond sur `http://votre-serveur:8000/`
- [ ] AceStream Engine tourne sur le serveur (check `/api/health/acestream`)
- [ ] Le frontend peut charger la liste des chaînes
- [ ] Cliquer sur "▶ Regarder" ouvre le lecteur
- [ ] Le lecteur affiche "Initialisation..." puis "Chargement..."
- [ ] La vidéo démarre après 10-20 secondes
- [ ] Les contrôles du lecteur fonctionnent (play/pause, volume)
- [ ] Fermer le lecteur fonctionne correctement
- [ ] L'APK Android se connecte au backend distant

---

## ⚠️ Problèmes Courants

### Problème 1 : "Backend non disponible"
**Solution :**
- Vérifiez que le backend tourne : `curl http://votre-serveur:8000/health`
- Vérifiez l'URL dans `webapp/.env`
- Vérifiez le firewall : `ufw status`

### Problème 2 : "AceStream Engine not ready"
**Solution :**
- Sur le serveur : `curl http://127.0.0.1:6878/webui/api/service`
- Redémarrer AceStream : `pkill acestream-engine && acestream-engine --client-console &`

### Problème 3 : "Timeout lors du chargement"
**Solution :**
- Le flux peut être hors ligne
- Le serveur peut être surchargé
- Augmentez les ressources du serveur (RAM/CPU)

### Problème 4 : "CORS Error" dans la console
**Solution :**
- Le backend a déjà CORS configuré (`allow_origins=["*"]`)
- Videz le cache du navigateur
- Vérifiez que l'URL du backend est correcte

---

## 💰 Estimation des Coûts

| Service | Coût Mensuel | Notes |
|---------|--------------|-------|
| VPS (Hetzner CX21) | 5€ | Hébergement backend |
| Nom de domaine | 1€ | Optionnel mais recommandé |
| SSL Certificate | Gratuit | Let's Encrypt |
| **TOTAL** | **~6€/mois** | Pour usage illimité |

**Comparé à :**
- Chaque utilisateur installe AceStream : 0€ mais mauvaise expérience
- Cloud gratuit (Railway/Render) : Limites strictes, P2P souvent bloqué

---

## 📈 Optimisations Futures (Optionnel)

### 1. CDN pour les Segments HLS
Utiliser Cloudflare ou BunnyCDN pour distribuer les segments HLS.

### 2. Load Balancer
Si beaucoup d'utilisateurs simultanés, utiliser plusieurs serveurs backend.

### 3. Cache Redis
Mettre en cache les playlists et métadonnées.

### 4. Monitoring
Installer Grafana + Prometheus pour surveiller les performances.

---

## 🎯 Résumé

✅ **Vous avez maintenant une application complète où :**
- L'utilisateur n'installe RIEN
- Tout fonctionne dans le navigateur
- L'APK Android fonctionne sur tous les appareils
- Un seul serveur backend gère tous les utilisateurs

✅ **Les fichiers modifiés :**
- `webapp/src/App.js` - Frontend nettoyé
- `backend/app/main.py` - Backend déjà configuré

✅ **Prochaine étape recommandée :**
1. Louer un VPS (Hetzner 5€/mois)
2. Déployer le backend avec Docker
3. Compiler l'APK avec l'URL du backend
4. Distribuer l'APK à vos utilisateurs

---

## 📞 Support

Si vous avez des questions ou des problèmes :
1. Vérifiez les logs du backend : `docker logs acestream-api`
2. Vérifiez les logs AceStream : `tail -f /var/log/acestream.log`
3. Testez les endpoints API manuellement avec curl

---

🎉 **Félicitations ! Votre application est prête à être déployée !**
