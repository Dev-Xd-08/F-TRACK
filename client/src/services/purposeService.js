// Personal Purpose Service for F-TRACK: FITNESS ASCENSION (Stage 19)

const API_URL = import.meta.env.VITE_API_URL || '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('ftrack_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/**
 * Fetch the authenticated user's fitness purpose
 */
export const getPurpose = async () => {
  const response = await fetch(`${API_URL}/purpose`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to retrieve personal purpose.');
  }

  return data;
};

/**
 * Anchor or update user's fitness purpose
 */
export const savePurpose = async (purposeData) => {
  const response = await fetch(`${API_URL}/purpose`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(purposeData),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to save personal purpose.');
  }

  return data;
};

/**
 * Clear user's fitness purpose
 */
export const deletePurpose = async () => {
  const response = await fetch(`${API_URL}/purpose`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to clear personal purpose.');
  }

  return data;
};

export default {
  getPurpose,
  savePurpose,
  deletePurpose,
};
