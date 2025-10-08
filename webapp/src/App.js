import React, { useState, useEffect } from 'react';
import './App.css';

// Fonction pour parser le nom de l'événement
const parseEventName = (name) => {
  let time = '--:--';
  let team1 = 'Équipe 1';
  let team2 = 'Équipe 2';
  let channel = 'N/A';

  // 1. Extraire l'heure (ex: 01:30 - ...)
  const timeMatch = name.match(/^(\d{2}:\d{2})\s*-\s*/);
  if (timeMatch) {
    time = timeMatch[1];
    name = name.replace(timeMatch[0], ''); // Nettoyer le nom
  }

  // 2. Séparer les équipes et la chaîne (ex: ... - Cruzeiro vs Sport Recife - MATCH! ...)
  const parts = name.split('-').map(p => p.trim());
  
  if (parts.length > 1) {
    const eventPart = parts.find(p => p.toLowerCase().includes('vs'));
    channel = parts[parts.length - 1]; // La chaîne est souvent à la fin

    if (eventPart) {
      const teams = eventPart.split(/vs/i).map(t => t.trim());
      team1 = teams[0] || team1;
      team2 = teams[1] || team2;
    } else {
      // Si pas de 'vs', on prend une partie comme nom principal
      team1 = parts[1] || name;
      team2 = '';
    }
  } else {
    team1 = name;
  }

  return { time, team1, team2, channel };
};

function App() {
  const [channels, setChannels] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/amouradore/app-web-vercel/main/lista.m3u')
      .then(response => response.text())
      .then(data => {
        const lines = data.split('\n');
        const parsedChannels = [];
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].startsWith('#EXTINF:')) {
            const info = lines[i];
            const url = lines[i + 1];
            if (url && url.includes('getstream?id=')) {
              const urlParts = url.split('id=');
              if (urlParts.length < 2) continue; // Skip invalid lines
              const contentId = urlParts[1].trim();
              const acestreamUrl = `acestream://${contentId}?player_fullscreen=1`;

              const logoMatch = info.match(/tvg-logo="([^"]*)"/);
              const nameMatch = info.match(/,(.+)/);
              
              const logo = logoMatch ? logoMatch[1] : 'https://via.placeholder.com/35';
              const rawName = nameMatch ? nameMatch[1].trim() : 'Unnamed Channel';
              
              const eventDetails = parseEventName(rawName);

              parsedChannels.push({ ...eventDetails, logo, url: acestreamUrl });
              i++;
            }
          }
        }
        setChannels(parsedChannels);
      })
      .catch(error => setError(error.message));
  }, []);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-2 ad-space d-none d-lg-block">
          <h5 className="text-center mt-4 text-muted">Publicité</h5>
        </div>

        <main className="col-lg-8 col-md-12">
          <div className="container mt-4">
            <header className="text-center mb-4">
              <h1>Événements à venir</h1>
            </header>

            <div className="alert alert-info text-center fw-bold" role="alert">
              Pour regarder les matchs, le logiciel Ace Stream est nécessaire. 
              <a href="https://www.acestream.org/" target="_blank" rel="noopener noreferrer" className="alert-link">Cliquez ici pour l'installer.</a>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <div>
              {channels.map((channel, index) => (
                <a key={index} href={channel.url} className="match-card" rel="noopener noreferrer">
                  <div className="team-section">
                    <span className="team-name">{channel.team1}</span>
                  </div>
                  
                  <div className="info-section">
                    <img src={channel.logo} className="channel-logo" alt="" onError={(e) => { e.target.onerror = null; e.target.src='https://via.placeholder.com/35' }}/>
                    <div className="info-text">
                      <div className="match-time">{channel.time}</div>
                      <div className="match-channel">{channel.channel}</div>
                    </div>
                  </div>
                  
                  <div className="team-section right">
                    <span className="team-name">{channel.team2}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </main>

        <div className="col-2 ad-space d-none d-lg-block">
          <h5 className="text-center mt-4 text-muted">Publicité</h5>
        </div>
      </div>
    </div>
  );
}

export default App;
