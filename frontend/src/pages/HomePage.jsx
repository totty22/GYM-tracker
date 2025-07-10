// frontend/src/pages/HomePage.jsx

import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';

const HomePage = () => {
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          my: 4,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <FitnessCenterIcon sx={{ fontSize: 80, mb: 2, color: 'primary.main' }} />
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to Gym Tracker
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Your ultimate companion for creating, managing, and tracking your gym routines.
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button 
            variant="contained" 
            size="large"
            component={RouterLink} 
            to="/routines"
          >
            Go to My Routines
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default HomePage;