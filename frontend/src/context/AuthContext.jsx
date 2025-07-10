// frontend/src/context/AuthContext.jsx

import React, { createContext, useState, useEffect, useContext } from 'react';
import axiosInstance from '../api/axios';
import { CircularProgress, Box } from '@mui/material';

const AuthContext = createContext(null);

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Al cargar la app, verifica si ya hay una sesión de usuario válida
        const verifyUser = async () => {
            try {
                const response = await axiosInstance.get('/api/auth/me/');
                setUser(response.data);
                setIsAuthenticated(true);
            } catch (error) {
                console.log('No active session found.');
                setUser(null);
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };
        verifyUser();
    }, []);

    const login = async (username, password) => {
        setIsLoading(true);
        try {
            const response = await axiosInstance.post('/api/auth/login/', { username, password });
            setUser(response.data);
            setIsAuthenticated(true);
            setIsLoading(false);
            return response;
        } catch (error) {
            setIsLoading(false);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await axiosInstance.post('/api/auth/logout/');
        } catch (error) {
            console.error('Logout failed', error);
        } finally {
            setUser(null);
            setIsAuthenticated(false);
        }
    };

    const value = {
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
    };

    // Muestra un spinner de carga global mientras se verifica la sesión inicial
    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }
    
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;