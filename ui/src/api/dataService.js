/**
 * Data Service
 * 
 * Handles all data operations with the API including:
 * - Create, read, update, delete operations (CRUD)
 * - Complex queries
 * - Filtering, sorting, pagination
 */

import { buildUrl, handleResponse, createRequestConfig } from './config';

/**
 * Fetch data from a table
 * @param {string} table - Table name
 * @param {Object} queryParams - Query parameters like select, filters, etc.
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} Query results
 */
export const fetchData = async (table, queryParams = {}, token = null) => {
  try {
    // Convert query params to URL parameters
    const params = new URLSearchParams();
    params.append('table', table);
    
    // Add any additional query parameters
    Object.entries(queryParams).forEach(([key, value]) => {
      if (typeof value === 'object') {
        params.append(key, JSON.stringify(value));
      } else {
        params.append(key, value);
      }
    });
    
    const url = `${buildUrl('/data/')}?${params.toString()}`;
    const config = createRequestConfig('GET', null, token);
    
    const response = await fetch(url, config);
    return await handleResponse(response);
  } catch (error) {
    console.error('Fetch data error:', error);
    throw error;
  }
};

/**
 * Insert data into a table
 * @param {string} table - Table name
 * @param {Object} data - Data to insert
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} Inserted data with ID
 */
export const insertData = async (table, data, token = null) => {
  try {
    const url = buildUrl('/data/');
    const config = createRequestConfig('POST', { table, data }, token);
    
    const response = await fetch(url, config);
    return await handleResponse(response);
  } catch (error) {
    console.error('Insert data error:', error);
    throw error;
  }
};

/**
 * Update data in a table
 * @param {string} table - Table name
 * @param {string} matchColumn - Column name to match (usually 'id')
 * @param {any} matchValue - Value to match
 * @param {Object} data - Data to update
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} Updated data
 */
export const updateData = async (table, matchColumn, matchValue, data, token = null) => {
  try {
    const url = buildUrl('/data/');
    const config = createRequestConfig('PUT', {
      table,
      match_column: matchColumn,
      match_value: matchValue,
      data
    }, token);
    
    const response = await fetch(url, config);
    return await handleResponse(response);
  } catch (error) {
    console.error('Update data error:', error);
    throw error;
  }
};

/**
 * Delete data from a table
 * @param {string} table - Table name
 * @param {string} matchColumn - Column name to match (usually 'id')
 * @param {any} matchValue - Value to match
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} Result indicating success
 */
export const deleteData = async (table, matchColumn, matchValue, token = null) => {
  try {
    // Convert to URL parameters for DELETE request
    const params = new URLSearchParams();
    params.append('table', table);
    params.append('match_column', matchColumn);
    params.append('match_value', matchValue);
    
    const url = `${buildUrl('/data/')}?${params.toString()}`;
    const config = createRequestConfig('DELETE', null, token);
    
    const response = await fetch(url, config);
    return await handleResponse(response);
  } catch (error) {
    console.error('Delete data error:', error);
    throw error;
  }
};

/**
 * Execute a complex query
 * @param {string} table - Base table name
 * @param {Object} queryOptions - Query configuration (joins, filters, etc.)
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} Query results
 */
export const executeQuery = async (table, queryOptions, token = null) => {
  try {
    const url = buildUrl('/data/query/');
    const config = createRequestConfig('POST', {
      table,
      query: queryOptions
    }, token);
    
    const response = await fetch(url, config);
    return await handleResponse(response);
  } catch (error) {
    console.error('Execute query error:', error);
    throw error;
  }
}; 