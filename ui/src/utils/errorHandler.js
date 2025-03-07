/**
 * Error Handler Utility
 * 
 * Provides standardized error handling functions for the application.
 */

/**
 * Format API error message for display
 * @param {Error|string} error - Error object or message
 * @returns {string} Formatted error message
 */
export const formatErrorMessage = (error) => {
  if (!error) return 'An unknown error occurred';
  
  if (typeof error === 'string') return error;
  
  if (error.message) return error.message;
  
  return 'An unexpected error occurred';
};

/**
 * Map API error codes to user-friendly messages
 * @param {number} statusCode - HTTP status code
 * @returns {string} User-friendly error message
 */
export const getErrorMessageByStatusCode = (statusCode) => {
  const errorMessages = {
    400: 'Invalid request. Please check your input and try again.',
    401: 'You are not authenticated. Please sign in to continue.',
    403: 'You do not have permission to perform this action.',
    404: 'The requested resource was not found.',
    409: 'There was a conflict with the current state of the resource.',
    422: 'The request could not be processed. Please check your input.',
    429: 'Too many requests. Please try again later.',
    500: 'Server error. Please try again later or contact support.',
    503: 'Service unavailable. Please try again later.'
  };
  
  return errorMessages[statusCode] || 'An unexpected error occurred';
};

/**
 * Handle an API error and return a standardized error object
 * @param {Error} error - Error object from API call
 * @param {Function} setErrorState - Optional state setter function for error
 * @returns {Object} Standardized error object
 */
export const handleApiError = (error, setErrorState = null) => {
  console.error('API Error:', error);
  
  const errorObject = {
    message: formatErrorMessage(error),
    timestamp: new Date().toISOString(),
    isHandled: true
  };
  
  // If a state setter function is provided, update the error state
  if (setErrorState && typeof setErrorState === 'function') {
    setErrorState(errorObject);
  }
  
  return errorObject;
};

/**
 * Log error to monitoring/analytics service
 * @param {Error} error - Error object
 * @param {string} context - Context where the error occurred
 */
export const logErrorToService = (error, context = 'general') => {
  // This is a placeholder. In a real application, you would:
  // 1. Log to a service like Sentry, LogRocket, etc.
  // 2. Include relevant user context
  // 3. Add app version, browser info, etc.
  
  console.error(`${context} error:`, error);
  
  // Example if using a service like Sentry
  // if (window.Sentry) {
  //   window.Sentry.withScope((scope) => {
  //     scope.setTag('context', context);
  //     window.Sentry.captureException(error);
  //   });
  // }
}; 