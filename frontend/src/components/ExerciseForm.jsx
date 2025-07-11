// frontend/src/components/ExerciseForm.jsx

import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box
} from '@mui/material';
import axiosInstance from '../api/axios';
import toast from 'react-hot-toast';

const ExerciseForm = ({ open, onClose, onSave, exercise }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [muscleGroup, setMuscleGroup] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isEditing = exercise !== null;

    useEffect(() => {
        if (isEditing) {
            setName(exercise.name);
            setDescription(exercise.description || '');
            setMuscleGroup(exercise.muscle_group || '');
        } else {
            // Resetear el formulario para un nuevo ejercicio
            setName('');
            setDescription('');
            setMuscleGroup('');
        }
    }, [exercise, open]); // Se actualiza cuando cambia el ejercicio o se abre el modal

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const toastId = toast.loading(isEditing ? 'Updating exercise...' : 'Creating exercise...');

        const payload = { name, description, muscle_group: muscleGroup };

        try {
            if (isEditing) {
                await axiosInstance.put(`/api/exercises/${exercise.id}/`, payload);
            } else {
                await axiosInstance.post('/api/exercises/', payload);
            }
            toast.success('Exercise saved successfully!', { id: toastId });
            onSave(); // Llama a la función del padre para recargar y cerrar
        } catch (error) {
            toast.error('Failed to save exercise.', { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{isEditing ? 'Edit Exercise' : 'Add New Exercise'}</DialogTitle>
            <Box component="form" onSubmit={handleSubmit}>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Exercise Name"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <TextField
                        margin="dense"
                        label="Description"
                        type="text"
                        fullWidth
                        multiline
                        rows={3}
                        variant="outlined"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Muscle Group"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={muscleGroup}
                        onChange={(e) => setMuscleGroup(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="secondary">Cancel</Button>
                    <Button type="submit" variant="contained" disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : 'Save'}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
};

export default ExerciseForm;