// frontend/src/App.jsx (VERSIÓN VERIFICADA)

import React from 'react';
import { Routes, Route, Link as RouterLink } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Container, 
  Button, 
  Box,
  Icon // Usaremos Icon para el FitnessCenterIcon
} from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'; // Asegúrate de que esta línea exista y el paquete esté instalado

// Importaciones de las páginas
import HomePage from './pages/HomePage';
import RoutinesPage from './pages/RoutinesPage';
import WorkoutPage from './pages/WorkoutPage';

function App() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* BARRA DE NAVEGACIÓN SUPERIOR */}
      <AppBar position="static">
        <Toolbar>
          <FitnessCenterIcon sx={{ mr: 2 }}/>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Gym Tracker
          </Typography>
          <Button color="inherit" component={RouterLink} to="/">Home</Button>
          <Button color="inherit" component={RouterLink} to="/routines">My Routines</Button>
        </Toolbar>
      </AppBar>

      {/* CONTENIDO PRINCIPAL DE LA PÁGINA */}
      <Container component="main" sx={{ flexGrow: 1, py: 3 }} maxWidth="lg">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/routines" element={<RoutinesPage />} />
          <Route path="/workout/:routineId" element={<WorkoutPage />} />
          {/* Una página 404 simple */}
          <Route path="*" element={
            <Box sx={{textAlign: 'center', mt: 8}}>
              <Typography variant="h3">404 - Page Not Found</Typography>
              <Button component={RouterLink} to="/" variant="contained" sx={{mt: 4}}>Go Home</Button>
            </Box>
          } /> 
        </Routes>
      </Container>

       {/* FOOTER */}
      <Box component="footer" sx={{ p: 2, mt: 'auto', bgcolor: 'primary.dark', color: 'white', textAlign: 'center' }}>
        <Typography variant="body2">
          © {new Date().getFullYear()} Gym Tracker App
        </Typography>
      </Box>
    </Box>
  );
}

export default App;