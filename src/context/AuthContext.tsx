// src/context/AuthContext.tsx
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import {
  signInWithEmailPassword,
  signOut,
  getCurrentUser,
  onAuthStateChange,
  getSupabaseClient
} from '@/lib/supabase';

export type AuthUser = User & {
  role?: string | null;
};

const fetchProfile = async (userId: string) => {
  const supabase = getSupabaseClient();
  if (!supabase) return null;
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return data;
};

const mergeProfile = async (user: User | null): Promise<AuthUser | null> => {
  if (!user) return null;
  const profile = await fetchProfile(user.id);
  return profile ? { ...user, ...profile } : user;
};

interface AuthContextProps {
  user: AuthUser | null;
  isLoading: boolean;
  signIn: {
    withEmailPassword: (email: string, password: string) => Promise<void>;
  };
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(await mergeProfile(currentUser));
      } catch (error) {
        console.error('Failed to get current user:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    getUser();

    const { data: { subscription } } = onAuthStateChange((user) => {
      mergeProfile(user).then(setUser);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signInWithEmailPasswordHandler = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await signInWithEmailPassword(email, password);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOutHandler = async () => {
    setIsLoading(true);
    try {
      await signOut();
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    signIn: {
      withEmailPassword: signInWithEmailPasswordHandler,
    },
    signOut: signOutHandler,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}