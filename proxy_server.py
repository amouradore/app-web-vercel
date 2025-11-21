from flask import Flask, request, Response, send_from_directory, jsonify
from flask_cors import CORS
import requests
import os
import json

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Chemin vers le dossier de l'application web
WEB_APP_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'webapp', 'build')

print(f"Looking for webapp build in: {WEB_APP_FOLDER}")
print(f"Webapp build exists: {os.path.exists(WEB_APP_FOLDER)}")
if os.path.exists(WEB_APP_FOLDER):
    print(f"Files in build: {os.listdir(WEB_APP_FOLDER)}")

@app.route('/')
def serve_index():
    return send_from_directory(WEB_APP_FOLDER, 'index.html')

# Route pour servir les fichiers statiques React (CSS, JS)
@app.route('/static/<path:filename>')
def serve_react_static(filename):
    static_folder = os.path.join(WEB_APP_FOLDER, 'static')
    print(f"Serving static file: {filename} from {static_folder}")
    return send_from_directory(static_folder, filename)

# Route catch-all pour les autres fichiers (favicon, manifest, etc.)
@app.route('/<path:filename>')
def serve_static(filename):
    # Éviter les conflits avec les routes API
    if filename.startswith('api/'):
        return "API route not found", 404
    print(f"Serving file: {filename} from {WEB_APP_FOLDER}")
    return send_from_directory(WEB_APP_FOLDER, filename)

# Route pour obtenir des informations sur un stream AceStream
@app.route('/api/stream/info/<stream_id>')
def get_stream_info(stream_id):
    try:
        # Vérifier si le serveur AceStream Engine est accessible
        acestream_url = f"http://127.0.0.1:6878/ace/getstream?id={stream_id}"
        
        # Tester la connexion
        test_response = requests.head(acestream_url, timeout=5)
        
        if test_response.status_code == 200:
            return jsonify({
                "status": "available",
                "stream_url": acestream_url,
                "proxy_url": f"/api/stream/play/{stream_id}"
            })
        else:
            return jsonify({
                "status": "acestream_not_running",
                "message": "AceStream Engine n'est pas en cours d'exécution"
            }), 503
            
    except requests.exceptions.RequestException:
        return jsonify({
            "status": "acestream_not_available",
            "message": "AceStream Engine n'est pas disponible sur ce système"
        }), 503

# Route pour streamer via le proxy
@app.route('/api/stream/play/<stream_id>')
def stream_acestream(stream_id):
    try:
        acestream_url = f"http://127.0.0.1:6878/ace/getstream?id={stream_id}"
        
        # Effectuer la requête au serveur AceStream
        resp = requests.get(acestream_url, stream=True, timeout=10)
        resp.raise_for_status()

        # Headers pour le streaming
        def generate():
            for chunk in resp.iter_content(chunk_size=8192):
                if chunk:
                    yield chunk

        # Headers appropriés pour le streaming vidéo
        headers = {
            'Content-Type': resp.headers.get('Content-Type', 'video/mp4'),
            'Cache-Control': 'no-cache',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }

        return Response(generate(), 
                       status=resp.status_code,
                       headers=headers,
                       mimetype=resp.headers.get('Content-Type', 'video/mp4'))

    except requests.exceptions.RequestException as e:
        print(f"Erreur streaming AceStream: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/proxy')
def proxy_stream():
    url = request.args.get('url')
    if not url:
        return "URL is missing", 400

    print(f"Proxying request for: {url}")

    try:
        # Effectue la requête au serveur de streaming
        # stream=True permet de lire le contenu par morceaux
        resp = requests.get(url, stream=True, timeout=10)
        resp.raise_for_status() # Lève une exception pour les codes d'erreur HTTP (4xx ou 5xx)

        # Crée une réponse Flask pour renvoyer le contenu du flux
        # Définit les en-têtes CORS pour autoriser l'accès depuis notre application web
        # Copie tous les en-têtes de la réponse originale, sauf ceux qui peuvent causer des problèmes
        excluded_headers = ['content-encoding', 'content-length', 'transfer-encoding', 'connection']
        headers = [(name, value) for name, value in resp.raw.headers.items()
                   if name.lower() not in excluded_headers]
        
        # Ajoute l'en-tête Access-Control-Allow-Origin pour CORS
        headers.append(('Access-Control-Allow-Origin', '*')) # Ou spécifiez http://localhost:8000 si vous voulez être plus restrictif

        return Response(resp.iter_content(chunk_size=10*1024), 
                        status=resp.status_code,
                        headers=headers)

    except requests.exceptions.RequestException as e:
        print(f"Error proxying request: {e}")
        return str(e), 500

if __name__ == '__main__':
    app.run(debug=True, port=8000)
