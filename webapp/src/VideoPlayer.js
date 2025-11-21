import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import './VideoPlayer.css';

const VideoPlayer = ({ streamId, onClose, channelInfo }) => {
  const [streamStatus, setStreamStatus] = useState('checking');
  const [streamUrl, setStreamUrl] = useState('');
  const [error, setError] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    checkStreamAvailability();
  }, [streamId]);

  const checkStreamAvailability = async () => {
    try {
      setStreamStatus('checking');
      
      // Vérifier la disponibilité du stream via notre API
      const response = await fetch(`http://localhost:8000/api/stream/info/${streamId}`);
      const data = await response.json();
      
      if (data.status === 'available') {
        setStreamUrl(`http://localhost:8000/api/stream/play/${streamId}`);
        setStreamStatus('ready');
        setError('');
      } else {
        setStreamStatus('unavailable');
        setError(data.message || 'Stream non disponible');
      }
    } catch (err) {
      setStreamStatus('error');
      setError('Erreur de connexion au serveur de streaming');
      console.error('Erreur lors de la vérification du stream:', err);
    }
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleError = (error) => {
    console.error('Erreur du lecteur vidéo:', error);
    setError('Erreur lors de la lecture de la vidéo');
    setIsPlaying(false);
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
          {streamStatus === 'checking' && (
            <div className="status-message">
              <div className="spinner"></div>
              <p>Vérification de la disponibilité du stream...</p>
            </div>
          )}
          
          {streamStatus === 'ready' && (
            <div className="player-wrapper">
              <ReactPlayer
                url={streamUrl}
                controls={true}
                playing={isPlaying}
                width="100%"
                height="100%"
                onPlay={handlePlay}
                onPause={handlePause}
                onError={handleError}
                config={{
                  file: {
                    forceVideo: true,
                    attributes: {
                      crossOrigin: 'anonymous'
                    }
                  }
                }}
              />
            </div>
          )}
          
          {(streamStatus === 'unavailable' || streamStatus === 'error') && (
            <div className="status-message error">
              <h4>Stream non disponible</h4>
              <p>{error}</p>
              <div className="error-actions">
                <button onClick={checkStreamAvailability} className="retry-button">
                  Réessayer
                </button>
                <p className="help-text">
                  Pour utiliser cette fonctionnalité, vous devez avoir AceStream Engine installé et en cours d'exécution.
                </p>
                <a 
                  href="https://www.acestream.org/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="download-link"
                >
                  Télécharger AceStream
                </a>
              </div>
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
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;