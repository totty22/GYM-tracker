// frontend/src/components/RestTimer.jsx

import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, CircularProgress, Container } from '@mui/material';

const RestTimer = ({ restTime, nextExerciseName, onFinish }) => {
    const [timeLeft, setTimeLeft] = useState(restTime);
    const progress = (timeLeft / restTime) * 100;

    useEffect(() => {
        if (timeLeft <= 0) {
            onFinish();
            return;
        }

        const timerId = setInterval(() => {
            setTimeLeft(prevTime => prevTime - 1);
        }, 1000);

        // Limpia el intervalo cuando el componente se desmonta para evitar fugas de memoria
        return () => clearInterval(timerId);
    }, [timeLeft, onFinish]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ textAlign: 'center', my: 8 }}>
                <Typography variant="h4" color="text.secondary" gutterBottom>
                    REST
                </Typography>
                
                <Box sx={{ position: 'relative', display: 'inline-flex', my: 4 }}>
                    <CircularProgress variant="determinate" value={100} size={200} sx={{color: 'grey.700'}} />
                    <CircularProgress variant="determinate" value={progress} size={200} sx={{ position: 'absolute', left: 0 }} />
                    <Box
                        sx={{
                            top: 0, left: 0, bottom: 0, right: 0,
                            position: 'absolute',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Typography variant="h2" component="div" color="text.primary">
                            {formatTime(timeLeft)}
                        </Typography>
                    </Box>
                </Box>

                <Typography variant="h5" gutterBottom>
                    Up Next: {nextExerciseName}
                </Typography>
                <Button variant="outlined" sx={{ mt: 3 }} onClick={onFinish}>
                    Skip Rest
                </Button>
            </Box>
        </Container>
    );
};

export default RestTimer;