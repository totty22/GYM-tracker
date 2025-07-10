import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';

const RoutineList = () => {
    const [routines, setRoutines] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRoutines = async () => {
            try {
                // Esta petición sí requiere autenticación, ya que filtra por usuario
                const response = await axiosInstance.get('/api/routines/');
                setRoutines(response.data);
            } catch (err) {
                console.error("Failed to fetch routines", err);
            } finally {
                setLoading(false);
            }
        };
        fetchRoutines();
    }, []);

    if (loading) return <p>Loading routines...</p>;

    return (
        <div>
            <h2>Your Routines</h2>
            {routines.length > 0 ? (
                <ul>
                    {routines.map(routine => (
                        <li key={routine.id}>
                            {routine.name}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>You have not created any routines yet. (Or you are not logged in)</p>
            )}
        </div>
    );
};

export default RoutineList;