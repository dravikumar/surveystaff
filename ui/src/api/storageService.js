/**
 * Storage Service
 * 
 * Handles all file storage operations with the API including:
 * - Uploading files
 * - Downloading files
 * - Listing files
 * - Generating public URLs
 * - Deleting files
 */

import { buildUrl, handleResponse, createRequestConfig } from './config';

/**
 * Upload a file to storage
 * @param {string} bucket - Storage bucket name
 * @param {string} path - File path within the bucket
 * @param {File|Blob|string} fileData - File data to upload
 * @param {string} contentType - MIME type of the file
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} Upload result with path and URL
 */
export const uploadFile = async (bucket, path, fileData, contentType, token = null) => {
  try {
    const url = buildUrl('/storage/');
    
    // Handle different types of file data
    let fileContent = fileData;
    
    // If it's a File or Blob, convert to base64
    if (fileData instanceof File || fileData instanceof Blob) {
      fileContent = await readFileAsBase64(fileData);
    }
    
    const data = {
      bucket,
      path,
      file: fileContent,
      content_type: contentType
    };
    
    const config = createRequestConfig('POST', data, token);
    
    const response = await fetch(url, config);
    return await handleResponse(response);
  } catch (error) {
    console.error('Upload file error:', error);
    throw error;
  }
};

/**
 * Download a file from storage
 * @param {string} bucket - Storage bucket name
 * @param {string} path - File path within the bucket
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} File data with content type
 */
export const downloadFile = async (bucket, path, token = null) => {
  try {
    const params = new URLSearchParams();
    params.append('bucket', bucket);
    params.append('path', path);
    
    const url = `${buildUrl('/storage/')}?${params.toString()}`;
    const config = createRequestConfig('GET', null, token);
    
    const response = await fetch(url, config);
    return await handleResponse(response);
  } catch (error) {
    console.error('Download file error:', error);
    throw error;
  }
};

/**
 * List files in a storage bucket
 * @param {string} bucket - Storage bucket name
 * @param {string} path - Optional path prefix to filter by
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} List of files
 */
export const listFiles = async (bucket, path = '', token = null) => {
  try {
    const params = new URLSearchParams();
    params.append('bucket', bucket);
    
    if (path) {
      params.append('prefix', path);
    }
    
    const url = `${buildUrl('/storage/')}?${params.toString()}`;
    const config = createRequestConfig('GET', null, token);
    
    const response = await fetch(url, config);
    return await handleResponse(response);
  } catch (error) {
    console.error('List files error:', error);
    throw error;
  }
};

/**
 * Delete a file from storage
 * @param {string} bucket - Storage bucket name
 * @param {string} path - File path within the bucket
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} Result indicating success
 */
export const deleteFile = async (bucket, path, token = null) => {
  try {
    const params = new URLSearchParams();
    params.append('bucket', bucket);
    params.append('path', path);
    
    const url = `${buildUrl('/storage/')}?${params.toString()}`;
    const config = createRequestConfig('DELETE', null, token);
    
    const response = await fetch(url, config);
    return await handleResponse(response);
  } catch (error) {
    console.error('Delete file error:', error);
    throw error;
  }
};

/**
 * Generate a public URL for a file
 * @param {string} bucket - Storage bucket name
 * @param {string} path - File path within the bucket
 * @param {number} expiresIn - Expiration time in seconds
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} Public URL information
 */
export const getPublicUrl = async (bucket, path, expiresIn = 3600, token = null) => {
  try {
    const url = buildUrl('/storage/public-url/');
    const config = createRequestConfig('POST', {
      bucket,
      path,
      expires_in: expiresIn
    }, token);
    
    const response = await fetch(url, config);
    return await handleResponse(response);
  } catch (error) {
    console.error('Get public URL error:', error);
    throw error;
  }
};

/**
 * Helper function to read a file as base64
 * @param {File|Blob} file - File or Blob to read
 * @returns {Promise<string>} Base64 encoded file content
 */
const readFileAsBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // Remove the data URL prefix (e.g., "data:image/png;base64,")
      const base64String = reader.result.split(',')[1];
      resolve(base64String);
    };
    reader.onerror = error => reject(error);
  });
}; 