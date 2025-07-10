// frontend/src/components/RoutineCreationForm.jsx

import React, { useState } from 'react';
import axiosInstance from '../api/axios';
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  Alert
} from '@mui/material';

const RoutineCreationForm = ({ onRoutineCreated }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        if (!name) {
            setError('Routine name is required.');
            setIsSubmitting(false);
            return;
        }

        try {
            await axiosInstance.post('/api/routines/', {
                name: name,
                description: description
            });
            setName('');
            setDescription('');
            if (onRoutineCreated) {
                onRoutineCreated(); // Llama a la función del padre para refrescar la lista
            }
        } catch (err) {
            setError('Failed to create routine. Are you logged in?');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card sx={{ my: 4 }}>
            <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                    Create a New Routine
                </Typography>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="routine-name"
                        label="Routine Name"
                        name="name"
                        autoComplete="off"
                        autoFocus
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        name="description"
                        label="Description (Optional)"
                        id="routine-desc"
                        multiline
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Creating...' : 'Create Routine'}
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

export default RoutineCreationForm;