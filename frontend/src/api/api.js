import axiosInstance from './axios'; // Importamos nuestra instancia base

// Función de ayuda para leer la cookie
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

// Creamos un objeto 'api' que encapsula la lógica
const api = {
    // Las peticiones GET no necesitan token CSRF
    get: (url, config = {}) => axiosInstance.get(url, config),
    
    // Envolvemos POST para que siempre incluya el token CSRF
    post: (url, data, config = {}) => {
        const csrfToken = getCookie('csrftoken');
        const headers = {
            ...config.headers,
            'X-CSRFToken': csrfToken,
        };
        return axiosInstance.post(url, data, { ...config, headers });
    },

    // Hacemos lo mismo para PUT
    put: (url, data, config = {}) => {
        const csrfToken = getCookie('csrftoken');
        const headers = {
            ...config.headers,
            'X-CSRFToken': csrfToken,
        };
        return axiosInstance.put(url, data, { ...config, headers });
    },

    // Y para DELETE
    delete: (url, config = {}) => {
        const csrfToken = getCookie('csrftoken');
        const headers = {
            ...config.headers,
            'X-CSRFToken': csrfToken,
        };
        return axiosInstance.delete(url, { ...config, headers });
    },
};

export default api;