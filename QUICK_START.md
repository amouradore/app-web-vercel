# Guide Rapide - Démarrage de l'Application

## Services Actifs

✅ **Backend Python** - `http://localhost:8000`  
✅ **Cloudflare Tunnel** - Tunnel public actif  
✅ **Frontend React** - `http://localhost:3000`

## Configuration Actuelle

Le fichier `webapp/.env` est configuré pour utiliser le backend **local** :
```
REACT_APP_API_URL=http://localhost:8000
```

### Option 1 : Test Local (Configuration Actuelle)
- Fonctionne uniquement sur votre machine
- Utile pour tester que tout fonctionne correctement
- Ouvrez `http://localhost:3000` dans votre navigateur

### Option 2 : Accès Public via Cloudflare Tunnel

1. **Trouvez l'URL du tunnel** dans la fenêtre PowerShell "Cloudflare Tunnel"
   - Cherchez une ligne comme : `https://xxxx-yyyy-zzzz.trycloudflare.com`

2. **Mettez à jour** `webapp/.env` :
   ```
   REACT_APP_API_URL=https://votre-url-tunnel.trycloudflare.com
   ```

3. **Redémarrez le frontend** :
   - Arrêtez le serveur (Ctrl+C dans le terminal)
   - Relancez : `npm start`

4. **Partagez l'URL** :
   - Déployez le frontend sur Vercel/Netlify
   - Configurez `REACT_APP_API_URL` avec l'URL du tunnel
   - Les utilisateurs n'ont plus besoin d'AceStream installé !

## Résolution de Problèmes

### Le flux ne charge pas
- Vérifiez que AceStream Engine tourne (port 6878)
- Consultez les logs du backend pour voir les erreurs FFmpeg
- Attendez 15-30 secondes pour la première conversion

### L'URL du tunnel ne fonctionne pas
- Vérifiez que les 3 services tournent
- L'URL change à chaque redémarrage du tunnel
- Pour une URL fixe, consultez `backend/CLOUDFLARE_TUNNEL_SETUP.md`

## Commandes Utiles

```powershell
# Relancer tous les services
.\backend\start-tunnel.ps1

# Lancer uniquement le frontend
cd webapp
npm start

# Vérifier le backend
curl http://localhost:8000/health
```
