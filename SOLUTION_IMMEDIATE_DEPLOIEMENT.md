# 🚀 SOLUTION IMMÉDIATE AU PROBLÈME DE DÉPLOIEMENT

## 🔴 PROBLÈME CONFIRMÉ

**AceStream Engine ne démarre pas sur Render/Railway**
- ❌ Port 6878 inaccessible
- ❌ Dépendances manquantes
- ❌ Pas de vidéo diffusée

**URL relative au lieu d'absolue**
- ❌ Frontend ne peut pas charger la playlist HLS

---

## 🎯 3 SOLUTIONS DISPONIBLES

### 📊 Comparaison Rapide

| Critère | Option A (Services Externes) | Option B (Réparer AceStream) | Option C (VPS Dédié) |
|---------|------------------------------|------------------------------|----------------------|
| **Temps** | 30 min | 4-8 heures | 1-2 heures |
| **Complexité** | ⭐ Facile | ⭐⭐⭐⭐⭐ Difficile | ⭐⭐⭐ Moyenne |
| **Coût** | Gratuit | Gratuit | 5€/mois |
| **Fiabilité** | ⭐⭐⭐⭐ Haute | ⭐⭐ Incertaine | ⭐⭐⭐⭐⭐ Très haute |
| **Maintenance** | Zéro | Élevée | Moyenne |
| **Recommandé** | ✅ OUI | ❌ NON | ⭐ Si budget |

---

## ✅ OPTION A: Services Externes (RECOMMANDÉ)

### Principe
Utiliser des services publics comme `acestream.me` qui hébergent déjà AceStream Engine.

### Avantages
- ✅ Fonctionne immédiatement
- ✅ Aucune installation complexe
- ✅ Pas de dépendances à gérer
- ✅ Gratuit

### Code à Implémenter

#### 1. Modifier `backend/app/main.py`

Remplacer la fonction `play_acestream_channel`:

```python
@app.post("/api/play")
async def play_acestream_channel(request: Request, body: dict):
    """
    Version simplifiée utilisant des services externes
    """
    acestream_hash = body.get("hash")
    
    if not acestream_hash or len(acestream_hash) < 32:
        raise HTTPException(status_code=400, detail="Invalid AceStream hash")
    
    acestream_hash = acestream_hash.strip()
    
    # Construire l'URL de base depuis la requête
    base_url = str(request.base_url).rstrip('/')
    
    # Retourner les URLs des services externes
    return {
        "status": "success",
        "hash": acestream_hash,
        "embed_urls": {
            "acestream_me": f"https://acestream.me/?id={acestream_hash}",
            "torrentstream": f"http://torrentstream.net/watch/{acestream_hash}",
            "webtor": f"https://webtor.io/#!/acestream/{acestream_hash}"
        },
        "direct_url": f"acestream://{acestream_hash}",
        "type": "external_services",
        "backend": "proxy_only",
        "message": "Stream disponible via services externes - Aucune installation requise!"
    }
```

#### 2. Modifier `webapp/src/UnifiedStreamPlayer.js`

Mettre à jour pour afficher les options:

```javascript
const UnifiedStreamPlayer = ({ channel, onClose }) => {
  const [streamData, setStreamData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initStream = async () => {
      try {
        setIsLoading(true);
        const data = await playChannel(channel.acestream_hash);
        setStreamData(data);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };
    
    initStream();
  }, [channel]);

  if (isLoading) {
    return <div className="loading">⏳ Chargement du stream...</div>;
  }

  if (error) {
    return <div className="error">❌ Erreur: {error}</div>;
  }

  return (
    <div className="stream-player">
      <button onClick={onClose} className="close-btn">✕</button>
      
      <h2>🎬 {channel.name}</h2>
      
      <div className="stream-options">
        <h3>🚀 Méthodes de streaming disponibles:</h3>
        
        {streamData?.embed_urls && (
          <>
            <button 
              onClick={() => window.open(streamData.embed_urls.acestream_me, '_blank')}
              className="stream-btn primary"
            >
              🌐 AceStream Web Player
            </button>
            
            <button 
              onClick={() => window.open(streamData.embed_urls.torrentstream, '_blank')}
              className="stream-btn secondary"
            >
              📺 Torrent Stream
            </button>
            
            <button 
              onClick={() => window.open(streamData.embed_urls.webtor, '_blank')}
              className="stream-btn secondary"
            >
              ▶️ Webtor Player
            </button>
          </>
        )}
        
        <button 
          onClick={() => {
            navigator.clipboard.writeText(streamData?.hash);
            alert('✅ Hash copié dans le presse-papier!');
          }}
          className="stream-btn tertiary"
        >
          📋 Copier le Hash
        </button>
      </div>
      
      <div className="stream-info">
        <p><strong>Hash AceStream:</strong> <code>{streamData?.hash}</code></p>
        <p><small>💡 Les boutons ouvrent le stream dans un nouvel onglet</small></p>
      </div>
    </div>
  );
};
```

#### 3. Déployer les Modifications

```bash
# Commit et push
git add backend/app/main.py webapp/src/UnifiedStreamPlayer.js
git commit -m "Fix: Use external AceStream services instead of local engine"
git push origin main

# Render et Railway redéploieront automatiquement
```

#### 4. Tester

Après déploiement (2-3 minutes):
```bash
curl -X POST https://app-web-vercel.onrender.com/api/play \
  -H "Content-Type: application/json" \
  -d '{"hash":"d65257bb7856e13b718df1dfe65ee482d90dd384"}'
```

Devrait retourner:
```json
{
  "status": "success",
  "embed_urls": {
    "acestream_me": "https://acestream.me/?id=d65257bb...",
    "torrentstream": "http://torrentstream.net/watch/d65257bb...",
    "webtor": "https://webtor.io/#!/acestream/d65257bb..."
  },
  "type": "external_services"
}
```

---

## 🔧 OPTION B: Réparer AceStream Engine (COMPLEXE)

### ⚠️ Avertissement
Cette option est complexe et peut ne pas fonctionner sur Render/Railway en raison de restrictions.

### Modifications Nécessaires

#### 1. Mettre à jour `backend/Dockerfile`

```dockerfile
FROM python:3.11-slim

# Installer TOUTES les dépendances nécessaires pour AceStream
RUN apt-get update && apt-get install -y \
    ffmpeg \
    wget \
    curl \
    net-tools \
    procps \
    # Dépendances Python 2.7 pour AceStream
    python2.7 \
    python-pip-whl \
    python-setuptools \
    libpython2.7 \
    # Dépendances SSL
    libssl1.1 \
    libssl-dev \
    # Autres dépendances
    librtmp1 \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Créer symlink Python 2
RUN ln -s /usr/bin/python2.7 /usr/bin/python2

# Vérifier FFmpeg
RUN ffmpeg -version

# Télécharger et installer AceStream Engine
RUN mkdir -p /opt && \
    wget --timeout=30 --tries=3 \
    http://dl.acestream.org/linux/acestream_3.1.49_ubuntu_20.04_x86_64.tar.gz \
    -O /tmp/acestream.tar.gz && \
    tar -xzf /tmp/acestream.tar.gz -C /opt/ && \
    rm /tmp/acestream.tar.gz && \
    ln -s /opt/acestream.engine/acestream-engine /usr/local/bin/acestream-engine

# Vérifier l'installation
RUN ls -la /opt/acestream.engine/ && \
    ls -la /usr/local/bin/acestream-engine

WORKDIR /app

COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

COPY app /app/app
COPY *.m3u /app/ 2>/dev/null || true

RUN mkdir -p /app/storage/hls /root/.ACEStream

ENV ACESTREAM_BASE_URL=http://127.0.0.1:6878
ENV STORAGE_DIR=/app/storage
ENV PORT=8000
ENV PYTHONUNBUFFERED=1

EXPOSE 8000

COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

CMD ["/app/start.sh"]
```

#### 2. Améliorer `backend/start.sh`

```bash
#!/bin/bash
set -e

echo "🚀 Démarrage du backend AceStream → HLS"

# Vérifier FFmpeg
echo "🔍 Vérification de FFmpeg..."
if command -v ffmpeg &> /dev/null; then
    FFMPEG_VERSION=$(ffmpeg -version | head -n1)
    echo "✅ $FFMPEG_VERSION"
else
    echo "❌ ERREUR: FFmpeg n'est pas installé!"
    exit 1
fi

# Vérifier que AceStream Engine existe
echo "🔍 Vérification d'AceStream Engine..."
if [ -f "/usr/local/bin/acestream-engine" ]; then
    echo "✅ AceStream Engine trouvé"
    ls -lh /usr/local/bin/acestream-engine
else
    echo "❌ AceStream Engine introuvable!"
    exit 1
fi

# Vérifier les dépendances Python 2
echo "🔍 Vérification de Python 2..."
if command -v python2 &> /dev/null; then
    PYTHON2_VERSION=$(python2 --version 2>&1)
    echo "✅ $PYTHON2_VERSION"
else
    echo "⚠️  Python 2 non trouvé, AceStream peut ne pas fonctionner"
fi

# Créer le répertoire de logs
mkdir -p /var/log

# Démarrer AceStream Engine en arrière-plan avec logs détaillés
echo "📡 Démarrage d'AceStream Engine..."
nohup acestream-engine --client-console \
    --log-file /var/log/acestream.log \
    --log-backup-count 1 \
    --log-max-size 10485760 \
    > /var/log/acestream-stdout.log 2>&1 &

ACESTREAM_PID=$!
echo "✅ AceStream Engine démarré (PID: $ACESTREAM_PID)"

# Attendre plus longtemps (60 secondes au lieu de 30)
echo "⏳ Attente de AceStream (max 60s)..."
ACESTREAM_READY=false
for i in {1..60}; do
    if curl -s http://127.0.0.1:6878/webui/api/service?method=get_version > /dev/null 2>&1; then
        echo "✅ AceStream Engine prêt après ${i}s!"
        ACESTREAM_READY=true
        break
    fi
    sleep 1
    if [ $((i % 10)) -eq 0 ]; then
        echo "   Toujours en attente... ${i}s écoulées"
    fi
done

if [ "$ACESTREAM_READY" = false ]; then
    echo "⚠️  AceStream Engine n'a pas répondu après 60s"
    echo "📋 Logs AceStream:"
    tail -n 50 /var/log/acestream.log || echo "Pas de logs disponibles"
    echo ""
    echo "⚠️  L'API démarrera quand même, mais le streaming ne fonctionnera pas"
fi

# Démarrer FastAPI
echo "🌐 Démarrage de l'API FastAPI sur le port ${PORT}..."
exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT} --log-level info
```

#### 3. Ajouter un endpoint de debug

Ajouter dans `backend/app/main.py`:

```python
@app.get("/debug/acestream")
async def debug_acestream():
    """Debug endpoint pour vérifier l'état d'AceStream"""
    import subprocess
    import os
    
    debug_info = {
        "acestream_binary_exists": os.path.exists("/usr/local/bin/acestream-engine"),
        "python2_available": subprocess.run(["which", "python2"], capture_output=True).returncode == 0,
    }
    
    # Vérifier si le processus tourne
    try:
        result = subprocess.run(["pgrep", "-f", "acestream"], capture_output=True, text=True)
        debug_info["acestream_running"] = result.returncode == 0
        debug_info["acestream_pids"] = result.stdout.strip().split('\n') if result.stdout else []
    except:
        debug_info["acestream_running"] = False
    
    # Lire les logs
    try:
        with open("/var/log/acestream.log", "r") as f:
            debug_info["acestream_logs_last_20_lines"] = f.readlines()[-20:]
    except:
        debug_info["acestream_logs"] = "No logs available"
    
    return debug_info
```

### ⚠️ Problèmes Potentiels

- Render/Railway peuvent bloquer certains processus en arrière-plan
- Python 2.7 est obsolète et peut manquer de bibliothèques
- AceStream Engine peut nécessiter des privilèges système
- Le timeout de démarrage peut être insuffisant

---

## 💎 OPTION C: VPS Dédié (PROFESSIONNEL)

### Principe
Louer un serveur VPS, installer AceStream manuellement, et pointer votre backend vers ce VPS.

### Étapes

#### 1. Louer un VPS

**Fournisseurs recommandés:**
- **Contabo**: 5€/mois, 4 vCPU, 8GB RAM
- **Hetzner**: 5€/mois, 2 vCPU, 4GB RAM
- **DigitalOcean**: 6$/mois, 1 vCPU, 1GB RAM

**Spécifications minimales:**
- OS: Ubuntu 20.04 ou 22.04
- RAM: 1GB minimum (2GB recommandé)
- CPU: 1 vCPU minimum

#### 2. Installer AceStream sur le VPS

```bash
# Se connecter au VPS
ssh root@votre-vps-ip

# Installer les dépendances
apt-get update
apt-get install -y wget python2.7 libpython2.7 curl

# Télécharger AceStream Engine
wget http://dl.acestream.org/linux/acestream_3.1.49_ubuntu_20.04_x86_64.tar.gz
tar -xzf acestream_3.1.49_ubuntu_20.04_x86_64.tar.gz -C /opt/

# Créer un service systemd
cat > /etc/systemd/system/acestream.service << EOF
[Unit]
Description=AceStream Engine
After=network.target

[Service]
Type=simple
User=root
ExecStart=/opt/acestream.engine/acestream-engine --client-console
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Démarrer le service
systemctl daemon-reload
systemctl enable acestream
systemctl start acestream

# Vérifier le status
systemctl status acestream

# Tester l'API
curl http://localhost:6878/webui/api/service?method=get_version
```

#### 3. Ouvrir le port 6878 dans le firewall

```bash
# UFW (Ubuntu)
ufw allow 6878/tcp
ufw reload

# Ou iptables
iptables -A INPUT -p tcp --dport 6878 -j ACCEPT
```

#### 4. Configurer le Backend

Modifier les variables d'environnement sur Render/Railway:

```bash
ACESTREAM_BASE_URL=http://VOTRE_VPS_IP:6878
```

#### 5. Tester la Connexion

```bash
# Depuis votre machine locale
curl http://VOTRE_VPS_IP:6878/webui/api/service?method=get_version

# Devrait retourner:
# {"result":{"version":"3.1.49",...}}
```

### Avantages
- ✅ Contrôle total sur AceStream
- ✅ Performance dédiée
- ✅ Logs accessibles
- ✅ FFmpeg + HLS fonctionnent parfaitement
- ✅ Pas de restriction cloud

### Inconvénients
- ❌ Coût mensuel (~5€)
- ❌ Maintenance du serveur
- ❌ Configuration initiale plus longue

---

## 🎯 RECOMMANDATION FINALE

### Pour un Déploiement Immédiat (Aujourd'hui)
→ **OPTION A** - Services Externes
- Temps: 30 minutes
- Fonctionne garantie
- Gratuit
- Parfait pour MVP/test

### Pour une Solution Professionnelle (Long terme)
→ **OPTION C** - VPS Dédié
- Meilleure performance
- Contrôle total
- Coût acceptable (5€/mois)
- Parfait pour production

### À Éviter (Sauf si vous êtes expert)
→ **OPTION B** - Réparer AceStream
- Trop complexe
- Résultat incertain
- Perte de temps potentielle

---

## 📋 QUELLE OPTION CHOISISSEZ-VOUS ?

Je peux vous aider à implémenter n'importe quelle option. Dites-moi laquelle vous préférez et je vous fournirai le code exact et les commandes à exécuter ! 🚀
