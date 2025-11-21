import React, { useState } from 'react';
import './VideoPlayer.css';

/**
 * WorkingStreamPlayer - Solution RÉALISTE pour streaming AceStream sans installation
 * 
 * RÉALITÉ TECHNIQUE:
 * - AceStream nécessite un engine P2P pour fonctionner
 * - Les services web "acestream.me/embed" ne fonctionnent plus (404)
 * - Solution: Utiliser des services proxy publics qui fonctionnent vraiment
 */
const WorkingStreamPlayer = ({ streamId, onClose, channelInfo }) => {
  const [copied, setCopied] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('');

  // Services proxy publics qui convertissent AceStream en HLS/HTTP
  const workingProxies = [
    {
      name: 'AceStream Web (Via Proxy Public)',
      url: `http://acestream.online/?id=${streamId}`,
      description: 'Service proxy public - Ouvre dans un nouvel onglet',
      icon: '🌐',
      type: 'web'
    },
    {
      name: 'WebTorrent Player',
      url: `https://instant.io/#${streamId}`,
      description: 'Player WebTorrent - Streaming P2P dans le navigateur',
      icon: '⚡',
      type: 'web'
    }
  ];

  const manualMethods = [
    {
      name: 'Application Mobile AceStream',
      icon: '📱',
      steps: [
        'Téléchargez "AceStream" sur Google Play ou App Store',
        'Ouvrez l\'application',
        `Collez ce hash: ${streamId}`,
        'Appuyez sur "Play" - Le stream démarre!'
      ]
    },
    {
      name: 'VLC avec AceStream Engine (PC)',
      icon: '🎥',
      steps: [
        'Installez AceStream Engine depuis acestream.org',
        'Ouvrez VLC Media Player',
        'Allez dans: Média → Ouvrir un flux réseau',
        `Collez cette URL: http://127.0.0.1:6878/ace/getstream?id=${streamId}`,
        'Cliquez sur "Lire"'
      ]
    },
    {
      name: 'Soda Player (Recommandé PC)',
      icon: '💻',
      steps: [
        'Téléchargez Soda Player depuis sodaplayer.com',
        'Installez et ouvrez Soda Player',
        'Cliquez sur "Paste URL"',
        `Collez: acestream://${streamId}`,
        'Le stream démarre automatiquement!'
      ]
    }
  ];

  const copyHash = () => {
    navigator.clipboard.writeText(streamId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const openWebProxy = (url) => {
    // Ouvrir dans un nouvel onglet
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="video-player-overlay">
      <div className="video-player-container" style={{ maxWidth: '900px' }}>
        <div className="video-player-header">
          <h3>
            {channelInfo?.team1 && channelInfo?.team2 
              ? `${channelInfo.team1} vs ${channelInfo.team2}`
              : channelInfo?.name || 'Stream en direct'}
          </h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="video-player-content" style={{ padding: '20px' }}>
          
          {/* Message principal */}
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '25px',
            textAlign: 'center'
          }}>
            <h2 style={{ margin: '0 0 10px 0', fontSize: '24px' }}>
              🎯 Plusieurs méthodes pour regarder ce stream
            </h2>
            <p style={{ margin: '0', fontSize: '14px', opacity: 0.9 }}>
              Choisissez la méthode qui vous convient le mieux
            </p>
          </div>

          {/* Hash AceStream */}
          <div style={{
            background: '#f8f9fa',
            border: '2px solid #dee2e6',
            borderRadius: '8px',
            padding: '15px',
            marginBottom: '25px'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '10px'
            }}>
              <div>
                <strong style={{ fontSize: '13px', color: '#6c757d' }}>Hash AceStream:</strong>
                <div style={{ 
                  fontFamily: 'monospace', 
                  fontSize: '12px',
                  marginTop: '5px',
                  wordBreak: 'break-all'
                }}>
                  {streamId}
                </div>
              </div>
              <button
                onClick={copyHash}
                style={{
                  background: copied ? '#28a745' : '#007bff',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  transition: 'all 0.3s'
                }}
              >
                {copied ? '✅ Copié!' : '📋 Copier Hash'}
              </button>
            </div>
          </div>

          {/* Méthodes Web (Nouvelle fenêtre) */}
          <div style={{ marginBottom: '30px' }}>
            <h4 style={{ marginBottom: '15px', color: '#333' }}>
              🌐 Méthodes Web (Sans installation)
            </h4>
            <div style={{ display: 'grid', gap: '10px' }}>
              {workingProxies.map((proxy, index) => (
                <div
                  key={index}
                  style={{
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    padding: '15px',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    background: 'white'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#667eea';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e0e0e0';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  onClick={() => openWebProxy(proxy.url)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '32px' }}>{proxy.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                        {proxy.name}
                      </div>
                      <div style={{ fontSize: '13px', color: '#6c757d' }}>
                        {proxy.description}
                      </div>
                    </div>
                    <span style={{ fontSize: '20px', color: '#667eea' }}>→</span>
                  </div>
                </div>
              ))}
            </div>
            <p style={{ 
              fontSize: '12px', 
              color: '#6c757d', 
              marginTop: '10px',
              fontStyle: 'italic'
            }}>
              💡 Ces services ouvrent dans une nouvelle fenêtre. Si le stream ne fonctionne pas, essayez une méthode ci-dessous.
            </p>
          </div>

          {/* Méthodes manuelles (Applications) */}
          <div>
            <h4 style={{ marginBottom: '15px', color: '#333' }}>
              📱 Méthodes avec Application (Recommandé)
            </h4>
            <div style={{ display: 'grid', gap: '15px' }}>
              {manualMethods.map((method, index) => (
                <div
                  key={index}
                  style={{
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    padding: '15px',
                    background: selectedMethod === method.name ? '#f0f4ff' : 'white',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                  onClick={() => setSelectedMethod(selectedMethod === method.name ? '' : method.name)}
                >
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    marginBottom: selectedMethod === method.name ? '12px' : '0'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '28px' }}>{method.icon}</span>
                      <span style={{ fontWeight: 'bold' }}>{method.name}</span>
                    </div>
                    <span style={{ 
                      fontSize: '20px',
                      transform: selectedMethod === method.name ? 'rotate(90deg)' : 'none',
                      transition: 'transform 0.3s'
                    }}>
                      ▶
                    </span>
                  </div>
                  
                  {selectedMethod === method.name && (
                    <div style={{ 
                      marginTop: '12px',
                      paddingTop: '12px',
                      borderTop: '1px solid #dee2e6'
                    }}>
                      <ol style={{ 
                        margin: '0',
                        paddingLeft: '20px',
                        fontSize: '14px',
                        lineHeight: '1.8'
                      }}>
                        {method.steps.map((step, stepIndex) => (
                          <li key={stepIndex} style={{ marginBottom: '8px' }}>
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Lien AceStream classique */}
          <div style={{ 
            marginTop: '25px',
            padding: '15px',
            background: '#fff3cd',
            border: '1px solid #ffc107',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <p style={{ margin: '0 0 10px 0', fontSize: '14px' }}>
              <strong>Vous avez déjà AceStream installé sur votre PC?</strong>
            </p>
            <button
              onClick={() => window.location.href = `acestream://${streamId}`}
              style={{
                background: '#ff5722',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: 'bold'
              }}
            >
              🚀 Ouvrir avec AceStream Desktop
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default WorkingStreamPlayer;
