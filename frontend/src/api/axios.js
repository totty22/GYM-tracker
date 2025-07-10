// frontend/src/api/axios.js (VERSIÓN FINAL Y ROBUSTA)

import axios from 'axios';

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

const axiosInstance = axios.create({
    // baseURL la dejamos vacía para tener control total en las llamadas.
    // Esto evita la duplicación de /api/
    baseURL: '/', 
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // Añadimos el token CSRF aquí directamente
        'X-CSRFToken': getCookie('csrftoken')
    },
    withCredentials: true, 
});

export default axiosInstance;