import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000/api`,
    timeout: 30000,
    withCredentials: true, // send httpOnly refresh token cookie on every request
});

// ─── Request Interceptor ──────────────────────────────────────────────────────
// Attach our JWT access token + device fingerprint to every outgoing request.
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        let deviceId = localStorage.getItem('deviceId');

        if (!deviceId) {
            deviceId = 'device_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
            localStorage.setItem('deviceId', deviceId);
        }

        // Only append the local JWT if the request hasn't explicitly set a custom Authorization header
        const headers = config.headers || {};

        let hasAuth = false;
        if (typeof headers.has === 'function') {
            hasAuth = headers.has('Authorization') || headers.has('authorization');
        } else {
            // Fallback for raw objects
            hasAuth = Object.keys(headers).some(key => key.toLowerCase() === 'authorization');
        }

        // Explicitly DO NOT attach the local JWT to these endpoints:
        const isAuthSync = config.url && config.url.includes('/auth/sync');
        const isAuthRefresh = config.url && config.url.includes('/auth/refresh');

        if (token && !hasAuth && !isAuthSync && !isAuthRefresh) {
            if (typeof headers.set === 'function') {
                headers.set('Authorization', `Bearer ${token}`);
            } else {
                headers['Authorization'] = `Bearer ${token}`;
            }
        }

        if (typeof headers.set === 'function') {
            headers.set('X-Device-Id', deviceId);
        } else {
            headers['X-Device-Id'] = deviceId;
        }

        config.headers = headers;

        return config;
    },
    (error) => Promise.reject(error)
);

// ─── Response Interceptor (Silent Refresh) ────────────────────────────────────
// When any request returns 401, automatically call /auth/refresh once.
// If refresh succeeds → retry the original request with the new access token.
// If refresh fails (cookie expired) → clear storage and force re-login.

let isRefreshing = false;
let failedQueue = []; // requests waiting while a refresh is in progress

const processQueue = (error, token = null) => {
    failedQueue.forEach(({ resolve, reject }) => {
        if (error) {
            reject(error);
        } else {
            resolve(token);
        }
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Skip retry for the refresh endpoint itself to avoid infinite loops
        const isRefreshCall = originalRequest.url?.includes('/auth/refresh');
        const isLogoutCall = originalRequest.url?.includes('/auth/logout');

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !isRefreshCall &&
            !isLogoutCall
        ) {
            if (isRefreshing) {
                // Queue this request until the refresh completes
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then((newToken) => {
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    return api(originalRequest);
                }).catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Ask the server for a new access token using the httpOnly cookie
                const { data } = await api.post('/auth/refresh');
                const newToken = data.accessToken;

                localStorage.setItem('token', newToken);
                api.defaults.headers.common.Authorization = `Bearer ${newToken}`;
                originalRequest.headers.Authorization = `Bearer ${newToken}`;

                processQueue(null, newToken);
                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);

                // Refresh token also expired → force logout
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                if (window.location.pathname !== '/login' && window.location.pathname !== '/signup') {
                    window.location.href = '/login';
                }

                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;
