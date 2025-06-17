import axios from 'axios';

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3005",
    withCredentials: true,
});

// TODO: When user login use this: localStorage.setItem('token', receivedToken);
api.interceptors.request.use((config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => {
        if ('data' in response.data) {
            return response.data.data;
        } else if ('error' in response.data) {
            return Promise.reject(response.data.error);
        }

        return response.data;
    },
    (error) => {
        return Promise.reject(error.response?.data?.error || error.message);
    }
);
