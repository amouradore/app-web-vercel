import React, { useState, useEffect } from 'react';
import './AceStreamWebPlayer.css';

const ImprovedWebPlayer = ({ aceStreamHash, title = "Live Stream", onError, onClose }) => {
    const [currentMethod, setCurrentMethod] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [showInstructions, setShowInstructions] = useState(false);
    
    // Solutions alternatives qui fonctionnent VRAIMENT
    const streamingMethods = [
        {
            name: "Ouverture Nouvelle Fenêtre",
            description: "Ouvre le stream dans un nouvel onglet",
            type: "popup",
            url: `https://acestream.me/?id=${aceStreamHash}`,
            action: () => {
                window.open(`https://acestream.me/?id=${aceStreamHash}`, '_blank');
                return true;
            }
        },
        {
            name: "Lien Direct AceStream",
            description: "Lance AceStream directement",
            type: "direct",
            url: `acestream://${aceStreamHash}`,
            action: () => {
                window.location.href = `acestream://${aceStreamHash}`;
                return true;
            }
        },
        {
            name: "Copie Hash",
            description: "Copie le hash pour usage externe",
            type: "copy",
            action: () => {
                navigator.clipboard.writeText(aceStreamHash);
                alert(`Hash copié ! ${aceStreamHash}`);
                return true;
            }
        },
        {
            name: "Instructions Web",
            description: "Guide d'utilisation alternatif",
            type: "instructions",
            action: () => {
                setShowInstructions(true);
                return true;
            }
        }
    ];
    
    const currentSolution = streamingMethods[currentMethod];
    
    useEffect(() => {
        setIsLoading(false);
    }, [currentMethod, aceStreamHash]);
    
    const handleMethodClick = (methodIndex) => {
        const method = streamingMethods[methodIndex];
        console.log(`🎬 Tentative: ${method.name}`);
        
        try {
            const success = method.action();
            if (success) {
                console.log(`✅ ${method.name} exécuté avec succès`);
                // On peut fermer le player après 2 secondes si c'est une action externe
                if (method.type !== 'instructions') {
                    setTimeout(() => {
                        onClose && onClose();
                    }, 2000);
                }
            }
        } catch (error) {
            console.error(`❌ Erreur ${method.name}:`, error);
            setHasError(true);
        }
    };
    
    const InstructionsPanel = () => (
        <div className="instructions-panel">
            <h4>📋 Comment regarder ce stream</h4>
            <div className="instructions-content">
                <div className="instruction-step">
                    <strong>Option 1: Via navigateur web</strong>
                    <ol>
                        <li>Aller sur <a href="https://acestream.me" target="_blank" rel="noopener noreferrer">acestream.me</a></li>
                        <li>Coller le hash: <code>{aceStreamHash}</code></li>
                        <li>Cliquer sur "Play"</li>
                    </ol>
                </div>
                
                <div className="instruction-step">
                    <strong>Option 2: Application mobile</strong>
                    <ol>
                        <li>Télécharger "AceStream" sur Play Store/App Store</li>
                        <li>Ouvrir l'app et coller le hash</li>
                        <li>Profiter du stream</li>
                    </ol>
                </div>
                
                <div className="instruction-step">
                    <strong>Option 3: VLC (Advanced)</strong>
                    <ol>
                        <li>Installer AceStream Engine</li>
                        <li>Ouvrir VLC → Réseau → <code>http://127.0.0.1:6878/ace/getstream?id={aceStreamHash}</code></li>
                    </ol>
                </div>
            </div>
            
            <button 
                className="copy-hash-btn"
                onClick={() => {
                    navigator.clipboard.writeText(aceStreamHash);
                    alert('Hash copié dans le presse-papier !');
                }}
            >
                📋 Copier le Hash
            </button>
        </div>
    );
    
    return (
        <div className="acestream-web-player">
            <div className="player-header">
                <div className="stream-info">
                    <h3 className="stream-title">{title}</h3>
                    <div className="service-indicator">
                        <span className="service-icon">🎯</span>
                        <span className="service-name">Solutions Alternatives</span>
                        <span className="service-description">(Méthodes qui fonctionnent vraiment)</span>
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
                {!showInstructions ? (
                    <div className="streaming-methods">
                        <div className="method-selection">
                            <h4>🚀 Choisissez votre méthode de streaming :</h4>
                            
                            {streamingMethods.map((method, index) => (
                                <div key={index} className="streaming-method">
                                    <button 
                                        className="method-button"
                                        onClick={() => handleMethodClick(index)}
                                    >
                                        <div className="method-content">
                                            <strong>{method.name}</strong>
                                            <small>{method.description}</small>
                                        </div>
                                        <span className="method-arrow">→</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                        
                        <div className="stream-details">
                            <h4>📊 Informations du Stream</h4>
                            <div className="hash-display">
                                <label>Hash AceStream:</label>
                                <div className="hash-value">
                                    <code>{aceStreamHash}</code>
                                    <button 
                                        className="copy-btn"
                                        onClick={() => {
                                            navigator.clipboard.writeText(aceStreamHash);
                                            alert('Hash copié !');
                                        }}
                                    >
                                        📋
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <InstructionsPanel />
                )}
            </div>
            
            <div className="player-footer">
                <div className="footer-info">
                    <small>💡 Ces méthodes contournent les limitations des iframes web</small>
                </div>
                {showInstructions && (
                    <button 
                        className="back-button"
                        onClick={() => setShowInstructions(false)}
                    >
                        ← Retour aux options
                    </button>
                )}
            </div>
        </div>
    );
};

export default ImprovedWebPlayer;