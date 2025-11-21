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
      if (sessionIdRef.current) {
        stopStream(sessionIdRef.current).catch(console.error);
      }
    };
  }, [channel]);

  const startStream = async () => {
    try {
      setStatus('loading');
      setProgress(10);
      setError('');

      // Étape 1: Connexion au backend
      setProgress(30);
      
      // Étape 2: Démarrage de la conversion AceStream → HLS
      const response = await playChannel(channel.acestream_hash);
      
      setProgress(60);
      sessionIdRef.current = response.session_id;
      
      // Étape 3: Attendre que le flux soit prêt
      await waitForStreamReady(response.hls_url);
      
      setProgress(100);
      setStreamData(response);
      setStatus('ready');
      
    } catch (err) {
      console.error('Erreur de démarrage:', err);
      setError(err.message || 'Impossible de démarrer le stream');
      setStatus('error');
    }
  };

  const waitForStreamReady = async (hlsUrl, maxAttempts = 20) => {
    for (let i = 0; i < maxAttempts; i++) {
      try {
        const response = await fetch(hlsUrl, { method: 'HEAD' });
        if (response.ok) {
          return true;
        }
      } catch (e) {
        // Continue trying
      }
      
      // Attendre 1 seconde entre chaque tentative
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProgress(60 + (i * 2)); // Progress bar de 60% à 100%
    }
    
    throw new Error('Timeout: le flux n\'a pas démarré à temps');
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
