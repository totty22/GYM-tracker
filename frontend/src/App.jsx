// frontend/src/App.jsx

import React from 'react';
import { Routes, Route, Link as RouterLink } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WorkoutProvider, useWorkout } from './context/WorkoutContext';
import { Toaster, toast } from 'react-hot-toast';
import { 
  AppBar, Toolbar, Typography, Container, Button, Box 
} from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';

// Importaciones de páginas y componentes
import HomePage from './pages/HomePage';
import RoutinesPage from './pages/RoutinesPage';
import WorkoutPage from './pages/WorkoutPage';
import LoginPage from './pages/LoginPage';
import RoutineEditPage from './pages/RoutineEditPage';
import ExercisesPage from './pages/ExercisesPage';
import PrivateRoute from './components/PrivateRoute';

function Navigation() {
  const { isAuthenticated, user, logout } = useAuth();
  const { workoutState } = useWorkout(); 
  
  const isWorkoutActive = workoutState?.isActive;
  const activeRoutineId = workoutState?.routineId;

  const handleInactiveWorkoutClick = () => {
      toast.info('No active workout. Start one from your routines!');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <FitnessCenterIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div">
          <RouterLink to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            Gym Tracker
          </RouterLink>
        </Typography>
        <Button color="inherit" component={RouterLink} to="/">Home</Button>
        {/* Solo mostrar estos botones si el usuario está autenticado */}
        {isAuthenticated && (
          <>
            <Button color="inherit" component={RouterLink} to="/routines">My Routines</Button>
            <Button color="inherit" component={RouterLink} to="/exercises">Exercises</Button>
          </>
        )}
        
        <Box sx={{ flexGrow: 1 }} />
        
        {/* --- LA CORRECCIÓN ESTÁ AQUÍ --- */}
        {/* El botón de Active Workout ahora solo se renderiza si el usuario está autenticado */}
        {isAuthenticated && (
          <Button
              variant="contained"
              color={isWorkoutActive ? "secondary" : "primary"}
              component={isWorkoutActive ? RouterLink : 'button'}
              to={isWorkoutActive ? `/workout/${activeRoutineId}` : undefined}
              onClick={!isWorkoutActive ? handleInactiveWorkoutClick : undefined}
              sx={{ mr: 2 }}
          >
              Active Workout
          </Button>
        )}

        {isAuthenticated && user ? (
          <>
            <Typography>Welcome, {user.username}!</Typography>
            <Button color="inherit" onClick={logout} sx={{ ml: 1 }}>Logout</Button>
          </>
        ) : (
          <Button color="inherit" component={RouterLink} to="/login">Login</Button>
        )}
      </Toolbar>
    </AppBar>
  );
}

// ... (El resto del archivo App.jsx, AppLayout y App no necesita cambios)
function AppLayout() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navigation />
      <Container component="main" sx={{ flexGrow: 1, py: 3 }} maxWidth="lg">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route element={<PrivateRoute />}>
            <Route path="/routines" element={<RoutinesPage />} />
            <Route path="/routines/:id" element={<RoutineEditPage />} />
            <Route path="/exercises" element={<ExercisesPage />} />
            <Route path="/workout/:routineId" element={<WorkoutPage />} />
          </Route>
          <Route path="*" element={ <Typography>404 - Page Not Found</Typography> } /> 
        </Routes>
      </Container>
      <Box component="footer" sx={{ p: 2, mt: 'auto', backgroundColor: 'background.paper', textAlign: 'center' }}>
        <Typography variant="body2">© {new Date().getFullYear()} Gym Tracker App</Typography>
      </Box>
    </Box>
  );
}

function App() {
  return (
    <AuthProvider>
      <WorkoutProvider>
        <Toaster position="top-center" reverseOrder={false} />
        <AppLayout />
      </WorkoutProvider>
    </AuthProvider>
  );
}

export default App;