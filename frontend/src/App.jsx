// frontend/src/App.jsx

import React from 'react';
import { Routes, Route, Link as RouterLink } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import { 
  AppBar, Toolbar, Typography, Container, Button, Box 
} from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';

// Importaciones de páginas y componentes
import HomePage from './pages/HomePage';
import RoutinesPage from './pages/RoutinesPage';
import WorkoutPage from './pages/WorkoutPage';
import LoginPage from './pages/LoginPage';
import RoutineEditPage from './pages/RoutineEditPage'; // <--- Importante
import PrivateRoute from './components/PrivateRoute';

// Componente de Navegación
function Navigation() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <AppBar position="static">
      <Toolbar>
        <FitnessCenterIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <RouterLink to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            Gym Tracker
          </RouterLink>
        </Typography>
        <Button color="inherit" component={RouterLink} to="/">Home</Button>
        <Button color="inherit" component={RouterLink} to="/routines">My Routines</Button>
        {isAuthenticated && user ? (
          <>
            <Typography sx={{ mx: 2 }}>Welcome, {user.username}!</Typography>
            <Button color="inherit" onClick={logout}>Logout</Button>
          </>
        ) : (
          <Button color="inherit" component={RouterLink} to="/login">Login</Button>
        )}
      </Toolbar>
    </AppBar>
  );
}

// Layout principal de la aplicación
function AppLayout() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navigation />
      <Container component="main" sx={{ flexGrow: 1, py: 3 }} maxWidth="lg">
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Rutas Privadas */}
          <Route element={<PrivateRoute />}>
            <Route path="/routines" element={<RoutinesPage />} />
            <Route path="/routines/:id" element={<RoutineEditPage />} />
            <Route path="/workout/:routineId" element={<WorkoutPage />} />
          </Route>
          
          {/* Página 404 */}
          <Route path="*" element={
            <Box sx={{textAlign: 'center', mt: 8}}>
              <Typography variant="h3">404 - Page Not Found</Typography>
              <Button component={RouterLink} to="/" variant="contained" sx={{mt: 4}}>Go Home</Button>
            </Box>
          } /> 
        </Routes>
      </Container>
      <Box component="footer" sx={{ p: 2, mt: 'auto', backgroundColor: 'background.paper', textAlign: 'center' }}>
        <Typography variant="body2">
          © {new Date().getFullYear()} Gym Tracker App
        </Typography>
      </Box>
    </Box>
  );
}

// El componente App se encarga de los proveedores de contexto
function App() {
  return (
    <AuthProvider>
      <Toaster position="top-center" reverseOrder={false} />
      <AppLayout />
    </AuthProvider>
  );
}

export default App;