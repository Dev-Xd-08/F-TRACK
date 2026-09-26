// Health & Body Analysis API Service for F-TRACK: FITNESS ASCENSION

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
 * Fetch the authenticated user's latest health calculations
 */
export const getHealthProfile = async () => {
  const response = await fetch(`${API_URL}/health/profile`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to retrieve body analysis profile.');
  }

  return data;
};

/**
 * Calculate Body Mass Index (BMI)
 * @param {number} heightCm - Height in centimeters
 * @param {number} weightKg - Weight in kilograms
 */
export const calculateBMI = async (heightCm, weightKg) => {
  const response = await fetch(`${API_URL}/health/bmi`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ heightCm, weightKg }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to calculate BMI.');
  }

  return data;
};

/**
 * Calculate BMR and TDEE maintenance calories
 * @param {object} params - Calculation parameters
 * @param {number} params.age - Age in years
 * @param {string} params.sex - 'male' | 'female'
 * @param {number} params.heightCm - Height in cm
 * @param {number} params.weightKg - Weight in kg
 * @param {string} params.activityLevel - Activity tier
 */
export const calculateCalories = async ({ age, sex, heightCm, weightKg, activityLevel }) => {
  const response = await fetch(`${API_URL}/health/calories`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ age, sex, heightCm, weightKg, activityLevel }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to calculate calorie requirements.');
  }

  return data;
};

export default {
  getHealthProfile,
  calculateBMI,
  calculateCalories,
};
