// frontend/src/pages/RoutinesPage.jsx

import React, { useState, useEffect } from 'react';
import { Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import axiosInstance from '../api/axios';
import RoutineList from '../components/RoutineList';
import RoutineCreationForm from '../components/RoutineCreationForm';

const RoutinesPage = () => {
    const [routines, setRoutines] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); // Hook para redirigir al usuario

    const fetchRoutines = async () => {
        setLoading(true);
        try {
            // NOTA: Esta petición requiere que el usuario esté autenticado.
            // Para probar, asegúrate de haber iniciado sesión en el panel de admin de Django 
            // en tu navegador (http://127.0.0.1:8000/admin/). 
            // El navegador guardará la cookie de sesión y la enviará con las peticiones.
            const response = await axiosInstance.get('/api/routines/');
            setRoutines(response.data);
        } catch (err) {
            console.error("Failed to fetch routines", err);
            // Idealmente, aquí se mostraría un mensaje de error al usuario.
            // Por ejemplo, si da un error 403, redirigir a la página de login.
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRoutines();
    }, []);

    const handleRoutineCreated = () => {
        // Vuelve a cargar las rutinas para que la nueva aparezca en la lista
        fetchRoutines();
    };

    const handleSelectRoutine = (routineId) => {
        // Navega a la página de entrenamiento con el ID de la rutina seleccionada
        navigate(`/workout/${routineId}`);
    };

    return (
        <Container maxWidth="md">
            {/* El formulario para crear nuevas rutinas */}
            <RoutineCreationForm onRoutineCreated={handleRoutineCreated} />

            {/* La lista de rutinas existentes */}
            <RoutineList 
                routines={routines} 
                loading={loading} 
                onSelectRoutine={handleSelectRoutine}
            />
        </Container>
    );
};

export default RoutinesPage;