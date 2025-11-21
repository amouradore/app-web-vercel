import React, { useState, useEffect } from 'react';
import { getPlaylists, getChannels } from './services/streamApi';
import UnifiedStreamPlayer from './UnifiedStreamPlayer';
import './App.css';

/**
 * Composant principal pour afficher les playlists et chaînes
 */
const ChannelList = () => {
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Charger les playlists au démarrage
  useEffect(() => {
    loadPlaylists();
  }, []);

  const loadPlaylists = async () => {
    try {
      setLoading(true);
      const data = await getPlaylists();
      setPlaylists(data.playlists || []);
      setError('');
    } catch (err) {
      setError('Erreur lors du chargement des playlists');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaylistSelect = async (playlist) => {
    try {
      setLoading(true);
      setSelectedPlaylist(playlist);
      const data = await getChannels(playlist.name);
      setChannels(data.channels || []);
      setError('');
    } catch (err) {
      setError('Erreur lors du chargement des chaînes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChannelPlay = (channel) => {
    setSelectedChannel(channel);
  };

  const handleClosePlayer = () => {
    setSelectedChannel(null);
  };

  // Filtrer les chaînes par recherche
  const filteredChannels = channels.filter(channel =>
    channel.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    channel.group?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Grouper les chaînes par catégorie
  const groupedChannels = filteredChannels.reduce((acc, channel) => {
    const group = channel.group || 'Autres';
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(channel);
    return acc;
  }, {});

  return (
    <div className="channel-list-container">
      <header className="app-header">
        <h1>📺 IPTV Streaming</h1>
        <p>Regardez vos matchs et chaînes préférés sans installation!</p>
      </header>

      {/* Liste des playlists */}
      {!selectedPlaylist && (
        <div className="playlists-section">
          <h2>📁 Playlists Disponibles</h2>
          {loading ? (
            <div className="loading">Chargement...</div>
          ) : (
            <div className="playlist-grid">
              {playlists.map((playlist, index) => (
                <div
                  key={index}
                  className="playlist-card"
                  onClick={() => handlePlaylistSelect(playlist)}
                >
                  <div className="playlist-icon">📺</div>
                  <h3>{playlist.name}</h3>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Liste des chaînes */}
      {selectedPlaylist && (
        <div className="channels-section">
          <div className="channels-header">
            <button
              className="back-button"
              onClick={() => {
                setSelectedPlaylist(null);
                setChannels([]);
                setSearchTerm('');
              }}
            >
              ← Retour aux playlists
            </button>
            <h2>{selectedPlaylist.name}</h2>
            <div className="channel-count">
              {filteredChannels.length} chaîne(s)
            </div>
          </div>

          {/* Barre de recherche */}
          <div className="search-bar">
            <input
              type="text"
              placeholder="🔍 Rechercher une chaîne ou catégorie..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="loading">Chargement des chaînes...</div>
          ) : (
            <div className="channels-list">
              {Object.entries(groupedChannels).map(([group, groupChannels]) => (
                <div key={group} className="channel-group">
                  <h3 className="group-title">
                    📁 {group} ({groupChannels.length})
                  </h3>
                  <div className="channel-grid">
                    {groupChannels.map((channel, index) => (
                      <div
                        key={index}
                        className="channel-card"
                        onClick={() => handleChannelPlay(channel)}
                      >
                        {channel.logo && (
                          <img
                            src={channel.logo}
                            alt={channel.name}
                            className="channel-logo"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        )}
                        <div className="channel-info">
                          <h4>{channel.name}</h4>
                          {channel.id && (
                            <span className="channel-id">{channel.id}</span>
                          )}
                        </div>
                        <button className="play-button">▶ Regarder</button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Afficher les erreurs */}
      {error && (
        <div className="error-message">
          <p>❌ {error}</p>
          <button onClick={loadPlaylists}>Réessayer</button>
        </div>
      )}

      {/* Lecteur vidéo */}
      {selectedChannel && (
        <UnifiedStreamPlayer
          channel={selectedChannel}
          onClose={handleClosePlayer}
        />
      )}

      {/* Footer */}
      <footer className="app-footer">
        <p>✨ Streaming sans installation AceStream</p>
        <p>🔒 Conversion sécurisée AceStream → HLS</p>
      </footer>
    </div>
  );
};

export default ChannelList;
