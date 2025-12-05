# Guide d'installation Cloudflare Tunnel (100% Gratuit)

Ce guide vous permet d'exposer votre backend local sur Internet **gratuitement** et **sans limite de temps**.

## Prérequis

- Votre backend Python doit tourner sur `http://localhost:8000`
- AceStream Engine doit être installé et actif sur `http://localhost:6878`

## Étape 1 : Installation de cloudflared

### Windows

1. Téléchargez cloudflared :
   ```powershell
   # Télécharger la dernière version
   Invoke-WebRequest -Uri "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe" -OutFile "cloudflared.exe"
   ```

2. Déplacez `cloudflared.exe` dans un dossier de votre choix (ex: `C:\cloudflared\`)

3. Ajoutez ce dossier au PATH système (optionnel mais recommandé)

## Étape 2 : Création du tunnel (Mode Quick)

**Option Simple (sans compte Cloudflare) :**

```powershell
# Démarrer un tunnel temporaire
cloudflared tunnel --url http://localhost:8000
```

Cette commande va :
- Créer un tunnel temporaire
- Afficher une URL publique (ex: `https://random-name.trycloudflare.com`)
- Rediriger tout le trafic vers votre backend local

**Important :** Copiez l'URL affichée (elle change à chaque redémarrage du tunnel).

## Étape 3 : Configuration du Frontend

1. Ouvrez `webapp/.env` (créez-le si nécessaire)
2. Ajoutez :
   ```env
   REACT_APP_API_URL=https://votre-url-tunnel.trycloudflare.com
   ```
3. Redémarrez le frontend : `npm start`

## Étape 4 : Test complet

1. **Terminal 1** : Backend Python
   ```powershell
   cd backend
   uvicorn app.main:app --reload --port 8000
   ```

2. **Terminal 2** : Cloudflare Tunnel
   ```powershell
   cloudflared tunnel --url http://localhost:8000
   ```

3. **Terminal 3** : Frontend React
   ```powershell
   cd webapp
   npm start
   ```

4. Ouvrez `http://localhost:3000` et testez la lecture d'un flux

## Option Avancée : Tunnel Permanent (avec compte Cloudflare)

Si vous voulez une URL fixe qui ne change jamais :

1. Créez un compte gratuit sur [Cloudflare](https://dash.cloudflare.com/sign-up)

2. Authentifiez cloudflared :
   ```powershell
   cloudflared tunnel login
   ```

3. Créez un tunnel nommé :
   ```powershell
   cloudflared tunnel create acestream-backend
   ```

4. Configurez le tunnel (fichier `config.yml`) :
   ```yaml
   tunnel: <TUNNEL-ID>
   credentials-file: C:\Users\<VOTRE-USER>\.cloudflared\<TUNNEL-ID>.json

   ingress:
     - hostname: acestream-backend.votre-domaine.com
       service: http://localhost:8000
     - service: http_status:404
   ```

5. Lancez le tunnel :
   ```powershell
   cloudflared tunnel run acestream-backend
   ```

## Dépannage

### Le tunnel ne démarre pas
- Vérifiez que le backend est bien sur le port 8000
- Désactivez temporairement l'antivirus

### Erreur CORS
- C'est normal, le backend accepte déjà tous les domaines (`allow_origins=["*"]`)

### Le flux ne charge pas
- Vérifiez que AceStream Engine est actif (`http://localhost:6878`)
- Vérifiez les logs du backend pour voir les erreurs FFmpeg

## Avantages de cette solution

✅ **100% Gratuit** : Aucun coût, aucune limite de temps  
✅ **Pas de compte requis** : Mode quick tunnel sans inscription  
✅ **Pas de suspension** : Tant que votre PC est allumé, ça marche  
✅ **Performance** : Pas de latence cloud, tout est local  

## Inconvénients

⚠️ Votre PC doit rester allumé  
⚠️ L'URL change à chaque redémarrage (mode quick)  
⚠️ Votre IP publique est exposée (via Cloudflare)
