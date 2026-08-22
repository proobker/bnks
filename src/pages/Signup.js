import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
export default function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { signUp } = useAuth();
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            await signUp(email, password);
            // After sign up, we can redirect to dashboard or show a message.
            // For simplicity, we'll redirect to dashboard.
            navigate('/dashboard', { replace: true });
        }
        catch (err) {
            setError(err.message || 'Sign up failed');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { className: "min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-800 mb-6", children: "Sign Up" }), error && (_jsx("p", { className: "mb-4 p-3 bg-red-50 text-red-600 rounded w-full max-w-xs", children: error })), _jsxs("form", { onSubmit: handleSubmit, className: "w-full max-w-xs space-y-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "email", className: "block text-sm font-medium text-gray-700 mb-1", children: "Email" }), _jsx("input", { id: "email", type: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value), className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "password", className: "block text-sm font-medium text-gray-700 mb-1", children: "Password" }), _jsx("input", { id: "password", type: "password", required: true, value: password, onChange: (e) => setPassword(e.target.value), className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" })] }), _jsx("button", { type: "submit", disabled: loading, className: "w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-50", children: loading ? 'Signing up...' : 'Sign Up' })] }), _jsxs("p", { className: "mt-4 text-sm text-gray-600", children: ["Already have an account?", ' ', _jsx("a", { href: "/login", className: "text-blue-600 hover:underline font-medium", children: "Login" })] })] }));
}
