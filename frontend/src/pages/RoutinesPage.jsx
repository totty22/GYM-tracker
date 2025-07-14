// frontend/src/pages/RoutinesPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { Container, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import { useWorkout } from '../context/WorkoutContext';

import axiosInstance from '../api/axios';
import RoutineList from '../components/RoutineList';
import toast from 'react-hot-toast';

const RoutinesPage = () => {
    const [routines, setRoutines] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { startWorkout } = useWorkout(); // Usamos el contexto para iniciar el workout

    const fetchRoutines = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get('/api/routines/');
            setRoutines(response.data);
        } catch (err) {
            console.error("Failed to fetch routines", err);
            toast.error("Could not load your routines. Please try again.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRoutines();
    }, [fetchRoutines]);

    // La función ahora solo pasa el ID de la rutina al contexto
    const handleSelectRoutine = (routineId) => {
        startWorkout(routineId);
    };

    const handleDeleteRoutine = async (routineId) => {
        if (window.confirm('Are you sure you want to delete this routine? This action cannot be undone.')) {
            const toastId = toast.loading('Deleting routine...');
            try {
                await axiosInstance.delete(`/api/routines/${routineId}/`);
                toast.success('Routine deleted successfully!', { id: toastId });
                fetchRoutines(); // Recargar la lista para reflejar el cambio
            } catch (error) {
                toast.error('Failed to delete routine.', { id: toastId });
            }
        }
    };

    return (
        <Container maxWidth="md">
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                 <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/routines/new')}
                >
                    Create New Routine
                </Button>
            </Box>

            <RoutineList 
                routines={routines} 
                loading={loading} 
                onSelectRoutine={handleSelectRoutine}
                onDeleteRoutine={handleDeleteRoutine}
            />
        </Container>
    );
};

export default RoutinesPage;