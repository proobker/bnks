import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
const AuthContext = createContext(undefined);
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });
        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });
        return () => {
            subscription.unsubscribe();
        };
    }, []);
    const signIn = async (email, password) => {
        await supabase.auth.signInWithPassword({ email, password });
    };
    const signUp = async (email, password) => {
        await supabase.auth.signUp({ email, password });
        // Note: In a production app, you might want to handle email verification here.
    };
    const signOut = async () => {
        await supabase.auth.signOut();
    };
    if (loading) {
        return _jsx("div", { children: "Loading..." });
    }
    return (_jsx(AuthContext.Provider, { value: { user, loading, signIn, signUp, signOut }, children: children }));
}
