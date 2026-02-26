import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

export const ProtectedRoute: React.FC = () => {
    const { token, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>; // Or a nice spinner
    }

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};
