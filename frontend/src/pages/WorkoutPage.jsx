// frontend/src/pages/WorkoutPage.jsx (VERSIÓN CON LAYOUT DE FORMULARIO MEJORADO)

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Typography, Container, Card, CardContent, Button, Grid, TextField, CardMedia
} from '@mui/material';
import axiosInstance from '../api/axios';
import toast from 'react-hot-toast';
import RestTimer from '../components/RestTimer';
import { useWorkout } from '../context/WorkoutContext';

const WorkoutPage = () => {
    const navigate = useNavigate();
    const { workoutState, advanceToNext, endWorkout } = useWorkout();
    const [weight, setWeight] = useState('');
    const [notes, setNotes] = useState('');

    useEffect(() => {
        if (!workoutState?.isActive) {
            navigate('/routines');
        }
    }, [workoutState, navigate]);

    const currentExercise = workoutState?.routineDetails?.exercises[workoutState.currentExerciseIndex];

    useEffect(() => {
        if (currentExercise) {
            setWeight(currentExercise.last_weight_achieved || '');
            setNotes('');
        }
    }, [currentExercise]);

    if (!workoutState || !currentExercise) {
        return null; 
    }

    const { currentSet, isResting, sessionId } = workoutState;
    const totalSets = parseInt(currentExercise.sets, 10);
    const isLastSet = currentSet === totalSets;
    const nextExercise = workoutState.routineDetails.exercises[workoutState.currentExerciseIndex + 1];

    const handleCompleteSet = async () => {
        if (isLastSet) {
            const toastId = toast.loading('Logging final set...');
            try {
                const weightToSend = weight || '0';
                await axiosInstance.post('/api/exercise-logs/', {
                    workout_session: sessionId,
                    routine_exercise: currentExercise.id,
                    weight_achieved: weightToSend,
                    notes: notes,
                });
                toast.success(`${currentExercise.exercise.name} completed!`, { id: toastId });
                advanceToNext();
            } catch (error) {
                console.error("Backend Validation Error:", error.response?.data);
                toast.error('Failed to log exercise.', { id: toastId });
            }
        } else {
            advanceToNext();
        }
    };
    
    if (isResting) {
        return <RestTimer />;
    }

    return (
        <Container maxWidth="md">
            <Card>
                {currentExercise.exercise.image && (
                    <CardMedia component="img" sx={{ height: 250, objectFit: 'contain', mt: 2 }} image={currentExercise.exercise.image} alt={currentExercise.exercise.name} />
                )}
                <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary">CURRENT EXERCISE</Typography>
                    <Typography variant="h2" component="h1" gutterBottom>{currentExercise.exercise.name}</Typography>
                    <Grid container spacing={4} sx={{ my: 4 }} justifyContent="center">
                        <Grid item xs={4}><Typography variant="h4">SET {currentSet}/{totalSets}</Typography></Grid>
                        <Grid item xs={4}><Typography variant="h4">{currentExercise.reps} REPS</Typography></Grid>
                        <Grid item xs={4}>
                            <Typography variant="body1" color="text.secondary">LAST TIME</Typography>
                            <Typography variant="h5">{currentExercise.last_weight_achieved ? `${currentExercise.last_weight_achieved} kg` : 'N/A'}</Typography>
                        </Grid>
                    </Grid>

                    {/* --- ZONA DE ENTRADA DE DATOS MEJORADA --- */}
                    <Box 
                        sx={{ 
                            width: '60%', 
                            mx: 'auto', // Centra el contenedor
                            display: 'flex', 
                            flexDirection: 'column',
                            gap: 2, // Añade espacio entre los campos
                            mb: 3 // Margen inferior antes del botón
                        }}
                    >
                        <TextField 
                            label="Enter Weight (kg)" 
                            type="number" 
                            value={weight} 
                            onChange={(e) => setWeight(e.target.value)} 
                            variant="outlined"
                            autoFocus 
                        />
                        <TextField 
                            label="Notes (optional)" 
                            multiline 
                            rows={2}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            variant="outlined"
                        />
                    </Box>
                    
                    <Button variant="contained" size="large" onClick={handleCompleteSet}>
                        Complete Set
                    </Button>
                    
                    <Box sx={{ mt: 5, p: 2, backgroundColor: 'background.paper', borderRadius: 1 }}>
                        <Typography variant="h6">
                            Up Next: {isLastSet ? (nextExercise?.exercise.name || 'Finish Workout!') : `Set ${currentSet + 1} of ${currentExercise.exercise.name}`}
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Button color="secondary" onClick={() => endWorkout(true)}>Finish Workout Early</Button>
            </Box>
        </Container>
    );
};

export default WorkoutPage;