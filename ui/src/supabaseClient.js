import { createClient } from '@supabase/supabase-js';

// Replace these with your actual Supabase project values
const supabaseUrl = 'https://isemxmpjdhizdfuqguyj.supabase.co';

// Make sure this is your actual anon key, not a placeholder
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzZW14bXBqZGhpemRmdXFndXlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA4NTk2MTgsImV4cCI6MjA1NjQzNTYxOH0.vC__UDfbRZwA8P2-OqYDvbPEmK_6WMuSwJRgQPxepsc';

console.log('Initializing Supabase client with URL:', supabaseUrl);

// Create client with additional options for debugging
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Test the connection
supabase.auth.getSession()
  .then(response => {
    console.log('Supabase connection test:', response.error ? 'Failed' : 'Successful');
    if (response.error) {
      console.error('Supabase connection error:', response.error);
    }
  })
  .catch(err => {
    console.error('Supabase connection test error:', err);
  });
