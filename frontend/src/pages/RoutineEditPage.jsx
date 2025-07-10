// frontend/src/pages/RoutineEditPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box } from '@mui/material';
import axiosInstance from '../api/axios';
import RoutineForm from '../components/RoutineForm'; // Crearemos este componente a continuación
import toast from 'react-hot-toast';

const RoutineEditPage = () => {
    const { id } = useParams(); // Obtiene el 'id' de la URL. Será 'new' para crear.
    const navigate = useNavigate();
    const isNew = id === 'new';

    const [routine, setRoutine] = useState(null);
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(!isNew); // No cargar si es una nueva rutina

    useEffect(() => {
        // Cargar la lista completa de ejercicios disponibles para el selector
        const fetchExercises = async () => {
            try {
                const response = await axiosInstance.get('/api/exercises/');
                setExercises(response.data);
            } catch (error) {
                toast.error('Failed to load available exercises.');
            }
        };

        // Si estamos editando, cargar los datos de la rutina existente
        if (!isNew) {
            const fetchRoutine = async () => {
                setLoading(true);
                try {
                    const response = await axiosInstance.get(`/api/routines/${id}/`);
                    setRoutine(response.data);
                } catch (error) {
                    toast.error('Failed to load routine details.');
                    navigate('/routines'); // Si falla, volver a la lista
                } finally {
                    setLoading(false);
                }
            };
            fetchRoutine();
        }
        
        fetchExercises();
    }, [id, isNew, navigate]);

    const handleSave = async (routineData) => {
        const toastId = toast.loading(isNew ? 'Creating Routine...' : 'Updating Routine...');

        try {
            if (isNew) {
                await axiosInstance.post('/api/routines/', routineData);
            } else {
                await axiosInstance.put(`/api/routines/${id}/`, routineData);
            }
            toast.success('Routine saved successfully!', { id: toastId });
            navigate('/routines'); // Volver a la lista después de guardar
        } catch (error) {
            toast.error('Failed to save the routine.', { id: toastId });
        }
    };
    
    if (loading) {
        return <Typography>Loading routine...</Typography>;
    }

    return (
        <Container maxWidth="md">
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    {isNew ? 'Create New Routine' : 'Edit Routine'}
                </Typography>
                <RoutineForm
                    initialData={routine}
                    availableExercises={exercises}
                    onSave={handleSave}
                />
            </Box>
        </Container>
    );
};

export default RoutineEditPage;