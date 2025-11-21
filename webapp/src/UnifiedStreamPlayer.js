import React, { useState, useEffect, useRef } from 'react';
import HLSPlayer from './HLSPlayer';
import { playChannel, stopStream } from './services/streamApi';
import './VideoPlayer.css';

/**
 * UnifiedStreamPlayer - Lecteur unifié qui utilise le backend HLS
 * Ne nécessite AUCUNE installation AceStream côté client
 */
const UnifiedStreamPlayer = ({ channel, onClose }) => {
  const [status, setStatus] = useState('initializing'); // initializing, loading, ready, error
  const [streamData, setStreamData] = useState(null);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const sessionIdRef = useRef(null);

  useEffect(() => {
    if (channel?.acestream_hash) {
      startStream();
    }

    // Cleanup on unmount
    return () => {
      // Cleanup si nécessaire
    };
  }, [channel]);

  const startStream = async () => {
    try {
      setStatus('loading');
      setProgress(10);
      setError('');

      // Étape 1: Connexion au backend
      setProgress(30);
      
      // Étape 2: Démarrage de la conversion AceStream → HLS via Railway
      const response = await playChannel(channel.acestream_hash);
      
      console.log('Backend response:', response);
      
      // Vérifier que nous avons reçu une URL de stream
      if (!response.hls_url && !response.stream_url) {
        throw new Error('Le backend n\'a pas retourné d\'URL de stream');
      }
      
      setProgress(60);
      
      // Utiliser hls_url ou stream_url selon ce que le backend retourne
      const streamUrl = response.hls_url || response.stream_url;
      response.hls_url = streamUrl; // S'assurer que hls_url est défini
      
      setProgress(80);
      
      // Pas besoin d'attendre - AceStream Engine sur Railway gère cela
      setProgress(100);
      setStreamData(response);
      setStatus('ready');
      
    } catch (err) {
      console.error('Erreur de démarrage:', err);
      setError(err.message || 'Impossible de démarrer le stream. Le backend Railway est peut-être en cours de démarrage.');
      setStatus('error');
    }
  };


  const handleRetry = () => {
    startStream();
  };

  const handlePlayerError = (error) => {
    console.error('Erreur du lecteur:', error);
    setError('Erreur de lecture. Vérifiez votre connexion.');
    setStatus('error');
  };

  return (
    <div className="video-player-overlay">
      <div className="video-player-container">
        {/* Header */}
        <div className="video-player-header">
          <h3>
            {channel?.name || 'Lecture en cours'}
          </h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        {/* Content */}
        <div className="video-player-content">
          {/* Loading State */}
          {status === 'loading' && (
            <div className="status-message">
              <div className="spinner"></div>
              <p>Démarrage du flux HLS...</p>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="progress-text">{progress}%</p>
              <p className="info-text">
                ⏳ Conversion AceStream → HLS en cours<br/>
                📡 Aucune installation requise!
              </p>
            </div>
          )}

          {/* Ready State - HLS Player */}
          {status === 'ready' && streamData && (
            <div className="player-wrapper">
              <HLSPlayer 
                src={streamData.hls_url}
                title={channel?.name}
                onError={handlePlayerError}
                onReady={() => console.log('Stream prêt!')}
              />
              <div className="stream-info">
                <span className="badge badge-success">🔴 EN DIRECT</span>
                <span className="badge badge-info">HLS (Pas d'installation)</span>
              </div>
            </div>
          )}

          {/* Error State */}
          {status === 'error' && (
            <div className="status-message error">
              <h4>❌ Erreur de streaming</h4>
              <p>{error}</p>
              <div className="error-actions">
                <button onClick={handleRetry} className="retry-button">
                  🔄 Réessayer
                </button>
                <button onClick={onClose} className="secondary-button">
                  Fermer
                </button>
              </div>
              <div className="help-text">
                <p><strong>Causes possibles:</strong></p>
                <ul>
                  <li>Le flux AceStream n'est pas disponible</li>
                  <li>Le backend est en cours de démarrage</li>
                  <li>Problème de connexion réseau</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer - Channel Info */}
        {channel && (
          <div className="video-player-info">
            <div className="channel-details">
              {channel.logo && (
                <img src={channel.logo} alt="" className="channel-logo-small" />
              )}
              <div className="channel-text">
                <div className="channel-name">
                  {channel.name}
                </div>
                {channel.group && (
                  <div className="channel-group">
                    📁 {channel.group}
                  </div>
                )}
                {channel.id && (
                  <div className="channel-id">
                    🆔 {channel.id}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UnifiedStreamPlayer;
