import axios, {AxiosInstance} from 'axios';

// @ts-ignore
const API_HOST = import.meta.env.VITE_API_HOST || "api";
const dateKeyRx = /date/i;
const api: AxiosInstance = axios.create({
    baseURL: API_HOST,
    transformResponse: (data) =>
        JSON.parse(data, (key, value) =>
            dateKeyRx.test(key) ? new Date(value) : value
        ),
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token)
        config.headers['Authorization'] = `Bearer ${token}`;

    return config;
})

export default api;