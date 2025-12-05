# ✅ FFmpeg Installation Complète pour Render

## 🎯 Objectif
Ajouter FFmpeg au processus de build sur Render pour permettre la conversion des flux AceStream en HLS.

## 📦 Ce qui a été fait

### 1. ✅ Dockerfile amélioré (`backend/Dockerfile`)
- Installation de FFmpeg avec toutes les dépendances
- Vérification automatique des codecs H.264 et AAC
- Ajout de `procps` pour le monitoring

### 2. ✅ Script de démarrage amélioré (`backend/start.sh`)
- Vérification de FFmpeg au démarrage
- Affichage de la version installée
- Erreur explicite si FFmpeg est manquant

### 3. ✅ Configuration Render (`backend/render.yaml`)
Nouvelles variables d'environnement :
```yaml
- key: FFMPEG_ENABLED
  value: "true"
- key: FFMPEG_LOG_LEVEL
  value: "warning"
```

### 4. ✅ Scripts de test créés

#### `backend/test_ffmpeg.py` (Python)
- Test d'installation
- Test des codecs H.264 et AAC
- Test du format HLS
- Test de conversion vidéo
- Test de segmentation HLS

#### `backend/verify_ffmpeg.sh` (Bash)
- Vérification rapide de FFmpeg
- Test de génération vidéo simple

#### `backend/build.sh` (Build personnalisé)
- Script de build complet pour Render
- Installation de FFmpeg et vérification
- Installation des dépendances Python

### 5. ✅ Documentation (`backend/FFMPEG_INSTALLATION.md`)
- Guide complet d'installation
- Explications sur l'utilisation dans le code
- Dépannage et optimisations

## 🚀 Comment déployer sur Render

### Option 1 : Avec Docker (Recommandé)
Le Dockerfile gère tout automatiquement :
```bash
# Render utilise directement le Dockerfile
# Aucune configuration supplémentaire nécessaire
```

### Option 2 : Build personnalisé
Si vous n'utilisez pas Docker, activez le build script dans `render.yaml` :
```yaml
buildCommand: chmod +x build.sh && ./build.sh
```

## 🧪 Tester localement

### Avec Docker
```bash
cd backend

# Build l'image
docker build -t acestream-backend .

# Vérifier FFmpeg
docker run acestream-backend ffmpeg -version

# Lancer le test Python
docker run acestream-backend python test_ffmpeg.py
```

### Sans Docker
```bash
cd backend

# Installer FFmpeg (Ubuntu/Debian)
sudo apt-get update
sudo apt-get install ffmpeg

# Tester avec le script Python
python test_ffmpeg.py

# Ou avec le script bash
bash verify_ffmpeg.sh
```

## 📊 Ce que FFmpeg fait dans votre application

### Conversion AceStream → HLS

```
AceStream (MPEG-TS)
         ↓
    FFmpeg convertit
         ↓
   HLS (.m3u8 + .ts)
         ↓
  Lecteur Web (HTML5)
```

### Commande FFmpeg utilisée
```bash
ffmpeg -i http://127.0.0.1:6878/ace/getstream?id=HASH \
       -c:v copy \              # Copie vidéo (pas de réencodage)
       -c:a copy \              # Copie audio (pas de réencodage)
       -f hls \                 # Format HLS
       -hls_time 2 \            # Segments de 2 secondes
       -hls_list_size 6 \       # Garder 6 segments
       -hls_flags delete_segments \  # Supprimer anciens segments
       /app/storage/hls/HASH/playlist.m3u8
```

## 🔍 Vérifier FFmpeg sur Render

Après déploiement, vérifiez les logs :

1. Aller sur **Render Dashboard**
2. Sélectionner votre service `acestream-backend`
3. Aller dans **Logs**
4. Chercher :
   ```
   ✅ FFmpeg installé avec succès avec support H.264 et AAC
   🔍 Vérification de FFmpeg...
   ✅ ffmpeg version X.X.X
   ```

## 📈 Performance

### Sur Render Free Plan
- ✅ FFmpeg fonctionne
- ⚠️ CPU limité (512 MB RAM)
- ⚠️ Conversion en temps réel possible pour 1-2 streams
- ⚠️ Timeout après 15 min d'inactivité

### Optimisations appliquées
1. **Copy codecs** : `-c:v copy -c:a copy` (pas de réencodage)
2. **Segments courts** : 2 secondes pour latence réduite
3. **Nettoyage auto** : Anciens segments supprimés
4. **Format optimisé** : HLS natif

## 🐛 Dépannage

### FFmpeg non trouvé
**Symptôme** : `❌ ERREUR: FFmpeg n'est pas installé!`

**Solution** :
1. Vérifier le Dockerfile
2. Rebuild avec `--no-cache`
3. Vérifier les logs de build

### Conversion lente
**Symptôme** : Stream buffering ou saccadé

**Solutions** :
1. Vérifier que `-c:v copy` est utilisé (pas de réencodage)
2. Augmenter la taille des segments HLS
3. Passer à un plan payant Render (plus de CPU)

### Codec manquant
**Symptôme** : `Unknown encoder 'libx264'`

**Solution** :
```dockerfile
RUN apt-get install -y ffmpeg libavcodec-extra
```

## 📝 Fichiers modifiés

```
backend/
├── Dockerfile                    ✅ Modifié (vérification codecs)
├── start.sh                      ✅ Modifié (vérification FFmpeg)
├── render.yaml                   ✅ Modifié (variables env)
├── build.sh                      ✨ Nouveau (build personnalisé)
├── test_ffmpeg.py                ✨ Nouveau (tests Python)
├── verify_ffmpeg.sh              ✨ Nouveau (vérification rapide)
└── FFMPEG_INSTALLATION.md        ✨ Nouveau (documentation)
```

## ✅ Checklist de déploiement

- [x] FFmpeg installé dans Dockerfile
- [x] Vérifications codecs ajoutées
- [x] Variables d'environnement configurées
- [x] Script de démarrage mis à jour
- [x] Tests créés
- [x] Documentation complète

## 🎉 Prêt pour le déploiement !

Vous pouvez maintenant déployer sur Render. FFmpeg sera automatiquement installé et vérifié.

### Commandes de déploiement

```bash
# Si vous utilisez Git
git add .
git commit -m "Add FFmpeg installation and verification"
git push

# Render détectera le push et déploiera automatiquement
```

### Après le déploiement

1. Vérifier les logs Render
2. Tester un stream AceStream
3. Vérifier que la conversion HLS fonctionne
4. Tester le lecteur web

---

**Questions ou problèmes ?** 
Consultez `backend/FFMPEG_INSTALLATION.md` pour plus de détails.
