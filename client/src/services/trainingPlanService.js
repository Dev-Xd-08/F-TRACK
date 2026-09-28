// Training Plan & Adaptive Life API Service for F-TRACK: FITNESS ASCENSION (Stage 20)

const API_URL = import.meta.env.VITE_API_URL || '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('ftrack_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/**
 * Get active training plan and schedule
 */
export const getTrainingPlan = async () => {
  const response = await fetch(`${API_URL}/training-plan`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to retrieve training plan.');
  }

  return data;
};

/**
 * Create or configure a new training plan
 */
export const createTrainingPlan = async (planData) => {
  const response = await fetch(`${API_URL}/training-plan`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(planData),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to create training plan.');
  }

  return data;
};

/**
 * Update active training plan
 */
export const updateTrainingPlan = async (id, updates) => {
  const response = await fetch(`${API_URL}/training-plan/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(updates),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to update training plan.');
  }

  return data;
};

/**
 * Delete a training plan
 */
export const deleteTrainingPlan = async (id) => {
  const response = await fetch(`${API_URL}/training-plan/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to delete training plan.');
  }

  return data;
};

/**
 * Get adaptive week status (day-by-day progress and rebalancing)
 */
export const getAdaptiveWeek = async () => {
  const response = await fetch(`${API_URL}/training-plan/schedule/adaptive-week`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to retrieve adaptive week status.');
  }

  return data;
};

/**
 * Get personal baseline and self-comparison
 */
export const getBaseline = async () => {
  const response = await fetch(`${API_URL}/training-plan/metrics/baseline`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to retrieve personal baseline.');
  }

  return data;
};

/**
 * Get daily adaptive recommendation with "Why this?"
 */
export const getDailyRecommendation = async () => {
  const response = await fetch(`${API_URL}/training-plan/advisory/recommendation`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to retrieve daily recommendation.');
  }

  return data;
};

/**
 * Get load check signal and activity balance distribution
 */
export const getLoadAndBalance = async () => {
  const response = await fetch(`${API_URL}/training-plan/metrics/balance`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to retrieve load and balance telemetry.');
  }

  return data;
};

/**
 * Get life load and available time context
 */
export const getLifeContext = async () => {
  const response = await fetch(`${API_URL}/training-plan/context/life-load`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to retrieve life context.');
  }

  return data;
};

/**
 * Update weekly life load
 */
export const setLifeLoad = async (lifeLoad) => {
  const response = await fetch(`${API_URL}/training-plan/context/life-load`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ lifeLoad }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to update life load.');
  }

  return data;
};

/**
 * Update today's available minutes
 */
export const setAvailability = async (availableMinutes) => {
  const response = await fetch(`${API_URL}/training-plan/context/availability`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ availableMinutes }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to update available time.');
  }

  return data;
};

export default {
  getTrainingPlan,
  createTrainingPlan,
  updateTrainingPlan,
  deleteTrainingPlan,
  getAdaptiveWeek,
  getBaseline,
  getDailyRecommendation,
  getLoadAndBalance,
  getLifeContext,
  setLifeLoad,
  setAvailability,
};
