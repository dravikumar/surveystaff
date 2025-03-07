import React, { createContext, useState, useEffect, useContext } from 'react';
// Import auth service instead of direct Supabase client
import { authService } from '../api';

// Create the authentication context
const AuthContext = createContext();

// Custom hook to use the auth context
export function useAuth() {
  return useContext(AuthContext);
}

// Provider component that wraps your app and makes auth object available to any child component that calls useAuth()
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for existing session/token in localStorage
  useEffect(() => {
    const checkSession = async () => {
      try {
        setLoading(true);
        
        // Get token from localStorage
        const token = localStorage.getItem('supabase_auth_token');
        
        if (token) {
          // Verify session is still valid
          const response = await authService.verifySession(token);
          
          if (response.success) {
            setSession(response.session);
            
            // Get user data
            const userResponse = await authService.getCurrentUser(token);
            if (userResponse.success) {
              setUser(userResponse.user);
            }
          } else {
            // Session expired or invalid, clean up
            localStorage.removeItem('supabase_auth_token');
            setSession(null);
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Session verification error:', error);
        setError(error.message);
        // Clean up if there's an error
        localStorage.removeItem('supabase_auth_token');
        setSession(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    checkSession();
  }, []);

  // Sign up a new user
  const signUp = async (email, password, metadata = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authService.signUp(email, password, metadata);
      
      if (response.success) {
        setUser(response.user);
        setSession(response.session);
        
        // Store token in localStorage
        if (response.session?.access_token) {
          localStorage.setItem('supabase_auth_token', response.session.access_token);
        }
        
        return response;
      } else {
        throw new Error(response.error || 'Sign up failed');
      }
    } catch (error) {
      console.error('Sign up error:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign in a user
  const signIn = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authService.signIn(email, password);
      
      if (response.success) {
        setUser(response.user);
        setSession(response.session);
        
        // Store token in localStorage
        if (response.session?.access_token) {
          localStorage.setItem('supabase_auth_token', response.session.access_token);
        }
        
        return response;
      } else {
        throw new Error(response.error || 'Sign in failed');
      }
    } catch (error) {
      console.error('Sign in error:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign out the current user
  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('supabase_auth_token');
      
      if (token) {
        await authService.signOut(token);
      }
      
      // Always clean up local state, even if API call fails
      localStorage.removeItem('supabase_auth_token');
      setUser(null);
      setSession(null);
      
      return { success: true };
    } catch (error) {
      console.error('Sign out error:', error);
      setError(error.message);
      
      // Still clean up local state
      localStorage.removeItem('supabase_auth_token');
      setUser(null);
      setSession(null);
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Send password reset email
  const resetPassword = async (email) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authService.resetPassword(email);
      
      return response;
    } catch (error) {
      console.error('Reset password error:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update user password
  const updatePassword = async (newPassword) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('supabase_auth_token');
      
      if (!token) {
        throw new Error('Not authenticated');
      }
      
      const response = await authService.updatePassword(token, newPassword);
      
      return response;
    } catch (error) {
      console.error('Update password error:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('supabase_auth_token');
      
      if (!token) {
        throw new Error('Not authenticated');
      }
      
      const response = await authService.updateUser(token, userData);
      
      if (response.success) {
        setUser(response.user);
      }
      
      return response;
    } catch (error) {
      console.error('Update profile error:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get current user's token
  const getToken = () => {
    return localStorage.getItem('supabase_auth_token');
  };

  // Value object that will be shared with components that use this context
  const value = {
    user,
    session,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
    getToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
