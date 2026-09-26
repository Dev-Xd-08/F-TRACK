// Progression API Service for F-TRACK: FITNESS ASCENSION (Stage 6)

const API_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Helper to retrieve stored JWT authorization header
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem('ftrack_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/**
 * Fetch the authenticated warrior's progression matrix
 * (Level, XP, Rank, Streak, and total stats)
 */
export const getProgression = async () => {
  const response = await fetch(`${API_URL}/progression`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to retrieve warrior ascension status.');
  }

  return data;
};

/**
 * Fetch the authenticated warrior's progression events history
 */
export const getProgressionHistory = async () => {
  const response = await fetch(`${API_URL}/progression/history`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to retrieve ascension history.');
  }

  return data;
};

export default {
  getProgression,
  getProgressionHistory,
};
