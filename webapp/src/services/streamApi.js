// 🔧 CONFIGURATION: Remplacer par l'URL de votre backend déployé
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

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
  const res = await fetch(`${apiBase}/api/streams`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ hash })
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

export async function stopStreamSession(apiBase, sessionId) {
  const res = await fetch(`${apiBase}/api/streams/${sessionId}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

export default {
  getPlaylists,
  getChannels,
  playChannel,
  getStreamStatus,
  stopStream,
  checkBackendHealth
};
