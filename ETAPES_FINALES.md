# Configuration Backend Render - ÉTAPES FINALES

## ✅ URL Railway Obtenue
`https://acestream-server-production.up.railway.app`

## 🔧 Configuration Render (Backend)

1. **Allez sur** [Render.com](https://dashboard.render.com/)
2. **Cliquez sur votre service backend** (celui qui s'appelle probablement "app-web-vercel" ou similaire)
3. Dans le menu de gauche, cliquez sur **"Environment"**
4. Cliquez sur **"Add Environment Variable"**
5. Ajoutez :
   - **Key** : `ACEPROXY_URL`
   - **Value** : `https://acestream-server-production.up.railway.app`
6. Cliquez sur **"Save Changes"**

Render redéploiera automatiquement le backend (2-3 minutes).

## 📤 Pousser le Code Backend

Le backend a été modifié localement. Il faut le pousser sur GitHub :

```bash
git add backend/app/main.py GUIDE_DEPLOIEMENT_ACEPROXY.md CONFIGURATION_FINALE.md
git commit -m "feat: configure acestream server with Railway"
git pull --rebase
git push
```

## ✅ Test Final

Une fois Render redéployé :
1. Visitez votre app frontend (Vercel)
2. Cliquez sur une chaîne
3. Le lecteur devrait charger ! 🎥

## 📝 URL à Tester

Test API AceStream :
```
https://acestream-server-production.up.railway.app/webui/api/service?method=get_version
```

Backend API après redéploiement :
```
https://app-web-vercel.onrender.com/api/play
```
(avec un POST contenant `{"hash": "40_caracteres_hash"}`)
