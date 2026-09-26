// Authentication Service for F-TRACK: FITNESS ASCENSION

const API_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Register a new warrior user
 */
export const registerUser = async (name, email, password) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Warrior registration failed.');
  }

  return data;
};

/**
 * Authenticate existing warrior and obtain JWT
 */
export const loginUser = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Portal authentication failed.');
  }

  return data;
};

/**
 * Fetch current authenticated warrior profile using JWT Bearer token
 */
export const getCurrentUser = async (token) => {
  const response = await fetch(`${API_URL}/auth/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Token verification failed.');
  }

  return data;
};

export default {
  registerUser,
  loginUser,
  getCurrentUser,
};
