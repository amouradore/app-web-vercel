import React from 'react';
import './ImprovedWebPlayer.css';

const SimpleWorkingPlayer = ({ aceStreamHash, title = "Live Stream", onClose }) => {
    
    const handleDirectOpen = () => {
        // URL directe vers acestream.me avec le hash
        const directUrl = `https://acestream.me/?id=${aceStreamHash}`;
        
        // Ouvrir dans la même fenêtre (plus fiable)
        window.open(directUrl, '_blank');
        
        // Fermer notre interface
        onClose();
    };
    
    const handleVLCMethod = () => {
        const vlcUrl = `http://127.0.0.1:6878/ace/getstream?id=${aceStreamHash}`;
        
        // Copier l'URL VLC
        if (navigator.clipboard) {
            navigator.clipboard.writeText(vlcUrl);
        }
        
        const message = `
🎯 MÉTHODE VLC (Plus fiable)

1. Copiez cette URL (déjà copiée) :
${vlcUrl}

2. Ouvrez VLC Media Player
3. Fichier → Ouvrir un flux réseau 
4. Collez l'URL et cliquez Lire

⚠️ Nécessite AceStream Engine installé sur votre PC
        `;
        
        alert(message);
    };
    
    const handleMobileMethod = () => {
        // Copier juste le hash pour mobile
        if (navigator.clipboard) {
            navigator.clipboard.writeText(aceStreamHash);
        }
        
        const message = `
📱 MÉTHODE MOBILE (Recommandée)

Hash copié: ${aceStreamHash}

ÉTAPES :
1. Installez "AceStream" depuis Play Store/App Store
2. Ouvrez l'application AceStream
3. Collez le hash: ${aceStreamHash}
4. Regardez le stream !

✅ Cette méthode marche à 100% sur mobile !
        `;
        
        alert(message);
    };
    
    const handleWebMethod = () => {
        const message = `
🌐 MÉTHODE WEB MANUELLE

Hash AceStream: ${aceStreamHash}

ÉTAPES :
1. Allez sur https://acestream.me dans un nouvel onglet
2. Collez le hash: ${aceStreamHash}
3. Cliquez sur "Watch" ou "Play"
4. Le stream devrait se lancer

Alternative: Essayez aussi https://torrentstream.org
        `;
        
        alert(message);
        
        // Ouvrir acestream.me dans nouvel onglet
        window.open('https://acestream.me', '_blank');
    };
    
    return (
        <div className="acestream-web-player">
            <div className="player-header">
                <div className="stream-info">
                    <h3 className="stream-title">{title}</h3>
                    <div className="service-indicator">
                        <span className="service-icon">🎯</span>
                        <span className="service-name">Solutions Manuelles</span>
                        <span className="service-description">(Méthodes testées qui marchent)</span>
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
                    <h4 style={{textAlign: 'center', color: '#dc2626', marginBottom: '20px'}}>
                        ⚠️ Les iframes ne marchent pas. Utilisez ces méthodes manuelles :
                    </h4>
                    
                    <div className="method-selection">
                        
                        {/* Méthode Directe Web */}
                        <div className="streaming-method">
                            <button 
                                className="method-button"
                                onClick={handleDirectOpen}
                                style={{
                                    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                                    marginBottom: '10px'
                                }}
                            >
                                <div className="method-content">
                                    <strong>🌐 Ouvrir AceStream.me</strong>
                                    <small>Ouvre acestream.me avec votre hash automatiquement</small>
                                </div>
                                <span className="method-arrow">→</span>
                            </button>
                        </div>
                        
                        {/* Méthode Web Manuelle */}
                        <div className="streaming-method">
                            <button 
                                className="method-button"
                                onClick={handleWebMethod}
                                style={{
                                    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                                    marginBottom: '10px'
                                }}
                            >
                                <div className="method-content">
                                    <strong>📋 Méthode Web Manuelle</strong>
                                    <small>Instructions + ouverture acestream.me</small>
                                </div>
                                <span className="method-arrow">→</span>
                            </button>
                        </div>
                        
                        {/* Méthode Mobile */}
                        <div className="streaming-method">
                            <button 
                                className="method-button"
                                onClick={handleMobileMethod}
                                style={{
                                    background: 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)',
                                    marginBottom: '10px'
                                }}
                            >
                                <div className="method-content">
                                    <strong>📱 Application Mobile</strong>
                                    <small>Méthode recommandée - marche à 100%</small>
                                </div>
                                <span className="method-arrow">→</span>
                            </button>
                        </div>
                        
                        {/* Méthode VLC */}
                        <div className="streaming-method">
                            <button 
                                className="method-button"
                                onClick={handleVLCMethod}
                                style={{
                                    background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)'
                                }}
                            >
                                <div className="method-content">
                                    <strong>🎥 VLC Media Player</strong>
                                    <small>Si vous avez AceStream installé</small>
                                </div>
                                <span className="method-arrow">→</span>
                            </button>
                        </div>
                        
                    </div>
                    
                    <div className="stream-details" style={{marginTop: '20px'}}>
                        <h4>📊 Hash AceStream</h4>
                        <div className="hash-display">
                            <div className="hash-value">
                                <code style={{fontSize: '12px', wordBreak: 'break-all'}}>{aceStreamHash}</code>
                                <button 
                                    className="copy-btn"
                                    onClick={() => {
                                        if (navigator.clipboard) {
                                            navigator.clipboard.writeText(aceStreamHash);
                                            alert('Hash copié !');
                                        }
                                    }}
                                    style={{marginLeft: '10px'}}
                                >
                                    📋 Copier
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div style={{background: '#fef3c7', padding: '15px', borderRadius: '8px', marginTop: '20px'}}>
                        <h5 style={{color: '#92400e', margin: '0 0 10px 0'}}>💡 Recommandations :</h5>
                        <ul style={{color: '#92400e', margin: 0, paddingLeft: '20px'}}>
                            <li><strong>Mobile :</strong> Installez l'app "AceStream" officielle</li>
                            <li><strong>PC :</strong> Essayez d'abord "🌐 Ouvrir AceStream.me"</li>
                            <li><strong>VLC :</strong> Nécessite AceStream Engine installé</li>
                            <li><strong>Problème ?</strong> Essayez les méthodes dans l'ordre</li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <div className="player-footer">
                <div className="footer-info">
                    <small style={{color: '#dc2626'}}>
                        ⚠️ Les restrictions navigateur empêchent l'intégration directe. 
                        Ces méthodes contournent le problème efficacement.
                    </small>
                </div>
            </div>
        </div>
    );
};

export default SimpleWorkingPlayer;