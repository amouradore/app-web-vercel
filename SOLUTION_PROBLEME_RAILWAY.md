# 🔧 Solution au Problème Railway - "No start command was found"

## ❌ PROBLÈME IDENTIFIÉ

Railway cherche les fichiers dans la **racine du projet** au lieu du dossier **`backend/`**.

**Erreur dans les logs:**
```
No start command was found
```

**Cause:** Le **Root Directory** n'est pas configuré sur `backend`.

---

## ✅ SOLUTION EN 3 ÉTAPES

### **ÉTAPE 1: Configurer le Root Directory**

1. **Aller dans Railway Dashboard**
2. **Cliquer sur votre service** (celui qui a l'erreur)
3. **Onglet "Settings"**
4. **Chercher la section "Build"** ou **"Service Settings"**
5. **Trouver "Root Directory" ou "Source Directory"**
6. **Entrer:** `backend`
7. **Cliquer "Save"** ou appuyer sur Entrée

⚠️ **Railway va automatiquement redéployer!**

---

### **ÉTAPE 2: Attendre le redéploiement** (5-8 minutes)

Railway va:
- ✅ Détecter le `Dockerfile` dans `backend/`
- ✅ Trouver `requirements.txt`
- ✅ Trouver les fichiers `.m3u`
- ✅ Builder l'image Docker
- ✅ Démarrer le service

**Logs attendus:**
```
Building docker image...
Successfully built image
Starting service...
Deployment live!
```

---

### **ÉTAPE 3: Vérifier que ça fonctionne**

Une fois le déploiement terminé:

1. **Générer un domaine** (si pas déjà fait):
   - Settings → Networking → Generate Domain

2. **Tester le backend:**
   ```bash
   curl https://votre-projet.up.railway.app/
   ```

**Réponse attendue:**
```json
{
  "service": "AceStream → HLS Proxy",
  "version": "2.0.0",
  ...
}
```

---

## 🎯 CONFIGURATION COMPLÈTE RAILWAY

### Paramètres du service:

```
Root Directory: backend          ← CRITIQUE!
```

### Variables d'environnement (3):

```
ACESTREAM_BASE_URL = http://127.0.0.1:6878
STORAGE_DIR        = /app/storage
PORT               = ${{PORT}}
```

---

## 📸 CAPTURES D'ÉCRAN - OÙ TROUVER ROOT DIRECTORY

### Dans Railway Dashboard:

1. **Cliquer sur votre service**
2. **Onglet "Settings"**
3. **Faire défiler jusqu'à "Build" ou "Service"**
4. Vous verrez:
   ```
   Root Directory
   [_____________]  ← Entrer "backend" ici
   ```

---

## ⚠️ SI ÇA NE FONCTIONNE TOUJOURS PAS

### Option A: Vérifier que le Dockerfile existe

```bash
# Localement, vérifier:
ls backend/Dockerfile
```

**Devrait afficher:** `backend/Dockerfile`

### Option B: Vérifier les logs Railway

1. Dashboard Railway
2. Votre service
3. Onglet "Deployments"
4. Cliquer sur le dernier déploiement
5. Lire les logs

### Option C: Redéployer manuellement

1. Settings → "Restart"
2. OU Deployments → "Redeploy"

---

## 🚀 ALTERNATIVE: Utiliser railway.toml

Si la configuration via l'interface ne fonctionne pas, créer un fichier:

**Fichier: `railway.toml`** (à la racine du projet)

```toml
[build]
builder = "DOCKERFILE"
dockerfilePath = "backend/Dockerfile"

[deploy]
startCommand = "cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT"
```

Ensuite:
```bash
git add railway.toml
git commit -m "Add Railway configuration"
git push
```

Railway redéploiera automatiquement avec cette config.

---

## ✅ CHECKLIST DE VÉRIFICATION

- [ ] Root Directory = `backend` configuré dans Settings
- [ ] Variables d'environnement ajoutées (3 variables)
- [ ] Redéploiement terminé (vert dans Railway)
- [ ] Domaine généré
- [ ] Backend répond au curl

---

## 🆘 TOUJOURS BLOQUÉ?

### Méthode alternative: Dockerfile à la racine

Si vraiment Root Directory ne fonctionne pas, on peut créer un Dockerfile à la racine:

**Fichier: `Dockerfile`** (à la racine, pas dans backend/)

```dockerfile
FROM python:3.11-slim

# Installer dépendances système
RUN apt-get update && apt-get install -y \
    ffmpeg \
    wget \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copier depuis backend/
COPY backend/requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/app /app/app
COPY backend/*.m3u /app/

RUN mkdir -p /app/storage/hls

ENV ACESTREAM_BASE_URL=http://127.0.0.1:6878
ENV STORAGE_DIR=/app/storage
ENV PORT=8000

EXPOSE 8000

CMD uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

Ensuite:
```bash
git add Dockerfile
git commit -m "Add root Dockerfile for Railway"
git push
```

**Puis dans Railway:**
- Root Directory: (laisser vide ou `/`)

---

## 📞 BESOIN D'AIDE SUPPLÉMENTAIRE?

Envoyez-moi:
1. Capture d'écran de Settings → Build
2. Capture d'écran des logs complets
3. Confirmation que Root Directory = `backend`

Je vous aiderai à résoudre!

---

## 🎯 RÉSUMÉ RAPIDE

**LE PROBLÈME:** Railway cherche dans la racine au lieu de `backend/`

**LA SOLUTION:** Configurer Root Directory = `backend` dans Settings

**OÙ:** Dashboard → Service → Settings → Build → Root Directory

**RÉSULTAT:** Railway trouvera le Dockerfile et démarrera correctement!
