// frontend/src/components/RestTimer.jsx

import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { useWorkout } from '../context/WorkoutContext';

const RestTimer = () => {
    const { workoutState, finishRest } = useWorkout();
    const { restUntil, routineDetails, currentExerciseIndex, currentSet } = workoutState;
    
    const calculateTimeLeft = () => {
        if (!restUntil) return 0;
        return Math.max(0, Math.round((restUntil - Date.now()) / 1000));
    };

    const [secondsLeft, setSecondsLeft] = useState(calculateTimeLeft);

    useEffect(() => {
        const timer = setInterval(() => {
            const timeLeft = calculateTimeLeft();
            setSecondsLeft(timeLeft);
            if (timeLeft <= 0) {
                clearInterval(timer);
                finishRest();
            }
        }, 500); // Actualizar cada medio segundo para más suavidad

        return () => clearInterval(timer);
    }, [restUntil, finishRest]);
    
    const totalRestTime = routineDetails.exercises[currentExerciseIndex].rest_time_seconds;
    const progress = (secondsLeft / totalRestTime) * 100;
    
    // Lógica para saber qué viene después
    const currentExercise = routineDetails.exercises[currentExerciseIndex];
    const isLastSet = currentSet === parseInt(currentExercise.sets, 10);
    const nextExercise = routineDetails.exercises[currentExerciseIndex + 1];
    const nextText = isLastSet 
        ? (nextExercise?.exercise.name || 'Last one!') 
        : `Set ${currentSet + 1}`;

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '70vh', textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>REST</Typography>
            <Box sx={{ position: 'relative', display: 'inline-flex', my: 4 }}>
                <CircularProgress variant="determinate" value={100} size={200} thickness={2} sx={{ color: 'grey.800' }} />
                <CircularProgress variant="determinate" value={progress} size={200} thickness={4} sx={{ position: 'absolute', left: 0 }} />
                <Box sx={{ top: 0, left: 0, bottom: 0, right: 0, position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography variant="h2">{secondsLeft}</Typography>
                </Box>
            </Box>
            <Typography variant="h5" color="text.secondary">Up Next: {nextText}</Typography>
            <Button variant="outlined" color="secondary" onClick={finishRest} sx={{ mt: 4 }}>
                Skip Rest
            </Button>
        </Box>
    );
};

export default RestTimer;