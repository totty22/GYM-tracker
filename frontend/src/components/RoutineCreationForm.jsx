// frontend/src/components/RoutineCreationForm.jsx

import React, { useState } from 'react';
import axiosInstance from '../api/axios';

// --- NUEVA FUNCIÓN ---
// Esta es una función de ayuda estándar para leer el valor de una cookie específica.
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // ¿Comienza esta cookie con el nombre que queremos?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
// --- FIN DE LA NUEVA FUNCIÓN ---

const RoutineCreationForm = ({ onRoutineCreated }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!name) {
            setError('Routine name is required.');
            return;
        }

        try {
            // --- PASO 1: Obtener el token CSRF manualmente ---
            const csrfToken = getCookie('csrftoken');
            console.log("CSRF Token leído de la cookie:", csrfToken); // Para depurar

            if (!csrfToken) {
                setError('CSRF Token not found. Please refresh the page.');
                return;
            }

            // --- PASO 2: Enviar la petición con la cabecera manual ---
            const response = await axiosInstance.post('/api/routines/', {
                name: name,
                description: description
            }, {
                headers: {
                    'X-CSRFToken': csrfToken // Añadimos la cabecera explícitamente
                }
            });
            
            console.log('Routine created:', response.data);
            setName('');
            setDescription('');
            if(onRoutineCreated) {
                onRoutineCreated(response.data);
            }
        } catch (err) {
            setError('Failed to create routine. Please check console.');
            console.error(err);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Create a New Routine</h3>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div>
                <label htmlFor="routine-name">Routine Name:</label>
                <input
                    id="routine-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="routine-desc">Description:</label>
                <textarea
                    id="routine-desc"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>
            <button type="submit">Create Routine</button>
        </form>
    );
};

export default RoutineCreationForm;