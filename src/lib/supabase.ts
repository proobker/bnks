// Supabase client configuration for EduFit Nepal
import { createClient } from '@supabase/supabase-js';

// Initialize browser client (for components)
export const createBrowserSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createClient(supabaseUrl, supabaseAnonKey);
};

// Initialize server client (for server actions)
export const createServerSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  return createClient(supabaseUrl, supabaseServiceRoleKey);
};

// Helper function to get client based on environment
export const getSupabaseClient = () => {
  if (typeof window !== 'undefined') {
    return createBrowserSupabaseClient();
  }
  // For server-side, we'd need to pass req/res context
  return null;
};

export default { createBrowserSupabaseClient, createServerSupabaseClient, getSupabaseClient };