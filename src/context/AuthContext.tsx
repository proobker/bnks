// src/context/AuthContext.tsx
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import {
  signInWithEmailPassword,
  signInWithGoogle,
  signOut,
  getCurrentUser,
  onAuthStateChange
} from '@/lib/supabase';

interface AuthContextProps {
  user: User | null;
  isLoading: boolean;
  signIn: {
    withEmailPassword: (email: string, password: string) => Promise<void>;
    withGoogle: () => Promise<void>;
  };
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Failed to get current user:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    getUser();

    const { data: { subscription } } = onAuthStateChange((user) => {
      setUser(user);
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

  const signInWithGoogleHandler = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
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
      withGoogle: signInWithGoogleHandler,
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