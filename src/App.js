import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
function App() {
    return (_jsx(AuthProvider, { children: _jsx(BrowserRouter, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Landing, {}) }), _jsx(Route, { path: "/login", element: _jsx(Login, {}) }), _jsx(Route, { path: "/signup", element: _jsx(Signup, {}) }), _jsx(Route, { path: "/auth/callback", element: _jsx(Navigate, { to: "/", replace: true }) }), _jsx(Route, { path: "/dashboard", element: _jsx(ProtectedRoute, { children: _jsx(Dashboard, {}) }) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/", replace: true }) })] }) }) }));
}
export default App;
