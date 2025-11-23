// Helper to determine the API URL based on the environment
export const getApiUrl = () => {
    // If VITE_API_URL is set in .env (e.g., in Vercel), use it.
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
    }
    
    // Local Development fallback
    if (import.meta.env.MODE === 'development') {
        return 'http://localhost:5000/api';
    }

    // Default production fallback (relative path for Vercel rewrites)
    return '/api';
};

export const API_URL = getApiUrl();