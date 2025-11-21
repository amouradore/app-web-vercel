#!/usr/bin/env python3
from flask import Flask, send_from_directory, jsonify, request, Response
from flask_cors import CORS
import os
import requests

app = Flask(__name__)
CORS(app)

# Dossier build React
BUILD_DIR = os.path.join(os.path.dirname(__file__), 'webapp', 'build')

print(f"Serving React app from: {BUILD_DIR}")
print(f"Build directory exists: {os.path.exists(BUILD_DIR)}")

@app.route('/')
def serve_react_app():
    return send_from_directory(BUILD_DIR, 'index.html')

@app.route('/static/<path:path>')
def serve_static_files(path):
    return send_from_directory(os.path.join(BUILD_DIR, 'static'), path)

@app.route('/manifest.json')
def serve_manifest():
    return send_from_directory(BUILD_DIR, 'manifest.json')

@app.route('/favicon.ico')
def serve_favicon():
    return send_from_directory(BUILD_DIR, 'favicon.ico')

@app.route('/logo192.png')
def serve_logo192():
    return send_from_directory(BUILD_DIR, 'logo192.png')

@app.route('/logo512.png')
def serve_logo512():
    return send_from_directory(BUILD_DIR, 'logo512.png')

@app.route('/robots.txt')
def serve_robots():
    return send_from_directory(BUILD_DIR, 'robots.txt')

# API pour les streams AceStream
@app.route('/api/stream/info/<stream_id>')
def get_stream_info(stream_id):
    try:
        acestream_url = f"http://127.0.0.1:6878/ace/getstream?id={stream_id}"
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

@app.route('/api/stream/play/<stream_id>')
def stream_acestream(stream_id):
    try:
        acestream_url = f"http://127.0.0.1:6878/ace/getstream?id={stream_id}"
        resp = requests.get(acestream_url, stream=True, timeout=10)
        resp.raise_for_status()

        def generate():
            for chunk in resp.iter_content(chunk_size=8192):
                if chunk:
                    yield chunk

        headers = {
            'Content-Type': resp.headers.get('Content-Type', 'video/mp4'),
            'Cache-Control': 'no-cache',
            'Access-Control-Allow-Origin': '*'
        }

        return Response(generate(), 
                       status=resp.status_code,
                       headers=headers)

    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("🚀 Démarrage du serveur sur http://localhost:8000")
    print("📁 Serveur React + API AceStream")
    app.run(host='0.0.0.0', port=8000, debug=True)