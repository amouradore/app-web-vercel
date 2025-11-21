# AceStream Engine (Service) - Options de mise en place

Votre backend convertit AceStream → HLS en lisant l'Engine via HTTP (port 6878). Vous avez 3 options pour faire tourner l'Engine côté serveur.

Option A — Utiliser un Engine déjà installé sur la machine hôte (le plus simple pour tester)
1) Installez AceStream Engine sur la machine (Linux/Windows)
2) Vérifiez qu'il écoute sur http://127.0.0.1:6878 (ou 0.0.0.0)
3) Dans `docker-compose.yml`, mettez côté backend:
   - ACESTREAM_BASE_URL=http://host.docker.internal:6878 (Windows/Mac)
   - ou http://172.17.0.1:6878 (Linux Docker bridge)
4) Ne lancez pas le service `engine` du compose.

Option B — Utiliser une image communautaire Docker (rapide)
AVERTISSEMENT: Images non-officielles. Utilisez à vos risques, testez en POC uniquement.

Exemples d'images:
- romancin/acestream-engine:latest
- pirafrank/acestream-engine

Dans docker-compose.yml (déjà prêt):
- Le service `engine` utilise par défaut `romancin/acestream-engine:latest`
- Expose le port 6878

Option C — Construire sa propre image Engine (avancé)
Fichier Dockerfile fourni en exemple (commenté) pour construire un conteneur Engine si vous avez des binaires/licences.

Bonnes pratiques (prod)
- Restreindre l'accès au port 6878 depuis l'extérieur (réseau privé Docker)
- Le backend seul doit parler à l'Engine
- Limiter la durée des sessions et surveiller la bande passante
- Conformité légale: vous êtes responsable des contenus consommés/diffusés
