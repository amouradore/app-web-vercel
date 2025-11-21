#!/usr/bin/env python3
"""
Convertisseur AceStream vers Web Players - Solution finale
Permet de regarder les chaînes sans installer AceStream
"""
import re
import os
from typing import List, Dict

class AceStreamWebConverter:
    def __init__(self):
        """
        Solution optimale identifiée:
        1. Utiliser acestream.me/embed pour les iframes
        2. Fallback vers d'autres services si nécessaire
        3. Compatible avec votre architecture existante
        """
        self.web_services = [
            {
                "name": "AceStream Official Web",
                "embed_url": "https://acestream.me/embed/{hash}",
                "priority": 1,
                "reliable": True
            },
            {
                "name": "AceStream Player",
                "embed_url": "https://acestream.org/play/{hash}",
                "priority": 2, 
                "reliable": True
            },
            {
                "name": "Alternative Web Service",
                "embed_url": "https://torrentstream.net/embed/{hash}",
                "priority": 3,
                "reliable": False
            }
        ]
    
    def extract_acestream_hash(self, url: str) -> str:
        """Extrait le hash AceStream d'une URL"""
        patterns = [
            r'http://127\.0\.0\.1:6878/ace/getstream\?id=([a-f0-9]{40})',
            r'acestream://([a-f0-9]{40})',
            r'id=([a-f0-9]{40})'
        ]
        
        for pattern in patterns:
            match = re.search(pattern, url)
            if match:
                return match.group(1)
        return None
    
    def convert_to_web_url(self, acestream_hash: str, service_index: int = 0) -> str:
        """Convertit un hash AceStream vers une URL web"""
        if service_index < len(self.web_services):
            service = self.web_services[service_index]
            return service["embed_url"].format(hash=acestream_hash)
        return None
    
    def convert_m3u_file(self, input_file: str, output_file: str = None) -> bool:
        """Convertit un fichier M3U AceStream vers web services"""
        if not os.path.exists(input_file):
            print(f"❌ Fichier non trouvé: {input_file}")
            return False
        
        if output_file is None:
            output_file = input_file.replace('.m3u', '_web.m3u')
        
        try:
            with open(input_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Conversion ligne par ligne
            lines = content.split('\n')
            converted_lines = []
            conversions_count = 0
            
            for line in lines:
                acestream_hash = self.extract_acestream_hash(line)
                if acestream_hash:
                    # Remplacer par l'URL web
                    web_url = self.convert_to_web_url(acestream_hash)
                    converted_lines.append(web_url)
                    conversions_count += 1
                else:
                    converted_lines.append(line)
            
            # Sauvegarder le fichier converti
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write('\n'.join(converted_lines))
            
            print(f"✅ Conversion terminée:")
            print(f"   📁 Fichier source: {input_file}")
            print(f"   📁 Fichier converti: {output_file}")
            print(f"   🔄 {conversions_count} URLs converties")
            
            return True
            
        except Exception as e:
            print(f"❌ Erreur lors de la conversion: {e}")
            return False
    
    def generate_react_component(self) -> str:
        """Génère le composant React pour le web player"""
        react_code = '''
import React, { useState } from 'react';

const AceStreamWebPlayer = ({ aceStreamHash, title = "Live Stream" }) => {
    const [currentServiceIndex, setCurrentServiceIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    
    const webServices = [
        {
            name: "AceStream Official",
            embedUrl: `https://acestream.me/embed/${aceStreamHash}`,
            priority: 1
        },
        {
            name: "AceStream Player", 
            embedUrl: `https://acestream.org/play/${aceStreamHash}`,
            priority: 2
        }
    ];
    
    const currentService = webServices[currentServiceIndex];
    
    const handleServiceError = () => {
        if (currentServiceIndex < webServices.length - 1) {
            setCurrentServiceIndex(currentServiceIndex + 1);
            setIsLoading(true);
        }
    };
    
    const handleIFrameLoad = () => {
        setIsLoading(false);
    };
    
    return (
        <div className="acestream-web-player">
            <div className="player-header">
                <h3>{title}</h3>
                <span className="service-indicator">
                    📡 {currentService.name}
                </span>
            </div>
            
            {isLoading && (
                <div className="loading-indicator">
                    🔄 Chargement du stream...
                </div>
            )}
            
            <iframe
                src={currentService.embedUrl}
                width="100%"
                height="500px"
                frameBorder="0"
                allowFullScreen
                onLoad={handleIFrameLoad}
                onError={handleServiceError}
                style={{ 
                    display: isLoading ? 'none' : 'block',
                    border: 'none',
                    borderRadius: '8px'
                }}
            />
            
            {currentServiceIndex < webServices.length - 1 && (
                <button 
                    onClick={() => setCurrentServiceIndex(currentServiceIndex + 1)}
                    className="service-switcher"
                >
                    ↻ Essayer un autre service
                </button>
            )}
        </div>
    );
};

export default AceStreamWebPlayer;
'''
        return react_code

def main():
    """Fonction principale pour tester et appliquer la conversion"""
    converter = AceStreamWebConverter()
    
    print("🌐 CONVERTISSEUR ACESTREAM → WEB PLAYER")
    print("=" * 50)
    print("✅ Solution: Utilisation d'iframes vers acestream.me")
    print("✅ Avantage: Aucune installation requise")
    print("✅ Compatibilité: Fonctionne sur mobile et desktop")
    print()
    
    # Lister les fichiers M3U disponibles
    m3u_files = [f for f in os.listdir('.') if f.endswith('.m3u')]
    
    if m3u_files:
        print(f"📁 Fichiers M3U trouvés: {len(m3u_files)}")
        for file in m3u_files[:3]:  # Afficher les 3 premiers
            print(f"   • {file}")
        
        print(f"\n🔄 Conversion du fichier principal...")
        
        # Convertir le fichier principal
        main_file = 'lista.m3u' if 'lista.m3u' in m3u_files else m3u_files[0]
        success = converter.convert_m3u_file(main_file)
        
        if success:
            print(f"\n🎯 PROCHAINES ÉTAPES:")
            print(f"1. Intégrer le composant React généré")
            print(f"2. Remplacer les liens AceStream locaux par les URLs web")
            print(f"3. Tester avec vos chaînes préférées")
            print(f"4. Déployer sans dépendance AceStream !")
    else:
        print("❌ Aucun fichier M3U trouvé dans le répertoire")
    
    return converter

if __name__ == "__main__":
    main()