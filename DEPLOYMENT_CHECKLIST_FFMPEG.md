# ✅ FFmpeg Deployment Checklist

## 📋 Pré-Déploiement

- [x] FFmpeg installé dans Dockerfile
- [x] Codecs H.264 et AAC vérifiés
- [x] Format HLS supporté
- [x] Tests locaux réussis (6/6)
- [x] Scripts de vérification créés
- [x] Variables d'environnement configurées
- [x] Documentation complète

## 🚀 Déploiement

### 1. Commit et Push

```bash
git add .
git commit -m "✨ Add FFmpeg for AceStream to HLS conversion - All tests passed (6/6)"
git push origin main
```

### 2. Vérifier sur Render

- [ ] Aller sur [render.com](https://render.com/dashboard)
- [ ] Sélectionner le service `acestream-backend`
- [ ] Vérifier que le build démarre automatiquement
- [ ] Attendre la fin du build (5-10 min)

### 3. Vérifier les Logs

Chercher ces lignes dans les logs :

```
✅ FFmpeg installé avec succès avec support H.264 et AAC
🔍 Vérification de FFmpeg...
✅ ffmpeg version X.X.X
📡 Démarrage d'AceStream Engine...
✅ Backend démarré sur port 8000
```

## 🧪 Post-Déploiement

### 4. Tester l'API

```bash
# Test health check
curl https://votre-backend.onrender.com/health

# Devrait retourner: {"status": "ok"}
```

### 5. Tester un Stream AceStream

- [ ] Accéder à votre webapp
- [ ] Sélectionner une chaîne avec hash AceStream
- [ ] Vérifier que le stream démarre
- [ ] Vérifier que la conversion HLS fonctionne

### 6. Vérifier les Segments HLS

```bash
# Vérifier qu'un playlist.m3u8 est généré
curl https://votre-backend.onrender.com/hls/[HASH]/playlist.m3u8

# Devrait retourner un fichier .m3u8 avec des segments .ts
```

## 📱 Tests Multi-Plateformes

- [ ] Desktop Chrome
- [ ] Desktop Firefox
- [ ] Desktop Safari
- [ ] Mobile iOS (Safari)
- [ ] Mobile Android (Chrome)

## 🔍 Monitoring

### Logs à surveiller

1. **FFmpeg errors** : Chercher "ffmpeg" dans les logs
2. **Memory usage** : Render Free = 512 MB max
3. **CPU usage** : Conversion peut être intensive
4. **Timeouts** : Free plan = 15 min inactivité

### Métriques Render Dashboard

- [ ] CPU usage < 80%
- [ ] Memory usage < 450 MB
- [ ] Pas d'erreurs 500
- [ ] Response time < 5s

## 🐛 Dépannage

### Si FFmpeg non trouvé

```bash
# Vérifier le Dockerfile
cat backend/Dockerfile | grep ffmpeg

# Rebuild sans cache
# (sur Render: Manual Deploy → Clear build cache)
```

### Si conversion lente

```python
# Vérifier qu'on utilise copy codecs (pas de réencodage)
'-c:v', 'copy',  # ✅ Rapide
'-c:a', 'copy',  # ✅ Rapide
```

### Si segments HLS non créés

```bash
# Vérifier les permissions du dossier storage
ls -la /app/storage/hls/

# Vérifier les logs FFmpeg
# Render logs → Filtrer "ffmpeg"
```

## 📊 Indicateurs de Succès

| Métrique | Cible | Status |
|----------|-------|--------|
| Tests locaux | 6/6 | ✅ |
| Build Render | Succès | ⏳ |
| FFmpeg installé | Oui | ⏳ |
| Stream fonctionne | Oui | ⏳ |
| Mobile compatible | Oui | ⏳ |

## 🎯 Objectif Final

**Permettre aux utilisateurs de regarder des streams AceStream sans installer le logiciel.**

### Architecture

```
Utilisateur (Browser)
      ↓
Frontend (Webapp)
      ↓
Backend (Render + FFmpeg)
      ↓ Conversion
AceStream → HLS
      ↓
Lecteur HTML5
```

## 📚 Ressources

- `START_HERE_FFMPEG.md` - Point de départ
- `FFMPEG_IMPLEMENTATION_SUCCESS.md` - Rapport de succès
- `backend/FFMPEG_INSTALLATION.md` - Documentation technique
- `backend/test_ffmpeg.py` - Suite de tests

## ✅ Validation Finale

Une fois tous les tests passés :

- [ ] Backend déployé sur Render
- [ ] FFmpeg fonctionne correctement
- [ ] Conversion HLS opérationnelle
- [ ] Streams lisibles sur tous devices
- [ ] Pas d'installation côté utilisateur

---

## 🎉 Félicitations !

Si toutes les cases sont cochées, votre application est prête à diffuser des streams AceStream sans que les utilisateurs aient besoin d'installer quoi que ce soit !

---

**Status actuel** : ✅ Prêt pour déploiement  
**Tests** : 6/6 passés  
**Documentation** : Complète  
**Configuration** : Optimale
