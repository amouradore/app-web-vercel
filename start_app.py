#!/usr/bin/env python3
"""
Script de démarrage pour l'application de streaming
"""
import subprocess
import sys
import os
import time
import webbrowser
from threading import Thread

def check_dependencies():
    """Vérifier que les dépendances sont installées"""
    try:
        import flask
        from flask_cors import CORS
        print("✓ Flask et Flask-CORS installés")
    except ImportError as e:
        print(f"✗ Erreur: {e}")
        print("Installez les dépendances avec: pip install -r requirements.txt")
        return False
    
    # Vérifier les dépendances React
    if not os.path.exists("webapp/node_modules"):
        print("✗ Les dépendances React ne sont pas installées")
        print("Installez les dépendances avec: cd webapp && npm install")
        return False
    else:
        print("✓ Dépendances React installées")
    
    return True

def build_react_app():
    """Builder l'application React pour la production"""
    print("🔨 Building de l'application React...")
    try:
        result = subprocess.run(
            ["npm", "run", "build"], 
            cwd="webapp", 
            check=True, 
            capture_output=True, 
            text=True
        )
        print("✓ Build React terminé avec succès")
        return True
    except subprocess.CalledProcessError as e:
        print(f"✗ Erreur lors du build: {e}")
        print(f"Stdout: {e.stdout}")
        print(f"Stderr: {e.stderr}")
        return False

def start_proxy_server():
    """Démarrer le serveur proxy Flask"""
    print("🚀 Démarrage du serveur proxy Flask...")
    try:
        # Démarrer le serveur proxy
        subprocess.run([sys.executable, "proxy_server.py"], check=True)
    except KeyboardInterrupt:
        print("\n🛑 Arrêt du serveur proxy...")
    except subprocess.CalledProcessError as e:
        print(f"✗ Erreur serveur proxy: {e}")

def main():
    print("🎬 Démarrage de l'application de streaming")
    print("=" * 50)
    
    # Vérifier les dépendances
    if not check_dependencies():
        sys.exit(1)
    
    # Demander à l'utilisateur s'il veut builder l'app React
    build_choice = input("\nVoulez-vous builder l'application React ? (y/N): ").lower()
    
    if build_choice == 'y':
        if not build_react_app():
            print("Erreur lors du build. Continuons quand même...")
    
    print("\n📝 Instructions:")
    print("1. Le serveur sera accessible sur: http://localhost:8000")
    print("2. Pour que le streaming fonctionne, vous devez avoir AceStream Engine installé")
    print("3. AceStream Engine doit être en cours d'exécution sur le port 6878")
    print("4. Appuyez sur Ctrl+C pour arrêter le serveur")
    
    input("\nAppuyez sur Entrée pour continuer...")
    
    # Ouvrir le navigateur après un délai
    def open_browser():
        time.sleep(2)
        webbrowser.open('http://localhost:8000')
    
    browser_thread = Thread(target=open_browser)
    browser_thread.daemon = True
    browser_thread.start()
    
    # Démarrer le serveur
    start_proxy_server()

if __name__ == "__main__":
    main()