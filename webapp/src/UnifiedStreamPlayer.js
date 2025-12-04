import React, { useState, useEffect } from 'react';
import { playChannel } from './services/streamApi';
import './VideoPlayer.css';

/**
 * UnifiedStreamPlayer - Lecteur utilisant services externes
 * AUCUNE installation AceStream requise !
 */
const UnifiedStreamPlayer = ({ channel, onClose }) => {
  const [streamData, setStreamData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    const initStream = async () => {
      try {
        setIsLoading(true);
        setError(null);

        console.log('Demande de flux pour:', channel.acestream_hash);
        const data = await playChannel(channel.acestream_hash);
        
        console.log('Données reçues:', data);
        setStreamData(data);
        setIsLoading(false);
      } catch (err) {
        console.error('Erreur streaming:', err);
        setError(err.message || "Impossible de charger le stream");
        setIsLoading(false);
      }
    };

    if (channel?.acestream_hash) {
      initStream();
    }
  }, [channel]);

  const handleCopyHash = () => {
    navigator.clipboard.writeText(streamData?.hash || channel.acestream_hash);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const openStream = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (isLoading) {
    return (
      <div className="video-player-overlay">
        <div className="video-player-container loading">
          <button className="close-button" onClick={onClose}>✕</button>
          <div className="loading-content" style={{ textAlign: 'center', padding: '50px' }}>
            <div className="spinner"></div>
            <p style={{ marginTop: '20px' }}>⏳ Chargement du stream...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="video-player-overlay">
        <div className="video-player-container error">
          <button className="close-button" onClick={onClose}>✕</button>
          <div className="error-content" style={{ textAlign: 'center', padding: '50px' }}>
            <h3>❌ Erreur</h3>
            <p>{error}</p>
            <button onClick={onClose} className="retry-button" style={{ marginTop: '20px' }}>Fermer</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="video-player-overlay">
      <div className="video-player-container">
        <button className="close-button" onClick={onClose}>✕</button>
        
        <div className="video-header" style={{ padding: '20px', borderBottom: '1px solid #ddd' }}>
          <h2 style={{ margin: 0 }}>🎬 {channel.name}</h2>
          {channel.group && <span className="video-group" style={{ color: '#666', fontSize: '14px' }}>{channel.group}</span>}
        </div>

        <div className="stream-options" style={{ padding: '30px' }}>
          <h3 style={{ marginBottom: '20px' }}>🚀 Choisissez votre méthode de streaming :</h3>
          
          <div className="stream-buttons" style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' }}>
            {streamData?.embed_urls && (
              <>
                <button 
                  onClick={() => openStream(streamData.embed_urls.acestream_me)}
                  className="stream-btn primary"
                  style={{
                    padding: '15px 20px',
                    fontSize: '16px',
                    background: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <div>🌐 <strong>AceStream Web Player</strong></div>
                  <small style={{ display: 'block', marginTop: '5px', opacity: 0.9 }}>Service officiel AceStream</small>
                </button>
                
                <button 
                  onClick={() => openStream(streamData.embed_urls.acestream_player)}
                  className="stream-btn secondary"
                  style={{
                    padding: '15px 20px',
                    fontSize: '16px',
                    background: '#2196F3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <div>▶️ <strong>AceStream Player</strong></div>
                  <small style={{ display: 'block', marginTop: '5px', opacity: 0.9 }}>Player alternatif</small>
                </button>
                
                <button 
                  onClick={() => openStream(streamData.embed_urls.torrentstream)}
                  className="stream-btn secondary"
                  style={{
                    padding: '15px 20px',
                    fontSize: '16px',
                    background: '#FF9800',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <div>📺 <strong>Torrent Stream</strong></div>
                  <small style={{ display: 'block', marginTop: '5px', opacity: 0.9 }}>Service tiers</small>
                </button>
              </>
            )}
            
            <button 
              onClick={handleCopyHash}
              className="stream-btn tertiary"
              style={{
                padding: '15px 20px',
                fontSize: '16px',
                background: copySuccess ? '#4CAF50' : '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <div>{copySuccess ? '✅ Hash copié !' : '📋 Copier le Hash'}</div>
              <small style={{ display: 'block', marginTop: '5px', opacity: 0.9 }}>Pour utiliser avec VLC ou app mobile</small>
            </button>
          </div>
          
          <div className="stream-info" style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
            <p style={{ margin: '0 0 10px 0' }}><strong>Hash AceStream:</strong></p>
            <code style={{ 
              display: 'block', 
              padding: '10px', 
              background: '#fff', 
              borderRadius: '4px',
              wordBreak: 'break-all',
              fontSize: '12px'
            }}>{streamData?.hash}</code>
            
            <div className="info-box" style={{ marginTop: '20px', fontSize: '14px' }}>
              <p style={{ margin: '0 0 10px 0' }}><strong>💡 Conseils :</strong></p>
              <ul style={{ margin: 0, paddingLeft: '20px' }}>
                <li>Les boutons 🚀 ouvrent le stream dans un nouvel onglet</li>
                <li>Si un service ne marche pas, essayez un autre</li>
                <li>Le hash peut être utilisé avec n'importe quelle app AceStream</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedStreamPlayer;
