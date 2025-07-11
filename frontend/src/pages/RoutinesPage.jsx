// frontend/src/pages/RoutinesPage.jsx (VERSIÓN CON DELETE)

import React, { useState, useEffect, useCallback } from 'react';
import { Container, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';

import axiosInstance from '../api/axios';
import RoutineList from '../components/RoutineList';
import toast from 'react-hot-toast';

const RoutinesPage = () => {
    const [routines, setRoutines] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

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

    const handleSelectRoutine = (routineId) => {
        navigate(`/workout/${routineId}`);
    };

    // --- LÓGICA DE ELIMINACIÓN ---
    const handleDeleteRoutine = async (routineId) => {
        // Usamos window.confirm para una confirmación simple y efectiva
        if (window.confirm('Are you sure you want to delete this routine? This action cannot be undone.')) {
            const toastId = toast.loading('Deleting routine...');
            try {
                await axiosInstance.delete(`/api/routines/${routineId}/`);
                toast.success('Routine deleted successfully!', { id: toastId });
                // Volvemos a cargar las rutinas para que la lista se actualice
                fetchRoutines();
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
                onDeleteRoutine={handleDeleteRoutine} // <-- Pasamos la función como prop
            />
        </Container>
    );
};

export default RoutinesPage;