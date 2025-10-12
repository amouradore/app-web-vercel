import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// Fonction pour parser le nom de l'événement
const parseEventName = (name, rawInfo = '') => {
  let time = '--:--';
  let team1 = 'Équipe 1';
  let team2 = 'Équipe 2';
  let channel = 'N/A';
  let competition = '';

  // Extraire l'heure (ex: 01:00 - ...)
  const timeMatch = name.match(/^(\d{2}:\d{2})\s*-\s*/);
  if (timeMatch) {
    time = timeMatch[1];
    name = name.replace(timeMatch[0], ''); // Nettoyer le nom
  }

  // Diviser le reste par ' - ' pour séparer catégorie, compétition, équipes et chaîne
  const parts = name.split(' - ').map(p => p.trim()).filter(p => p);

  // Pour les formats avec 4 parties : [CATÉGORIE, COMPÉTITION, "Equipe1 vs Equipe2", CHAINE]
  if (parts.length >= 3) {
    let teamsPartIndex = 1; // Par défaut, l'index des équipes est 1
    
    // Si la première partie est une grande catégorie (ex: Brazil, Europe), 
    // les équipes seront à l'index 2
    if (parts.length >= 4 && 
        (parts[0].toLowerCase() === 'brazil' || 
         parts[0].toLowerCase() === 'europe' ||
         parts[0].length <= 8)) { // On suppose que les catégories générales sont courtes
      teamsPartIndex = 2;
      competition = parts[1]; // Compétition est entre catégorie et équipes
    } else {
      // Sinon, la compétition est à l'index 0
      competition = parts[0];
    }
    
    // Extraire équipes de la partie appropriée
    const teamsPart = parts[teamsPartIndex];
    const vsIndex = teamsPart.toLowerCase().indexOf(' vs ');
    if (vsIndex !== -1) {
      team1 = teamsPart.substring(0, vsIndex).trim();
      team2 = teamsPart.substring(vsIndex + 4).trim();
    }
    
    // La chaîne est la dernière partie
    channel = parts[parts.length - 1];
  } else if (parts.length === 2) {
    // Format : [COMPÉTITION - Equipe1 vs Equipe2, CHAINE] ou [COMPÉTITION, CHAINE]
    const firstPart = parts[0];
    const vsIndex = firstPart.toLowerCase().indexOf(' vs ');
    if (vsIndex !== -1) {
      // Le format est [COMPÉTITION - Equipe1 vs Equipe2, CHAINE]
      const dashIndex = firstPart.lastIndexOf(' - ');
      if (dashIndex !== -1) {
        competition = firstPart.substring(0, dashIndex).trim();
        const teamsPart = firstPart.substring(dashIndex + 3).trim();
        const vsIndex2 = teamsPart.toLowerCase().indexOf(' vs ');
        if (vsIndex2 !== -1) {
          team1 = teamsPart.substring(0, vsIndex2).trim();
          team2 = teamsPart.substring(vsIndex2 + 4).trim();
        }
      } else {
        // Le format est ["Equipe1 vs Equipe2", CHAINE]
        const vsIndex2 = firstPart.toLowerCase().indexOf(' vs ');
        if (vsIndex2 !== -1) {
          team1 = firstPart.substring(0, vsIndex2).trim();
          team2 = firstPart.substring(vsIndex2 + 4).trim();
        }
      }
      channel = parts[1];
    } else {
      // Juste compétition et chaîne, pas d'équipes spécifiques
      competition = firstPart;
      channel = parts[1];
    }
  } else if (parts.length === 1) {
    // Seulement une partie, probablement un format spécial
    competition = parts[0];
  }

  return { time, team1, team2, channel, competition };
};

// Fonction pour parser les chaînes TV à partir des informations #EXTINF
const parseTvChannel = (info) => {
  const groupTitleMatch = info.match(/group-title="([^"]*)"/);
  const logoMatch = info.match(/tvg-logo="([^"]*)"/);
  const nameMatch = info.match(/,(.+)/);

  const group = groupTitleMatch ? groupTitleMatch[1] : 'Autres';
  const logo = logoMatch ? logoMatch[1] : 'https://via.placeholder.com/35';
  const name = nameMatch ? nameMatch[1].trim() : 'Chaîne inconnue';

  return { name, logo, group };
};

function App() {
  const [activeTab, setActiveTab] = useState('events'); // 'events' ou 'livetv'
  const [channels, setChannels] = useState({});
  const [tvChannels, setTvChannels] = useState([]);
  const [groupedTvChannels, setGroupedTvChannels] = useState({});
  const [selectedTvGroup, setSelectedTvGroup] = useState(null); // Pour suivre le groupe de chaînes TV sélectionné
  const [selectedGroupName, setSelectedGroupName] = useState(''); // Pour stocker le nom du groupe sélectionné
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const adRef1 = useRef(null);
  const adRef2 = useRef(null);

  useEffect(() => {
    // Charger les logos de compétitions
    const loadCompetitionLogos = async () => {
      try {
        const response = await fetch('https://raw.githubusercontent.com/amouradore/app-web-vercel/main/LOGOS-LIGAS.xml');
        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
        
        // Extraire les logos de compétitions
        const leagues = xmlDoc.querySelectorAll('league');
        const competitionLogos = {};
        
        leagues.forEach(league => {
          const name = league.getAttribute('name');
          const logoUrl = league.querySelector('logo_url')?.textContent;
          if (name && logoUrl) {
            competitionLogos[name] = logoUrl;
          }
        });
        
        return competitionLogos;
      } catch (error) {
        console.error('Erreur lors du chargement des logos de compétitions:', error);
        return {};
      }
    };

    // Charger lista.m3u, les logos de compétitions et les chaînes TV simultanément
    Promise.all([
      fetch('https://raw.githubusercontent.com/amouradore/app-web-vercel/main/lista.m3u')
        .then(response => response.text()),
      loadCompetitionLogos(),
      fetch('https://raw.githubusercontent.com/amouradore/app-web-vercel/main/canales_acestream.m3u')
        .then(response => response.text())
        .catch(() => '') // Gérer le cas où le fichier n'existe pas
    ])
    .then(([data, competitionLogos, tvData]) => {
        console.log('Données brutes reçues:', data.substring(0, 200) + '...'); // Log des premiers caractères
        // Utilisation d'une expression régulière universelle pour gérer tous les formats de nouvelle ligne
        const lines = data.split(/\r\n|\r|\n/g);
        console.log('Nombre de lignes:', lines.length);
        
        const parsedChannels = [];
        const seenContentIds = new Set(); // Pour éviter les doublons
        
        let extinfCount = 0;
        let processedCount = 0;
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].startsWith('#EXTINF:')) {
            extinfCount++;
            const info = lines[i];
            const url = lines[i + 1];
            console.log(`Ligne ${i} EXTINF:`, info.substring(0, 100));
            
            if (url && url.includes('getstream?id=')) {
              const urlParts = url.split('id=');
              if (urlParts.length < 2) {
                console.log('URL invalide:', url);
                continue; // Skip invalid lines
              }
              
              const contentId = urlParts[1].split('&')[0].trim(); // Extraire l'ID de contenu sans paramètres supplémentaires
              console.log('Content ID extrait:', contentId);
              
              // Éviter les doublons basés sur l'ID de contenu
              if (seenContentIds.has(contentId)) {
                console.log('Doublon trouvé:', contentId);
                i++; // Passer à la prochaine ligne
                continue;
              }
              
              seenContentIds.add(contentId);
              
              // Créer une URL qui peut être utilisée dans le navigateur
              // Pour l'instant, on garde l'URL acestream mais avec gestion de l'installation
              const acestreamUrl = `acestream://${contentId}?player_fullscreen=1`;
              const alternativeUrl = `http://127.0.0.1:6878/ace/getstream?id=${contentId}`; // Pour usage local

              const logoMatch = info.match(/tvg-logo="([^"]*)"/);
              const nameMatch = info.match(/,(.+)/);
              
              console.log('Logo match:', logoMatch);
              console.log('Name match:', nameMatch);
              
              const logo = logoMatch ? logoMatch[1] : 'https://via.placeholder.com/35';
              const rawName = nameMatch ? nameMatch[1].trim() : 'Unnamed Channel';
              
              const eventDetails = parseEventName(rawName, info);

              parsedChannels.push({ 
                ...eventDetails, 
                logo, 
                acestreamUrl,
                alternativeUrl, 
                contentId // Ajouter l'ID pour référence
              });
              processedCount++;
              i++;
            } else {
              console.log('Ligne URL non valide:', url);
            }
          }
        }
        console.log('Total EXTINF trouvés:', extinfCount);
        console.log('Chaînes traitées:', processedCount);
        console.log('Chaînes parsées:', parsedChannels);
        
        // Regrouper les chaînes par compétition
        const groupedChannels = parsedChannels && parsedChannels.length > 0 
          ? parsedChannels.reduce((acc, channel) => {
              const competition = channel.competition || 'Autres';
              if (!acc[competition]) {
                acc[competition] = [];
              }
              acc[competition].push(channel);
              return acc;
            }, {})
          : {};

        setChannels(groupedChannels);
        
        // Traiter les chaînes TV si les données sont disponibles
        if (tvData) {
          console.log('Traitement des données TV...');
          console.log('Données TV brutes reçues:', tvData.substring(0, 200) + '...');
          
          // Utilisation d'une expression régulière universelle pour gérer tous les formats de nouvelle ligne
          const tvLines = tvData.split(/\r\n|\r|\n/g);
          console.log('Nombre de lignes TV:', tvLines.length);
          
          const parsedTvChannels = [];
          const seenTvContentIds = new Set(); // Pour éviter les doublons TV
          
          let tvExtinfCount = 0;
          let tvProcessedCount = 0;
          for (let i = 0; i < tvLines.length; i++) {
            if (tvLines[i].startsWith('#EXTINF:')) {
              tvExtinfCount++;
              const info = tvLines[i];
              const url = tvLines[i + 1];
              console.log(`Ligne TV ${i} EXTINF:`, info.substring(0, 100));
              
              if (url && url.includes('getstream?id=')) {
                const urlParts = url.split('id=');
                if (urlParts.length < 2) {
                  console.log('URL TV invalide:', url);
                  continue; // Skip invalid lines
                }
                
                const contentId = urlParts[1].split('&')[0].trim(); // Extraire l'ID de contenu sans paramètres supplémentaires
                console.log('Content ID TV extrait:', contentId);
                
                // Éviter les doublons basés sur l'ID de contenu
                if (seenTvContentIds.has(contentId)) {
                  console.log('Doublon TV trouvé:', contentId);
                  i++; // Passer à la prochaine ligne
                  continue;
                }
                
                seenTvContentIds.add(contentId);
                
                // Créer une URL qui peut être utilisée dans le navigateur
                // Pour l'instant, on garde l'URL acestream mais avec gestion de l'installation
                const acestreamUrl = `acestream://${contentId}?player_fullscreen=1`;
                const alternativeUrl = `http://127.0.0.1:6878/ace/getstream?id=${contentId}`; // Pour usage local

                
                // Extraire les informations de la chaîne TV
                const channelDetails = parseTvChannel(info);

                parsedTvChannels.push({ 
                  ...channelDetails, 
                  acestreamUrl,
                  alternativeUrl, 
                  contentId // Ajouter l'ID pour référence
                });
                tvProcessedCount++;
                i++;
              } else {
                console.log('Ligne URL TV non valide:', url);
              }
            }
          }
          console.log('Total EXTINF TV trouvés:', tvExtinfCount);
          console.log('Chaînes TV traitées:', tvProcessedCount);
          console.log('Chaînes TV parsées:', parsedTvChannels);
          
          // Regrouper les chaînes TV par groupe en utilisant la propriété `group`
          const groupedTvChannels = parsedTvChannels.reduce((acc, channel) => {
            const groupName = channel.group || 'Autres';
            if (!acc[groupName]) {
              acc[groupName] = [];
            }
            acc[groupName].push(channel);
            return acc;
          }, {});

          setTvChannels(parsedTvChannels);
          setGroupedTvChannels(groupedTvChannels);
        }
        
        setLoading(false);
      })
      .catch(error => {
        console.error('Erreur lors du chargement:', error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    // Fonction pour charger les annonces AdSense après le rendu
    const loadAds = () => {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        console.error('Erreur lors du chargement des annonces:', err);
      }
    };

    // Attendre que les annonces soient rendues, puis charger
    setTimeout(loadAds, 1000);
  }, [channels]);

  const handleChannelClick = (channel) => {
    // Afficher la pub Adsterra à chaque clic
    showAdsterraPopunder();
    
    // Afficher un message à l'utilisateur pour installer Ace Stream s'il ne l'a pas
    const hasAceStream = checkAceStreamInstallation();
    
    if (!hasAceStream) {
      const installConfirmed = window.confirm("Pour regarder ce flux, vous devez installer Ace Stream. Souhaitez-vous le télécharger ?");
      if (installConfirmed) {
        window.open("https://www.acestream.org/", "_blank");
      }
    }
  };

  // Fonction pour gérer le clic sur un groupe de chaînes TV
  const handleTvGroupClick = (groupName, channels) => {
    setSelectedTvGroup(channels);
    setSelectedGroupName(groupName);
    showAdsterraPopunder(); // Afficher la pub
  };

  // Fonction pour revenir à la liste des groupes
  const handleBackToGroups = () => {
    setSelectedTvGroup(null);
    setSelectedGroupName('');
  };

  // Fonction pour afficher la pub Adsterra pop-under
  const showAdsterraPopunder = () => {
    try {
      // Utiliser une approche plus simple avec une div cachée
      const adContainer = document.createElement('div');
      adContainer.style.position = 'absolute';
      adContainer.style.left = '-9999px';
      adContainer.style.top = '-9999px';
      adContainer.style.width = '1px';
      adContainer.style.height = '1px';
      adContainer.style.overflow = 'hidden';
      
      // Créer un iframe pour la pub
      const iframe = document.createElement('iframe');
      iframe.src = 'https://www.adsterra.com/pu/27725433';
      iframe.style.width = '800px';
      iframe.style.height = '600px';
      iframe.style.border = 'none';
      
      // Ajouter l'iframe à la div cachée
      adContainer.appendChild(iframe);
      
      // Ajouter la div au document
      document.body.appendChild(adContainer);
      
      // Supprimer la pub après 10 secondes
      setTimeout(() => {
        try {
          if (adContainer && adContainer.parentNode) {
            adContainer.parentNode.removeChild(adContainer);
          }
        } catch (e) {
          // Ignorer les erreurs de suppression
        }
      }, 10000);
    } catch (error) {
      console.log('Popunder bloquée par le navigateur');
    }
  };

  // Fonction pour vérifier si Ace Stream est installé (limitée)
  const checkAceStreamInstallation = () => {
    // Cette méthode n'est pas fiable dans les navigateurs modernes
    // On peut seulement vérifier si le lien a été correctement intercepté
    return false; // Pour l'instant, on suppose que ce n'est pas le cas
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-2 ad-space d-none d-lg-block">
          <div className="text-center mt-4">
            <h5 className="text-muted mb-3">Advertisement</h5>
            <div className="ad-container" ref={adRef1}>
              <ins 
                className="adsbygoogle"
                style={{display:'block', minWidth: '150px', width: '100%', height: '600px'}}
                data-ad-client="ca-pub-9547009217122053"
                data-ad-slot="2199893828"
                data-ad-format="auto"
                data-full-width-responsive="true"
              ></ins>
            </div>
          </div>
        </div>

        <main className="col-lg-8 col-md-12 col-sm-12">
          <div className="container mt-4">
            {/* Navigation par onglets */}
            <div className="tabs-navigation mb-4">
              <ul className="nav nav-tabs">
                <li className="nav-item">
                  <button 
                    className={`nav-link ${activeTab === 'events' ? 'active' : ''}`}
                    onClick={() => setActiveTab('events')}
                  >
                    Événements à venir
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    className={`nav-link ${activeTab === 'livetv' ? 'active' : ''}`}
                    onClick={() => setActiveTab('livetv')}
                  >
                    LIVE TV
                  </button>
                </li>
              </ul>
            </div>

            <header className="text-center mb-4">
              <h1>{activeTab === 'events' ? 'Événements à venir' : 'Chaînes TV en direct'}</h1>
            </header>

            <div className="alert alert-info text-center fw-bold" role="alert">
              {activeTab === 'events' 
                ? 'Pour regarder les matchs, le logiciel Ace Stream est nécessaire. ' 
                : 'Pour regarder les chaînes TV, le logiciel Ace Stream est nécessaire. '}
              <a href="https://www.acestream.org/" target="_blank" rel="noopener noreferrer" className="alert-link">Cliquez ici pour l'installer.</a>
            </div>

            {error && <div className="alert alert-danger">Erreur: {error}</div>}
            {loading && <div className="text-center">Chargement des événements...</div>}
            {!loading && channels.length === 0 && activeTab === 'events' && <div className="alert alert-warning">Aucun événement trouvé</div>}
            {!loading && tvChannels.length === 0 && activeTab === 'livetv' && <div className="alert alert-warning">Aucune chaîne TV trouvée</div>}

            <div>
              {/* Affichage conditionnel selon l'onglet actif */}
              {activeTab === 'events' && (
                <div>
                  {Object.entries(channels).map(([competition, matches]) => (
                    <div key={competition} className="competition-section">
                      <h3 className="competition-title">
                        {matches[0]?.competitionLogo && (
                          <img 
                            src={matches[0].competitionLogo} 
                            className="competition-logo" 
                            alt={competition}
                            onError={(e) => { e.target.onerror = null; e.target.src='https://via.placeholder.com/30' }}
                          />
                        )}
                        {competition}
                      </h3>
                      {matches.map((channel, index) => (
                        <div key={channel.contentId || index} className="match-card" onClick={() => handleChannelClick(channel)}>
                          <div className="match-card-content">
                            <div className="team-section left">
                              <span className="team-name">{channel.team1}</span>
                            </div>
                            
                            <div className="vs-divider">
                              <span className="vs-text">VS</span>
                            </div>
                            
                            <div className="team-section right">
                              <span className="team-name">{channel.team2}</span>
                            </div>
                          </div>
                          
                          <div className="info-section">
                            <img src={channel.logo} className="channel-logo" alt="" onError={(e) => { e.target.onerror = null; e.target.src='https://via.placeholder.com/35' }}/>
                            <div className="info-text">
                              <div className="match-time">{channel.time}</div>
                              <div className="match-competition">{channel.competition}</div>
                              <div className="match-channel">{channel.channel}</div>
                            </div>
                          </div>
                          
                          <a 
                            href={channel.acestreamUrl} 
                            className="play-link"
                            onClick={(e) => e.stopPropagation()}
                            rel="noopener noreferrer"
                          >
                            <span className="play-icon">▶</span> Play
                          </a>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'livetv' && (
                <div>
                  {selectedTvGroup ? (
                    // Vue des chaînes d'un groupe sélectionné
                    <div>
                      <button className="btn btn-secondary mb-3" onClick={handleBackToGroups}>&larr; Retour aux groupes</button>
                      <h3 className="competition-title">{selectedGroupName}</h3>
                      <div className="tv-channels-grid">
                        {selectedTvGroup.map((channel, index) => (
                          <div key={channel.contentId || index} className="match-card" onClick={() => handleChannelClick(channel)}>
                            <div className="match-card-content">
                              <img src={channel.logo} className="channel-logo-large" alt={channel.name} onError={(e) => { e.target.onerror = null; e.target.src='https://via.placeholder.com/80' }}/>
                              <div className="info-text-large">{channel.name}</div>
                            </div>
                            <a 
                              href={channel.acestreamUrl} 
                              className="play-link"
                              onClick={(e) => e.stopPropagation()}
                              rel="noopener noreferrer"
                            >
                              <span className="play-icon">▶</span> Play
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    // Vue des groupes de chaînes
                    <div>
                      {Object.keys(groupedTvChannels).length > 0 ? (
                        <div className="tv-channels-grid">
                          {Object.entries(groupedTvChannels).map(([groupName, channels]) => (
                            <div key={groupName} className="tv-group-card" onClick={() => handleTvGroupClick(groupName, channels)}>
                              <div className="tv-group-content">
                                <div className="tv-group-info">
                                  <div className="tv-group-name">{groupName}</div>
                                  <div className="tv-group-count">{channels.length} chaînes</div>
                                </div>
                              </div>
                              <div className="tv-group-channels-preview">
                                {channels.slice(0, 3).map((channel, index) => (
                                  <img 
                                    key={channel.contentId || index} 
                                    src={channel.logo} 
                                    className="tv-group-channel-logo" 
                                    alt={channel.name} 
                                    onError={(e) => { e.target.onerror = null; e.target.src='https://via.placeholder.com/35' }}
                                  />
                                ))}
                                {channels.length > 3 && (
                                  <div className="tv-group-more">+{channels.length - 3} autres</div>
                                )}
                              </div>
                              <a 
                                href="#" 
                                className="tv-group-play-link"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleTvGroupClick(groupName, channels);
                                }}
                                rel="noopener noreferrer"
                              >
                                <span className="play-icon">▶</span> Voir les chaînes
                              </a>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="alert alert-warning">Aucune chaîne TV trouvée</div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>

        <div className="col-2 ad-space d-none d-lg-block">
          <div className="text-center mt-4">
            <h5 className="text-muted mb-3">Advertisement</h5>
            <div className="ad-container" ref={adRef2}>
              <ins 
                className="adsbygoogle"
                style={{display:'block', minWidth: '150px', width: '100%', height: '600px'}}
                data-ad-client="ca-pub-9547009217122053"
                data-ad-slot="2199893828"
                data-ad-format="auto"
                data-full-width-responsive="true"
              ></ins>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;