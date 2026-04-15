// Central API configuration
// In development: uses localhost:5000
// In production: uses the deployed Render backend URL

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://invoice-generator-vfec.onrender.com';

export default API_BASE_URL;
