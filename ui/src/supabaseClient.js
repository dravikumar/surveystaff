import { createClient } from '@supabase/supabase-js';

// Replace with your Supabase URL and anon key
const supabaseUrl = 'https://isemxmpjdhizdfuqguyj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzZW14bXBqZGhpemRmdXFndXlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA4NTk2MTgsImV4cCI6MjA1NjQzNTYxOH0.vC__UDfbRZwA8P2-OqYDvbPEmK_6WMuSwJRgQPxepsc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
