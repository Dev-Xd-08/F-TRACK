// Personal Record Matrix API Service for F-TRACK: FITNESS ASCENSION (Stage 7)

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
 * Fetch the authenticated warrior's verified Personal Record Matrix
 */
export const getRecords = async () => {
  const response = await fetch(`${API_URL}/records`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to retrieve personal record matrix.');
  }

  return data;
};

export default {
  getRecords,
};
