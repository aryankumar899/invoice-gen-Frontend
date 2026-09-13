// Central API configuration
// Local: VITE_API_URL or localhost:5000
// Production: never use localhost (Vercel would bake that in and break live auth)

const RENDER_API = 'https://invoice-generator-vfec.onrender.com';
const raw = String(import.meta.env.VITE_API_URL || '').trim().replace(/\/$/, '');
const isLocalhost = /localhost|127\.0\.0\.1/i.test(raw);

const API_BASE_URL = import.meta.env.PROD
  ? (!raw || isLocalhost ? RENDER_API : raw)
  : (raw || 'http://localhost:5000');

export default API_BASE_URL;
