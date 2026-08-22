import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
export default function Dashboard() {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [username, setUsername] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [website, setWebsite] = useState('');
    useEffect(() => {
        if (user) {
            fetchProfile();
        }
        else {
            setLoading(false);
        }
    }, [user]);
    const fetchProfile = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();
            if (error)
                throw error;
            if (data) {
                setUsername(data.username || '');
                setAvatarUrl(data.avatar_url || '');
                setWebsite(data.website || '');
            }
        }
        catch (err) {
            setError(err.message || 'Failed to fetch profile');
        }
        finally {
            setLoading(false);
        }
    };
    const updateProfile = async () => {
        setLoading(true);
        setError(null);
        try {
            const updates = {
                username: username.trim() || null,
                avatar_url: avatarUrl.trim() || null,
                website: website.trim() || null,
                updated_at: new Date().toISOString(),
            };
            const { error } = await supabase
                .from('profiles')
                .upsert(updates, { onConflict: 'id' });
            if (error)
                throw error;
            await fetchProfile(); // refetch after update
        }
        catch (err) {
            setError(err.message || 'Failed to update profile');
        }
        finally {
            setLoading(false);
        }
    };
    const handleLogout = async () => {
        await signOut();
        navigate('/login', { replace: true });
    };
    if (loading)
        return _jsx("div", { children: "Loading..." });
    return (_jsxs("div", { className: "min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-800 mb-6", children: "Dashboard" }), error && (_jsx("p", { className: "mb-4 p-3 bg-red-50 text-red-600 rounded w-full max-w-xs", children: error })), !user ? (_jsx("p", { className: "text-gray-600", children: "You are not logged in." })) : (_jsxs("div", { className: "w-full max-w-xl space-y-6", children: [_jsxs("div", { className: "border rounded-lg p-6 bg-white shadow-sm", children: [_jsx("h2", { className: "text-2xl font-semibold text-gray-800 mb-4", children: "Profile" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "username", className: "block text-sm font-medium text-gray-700 mb-1", children: "Username" }), _jsx("input", { id: "username", type: "text", value: username, onChange: (e) => setUsername(e.target.value), className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "avatarUrl", className: "block text-sm font-medium text-gray-700 mb-1", children: "Avatar URL" }), _jsx("input", { id: "avatarUrl", type: "text", value: avatarUrl, onChange: (e) => setAvatarUrl(e.target.value), className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "website", className: "block text-sm font-medium text-gray-700 mb-1", children: "Website" }), _jsx("input", { id: "website", type: "text", value: website, onChange: (e) => setWebsite(e.target.value), className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" })] }), _jsx("button", { onClick: updateProfile, className: "w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-50", disabled: loading, children: loading ? 'Saving...' : 'Save Profile' })] })] }), _jsx("p", { className: "mt-4 text-sm text-gray-600", children: _jsx("button", { onClick: handleLogout, className: "text-gray-600 hover:underline font-medium", children: "Logout" }) })] }))] }));
}
