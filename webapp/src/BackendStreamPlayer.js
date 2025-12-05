import React, { useState, useEffect } from 'react';
import { getApiUrl } from './services/streamApi';

/**
 * BackendStreamPlayer - Streaming via votre backend
 * Utilise /api/stream/{hash} pour streamer via votre serveur
 */
const BackendStreamPlayer = ({ aceStreamHash, onClose }) => {
    const [streamUrl, setStreamUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (aceStreamHash) {
            // URL du stream HLS via votre backend
            const backendUrl = getApiUrl();
            // Utiliser HLS playlist au lieu du stream direct
            const url = `${backendUrl}/api/stream/${aceStreamHash}/playlist.m3u8`;

            setStreamUrl(url);
            setLoading(false);
        }
    }, [aceStreamHash]);

    if (loading) {
        return (
            <div className="stream-player-overlay">
                <div className="stream-player-container">
                    <div className="stream-player-header">
                        <h3>🎬 Préparation du flux...</h3>
                        <button onClick={onClose} className="close-button">✕</button>
                    </div>
                    <div className="stream-player-content">
                        <div className="loading-spinner">
                            <div className="spinner"></div>
                            <p>Connexion au serveur AceStream...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="stream-player-overlay">
                <div className="stream-player-container">
                    <div className="stream-player-header">
                        <h3>❌ Erreur</h3>
                        <button onClick={onClose} className="close-button">✕</button>
                    </div>
                    <div className="stream-player-content">
                        <div className="error-message">
                            <p>{error}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="stream-player-overlay">
            <div className="stream-player-container">
                <div className="stream-player-header">
                    <h3>📺 Lecture en cours</h3>
                    <button onClick={onClose} className="close-button">✕</button>
                </div>
                <div className="stream-player-content">
                    <video
                        controls
                        autoPlay
                        style={{ width: '100%', maxHeight: '70vh' }}
                        src={streamUrl}
                    >
                        Votre navigateur ne supporte pas la balise vidéo.
                    </video>

                    <div className="stream-info">
                        <p>
                            <strong>📡 Source :</strong> Votre serveur backend
                        </p>
                        <p>
                            <strong>🔗 Hash :</strong> {aceStreamHash}
                        </p>
                        <p>
                            <strong>ℹ️ Info :</strong> Le flux est converti en temps réel par votre serveur
                        </p>
                    </div>

                    <div className="stream-instructions">
                        <h4>💡 Si la vidéo ne démarre pas :</h4>
                        <ol>
                            <li>Vérifiez que AceStream Engine est actif sur votre PC</li>
                            <li>Vérifiez que le backend répond sur : {getApiUrl()}</li>
                            <li>Attendez quelques secondes pour la mise en mémoire tampon</li>
                        </ol>
                    </div>

                    <div className="alternative-methods">
                        <h4>🎯 Autres méthodes :</h4>
                        <button
                            onClick={() => {
                                const vlcUrl = `acestream://${aceStreamHash}`;
                                navigator.clipboard.writeText(vlcUrl);
                                alert(`✅ Lien copié !\n\nVous pouvez maintenant :\n• Ouvrir VLC\n• Fichier → Ouvrir un flux réseau\n• Coller : ${vlcUrl}`);
                            }}
                            className="method-button"
                        >
                            📋 Copier pour VLC
                        </button>

                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(aceStreamHash);
                                alert(`✅ Hash copié !\n\n${aceStreamHash}\n\nUtilisez-le avec l'application AceStream sur mobile`);
                            }}
                            className="method-button"
                        >
                            📱 Copier le hash
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BackendStreamPlayer;
