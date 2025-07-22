import { env } from '@/env';
import axios from 'axios';

// TODO(miha): Get url from config.
// VITE_BACKEND_URL: "http://localhost:30082",
export const api = axios.create({
    baseURL: "http://localhost:30082",// env.VITE_BACKEND_URL, // || "http://localhost:8081",
    // withCredentials: true,
});

api.interceptors.request.use(async (config) => {
    console.log(`baseURL1: ${env.VITE_BACKEND_URL}`);
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
