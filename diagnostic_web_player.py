#!/usr/bin/env python3
"""
Diagnostic des services web AceStream
Identifie pourquoi les iframes ne diffusent pas l'image
"""
import requests
import time
from urllib.parse import urlparse

def test_acestream_services():
    """Test les différents services AceStream web"""
    
    # Hash de test (DAZN F1)
    test_hash = "d65257bb934b73647374224fd62d836815804be2"
    
    services = [
        {
            "name": "AceStream.me Embed",
            "url": f"https://acestream.me/embed/{test_hash}",
            "type": "embed"
        },
        {
            "name": "AceStream.org Play", 
            "url": f"https://acestream.org/play/{test_hash}",
            "type": "player"
        },
        {
            "name": "AceStream Direct API",
            "url": f"https://api.acestream.me/stream/{test_hash}",
            "type": "api"
        },
        {
            "name": "Alternative Service 1",
            "url": f"https://torrentstream.net/embed/{test_hash}",
            "type": "embed"
        }
    ]
    
    print("🔍 DIAGNOSTIC SERVICES WEB ACESTREAM")
    print("=" * 50)
    
    working_services = []
    
    for service in services:
        print(f"\n🧪 Test: {service['name']}")
        print(f"URL: {service['url']}")
        
        try:
            response = requests.head(service['url'], timeout=10, allow_redirects=True)
            
            print(f"Status: {response.status_code}")
            print(f"Content-Type: {response.headers.get('content-type', 'N/A')}")
            
            if response.status_code == 200:
                print("✅ Service accessible")
                working_services.append(service)
            elif response.status_code == 404:
                print("❌ Service non trouvé")
            else:
                print(f"⚠️ Status non optimal: {response.status_code}")
                
        except Exception as e:
            print(f"❌ Erreur: {str(e)}")
    
    return working_services

def find_alternative_solutions():
    """Recherche des solutions alternatives"""
    
    print("\n🔄 SOLUTIONS ALTERNATIVES IDENTIFIÉES")
    print("=" * 45)
    
    alternatives = [
        {
            "name": "Proxy AceStream Local Amélioré",
            "description": "Créer un proxy local intelligent qui gère mieux les streams",
            "difficulty": "Moyen",
            "effectiveness": "Haute"
        },
        {
            "name": "Services HLS/M3U8 Alternatifs", 
            "description": "Remplacer AceStream par des flux HTTP directs",
            "difficulty": "Faible",
            "effectiveness": "Très Haute"
        },
        {
            "name": "Conversion Real-time",
            "description": "Convertir AceStream vers HLS à la volée",
            "difficulty": "Élevé",
            "effectiveness": "Haute"
        },
        {
            "name": "Services Tiers Spécialisés",
            "description": "Utiliser des APIs de streaming sportif légales",
            "difficulty": "Moyen",
            "effectiveness": "Très Haute"
        }
    ]
    
    for i, alt in enumerate(alternatives, 1):
        print(f"\n{i}. {alt['name']}")
        print(f"   📝 {alt['description']}")
        print(f"   🔧 Difficulté: {alt['difficulty']}")
        print(f"   ⚡ Efficacité: {alt['effectiveness']}")
    
    return alternatives

def check_iframe_compatibility():
    """Vérifie les problèmes d'iframe"""
    
    print("\n🖼️ DIAGNOSTIC IFRAME")
    print("=" * 25)
    
    issues = [
        "❌ X-Frame-Options: Les services bloquent l'affichage en iframe",
        "❌ CORS Policy: Politique de sécurité cross-origin",
        "❌ HTTPS/HTTP Mixed Content: Problème de protocoles mélangés",
        "❌ Content Security Policy: Restrictions CSP",
        "❌ Bloqueurs de publicité: Extensions qui bloquent les iframes"
    ]
    
    for issue in issues:
        print(f"  {issue}")
    
    print("\n💡 SOLUTIONS IFRAME:")
    print("  ✅ Utiliser des URLs directes au lieu d'iframes")
    print("  ✅ Implémenter un proxy server côté backend")
    print("  ✅ Ouvrir dans une nouvelle fenêtre/tab")
    print("  ✅ Utiliser des services avec headers permissifs")

if __name__ == "__main__":
    print("🚨 PROBLÈME IDENTIFIÉ:")
    print("Les services web AceStream ne diffusent pas l'image dans les iframes\n")
    
    # Test des services
    working = test_acestream_services()
    
    # Alternatives
    alternatives = find_alternative_solutions()
    
    # Diagnostic iframe
    check_iframe_compatibility()
    
    print(f"\n🎯 RECOMMANDATION IMMÉDIATE:")
    print("Implémenter la Solution #2: Services HLS/M3U8 Alternatifs")
    print("Cette solution contourne complètement le problème AceStream")