// frontend/src/components/RestTimer.jsx

import React from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { useTimer } from '../hooks/useTimer';

const RestTimer = ({ restTime, nextExerciseName, onFinish }) => {
    // Usamos nuestro custom hook para la lógica.
    const secondsLeft = useTimer(restTime, onFinish);

    // Calculamos el progreso para la barra circular (de 0 a 100)
    const progress = (secondsLeft / restTime) * 100;

    // Formateamos los segundos a un formato MM:SS para mostrar
    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;
    const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '70vh',
                textAlign: 'center'
            }}
        >
            <Typography variant="h4" gutterBottom>
                REST
            </Typography>

            {/* Círculo de progreso visual */}
            <Box sx={{ position: 'relative', display: 'inline-flex', my: 4 }}>
                <CircularProgress
                    variant="determinate"
                    value={progress}
                    size={200}
                    thickness={4}
                />
                <Box
                    sx={{
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        position: 'absolute',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Typography variant="h2" component="div" color="text.primary">
                        {formattedTime}
                    </Typography>
                </Box>
            </Box>

            <Typography variant="h5" color="text.secondary">
                Up Next: {nextExerciseName}
            </Typography>

            {/* Botón para saltar el descanso */}
            <Button
                variant="outlined"
                color="secondary"
                onClick={onFinish} // Llamamos a onFinish directamente para saltar
                sx={{ mt: 4 }}
            >
                Skip Rest
            </Button>
        </Box>
    );
};

export default RestTimer;