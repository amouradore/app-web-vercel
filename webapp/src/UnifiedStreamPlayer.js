import React, { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';
import { playChannel, checkBackendHealth } from './services/streamApi';
import './VideoPlayer.css';

/**
 * UnifiedStreamPlayer - Lecteur Web via Backend
 * Utilise le backend Python pour convertir AceStream en HLS.
 */
const UnifiedStreamPlayer = ({ channel, onClose }) => {
  const [streamUrl, setStreamUrl] = useState(null);
  const [isEmbed, setIsEmbed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusMessage, setStatusMessage] = useState('Initialisation...');
  const [backendReady, setBackendReady] = useState(false);

  const playerRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    const initStream = async () => {
      try {
        setIsLoading(true);
        setError(null);
        setStreamUrl(null);
        setIsEmbed(false);

        // 1. Vérifier le backend
        setStatusMessage('Vérification du serveur...');
        const health = await checkBackendHealth();

        if (!mounted) return;

        if (!health.available) {
          throw new Error("Le serveur de streaming n'est pas accessible. Assurez-vous que le backend Python est lancé.");
        }

        setBackendReady(true);

        // 2. Demander le flux
        setStatusMessage('Préparation du flux vidéo...');
        console.log('Demande de flux pour:', channel.acestream_hash);

        const data = await playChannel(channel.acestream_hash);

        if (!mounted) return;

        console.log('Flux reçu:', data);
        
        if (data.type === 'web_embed' || data.backend === 'web_iframe') {
            setIsEmbed(true);
            setStreamUrl(data.stream_url); // Note: backend returns stream_url (snake_case)
            setStatusMessage('Chargement du lecteur web...');
        } else {
            setIsEmbed(false);
            setStreamUrl(data.stream_url || data.hls_url);
            setStatusMessage('Chargement de la vidéo...');
        }
        
        // Pour les embeds, on arrête le loading quand l'iframe charge (ou on laisse un court délai)
        if (data.type === 'web_embed') {
            setTimeout(() => setIsLoading(false), 1000);
        }

      } catch (err) {
        console.error('Erreur streaming:', err);
        if (mounted) {
          setError(err.message || "Impossible de démarrer le flux.");
          setIsLoading(false);
        }
      }
    };

    if (channel && channel.acestream_hash) {
      initStream();
    }

    return () => {
      mounted = false;
    };
  }, [channel]);

  const handlePlayerReady = () => {
    setIsLoading(false);
    setStatusMessage('');
  };

  const handlePlayerError = (e) => {
    console.error('Erreur lecteur:', e);
    if (streamUrl && !isEmbed) {
      setStatusMessage('Attente des segments vidéo...');
    }
  };

  return (
    <div className="video-player-overlay">
      <div className="video-player-container">
        {/* Header */}
        <div className="video-player-header">
          <div className="header-info">
            <h3>{channel.name || 'Lecture en cours'}</h3>
            <span className="service-badge">
              {isEmbed ? '🌐 Lecteur Web' : '⚡ Serveur HLS'}
            </span>
          </div>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        {/* Content */}
        <div className="video-player-content">
          {error ? (
            <div className="status-message error">
              <h4>❌ Erreur de lecture</h4>
              <p>{error}</p>
              <div className="error-actions">
                <button onClick={() => window.location.reload()} className="retry-button">
                  🔄 Réessayer
                </button>
                <div className="help-text">
                  <p>Si le problème persiste, le serveur est peut-être surchargé ou le flux hors ligne.</p>
                  <a href={`acestream://${channel.acestream_hash}`} className="acestream-link">
                    🚀 Ouvrir dans AceStream (App locale)
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="player-wrapper" style={{ position: 'relative', width: '100%', height: '100%', minHeight: '450px', background: '#000' }}>
              {isLoading && (
                <div className="loading-overlay" style={{
                  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(0,0,0,0.8)', color: 'white', zIndex: 10
                }}>
                  <div className="spinner"></div>
                  <p style={{ marginTop: '15px', textAlign: 'center' }}>{statusMessage}</p>
                </div>
              )}

              {streamUrl && (
                isEmbed ? (
                    <iframe
                        src={streamUrl}
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        allowFullScreen
                        title="AceStream Embed"
                        style={{ background: '#000', border: 'none' }}
                        onLoad={() => setIsLoading(false)}
                    />
                ) : (
                    <ReactPlayer
                      ref={playerRef}
                      url={streamUrl}
                      width="100%"
                      height="100%"
                      playing={true}
                      controls={true}
                      onReady={handlePlayerReady}
                      onError={handlePlayerError}
                      config={{
                        file: {
                          forceHLS: true,
                          hlsOptions: {
                            enableWorker: true,
                            lowLatencyMode: true,
                          }
                        }
                      }}
                      style={{ background: '#000' }}
                    />
                )
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="video-player-footer" style={{ padding: '10px', background: '#f8f9fa', borderTop: '1px solid #dee2e6' }}>
          <div className="controls" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="status-text">
              <small className="text-muted">
                {isEmbed ? 'Lecture via service web externe.' : 'Flux converti par le serveur.'} Aucune installation requise.
              </small>
            </div>
            <div className="external-links">
              <a href={`acestream://${channel.acestream_hash}`} className="btn btn-sm btn-outline-primary">
                Ouvrir App Externe
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedStreamPlayer;
