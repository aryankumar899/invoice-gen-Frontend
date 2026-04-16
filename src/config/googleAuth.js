// Central Google OAuth helper — called from LoginPage & SignUpPage
// Sends the Google credential to our backend, saves token, navigates to dashboard

import API_BASE_URL from './api.js';

/**
 * @param {string} credential  – The raw Google ID token from @react-oauth/google
 * @param {Function} navigate  – react-router navigate()
 * @param {Function} setError  – state setter for error message
 * @param {Function} setLoading – state setter for loading flag
 */
export async function handleGoogleAuth(credential, navigate, setError, setLoading) {
  setLoading(true);
  setError('');
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential }),
    });
    const data = await res.json();
    if (data.success) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/dashboard');
    } else {
      setError(data.message || 'Google sign-in failed');
    }
  } catch (err) {
    setError('Server error during Google sign-in. Please try again.');
  } finally {
    setLoading(false);
  }
}
