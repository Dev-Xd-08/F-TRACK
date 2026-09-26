// Analytics & Progress Intelligence API Service for F-TRACK: FITNESS ASCENSION (Stage 10)

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
 * Fetch authenticated warrior's comprehensive fitness analytics and progress intelligence
 */
export const getAnalytics = async () => {
  const response = await fetch(`${API_URL}/analytics`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to retrieve fitness analytics telemetry.');
  }

  return data;
};

export default {
  getAnalytics,
};
