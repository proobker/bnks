import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
export default function Landing() {
    return (_jsxs("div", { className: "min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50", children: [_jsx("h1", { className: "text-4xl font-bold text-gray-800 mb-6", children: "Welcome to the Hackathon Starter" }), _jsx("p", { className: "text-lg text-gray-600 mb-8", children: "A boilerplate for building full-stack apps with Vite, React, Supabase, and more." }), _jsxs("div", { className: "space-x-4", children: [_jsx(Link, { to: "/login", className: "px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition", children: "Login" }), _jsx(Link, { to: "/signup", className: "px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition", children: "Sign Up" })] })] }));
}
