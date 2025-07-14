// frontend/src/components/ExerciseForm.jsx (VERSIÓN CON SUBIDA DE IMAGEN)

import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Avatar
} from '@mui/material';
import axiosInstance from '../api/axios';
import toast from 'react-hot-toast';

const ExerciseForm = ({ open, onClose, onSave, exercise }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [muscleGroup, setMuscleGroup] = useState('');
    const [image, setImage] = useState(null); // Para el archivo de imagen
    const [imagePreview, setImagePreview] = useState(null); // Para la previsualización
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isEditing = exercise !== null;

    useEffect(() => {
        if (open) { // Solo actualizar el estado cuando el modal se abre
            if (isEditing) {
                setName(exercise.name);
                setDescription(exercise.description || '');
                setMuscleGroup(exercise.muscle_group || '');
                setImagePreview(exercise.image); // URL de la imagen existente
            } else {
                setName('');
                setDescription('');
                setMuscleGroup('');
                setImage(null);
                setImagePreview(null);
            }
        }
    }, [exercise, open, isEditing]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file)); // Crea una URL local para la preview
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const toastId = toast.loading('Saving exercise...');

        // --- CAMBIO CLAVE: USAR FormData ---
        // Para subir archivos, debemos usar FormData en lugar de un objeto JSON.
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('muscle_group', muscleGroup);
        if (image) { // Solo añadir la imagen si se ha seleccionado una nueva
            formData.append('image', image, image.name);
        }

        try {
            if (isEditing) {
                // DRF es inteligente: PUT/PATCH con FormData funciona bien.
                await axiosInstance.put(`/api/exercises/${exercise.id}/`, formData);
            } else {
                await axiosInstance.post('/api/exercises/', formData);
            }
            toast.success('Exercise saved!', { id: toastId });
            onSave();
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
                    {/* Previsualización de la imagen */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                        <Avatar src={imagePreview} sx={{ width: 100, height: 100 }} />
                    </Box>
                    {/* Botón para subir archivo */}
                    <Button variant="contained" component="label" fullWidth>
                        Upload Image
                        <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                    </Button>

                    <TextField autoFocus margin="dense" label="Exercise Name" type="text" fullWidth value={name} onChange={(e) => setName(e.target.value)} required />
                    <TextField margin="dense" label="Description" type="text" fullWidth multiline rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
                    <TextField margin="dense" label="Muscle Group" type="text" fullWidth value={muscleGroup} onChange={(e) => setMuscleGroup(e.target.value)} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="contained" disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : 'Save'}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
};

export default ExerciseForm;