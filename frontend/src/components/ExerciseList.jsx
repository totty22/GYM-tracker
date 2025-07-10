import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';

const ExerciseList = () => {
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Para que esto funcione, necesitas estar autenticado en el backend.
        // Por ahora, puedes eliminar 'permission_classes = [IsAuthenticated]' de las Vistas de Django
        // para las peticiones GET y probar sin autenticación.
        const fetchExercises = async () => {
            try {
                const response = await axiosInstance.get('/api/exercises/');
                setExercises(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch exercises.');
                setLoading(false);
                console.error(err);
            }
        };

        fetchExercises();
    }, []); // El array vacío asegura que esto se ejecute solo una vez al montar el componente

    if (loading) return <p>Loading exercises...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h2>Available Exercises</h2>
            <ul>
                {exercises.map(exercise => (
                    <li key={exercise.id}>
                        <strong>{exercise.name}</strong> - <em>{exercise.muscle_group}</em>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ExerciseList;