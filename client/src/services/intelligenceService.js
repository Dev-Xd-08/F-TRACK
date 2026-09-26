// Fitness Intelligence & Smart Insights API Service for F-TRACK: FITNESS ASCENSION (Stage 12)

const API_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Retrieve authorization headers with stored JWT token
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem('ftrack_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/**
 * Fetch authenticated warrior's personal fitness intelligence and smart insights
 */
export const getFitnessIntelligence = async () => {
  const response = await fetch(`${API_URL}/intelligence`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to retrieve fitness intelligence telemetry.');
  }

  return data;
};

export default {
  getFitnessIntelligence,
};
