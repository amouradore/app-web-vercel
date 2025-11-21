# Backend AceStream → HLS (POC)

Objectif: convertir un hash AceStream en flux HLS lisible par navigateur/mobile, sans installer AceStream côté utilisateur.

## Architecture (POC)
- FastAPI: endpoints REST pour démarrer/arrêter/suivre une session de streaming
- AceStream Engine: doit tourner côté serveur (service séparé)
- FFmpeg: lit `http://engine:6878/ace/getstream?id={hash}` et sort en HLS (segments + manifest)
- Stockage HLS: dossier local `./storage/hls/{sessionId}` (servi en statique par FastAPI)

## Endpoints
- POST `/api/streams` { hash, ttlSeconds? } → { sessionId, hlsUrl }
- GET  `/api/streams/{sessionId}` → statut (running, bytes, startedAt, hlsUrl)
- DELETE `/api/streams/{sessionId}` → stoppe la session et nettoie

## Lancement local (POC sans engine)
```
python -m venv .venv
. .venv/bin/activate  # Windows: .venv\Scripts\Activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Note: vous aurez besoin d'un AceStream Engine accessible par le backend (ex: `http://localhost:6878`). En prod, utilisez docker-compose pour avoir un service `engine` dans le réseau Docker.

## Déploiement (esquisse)
- Docker (backend) + service AceStream Engine + volume persistant pour segments
- Optionnel: Nginx ou CDN pour servir /hls
- Sécurité: tokens JWT courts, TTL sessions, rate-limit
