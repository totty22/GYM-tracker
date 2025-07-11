// frontend/src/pages/WorkoutPage.jsx (VERSIÓN FINAL Y CORREGIDA)

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box, Typography, Container, Card, CardContent, Button, Grid, TextField, CircularProgress
} from '@mui/material';
import axiosInstance from '../api/axios';
import toast from 'react-hot-toast';
import RestTimer from '../components/RestTimer';

const WorkoutPage = () => {
    const { routineId } = useParams();
    const navigate = useNavigate();

    const [routine, setRoutine] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sessionId, setSessionId] = useState(null); // Inicia como null
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [weight, setWeight] = useState('');
    const [isResting, setIsResting] = useState(false);

    useEffect(() => {
        const startWorkout = async () => {
            try {
                const routineRes = await axiosInstance.get(`/api/routines/${routineId}/`);
                setRoutine(routineRes.data);

                const sessionRes = await axiosInstance.post('/api/workout-sessions/', { routine: routineId });
                setSessionId(sessionRes.data.id); // ¡Aquí se establece el ID!
            } catch (error) {
                toast.error('Failed to start workout session.');
                navigate('/routines');
            } finally {
                setLoading(false);
            }
        };
        startWorkout();
    }, [routineId, navigate]);

    const currentExercise = routine?.exercises[currentExerciseIndex];
    const nextExercise = routine?.exercises[currentExerciseIndex + 1];

    const handleCompleteExercise = async () => {
        if (!weight) {
            toast.error('Please enter the weight you lifted.');
            return;
        }
        try {
            await axiosInstance.post('/api/exercise-logs/', {
                workout_session: sessionId, // Ahora SÍ tiene un valor
                routine_exercise: currentExercise.id,
                weight_achieved: weight
            });
            toast.success(`${currentExercise.exercise.name} completed!`);
            
            if (nextExercise) {
                setIsResting(true);
            } else {
                handleFinishWorkout();
            }
        } catch (error) {
            console.error("Backend Validation Error:", error.response?.data);
            const errorMsg = error.response?.data ? Object.values(error.response.data).flat().join(' ') : 'Failed to log exercise.';
            toast.error(errorMsg);
        }
    };

    const handleFinishWorkout = useCallback(() => {
        toast.success('Workout Finished! Well done!', { duration: 4000, icon: '🎉' });
        navigate('/routines');
    }, [navigate]);

    const handleNextExercise = useCallback(() => {
        setIsResting(false);
        setWeight('');
        setCurrentExerciseIndex(prev => prev + 1);
    }, []);

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    }
    
    if (!routine || !currentExercise) {
         return <Typography sx={{textAlign: 'center', mt: 4}}>Could not load workout details.</Typography>;
    }

    if (isResting) {
        return (
            <RestTimer
                restTime={currentExercise.rest_time_seconds}
                nextExerciseName={nextExercise?.exercise?.name || 'Last one!'}
                onFinish={handleNextExercise}
            />
        );
    }

    return (
        <Container maxWidth="md">
            <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary">CURRENT EXERCISE</Typography>
                    <Typography variant="h2" component="h1" gutterBottom>
                        {currentExercise.exercise.name}
                    </Typography>

                    <Grid container spacing={4} sx={{ my: 4 }} justifyContent="center">
                        <Grid item xs={4}><Typography variant="h4">{currentExercise.sets} SETS</Typography></Grid>
                        <Grid item xs={4}><Typography variant="h4">{currentExercise.reps} REPS</Typography></Grid>
                        <Grid item xs={4}>
                            <Typography variant="body1" color="text.secondary">LAST TIME</Typography>
                            <Typography variant="h5">
                                {currentExercise.last_weight_achieved ? `${currentExercise.last_weight_achieved} kg` : 'N/A'}
                            </Typography>
                        </Grid>
                    </Grid>

                    <TextField
                        label="Enter Weight (kg)"
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        variant="outlined"
                        sx={{ width: '50%', mb: 3 }}
                        autoFocus
                        disabled={!sessionId} // <-- DESHABILITADO SI NO HAY SESIÓN
                    />
                    <br/>
                    <Button 
                        variant="contained" 
                        size="large" 
                        onClick={handleCompleteExercise}
                        disabled={!sessionId} // <-- DESHABILITADO SI NO HAY SESIÓN
                    >
                        Complete Exercise
                    </Button>

                    <Box sx={{ mt: 5, p: 2, backgroundColor: 'background.paper', borderRadius: 1 }}>
                        <Typography variant="h6">Up Next: {nextExercise ? nextExercise.exercise.name : 'Finish!'}</Typography>
                    </Box>
                </CardContent>
            </Card>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Button color="secondary" onClick={handleFinishWorkout}>Finish Workout Early</Button>
            </Box>
        </Container>
    );
};

export default WorkoutPage;