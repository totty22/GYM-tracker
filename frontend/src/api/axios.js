// frontend/src/api/axios.js (VERSIÓN FINAL Y ROBUSTA CON INTERCEPTORES)

import axios from 'axios';

// Función auxiliar para obtener el valor de una cookie por su nombre
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // ¿Comienza la cadena de la cookie con el nombre que queremos?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Creamos la instancia de Axios. Nota que ya NO fijamos el X-CSRFToken aquí.
const axiosInstance = axios.create({
    baseURL: '/', // El proxy de Vite se encargará de redirigir a http://localhost:8000
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true, // Crucial para que el navegador envíe y reciba cookies
});

// === EL CAMBIO MÁGICO: EL INTERCEPTOR DE PETICIONES ===
// Esto se ejecuta ANTES de que cada petición sea enviada.
axiosInstance.interceptors.request.use(
    (config) => {
        // Obtenemos el token CSRF MÁS RECIENTE de las cookies en cada petición.
        const csrfToken = getCookie('csrftoken');
        
        // Si el token existe, lo añadimos a las cabeceras de esta petición específica.
        if (csrfToken) {
            config.headers['X-CSRFToken'] = csrfToken;
        }
        
        return config;
    },
    (error) => {
        // Si hay un error durante la configuración de la petición, lo rechazamos.
        return Promise.reject(error);
    }
);


export default axiosInstance;