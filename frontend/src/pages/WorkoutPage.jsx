// frontend/src/pages/WorkoutPage.jsx

import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Container } from '@mui/material';

const WorkoutPage = () => {
  // El hook useParams nos permite leer parámetros de la URL, como el :routineId
  const { routineId } = useParams();

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Workout Session
        </Typography>
        <Typography variant="body1">
          Starting workout for Routine ID: <strong>{routineId}</strong>
        </Typography>
        {/* Aquí irá la lógica de la vista de entrenamiento */}
      </Box>
    </Container>
  );
};

export default WorkoutPage;