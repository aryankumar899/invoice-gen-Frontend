export const LIVE_FRONTEND_URL = 'https://invoice-gen-frontend-beryl.vercel.app';

export function publicAppUrl() {
  const origin = typeof window !== 'undefined' ? window.location.origin : LIVE_FRONTEND_URL;
  if (/localhost|127\.0\.0\.1/i.test(origin)) return LIVE_FRONTEND_URL;
  return origin.replace(/\/$/, '');
}

export function withPublicAppUrls(mail) {
  if (!mail || typeof mail !== 'object') return mail;
  const appUrl = publicAppUrl();
  const next = { ...mail };
  Object.keys(next).forEach((key) => {
    const value = next[key];
    if (typeof value === 'string') {
      next[key] = value.replace(/https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/gi, appUrl);
    }
  });
  return next;
}
