import axios from 'axios';

const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/api/v1`;

// Create an Axios instance with a base URL and default settings
const api = axios.create({
    baseURL: API_BASE,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;