import axios from 'axios';

// @ts-ignore
const API_HOST = import.meta.env.VITE_API_HOST;

const api = axios.create({
  baseURL: API_HOST,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token)
        config.headers['Authorization'] = `Bearer ${token}`;

    return config;
})

export default api;