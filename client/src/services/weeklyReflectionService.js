// Weekly Reflection API Service for F-TRACK: FITNESS ASCENSION (Stage 20)

const API_URL = import.meta.env.VITE_API_URL || '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('ftrack_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/**
 * Fetch all past weekly reflections
 */
export const getWeeklyReflections = async () => {
  const response = await fetch(`${API_URL}/weekly-reflections`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to retrieve weekly reflections.');
  }

  return data;
};

/**
 * Fetch current week's reflection if it exists
 */
export const getCurrentWeeklyReflection = async () => {
  const response = await fetch(`${API_URL}/weekly-reflections/current`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to retrieve current week reflection.');
  }

  return data;
};

/**
 * Save or update weekly reflection
 */
export const saveWeeklyReflection = async (reflectionData) => {
  const response = await fetch(`${API_URL}/weekly-reflections`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(reflectionData),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to save weekly reflection.');
  }

  return data;
};

export default {
  getWeeklyReflections,
  getCurrentWeeklyReflection,
  saveWeeklyReflection,
};
