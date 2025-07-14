// frontend/src/pages/HistoryPage.jsx

import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, CircularProgress } from '@mui/material';
import axiosInstance from '../api/axios';
import toast from 'react-hot-toast';
import WorkoutHistoryList from '../components/WorkoutHistoryList'; // Crearemos este componente a continuación

const HistoryPage = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true);
            try {
                const response = await axiosInstance.get('/api/workout-sessions/');
                // Ordenamos las sesiones por fecha, de la más reciente a la más antigua
                const sortedSessions = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
                setSessions(sortedSessions);
            } catch (error) {
                toast.error("Could not load workout history.");
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []); // Se ejecuta solo una vez al montar la página

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="md">
            <Typography variant="h4" component="h1" gutterBottom sx={{ my: 3 }}>
                Workout History
            </Typography>
            <WorkoutHistoryList sessions={sessions} />
        </Container>
    );
};

export default HistoryPage;