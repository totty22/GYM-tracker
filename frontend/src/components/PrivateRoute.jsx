// frontend/src/components/PrivateRoute.jsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = () => {
    const { isAuthenticated, isLoading } = useAuth();
    
    // Si todavía estamos cargando el estado de autenticación, no renderizamos nada
    // (o un spinner si se prefiere, pero el AuthProvider ya lo hace globalmente).
    if (isLoading) {
        return null; 
    }

    // Si está autenticado, renderiza el contenido de la ruta.
    // Si no, redirige a la página de login.
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;