import React, { useState, useEffect } from 'react';
import './VideoPlayer.css';

const SmartStreamPlayer = ({ streamId, onClose, channelInfo }) => {
  const [streamUrls, setStreamUrls] = useState(null);
  const [currentMethod, setCurrentMethod] = useState('embed');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const API_BASE = process.env.REACT_APP_API_BASE || 'https://app-web-vercel-production.up.railway.app';

  useEffect(() => {
    fetchStreamUrls();
  }, [streamId]);

  const fetchStreamUrls = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`${API_BASE}/api/stream/${streamId}`);
      const data = await response.json();
      
      if (data.stream_urls) {
        setStreamUrls(data.stream_urls);
        setLoading(false);
      } else {
        setError('Impossible de récupérer les URLs de streaming');
        setLoading(false);
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des URLs:', err);
      setError('Erreur de connexion au serveur');
      setLoading(false);
    }
  };

  const getStreamUrl = () => {
    if (!streamUrls) return null;
    
    switch (currentMethod) {
      case 'embed':
        return streamUrls.embed;
      case 'web_player':
        return streamUrls.web_player;
      case 'local':
        return streamUrls.local;
      default:
        return streamUrls.embed;
    }
  };

  const renderPlayer = () => {
    const url = getStreamUrl();
    
    if (!url) return null;

    // Pour les embeds AceStream.me, utiliser un iframe
    if (currentMethod === 'embed' || currentMethod === 'web_player') {
      return (
        <iframe
          src={url}
          width="100%"
          height="100%"
          frameBorder="0"
          allow="autoplay; fullscreen; encrypted-media"
          allowFullScreen
          style={{ border: 'none' }}
          title="Stream Player"
        />
      );
    }

    // Pour les URLs directes (local AceStream)
    return (
      <video
        src={url}
        controls
        autoPlay
        style={{ width: '100%', height: '100%' }}
        onError={(e) => {
          console.error('Erreur vidéo:', e);
          setError('Erreur de lecture. Essayez une autre méthode.');
        }}
      />
    );
  };

  return (
    <div className="video-player-overlay">
      <div className="video-player-container">
        <div className="video-player-header">
          <h3>
            {channelInfo?.team1 && channelInfo?.team2 
              ? `${channelInfo.team1} vs ${channelInfo.team2}`
              : channelInfo?.name || 'Lecture en cours'
            }
          </h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="video-player-content">
          {loading && (
            <div className="status-message">
              <div className="spinner"></div>
              <p>Chargement du stream...</p>
            </div>
          )}
          
          {!loading && !error && streamUrls && (
            <div className="player-wrapper" style={{ position: 'relative', height: '500px' }}>
              {renderPlayer()}
              
              {/* Méthodes de lecture */}
              <div style={{ 
                position: 'absolute', 
                bottom: '10px', 
                left: '10px', 
                zIndex: 1000,
                background: 'rgba(0,0,0,0.7)',
                padding: '10px',
                borderRadius: '5px'
              }}>
                <div style={{ color: 'white', marginBottom: '5px', fontSize: '12px' }}>
                  Méthode de lecture:
                </div>
                <select 
                  value={currentMethod} 
                  onChange={(e) => setCurrentMethod(e.target.value)}
                  style={{ 
                    padding: '5px', 
                    borderRadius: '3px',
                    background: '#444',
                    color: 'white',
                    border: '1px solid #666',
                    cursor: 'pointer'
                  }}
                >
                  <option value="embed">🌐 Web Embed (Recommandé - Sans installation)</option>
                  <option value="web_player">🎬 Web Player AceStream.org</option>
                  <option value="local">💻 Local AceStream (Nécessite installation)</option>
                </select>
              </div>
            </div>
          )}
          
          {error && (
            <div className="status-message error">
              <h4>Erreur</h4>
              <p>{error}</p>
              <button onClick={fetchStreamUrls} className="retry-button">
                Réessayer
              </button>
            </div>
          )}
        </div>
        
        {channelInfo && (
          <div className="video-player-info">
            <div className="channel-details">
              {channelInfo.logo && (
                <img src={channelInfo.logo} alt="" className="channel-logo-small" />
              )}
              <div className="channel-text">
                <div className="channel-name">
                  {channelInfo.channel || channelInfo.group || 'Canal'}
                </div>
                {channelInfo.competition && (
                  <div className="competition-name">{channelInfo.competition}</div>
                )}
                {channelInfo.time && (
                  <div className="match-time">{channelInfo.time}</div>
                )}
              </div>
            </div>
            
            {/* Message informatif */}
            <div style={{ 
              marginTop: '10px', 
              padding: '10px', 
              background: '#e8f5e9', 
              borderRadius: '5px',
              fontSize: '13px',
              color: '#2e7d32'
            }}>
              ✅ <strong>Aucune installation requise !</strong> Le mode "Web Embed" fonctionne directement dans votre navigateur.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartStreamPlayer;
