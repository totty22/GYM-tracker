// frontend/src/api/axios.js (VERSIÓN FINAL Y CORREGIDA PARA SUBIDA DE ARCHIVOS)

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

// La configuración inicial sigue igual
const axiosInstance = axios.create({
    baseURL: '/',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true,
});


// --- INTERCEPTOR DE PETICIONES MEJORADO ---
axiosInstance.interceptors.request.use(
    (config) => {
        const csrfToken = getCookie('csrftoken');
        if (csrfToken) {
            config.headers['X-CSRFToken'] = csrfToken;
        }

        // --- ¡LA CORRECCIÓN MÁGICA ESTÁ AQUÍ! ---
        // Si los datos de la petición son una instancia de FormData (es decir, una subida de archivo),
        // eliminamos la cabecera 'Content-Type'.
        // Esto obliga al navegador a establecerla correctamente por sí mismo,
        // incluyendo el 'boundary' necesario para multipart.
        if (config.data instanceof FormData) {
            delete config.headers['Content-Type'];
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


export default axiosInstance;