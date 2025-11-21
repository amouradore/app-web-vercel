# Scripts et commandes utiles

## Lancer en local (POC complet)
```
# 1) Copier .env.example vers .env et ajuster si besoin
cp .env.example .env

# 2) Démarrer engine + backend
docker compose up -d --build

# 3) Vérifier que l'API répond
curl http://localhost:8000/docs

# 4) Tester un hash AceStream
curl -X POST http://localhost:8000/api/streams -H "Content-Type: application/json" -d '{"hash":"<VOTRE_HASH>"}'

# 5) Vous obtiendrez hlsUrl, ouvrez-le dans un player HLS (VLC, hls.js)
```

## Variables utiles
- ACESTREAM_BASE_URL: URL de l'engine vue par le backend (par défaut engine:6878 dans le réseau Docker)
- HLS_PUBLIC_BASE: si vous servez /hls derrière un CDN/Nginx (ex: https://cdn.domaine.com/hls)

## Nettoyage
```
docker compose down -v
```

## Notes
- L'image `romancin/acestream-engine` est fournie à titre de POC (non officielle). Remplacez-la en prod.
- Ouvrez le moins possible le port 6878 vers l'extérieur (réseau privé Docker recommandé).
- Surveillez la charge CPU/bande passante.
