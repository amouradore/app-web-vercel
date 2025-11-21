#!/usr/bin/env python3
"""
Script pour démarrer l'application complète
- React dev server sur port 3000 (interface)
- Flask API server sur port 8000 (backend)
"""
import subprocess
import sys
import time
import webbrowser
from threading import Thread
import os

def start_react_dev():
    """Démarre le serveur de développement React"""
    print("🎨 Démarrage du serveur React...")
    os.chdir("webapp")
    subprocess.run(["npm", "start"], shell=True)

def start_flask_api():
    """Démarre le serveur API Flask"""
    print("🔧 Démarrage de l'API Flask...")
    subprocess.run([sys.executable, "simple_server.py"], shell=True)

def open_browser():
    """Ouvre le navigateur après un délai"""
    time.sleep(8)
    print("🌐 Ouverture du navigateur...")
    webbrowser.open('http://localhost:3000')

def main():
    print("🚀 DÉMARRAGE DE L'APPLICATION COMPLÈTE")
    print("=" * 50)
    print("React Dev Server : http://localhost:3000 (Interface)")
    print("Flask API Server : http://localhost:8000 (Backend)")
    print("=" * 50)
    
    # Modifier l'URL de l'API dans le composant VideoPlayer
    print("📝 Configuration de l'URL de l'API...")
    
    # Lancer le navigateur en arrière-plan
    browser_thread = Thread(target=open_browser)
    browser_thread.daemon = True
    browser_thread.start()
    
    # Créer des threads pour les deux serveurs
    react_thread = Thread(target=start_react_dev)
    react_thread.daemon = True
    
    flask_thread = Thread(target=start_flask_api)
    flask_thread.daemon = True
    
    # Démarrer les serveurs
    react_thread.start()
    time.sleep(2)
    flask_thread.start()
    
    try:
        # Attendre les threads
        react_thread.join()
        flask_thread.join()
    except KeyboardInterrupt:
        print("\n🛑 Arrêt de l'application...")
        sys.exit(0)

if __name__ == "__main__":
    main()