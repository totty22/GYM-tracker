import axios from 'axios';

// La URL base apunta a la ruta de nuestra API en el backend de Django
const API_URL = 'http://localhost:8000/api/';

const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000/',
    timeout: 5000, // Tiempo de espera de 5 segundos
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    withCredentials: true 
});

axiosInstance.defaults.xsrfCookieName = 'csrftoken';
axiosInstance.defaults.xsrfHeaderName = 'X-CSRFToken';

export default axiosInstance;