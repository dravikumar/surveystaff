import React, { createContext, useState, useEffect, useContext } from 'react';
// Import supabase but don't use it yet
import { supabase } from '../supabaseClient';

// Create the authentication context
const AuthContext = createContext();

// Custom hook to use the auth context
export function useAuth() {
  return useContext(AuthContext);
}

// Provider component that wraps your app and makes auth object available to any child component that calls useAuth()
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authChangeEvent, setAuthChangeEvent] = useState(null);

  // Check for existing session when the component mounts
  useEffect(() => {
    let isMounted = true;
    console.log('AuthProvider useEffect running');
    
    const getSession = async () => {
      try {
        console.log('Checking for session...');
        const { data, error } = await supabase.auth.getSession();
        
        console.log('Session response:', data, error);
        
        if (error) {
          console.error('Session error:', error);
          if (isMounted) setError(error.message);
        } else if (data?.session) {
          console.log('Session found, user:', data.session.user);
          if (isMounted) setUser(data.session.user);
        } else {
          console.log('No session found');
        }
      } catch (err) {
        console.error('Error in getSession:', err);
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) {
          console.log('Setting loading to false');
          setLoading(false);
        }
      }
    };

    // Call getSession
    getSession();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session ? 'session exists' : 'no session');
        setAuthChangeEvent({ event, timestamp: new Date().toISOString() });
        
        if (isMounted) {
          if (session) {
            console.log('Setting user from auth change:', session.user);
            setUser(session.user);
          } else {
            console.log('Setting user to null from auth change');
            setUser(null);
          }
          setLoading(false);
        }
      }
    );

    // Cleanup subscription on unmount
    return () => {
      console.log('Cleanup function running');
      isMounted = false;
      if (authListener && authListener.subscription) {
        console.log('Cleaning up auth listener');
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  // Sign up function
  const signUp = async (email, password) => {
    try {
      setError(null);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Sign in function with improved logging
  const signIn = async (email, password) => {
    try {
      setError(null);
      console.log('Signing in with email:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      console.log('Sign in response:', data, error);
      
      if (error) {
        console.error('Sign in error:', error);
        throw error;
      }
      
      console.log('Sign in successful, user:', data.user);
      
      // Manually update the user state
      setUser(data.user);
      
      return data;
    } catch (error) {
      console.error('Error in signIn function:', error);
      setError(error.message);
      throw error;
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      setError(null);
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      setUser(null);
    } catch (error) {
      setError(error.message);
    }
  };

  // Reset password function
  const resetPassword = async (email) => {
    try {
      setError(null);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      return { success: true };
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Update password function
  const updatePassword = async (newPassword) => {
    try {
      setError(null);
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      
      if (error) throw error;
      return { success: true };
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Debug information
  const debugInfo = {
    userExists: !!user,
    userEmail: user?.email,
    isLoading: loading,
    errorMessage: error,
    authChangeEvent,
  };

  // The value that will be supplied to any consuming components
  const value = {
    user,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    debugInfo,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
