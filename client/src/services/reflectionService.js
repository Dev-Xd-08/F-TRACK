// Workout Reflection Service for F-TRACK: FITNESS ASCENSION (Stage 19)

const API_URL = import.meta.env.VITE_API_URL || '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('ftrack_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/**
 * Record a subjective post-workout reflection
 */
export const saveReflection = async (reflectionData) => {
  const response = await fetch(`${API_URL}/reflections`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(reflectionData),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to record session reflection.');
  }

  return data;
};

/**
 * Get user's workout reflections
 */
export const getReflections = async () => {
  const response = await fetch(`${API_URL}/reflections`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to retrieve reflections.');
  }

  return data;
};

export default {
  saveReflection,
  getReflections,
};
