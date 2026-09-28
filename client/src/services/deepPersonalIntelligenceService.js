// Deep Personal Intelligence API Service for F-TRACK: FITNESS ASCENSION (Stage 21)

const API_URL = import.meta.env.VITE_API_URL || '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('ftrack_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/**
 * Fetch consolidated deep personal intelligence
 */
export const getDeepIntelligence = async () => {
  const response = await fetch(`${API_URL}/deep-intelligence`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to retrieve deep intelligence.');
  }

  return data;
};

/**
 * Fetch behavioral patterns
 */
export const getPatterns = async () => {
  const response = await fetch(`${API_URL}/deep-intelligence/patterns`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to retrieve personal patterns.');
  }

  return data;
};

/**
 * Fetch "What Changed?" comparative telemetry
 */
export const getChanges = async () => {
  const response = await fetch(`${API_URL}/deep-intelligence/changes`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to retrieve comparative telemetry.');
  }

  return data;
};

/**
 * Fetch personal growth summary
 */
export const getGrowthSummary = async () => {
  const response = await fetch(`${API_URL}/deep-intelligence/summary`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to retrieve growth summary.');
  }

  return data;
};

export default {
  getDeepIntelligence,
  getPatterns,
  getChanges,
  getGrowthSummary,
};
