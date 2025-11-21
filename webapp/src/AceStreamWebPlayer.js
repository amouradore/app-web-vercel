import React, { useState, useEffect } from 'react';
import './AceStreamWebPlayer.css';

const AceStreamWebPlayer = ({ aceStreamHash, title = "Live Stream", onError }) => {
    const [currentServiceIndex, setCurrentServiceIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    
    const webServices = [
        {
            name: "AceStream Official",
            embedUrl: `https://acestream.me/embed/${aceStreamHash}`,
            priority: 1,
            description: "Service officiel AceStream"
        },
        {
            name: "AceStream Player",
            embedUrl: `https://acestream.org/play/${aceStreamHash}`,
            priority: 2,
            description: "Player alternatif"
        },
        {
            name: "Backup Service",
            embedUrl: `https://torrentstream.net/embed/${aceStreamHash}`,
            priority: 3,
            description: "Service de secours"
        }
    ];
    
    const currentService = webServices[currentServiceIndex];
    
    useEffect(() => {
        setIsLoading(true);
        setHasError(false);
    }, [currentServiceIndex, aceStreamHash]);
    
    const handleServiceError = () => {
        console.log(`❌ Erreur avec ${currentService.name}, tentative service suivant...`);
        
        if (currentServiceIndex < webServices.length - 1) {
            setCurrentServiceIndex(currentServiceIndex + 1);
        } else {
            setHasError(true);
            if (onError) {
                onError("Tous les services de streaming sont indisponibles");
            }
        }
    };
    
    const handleIFrameLoad = () => {
        console.log(`✅ Stream chargé via ${currentService.name}`);
        setIsLoading(false);
    };
    
    const switchToNextService = () => {
        if (currentServiceIndex < webServices.length - 1) {
            setCurrentServiceIndex(currentServiceIndex + 1);
        }
    };
    
    const resetToFirstService = () => {
        setCurrentServiceIndex(0);
        setHasError(false);
    };
    
    if (hasError) {
        return (
            <div className="acestream-error">
                <div className="error-content">
                    <h3>❌ Erreur de streaming</h3>
                    <p>Impossible de charger le stream depuis les services disponibles.</p>
                    <div className="error-actions">
                        <button onClick={resetToFirstService} className="retry-button">
                            🔄 Réessayer
                        </button>
                        <button onClick={() => window.location.reload()} className="reload-button">
                            ↻ Recharger la page
                        </button>
                    </div>
                </div>
            </div>
        );
    }
    
    return (
        <div className="acestream-web-player">
            <div className="player-header">
                <div className="stream-info">
                    <h3 className="stream-title">{title}</h3>
                    <div className="service-indicator">
                        <span className="service-icon">📡</span>
                        <span className="service-name">{currentService.name}</span>
                        <span className="service-description">({currentService.description})</span>
                    </div>
                </div>
                
                <div className="player-controls">
                    {currentServiceIndex < webServices.length - 1 && (
                        <button 
                            onClick={switchToNextService}
                            className="service-switcher"
                            title="Essayer un autre service"
                        >
                            ↻ Changer de service
                        </button>
                    )}
                </div>
            </div>
            
            <div className="player-container">
                {isLoading && (
                    <div className="loading-overlay">
                        <div className="loading-spinner"></div>
                        <p>🔄 Connexion au stream...</p>
                        <small>Service: {currentService.name}</small>
                    </div>
                )}
                
                <iframe
                    key={`${aceStreamHash}-${currentServiceIndex}`}
                    src={currentService.embedUrl}
                    width="100%"
                    height="500px"
                    frameBorder="0"
                    allowFullScreen
                    allow="fullscreen; autoplay"
                    onLoad={handleIFrameLoad}
                    onError={handleServiceError}
                    style={{ 
                        display: isLoading ? 'none' : 'block',
                        border: 'none',
                        borderRadius: '8px',
                        backgroundColor: '#000'
                    }}
                    title={`Stream: ${title}`}
                />
            </div>
            
            <div className="player-footer">
                <div className="stream-hash">
                    <small>🔗 Hash: {aceStreamHash.substring(0, 8)}...</small>
                </div>
                <div className="service-status">
                    <small>
                        Service {currentServiceIndex + 1}/{webServices.length} • 
                        Sans installation requise ✨
                    </small>
                </div>
            </div>
        </div>
    );
};

export default AceStreamWebPlayer;