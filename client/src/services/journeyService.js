// Journey & Adaptive Telemetry Service for F-TRACK: FITNESS ASCENSION (Stage 19)

const API_URL = import.meta.env.VITE_API_URL || '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('ftrack_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/**
 * Fetch comprehensive journey telemetry:
 * Milestones, Return Status, Today Focus, Goal Adjustments, Habit Patterns, Plateau Analysis, Growth Summary
 */
export const getJourneyTelemetry = async () => {
  const response = await fetch(`${API_URL}/journey/telemetry`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to retrieve journey telemetry.');
  }

  return data;
};

export default {
  getJourneyTelemetry,
};
