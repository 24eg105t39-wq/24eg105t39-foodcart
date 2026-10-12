import axios, { AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Interceptor to inject JWT Bearer token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('cravekart_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor for response errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    if (error.response?.status === 401) {
      // Session expired or unauthenticated
      if (window.location.pathname.startsWith('/admin')) {
        localStorage.removeItem('cravekart_token');
        localStorage.removeItem('cravekart_user');
      }
    }
    return Promise.reject(error);
  }
);

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message ||
      error.message ||
      'An error occurred while connecting to the server.'
    );
  }
  return (error as Error)?.message || 'An unexpected error occurred.';
}

export default apiClient;
