/**
 * useData Hook
 * 
 * Custom hook for data operations using the data service.
 * Automatically includes authentication token from AuthContext.
 */

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { dataService } from '../api';

export function useData() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { getToken } = useAuth();

  /**
   * Fetch data from a table
   * @param {string} table - Table name
   * @param {Object} queryParams - Query parameters (optional)
   * @returns {Promise<Object>} Query results
   */
  const fetchData = async (table, queryParams = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = getToken();
      const response = await dataService.fetchData(table, queryParams, token);
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Insert data into a table
   * @param {string} table - Table name
   * @param {Object} data - Data to insert
   * @returns {Promise<Object>} Inserted data with ID
   */
  const insertData = async (table, data) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = getToken();
      const response = await dataService.insertData(table, data, token);
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update data in a table
   * @param {string} table - Table name
   * @param {string} matchColumn - Column name to match (usually 'id')
   * @param {any} matchValue - Value to match
   * @param {Object} data - Data to update
   * @returns {Promise<Object>} Updated data
   */
  const updateData = async (table, matchColumn, matchValue, data) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = getToken();
      const response = await dataService.updateData(table, matchColumn, matchValue, data, token);
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete data from a table
   * @param {string} table - Table name
   * @param {string} matchColumn - Column name to match (usually 'id')
   * @param {any} matchValue - Value to match
   * @returns {Promise<Object>} Result indicating success
   */
  const deleteData = async (table, matchColumn, matchValue) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = getToken();
      const response = await dataService.deleteData(table, matchColumn, matchValue, token);
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Execute a complex query
   * @param {string} table - Base table name
   * @param {Object} queryOptions - Query configuration (joins, filters, etc.)
   * @returns {Promise<Object>} Query results
   */
  const executeQuery = async (table, queryOptions) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = getToken();
      const response = await dataService.executeQuery(table, queryOptions, token);
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
    fetchData,
    insertData,
    updateData,
    deleteData,
    executeQuery
  };
} 