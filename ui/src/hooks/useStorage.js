/**
 * useStorage Hook
 * 
 * Custom hook for storage operations using the storage service.
 * Automatically includes authentication token from AuthContext.
 */

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { storageService } from '../api';

export function useStorage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { getToken } = useAuth();

  /**
   * Upload a file to storage
   * @param {string} bucket - Storage bucket name
   * @param {string} path - File path within the bucket
   * @param {File|Blob|string} fileData - File data to upload
   * @param {string} contentType - MIME type of the file
   * @returns {Promise<Object>} Upload result with path and URL
   */
  const uploadFile = async (bucket, path, fileData, contentType) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = getToken();
      const response = await storageService.uploadFile(bucket, path, fileData, contentType, token);
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Download a file from storage
   * @param {string} bucket - Storage bucket name
   * @param {string} path - File path within the bucket
   * @returns {Promise<Object>} File data with content type
   */
  const downloadFile = async (bucket, path) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = getToken();
      const response = await storageService.downloadFile(bucket, path, token);
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * List files in a storage bucket
   * @param {string} bucket - Storage bucket name
   * @param {string} path - Optional path prefix to filter by
   * @returns {Promise<Object>} List of files
   */
  const listFiles = async (bucket, path = '') => {
    try {
      setLoading(true);
      setError(null);
      
      const token = getToken();
      const response = await storageService.listFiles(bucket, path, token);
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete a file from storage
   * @param {string} bucket - Storage bucket name
   * @param {string} path - File path within the bucket
   * @returns {Promise<Object>} Result indicating success
   */
  const deleteFile = async (bucket, path) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = getToken();
      const response = await storageService.deleteFile(bucket, path, token);
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Generate a public URL for a file
   * @param {string} bucket - Storage bucket name
   * @param {string} path - File path within the bucket
   * @param {number} expiresIn - Expiration time in seconds (default: 3600)
   * @returns {Promise<Object>} Public URL information
   */
  const getPublicUrl = async (bucket, path, expiresIn = 3600) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = getToken();
      const response = await storageService.getPublicUrl(bucket, path, expiresIn, token);
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Helper function to upload a file with a unique name based on the original filename
   * @param {string} bucket - Storage bucket name
   * @param {string} folder - Folder path within the bucket
   * @param {File} file - File object to upload
   * @returns {Promise<Object>} Upload result with path and URL
   */
  const uploadFileWithUniqueId = async (bucket, folder, file) => {
    try {
      setLoading(true);
      setError(null);
      
      // Generate a unique filename
      const fileExtension = file.name.split('.').pop();
      const uniqueId = new Date().getTime();
      const uniquePath = `${folder}/${uniqueId}_${file.name}`;
      
      const token = getToken();
      const response = await storageService.uploadFile(
        bucket,
        uniquePath,
        file,
        file.type,
        token
      );
      
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    uploadFile,
    downloadFile,
    listFiles,
    deleteFile,
    getPublicUrl,
    uploadFileWithUniqueId
  };
} 