// Supabase client configuration for EduFit Nepal
import { createClient, User } from '@supabase/supabase-js';

// Initialize browser client (for components)
export const createBrowserSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createClient(supabaseUrl, supabaseAnonKey);
};

// Initialize server client (for server actions)
export const createServerSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  return createClient(supabaseUrl, supabaseServiceRoleKey);
};

// Authentication helper functions
export const signInWithEmailPassword = async (email: string, password: string) => {
  const supabase = createBrowserSupabaseClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  if (error) throw error;
  return data;
};

export const signUpWithEmailPassword = async (
  email: string,
  password: string,
  role: string
) => {
  const supabase = createBrowserSupabaseClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { role },
      emailRedirectTo: `${window.location.origin}/login`,
    },
  });
  if (error) throw error;
  if (data.session && data.user) {
    await supabase.from('profiles').upsert({ id: data.user.id, role });
  }
  return { needsEmailConfirmation: !data.session };
};

export const signOut = async () => {
  const supabase = createBrowserSupabaseClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentUser = async () => {
  const supabase = createBrowserSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
};

export const getCurrentUserRole = async (): Promise<string | null> => {
  const supabase = createBrowserSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
  return profile?.role ?? null;
};

export const onAuthStateChange = (callback: (user: User | null) => void) => {
  const supabase = createBrowserSupabaseClient();
  return supabase.auth.onAuthStateChange((_, session) => {
    callback(session?.user ?? null);
  });
};

// Helper function to get client based on environment
export const getSupabaseClient = () => {
  if (typeof window !== 'undefined') {
    return createBrowserSupabaseClient();
  }
  // For server-side, we'd need to pass req/res context
  return null;
};

export default {
  createBrowserSupabaseClient,
  createServerSupabaseClient,
  getSupabaseClient,
  signInWithEmailPassword,
  signUpWithEmailPassword,
  signOut,
  getCurrentUser,
  getCurrentUserRole,
  onAuthStateChange
};