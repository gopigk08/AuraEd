export const getImageUrl = (path) => {
    if (!path) return '/placeholder-course.jpg';
    if (path.startsWith('http') || path.startsWith('data:')) return path;

    // Derive server URL from API URL since VITE_API_URL is already configured
    const apiUrl = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000/api`;
    const serverUrl = apiUrl.replace(/\/api$/, '');

    return `${serverUrl}${path}`;
};
