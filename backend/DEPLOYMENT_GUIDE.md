# Déploiement Backend AceStream → HLS

## Prérequis
- VPS Linux (ex: 4 vCPU / 8GB RAM)
- Docker + Docker Compose
- Nom de domaine (optionnel) et HTTPS (Caddy/Traefik/NGINX/Cloudflare)

## Étapes
1) Cloner votre repo et copier ce dossier `backend/`
2) Provisionner un service AceStream Engine (service `engine` du docker-compose)
   - Remplacer l'image par votre image/binaire fonctionnel
   - Vérifier que `http://engine:6878/ace/status` répond dans le réseau Docker
3) Démarrer le backend + engine:
```
docker compose up -d --build
```
4) Tester l'API:
```
curl -X POST http://<server>:8000/api/streams -H "Content-Type: application/json" -d '{"hash":"<ACESTREAM_HASH>"}'
```
Vous obtenez un `hlsUrl` (ex: /hls/<sessionId>/index.m3u8)

5) Exposer via reverse-proxy (HTTPS) et configurer CORS si nécessaire
6) Câbler le front (web + APK) pour appeler POST /api/streams et lire `hlsUrl`

## Notes
- Utiliser un CDN (Cloudflare) pour /hls est recommandé
- Implémenter des tokens et TTL stricts en prod
- Surveiller CPU/bande passante et limiter la résolution si besoin (-vf scale)
