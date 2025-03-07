/**
 * API Configuration
 * 
 * This file contains configuration for the API services including:
 * - Base URL
 * - Default headers
 * - Timeout settings
 * - Helper functions for building API requests
 */

// Base URL for all API requests
// In development, this should point to the Django backend server
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Default request timeout in milliseconds
const DEFAULT_TIMEOUT = 30000;

// Default headers for all requests
const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

/**
 * Build headers including authentication token if available
 * @param {string} token - Authentication token
 * @returns {Object} Headers object
 */
const buildHeaders = (token) => {
  const headers = { ...DEFAULT_HEADERS };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

/**
 * Build the full URL for an API endpoint
 * @param {string} endpoint - API endpoint path
 * @returns {string} Full URL
 */
const buildUrl = (endpoint) => {
  // Make sure endpoint starts with a slash
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${normalizedEndpoint}`;
};

/**
 * Handle API response, converting to JSON and checking for errors
 * @param {Response} response - Fetch API response object
 * @returns {Promise<Object>} Parsed response data
 * @throws {Error} If the response is not ok
 */
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    // If the server returns an error message, use it
    const errorMessage = data.error || response.statusText;
    throw new Error(errorMessage);
  }
  
  return data;
};

/**
 * Create a request configuration object for fetch
 * @param {string} method - HTTP method (GET, POST, etc.)
 * @param {Object} data - Request body data
 * @param {string} token - Authentication token
 * @returns {Object} Fetch request configuration
 */
const createRequestConfig = (method, data = null, token = null) => {
  const config = {
    method,
    headers: buildHeaders(token),
    credentials: 'include', // Include cookies in requests if needed
  };
  
  if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    config.body = JSON.stringify(data);
  }
  
  return config;
};

// Export configuration and helper functions
export {
  API_BASE_URL,
  DEFAULT_TIMEOUT,
  DEFAULT_HEADERS,
  buildHeaders,
  buildUrl,
  handleResponse,
  createRequestConfig,
}; 