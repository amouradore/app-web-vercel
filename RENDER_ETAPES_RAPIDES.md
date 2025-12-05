# ⚡ RENDER - ÉTAPES RAPIDES (10 minutes)

## 🎯 Ce Qu'on Va Faire

Déployer votre backend sur Render.com **GRATUITEMENT** - Aucune carte requise !

---

## 📋 ÉTAPES EN BREF

### 1️⃣ Créer un Compte Render (2 min)
```
1. Allez sur https://render.com
2. Cliquez "Get Started"
3. "Continue with GitHub"
4. Autorisez l'accès
```
✅ **Aucune carte bancaire requise**

---

### 2️⃣ Connecter Votre Repo (2 min)
```
1. Cliquez "New +" → "Web Service"
2. Cherchez "app-web-vercel"
3. Cliquez "Connect"
```

---

### 3️⃣ Configuration (3 min)
```
Name:           acestream-backend
Region:         Frankfurt (EU Central)
Branch:         main
Root Directory: backend         ⚠️ IMPORTANT !
Runtime:        Docker
Instance Type:  Free
```

---

### 4️⃣ Variables d'Environnement (2 min)
```
ACESTREAM_BASE_URL = http://127.0.0.1:6878
STORAGE_DIR        = /app/storage
PORT               = 8000
PYTHON_VERSION     = 3.11
```

---

### 5️⃣ Déployer (5-10 min)
```
1. Cliquez "Create Web Service"
2. Attendez le build (5-10 min)
3. Copiez l'URL: https://acestream-backend-xxxx.onrender.com
```

---

### 6️⃣ Tester (1 min)
```
Ouvrez dans votre navigateur:
https://acestream-backend-xxxx.onrender.com/health
```

Vous devriez voir:
```json
{
  "status": "healthy",
  "service": "acestream-hls-proxy"
}
```

---

### 7️⃣ Configurer le Frontend (2 min)
```bash
cd webapp
echo "REACT_APP_API_URL=https://acestream-backend-xxxx.onrender.com" > .env
```

---

### 8️⃣ Tester l'Application (2 min)
```bash
npm start
```

Ouvrez http://localhost:3000 et testez un flux !

---

## ✅ CHECKLIST

- [ ] Compte Render créé
- [ ] Repo connecté
- [ ] Service configuré
- [ ] Variables ajoutées
- [ ] Déployé avec succès
- [ ] URL copiée
- [ ] Frontend configuré
- [ ] Application testée

---

## ⚠️ SI PROBLÈME

### Le Service Ne Démarre Pas
- Vérifiez que Root Directory = "backend"
- Vérifiez les logs dans Render Dashboard

### AceStream Ne Fonctionne Pas
- C'est possible, Render peut limiter P2P
- Alternative : Essayez Replit ou Self-hosting

### Service Sleep après 15 min
- Normal sur le plan gratuit
- Première requête = 30 secondes de démarrage
- Solution : Keep-alive ping toutes les 10 min

---

## 🎉 SUCCÈS !

Si tout fonctionne :
- ✅ Backend gratuit sur Render
- ✅ Aucune carte requise
- ✅ 750h/mois (= 24/7)
- ✅ 0€ total

---

## 📞 BESOIN D'AIDE ?

Consultez : **GUIDE_RENDER_COMPLET.md**

Ou dites-moi à quelle étape vous êtes bloqué !

---

**COMMENCEZ MAINTENANT : https://render.com** 🚀
