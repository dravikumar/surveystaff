/**
 * Authentication Service
 * 
 * Handles all authentication-related API requests including:
 * - User registration (sign up)
 * - User authentication (sign in)
 * - User sign out
 * - Password reset/update
 * - User profile management
 */

import { buildUrl, handleResponse, createRequestConfig } from './config';

/**
 * Register a new user
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @param {Object} metadata - Optional user metadata
 * @returns {Promise<Object>} Result containing user and session data
 */
export const signUp = async (email, password, metadata = {}) => {
  try {
    const url = buildUrl('/auth/signup/');
    const config = createRequestConfig('POST', { email, password, metadata });
    
    const response = await fetch(url, config);
    return await handleResponse(response);
  } catch (error) {
    console.error('Sign up error:', error);
    throw error;
  }
};

/**
 * Authenticate a user
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<Object>} Result containing user and session data
 */
export const signIn = async (email, password) => {
  try {
    const url = buildUrl('/auth/signin/');
    const config = createRequestConfig('POST', { email, password });
    
    const response = await fetch(url, config);
    return await handleResponse(response);
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
};

/**
 * Sign out the current user
 * @param {string} token - User's access token
 * @returns {Promise<Object>} Result indicating success
 */
export const signOut = async (token) => {
  try {
    const url = buildUrl('/auth/signout/');
    const config = createRequestConfig('POST', { access_token: token }, token);
    
    const response = await fetch(url, config);
    return await handleResponse(response);
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
};

/**
 * Get current user data
 * @param {string} token - User's access token
 * @returns {Promise<Object>} User data
 */
export const getCurrentUser = async (token) => {
  try {
    const url = buildUrl('/auth/user/');
    const config = createRequestConfig('GET', null, token);
    
    const response = await fetch(url, config);
    return await handleResponse(response);
  } catch (error) {
    console.error('Get current user error:', error);
    throw error;
  }
};

/**
 * Update user profile information
 * @param {string} token - User's access token
 * @param {Object} userData - User data to update
 * @returns {Promise<Object>} Updated user data
 */
export const updateUser = async (token, userData) => {
  try {
    const url = buildUrl('/auth/user/');
    const config = createRequestConfig('PUT', userData, token);
    
    const response = await fetch(url, config);
    return await handleResponse(response);
  } catch (error) {
    console.error('Update user error:', error);
    throw error;
  }
};

/**
 * Send a password reset email
 * @param {string} email - User's email
 * @returns {Promise<Object>} Result indicating success
 */
export const resetPassword = async (email) => {
  try {
    const url = buildUrl('/auth/reset-password/');
    const config = createRequestConfig('POST', { email });
    
    const response = await fetch(url, config);
    return await handleResponse(response);
  } catch (error) {
    console.error('Reset password error:', error);
    throw error;
  }
};

/**
 * Update user's password (requires authentication)
 * @param {string} token - User's access token
 * @param {string} password - New password
 * @returns {Promise<Object>} Result indicating success
 */
export const updatePassword = async (token, password) => {
  try {
    const url = buildUrl('/auth/update-password/');
    const config = createRequestConfig('POST', { password }, token);
    
    const response = await fetch(url, config);
    return await handleResponse(response);
  } catch (error) {
    console.error('Update password error:', error);
    throw error;
  }
};

/**
 * Verify session validity and refresh if needed
 * @param {string} token - User's access token
 * @returns {Promise<Object>} Session data
 */
export const verifySession = async (token) => {
  try {
    const url = buildUrl('/auth/session/');
    const config = createRequestConfig('GET', null, token);
    
    const response = await fetch(url, config);
    return await handleResponse(response);
  } catch (error) {
    console.error('Verify session error:', error);
    throw error;
  }
}; 