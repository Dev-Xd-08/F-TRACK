// Workout Quest Service for F-TRACK: FITNESS ASCENSION

const API_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Retrieve the current warrior's authentication token
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem('ftrack_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/**
 * Fetch all workouts for the authenticated warrior
 */
export const getWorkouts = async () => {
  const response = await fetch(`${API_URL}/workouts`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to retrieve workout quests.');
  }

  return data;
};

/**
 * Fetch single workout by ID
 */
export const getWorkout = async (id) => {
  const response = await fetch(`${API_URL}/workouts/${id}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to retrieve workout quest details.');
  }

  return data;
};

/**
 * Log a new workout quest
 */
export const createWorkout = async (workoutData) => {
  const response = await fetch(`${API_URL}/workouts`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(workoutData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to record workout quest.');
  }

  return data;
};

/**
 * Update an existing workout quest
 */
export const updateWorkout = async (id, updateData) => {
  const response = await fetch(`${API_URL}/workouts/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(updateData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to update workout quest.');
  }

  return data;
};

/**
 * Delete a workout quest
 */
export const deleteWorkout = async (id) => {
  const response = await fetch(`${API_URL}/workouts/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to delete workout quest.');
  }

  return data;
};

export default {
  getWorkouts,
  getWorkout,
  createWorkout,
  updateWorkout,
  deleteWorkout,
};
