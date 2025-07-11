// frontend/src/pages/ExercisesPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import axiosInstance from '../api/axios';
import toast from 'react-hot-toast';

import ExerciseList from '../components/ExerciseList'; // Un componente de lista que crearemos/mejoraremos
import ExerciseForm from '../components/ExerciseForm'; // Un formulario modal que crearemos

const ExercisesPage = () => {
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingExercise, setEditingExercise] = useState(null); // Para saber si creamos o editamos

    const fetchExercises = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get('/api/exercises/');
            setExercises(response.data);
        } catch (error) {
            toast.error("Could not load exercises.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchExercises();
    }, [fetchExercises]);

    const handleOpenForm = (exercise = null) => {
        setEditingExercise(exercise);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingExercise(null);
    };

    const handleSave = () => {
        handleCloseForm();
        fetchExercises(); // Recargar la lista después de guardar
    };

    const handleDelete = async (exerciseId) => {
        if (window.confirm('Are you sure you want to delete this exercise? This cannot be undone.')) {
            const toastId = toast.loading('Deleting exercise...');
            try {
                await axiosInstance.delete(`/api/exercises/${exerciseId}/`);
                toast.success('Exercise deleted!', { id: toastId });
                fetchExercises(); // Recargar la lista
            } catch (error) {
                toast.error('Could not delete exercise. It might be in use in a routine.', { id: toastId });
            }
        }
    };

    return (
        <Container maxWidth="md">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" component="h1">
                    Manage Exercises
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenForm()}
                >
                    Add New Exercise
                </Button>
            </Box>

            <ExerciseList
                exercises={exercises}
                loading={loading}
                onEdit={handleOpenForm}
                onDelete={handleDelete}
            />
            
            <ExerciseForm
                open={isFormOpen}
                onClose={handleCloseForm}
                onSave={handleSave}
                exercise={editingExercise}
            />
        </Container>
    );
};

export default ExercisesPage;