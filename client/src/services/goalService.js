// Personal Goals & Mission Planning API Service for F-TRACK: FITNESS ASCENSION (Stage 13)

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
 * Fetch all fitness missions/goals for authenticated warrior
 */
export const getGoals = async () => {
  const response = await fetch(`${API_URL}/goals`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to retrieve fitness missions.');
  }

  return data;
};

/**
 * Fetch single mission by ID
 * @param {string} id 
 */
export const getGoal = async (id) => {
  const response = await fetch(`${API_URL}/goals/${id}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to retrieve mission details.');
  }

  return data;
};

/**
 * Create a new fitness mission
 * @param {Object} goalData 
 */
export const createGoal = async (goalData) => {
  const response = await fetch(`${API_URL}/goals`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(goalData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to create fitness mission.');
  }

  return data;
};

/**
 * Update an existing mission configuration
 * @param {string} id 
 * @param {Object} updates 
 */
export const updateGoal = async (id, updates) => {
  const response = await fetch(`${API_URL}/goals/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(updates),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to update fitness mission.');
  }

  return data;
};

/**
 * Delete a mission
 * @param {string} id 
 */
export const deleteGoal = async (id) => {
  const response = await fetch(`${API_URL}/goals/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to delete fitness mission.');
  }

  return data;
};

/**
 * Force refresh progress for a specific mission
 * @param {string} id 
 */
export const refreshGoal = async (id) => {
  const response = await fetch(`${API_URL}/goals/${id}/refresh`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to refresh mission progress.');
  }

  return data;
};

/**
 * Update manual progress for a CUSTOM mission
 * @param {string} id 
 * @param {number} value 
 */
export const updateGoalProgress = async (id, value) => {
  const response = await fetch(`${API_URL}/goals/${id}/progress`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ value }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to update mission progress.');
  }

  return data;
};

export default {
  getGoals,
  getGoal,
  createGoal,
  updateGoal,
  deleteGoal,
  refreshGoal,
  updateGoalProgress,
};
