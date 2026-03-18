import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Navbar from './components/Navbar';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AskQuestion from './pages/AskQuestion';
import QuestionDetails from './pages/QuestionDetails';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

const LockIcon = () => (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#e11d48" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '16px' }}>
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
);

const NotFoundIcon = () => (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '16px' }}>
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
);

const ProtectedRoute = ({ children, requireAdmin = false }) => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // show a proper blocked screen rather than just redirecting
    if (requireAdmin && user.role !== 'admin') {
        return (
            <div style={{ background: '#f8f9fa', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '15vh', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                <div className="text-center bg-white p-5 rounded-4 shadow-sm border" style={{ maxWidth: '400px' }}>
                    <LockIcon />
                    <h3 className="fw-bold text-dark mb-2">Access Denied</h3>
                    <p className="text-muted mb-4">You must have administrator privileges to view this page.</p>
                    <Link to={token ? "/" : "/login"} className="btn btn-primary fw-bold px-4 py-2 w-100" style={{ borderRadius: '8px' }}>
                        {token ? "Return to Home" : "Log In to Continue"}
                    </Link>
                </div>
            </div>
        );
    }

    if (!token) return <Navigate to="/login" replace />;
    return children;
};

const NotFound = () => (
    <div style={{ background: '#f8f9fa', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '15vh', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <div className="text-center bg-white p-5 rounded-4 shadow-sm border" style={{ maxWidth: '400px' }}>
            <NotFoundIcon />
            <h3 className="fw-bold text-dark mb-2">Page Not Found</h3>
            <p className="text-muted mb-4">We couldn't find the page you're looking for. It might have been moved or deleted.</p>
            <Link to="/" className="btn btn-primary fw-bold px-4 py-2 w-100" style={{ borderRadius: '8px' }}>Return to Home</Link>
        </div>
    </div>
);

const App = () => {
    return (
        <Router>
            <div style={{ padding: '0px' }}>
                <Navbar />

                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/questions/:id" element={<QuestionDetails />} />
                    <Route path="/ask-question" element={<AskQuestion />} />
                    <Route path="/user-dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
                    <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
                    <Route path="/admin" element={<ProtectedRoute requireAdmin={true}><AdminDashboard /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                    <Route path="*" element={<NotFound />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password/:token" element={<ResetPassword />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;