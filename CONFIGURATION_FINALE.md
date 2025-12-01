# Configuration AceStream Server (Magnetikonline)

## ✅ Service Railway Déployé

Votre service AceStream Server est maintenant en cours d'exécution sur Railway !

## 📝 Étapes Restantes

### 1. Générer l'URL Publique Railway

Dans l'interface Railway que vous avez ouverte :

1. Allez dans l'onglet **"Settings"** (Paramètres)
2. Scroll jusqu'à la section **"Networking"**
3. Cliquez sur **"Generate Domain"** ou **"Add Public Domain"**
4. Railway générera une URL comme : `https://your-service-name.railway.app`

**⚠️ IMPORTANT :** Copiez cette URL, vous en aurez besoin pour la suite !

### 2. Tester le Service (Optionnel)

Vérifiez que le service fonctionne en visitant dans votre navigateur :
```
https://votre-url.railway.app/webui/api/service?method=get_version
```

Vous devriez voir une réponse JSON avec la version d'AceStream.

### 3. Configurer le Backend Render

1. Allez sur [Render.com](https://render.com)
2. Accédez à votre service backend (Python API)
3. Allez dans **"Environment"** (Variables d'environnement)
4. Ajoutez une nouvelle variable :
   - **Key** : `ACEPROXY_URL`
   - **Value** : `https://votre-url.railway.app` (SANS le port 6878, juste l'URL HTTPS)

5. Cliquez sur **"Save Changes"**
6. Render redéploiera automatiquement le backend

### 4. Mise à Jour du Code

Le backend a déjà été modifié localement pour utiliser la bonne API :
- Port : 6878
- Endpoint : `/ace/getstream?id={HASH}`
- Type : `magnetikonline_docker`

**Il faut maintenant pousser les changements sur GitHub :**
```bash
git add backend/app/main.py
git commit -m "fix: update to use magnetikonline acestream-server API"
git push
```

### 5. Tester l'Application

Une fois le backend redéployé :
1. Visitez votre application frontend (Vercel)
2. Cliquez sur une chaîne
3. Le lecteur devrait maintenant charger le flux !

## 🆘 Besoin d'Aide ?

Dites-moi une fois que vous avez :
1. ✅ Généré l'URL publique Railway
2. ✅ Ajouté la variable `ACEPROXY_URL` sur Render

Je vous aiderai pour la suite !
