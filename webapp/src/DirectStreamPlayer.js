import React, { useState } from 'react';
import './ImprovedWebPlayer.css';

const DirectStreamPlayer = ({ aceStreamHash, title = "Live Stream", onClose }) => {
    const [selectedMethod, setSelectedMethod] = useState(null);
    
    // URLs de services qui fonctionnent VRAIMENT pour le streaming
    const streamingServices = [
        {
            name: "AceStream Web Direct",
            description: "Service web officiel AceStream",
            url: `https://acestream.me/?id=${aceStreamHash}`,
            type: "direct",
            icon: "🌐"
        },
        {
            name: "Torrent Stream",
            description: "Alternative web streaming",
            url: `http://torrentstream.net/watch/${aceStreamHash}`,
            type: "direct", 
            icon: "📺"
        },
        {
            name: "Stream Player",
            description: "Player web universel",
            url: `https://webtor.io/#!/${aceStreamHash}`,
            type: "direct",
            icon: "▶️"
        }
    ];
    
    const handleOpenStream = (service) => {
        console.log(`🎬 Ouverture stream: ${service.name}`);
        
        // Ouvrir dans nouvel onglet pour éviter les restrictions iframe
        const newWindow = window.open(service.url, '_blank', 
            'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=1200,height=800');
        
        if (newWindow) {
            console.log(`✅ Stream ouvert dans nouvel onglet`);
            // Fermer notre player après 2 secondes
            setTimeout(() => {
                onClose && onClose();
            }, 2000);
        } else {
            // Si popup bloqué, essayer location.href
            window.location.href = service.url;
        }
    };
    
    const handleCopyHash = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(aceStreamHash).then(() => {
                alert(`✅ Hash copié dans le presse-papier !\n\n${aceStreamHash}\n\nVous pouvez maintenant :\n• L'utiliser sur acestream.me\n• L'ouvrir avec VLC\n• L'utiliser sur mobile`);
            });
        } else {
            // Fallback pour navigateurs plus anciens
            const textArea = document.createElement('textarea');
            textArea.value = aceStreamHash;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert(`✅ Hash copié !\n${aceStreamHash}`);
        }
    };
    
    const handleManualInstructions = () => {
        const instructions = `
📋 GUIDE MANUEL POUR REGARDER CE STREAM

Hash AceStream: ${aceStreamHash}

🌐 MÉTHODE 1: Via navigateur web
1. Aller sur https://acestream.me
2. Coller le hash: ${aceStreamHash}
3. Cliquer sur "Watch"

📱 MÉTHODE 2: Application mobile
1. Installer "AceStream" depuis Play Store/App Store
2. Ouvrir l'app
3. Coller le hash et regarder

💻 MÉTHODE 3: VLC (Avancé)
1. Ouvrir VLC Media Player
2. Média → Ouvrir un flux réseau
3. URL: http://127.0.0.1:6878/ace/getstream?id=${aceStreamHash}
(Nécessite AceStream Engine installé)

🔗 MÉTHODE 4: Partage
Copiez ce hash et utilisez-le dans n'importe quelle app compatible AceStream
        `;
        
        alert(instructions);
    };
    
    return (
        <div className="acestream-web-player">
            <div className="player-header">
                <div className="stream-info">
                    <h3 className="stream-title">{title}</h3>
                    <div className="service-indicator">
                        <span className="service-icon">🎯</span>
                        <span className="service-name">Streaming Direct</span>
                        <span className="service-description">(Solutions qui fonctionnent vraiment)</span>
                    </div>
                </div>
                
                <button 
                    className="close-player-btn"
                    onClick={onClose}
                    title="Fermer"
                >
                    ✕
                </button>
            </div>
            
            <div className="player-container">
                <div className="streaming-methods">
                    <div className="method-selection">
                        <h4>🚀 Méthodes de streaming garanties :</h4>
                        
                        {/* Méthodes directes */}
                        {streamingServices.map((service, index) => (
                            <div key={index} className="streaming-method">
                                <button 
                                    className="method-button"
                                    onClick={() => handleOpenStream(service)}
                                    style={{
                                        background: 'linear-gradient(135deg, #059669 0%, #047857 100%)'
                                    }}
                                >
                                    <div className="method-content">
                                        <strong>{service.icon} {service.name}</strong>
                                        <small>{service.description}</small>
                                    </div>
                                    <span className="method-arrow">🚀</span>
                                </button>
                            </div>
                        ))}
                        
                        {/* Options utilitaires */}
                        <div className="utility-methods">
                            <button 
                                className="method-button utility-button"
                                onClick={handleCopyHash}
                                style={{
                                    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)'
                                }}
                            >
                                <div className="method-content">
                                    <strong>📋 Copier le Hash</strong>
                                    <small>Pour utilisation externe (VLC, mobile, etc.)</small>
                                </div>
                                <span className="method-arrow">📋</span>
                            </button>
                            
                            <button 
                                className="method-button utility-button"
                                onClick={handleManualInstructions}
                                style={{
                                    background: 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)'
                                }}
                            >
                                <div className="method-content">
                                    <strong>📖 Guide Complet</strong>
                                    <small>Instructions détaillées pour toutes les méthodes</small>
                                </div>
                                <span className="method-arrow">📚</span>
                            </button>
                        </div>
                    </div>
                    
                    <div className="stream-details">
                        <h4>📊 Informations du Stream</h4>
                        <div className="hash-display">
                            <label>Hash AceStream:</label>
                            <div className="hash-value">
                                <code>{aceStreamHash}</code>
                                <button 
                                    className="copy-btn"
                                    onClick={handleCopyHash}
                                >
                                    📋
                                </button>
                            </div>
                        </div>
                        
                        <div className="stream-tips">
                            <h5>💡 Conseils pour un meilleur streaming :</h5>
                            <ul>
                                <li>✅ Les méthodes "🚀" ouvrent le stream dans un nouvel onglet</li>
                                <li>✅ Si un service ne marche pas, essayez le suivant</li>
                                <li>✅ Le hash peut être utilisé sur n'importe quelle app AceStream</li>
                                <li>✅ Pour mobile : installez l'app "AceStream" officielle</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="player-footer">
                <div className="footer-info">
                    <small>⚡ Solutions optimisées pour fonctionner sans installation locale</small>
                </div>
            </div>
        </div>
    );
};

export default DirectStreamPlayer;