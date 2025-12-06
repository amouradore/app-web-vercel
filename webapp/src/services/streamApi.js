// 🔧 CONFIGURATION: Remplacer par l'URL de votre backend déployé
let API_URL = process.env.REACT_APP_API_URL || 'https://potter-thirty-llc-manufacturing.trycloudflare.com';

// Initialiser l'URL depuis le localStorage si disponible
const savedUrl = localStorage.getItem('iptv_api_url');
if (savedUrl) {
  // Vérifier si l'URL sauvegardée est l'ancienne URL invalide
  if (savedUrl.includes('virtual-unified-showing-maple')) {
    console.log('🗑️ Ancienne URL invalide détectée et supprimée:', savedUrl);
    localStorage.removeItem('iptv_api_url');
    // Garder la nouvelle URL par défaut
  } else {
    API_URL = savedUrl;
    console.log('🔗 API URL chargée depuis localStorage:', API_URL);
  }
}

// Vérifier les paramètres d'URL pour une surcharge temporaire
if (typeof window !== 'undefined') {
  const params = new URLSearchParams(window.location.search);
  const apiUrlParam = params.get('api');
  if (apiUrlParam) {
    API_URL = apiUrlParam;
    localStorage.setItem('iptv_api_url', API_URL);
    console.log('🔗 API URL mise à jour depuis URL param:', API_URL);
  }
}

/**
 * Obtient l'URL actuelle de l'API
 */
export const getApiUrl = () => API_URL;

/**
 * Définit une nouvelle URL d'API
 */
export const setApiUrl = (url) => {
  if (!url) return;
  // Retirer le slash final si présent
  API_URL = url.endsWith('/') ? url.slice(0, -1) : url;
  localStorage.setItem('iptv_api_url', API_URL);
  console.log('🔗 API URL mise à jour:', API_URL);
  // Recharger la page pour appliquer les changements partout si nécessaire
  window.location.reload();
};

/**
 * Récupère la liste des playlists M3U disponibles
 */
export const getPlaylists = async () => {
  try {
    const response = await fetch(`${API_URL}/api/playlists`);
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des playlists');
    }
    return await response.json();
  } catch (error) {
    console.error('Erreur getPlaylists:', error);
    throw error;
  }
};

/**
 * Récupère les chaînes d'une playlist spécifique
 */
export const getChannels = async (playlistName) => {
  try {
    const name = playlistName.replace('.m3u', '');
    const response = await fetch(`${API_URL}/api/playlists/${name}/channels`);
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des chaînes');
    }
    return await response.json();
  } catch (error) {
    console.error('Erreur getChannels:', error);
    throw error;
  }
};

/**
 * Démarre le streaming d'une chaîne AceStream
 */
export const playChannel = async (acestreamHash) => {
  try {
    const response = await fetch(`${API_URL}/api/play`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hash: acestreamHash })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Erreur lors du démarrage du stream');
    }
    return await response.json();
  } catch (error) {
    console.error('Erreur playChannel:', error);
    throw error;
  }
};

/**
 * Vérifie le statut d'une session de streaming
 */
export const getStreamStatus = async (sessionId) => {
  try {
    const response = await fetch(`${API_URL}/api/streams/${sessionId}`);
    if (!response.ok) {
      throw new Error('Erreur lors de la vérification du statut');
    }
    return await response.json();
  } catch (error) {
    console.error('Erreur getStreamStatus:', error);
    throw error;
  }
};

/**
 * Arrête une session de streaming
 */
export const stopStream = async (sessionId) => {
  try {
    const response = await fetch(`${API_URL}/api/streams/${sessionId}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      throw new Error('Erreur lors de l\'arrêt du stream');
    }
    return await response.json();
  } catch (error) {
    console.error('Erreur stopStream:', error);
    throw error;
  }
};

/**
 * Vérifie si le backend est disponible
 */
export const checkBackendHealth = async () => {
  try {
    const response = await fetch(`${API_URL}/`);
    if (!response.ok) {
      return { available: false, error: 'Backend non disponible' };
    }
    const data = await response.json();
    return { available: true, data };
  } catch (error) {
    console.error('Erreur checkBackendHealth:', error);
    return { available: false, error: error.message };
  }
};

// Legacy compatibility
export async function startStreamSession(apiBase, hash) {
  // Ignorer apiBase si on a une URL configurée globalement
  const baseUrl = API_URL || apiBase;
  const res = await fetch(`${baseUrl}/api/streams`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ hash })
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

export async function stopStreamSession(apiBase, sessionId) {
  const baseUrl = API_URL || apiBase;
  const res = await fetch(`${baseUrl}/api/streams/${sessionId}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

export default {
  getApiUrl,
  setApiUrl,
  getPlaylists,
  getChannels,
  playChannel,
  getStreamStatus,
  stopStream,
  checkBackendHealth
};
