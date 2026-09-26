// Quest System API Service for F-TRACK: FITNESS ASCENSION (Stage 8)

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
 * Fetch the authenticated warrior's active Daily and Weekly quests
 */
export const getQuests = async () => {
  const response = await fetch(`${API_URL}/quests`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to retrieve quest board telemetry.');
  }

  return data;
};

/**
 * Fetch the authenticated warrior's completed quest archives
 */
export const getQuestHistory = async () => {
  const response = await fetch(`${API_URL}/quests/history`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to retrieve quest completion history.');
  }

  return data;
};

export default {
  getQuests,
  getQuestHistory,
};
