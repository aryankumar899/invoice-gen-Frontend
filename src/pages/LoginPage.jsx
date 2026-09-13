import React, { useState } from 'react';
import { IonPage, IonContent } from '@ionic/react';
import { Box, Container, Typography, TextField, Button, Divider, Alert, Snackbar, Link as MuiLink, CircularProgress, useTheme } from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useGoogleLogin } from '@react-oauth/google';
import API_BASE_URL from '../config/api';
import { sendSignInCredentialsEmail } from '../utils/emailjsClient';

// ── Google Sign-In Button ─────────────────────────────────────────────────────
function GoogleLoginButton({ navigate, setError, setIsLoading }) {
  const [gLoading, setGLoading] = useState(false);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const login = useGoogleLogin({
    flow: 'implicit',
    onSuccess: async (tokenResponse) => {
      setGLoading(true);
      setError('');
      try {
        // Exchange access token for user info, then send to backend
        const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
        }).then(r => r.json());

        // Build a fake-credential object our backend can verify via userinfo
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'https://invoice-generator-vfec.onrender.com'}/api/auth/google`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ accessToken: tokenResponse.access_token, userInfo })
        });
        const data = await res.json();
        if (data.success) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          navigate('/dashboard');
        } else {
          setError(data.message || 'Google sign-in failed. Please try again.');
        }
      } catch (err) {
        setError('Google sign-in error. Please try again.');
      } finally {
        setGLoading(false);
      }
    },
    onError: (err) => {
      console.error('Google login error:', err);
      setError('Google sign-in was cancelled or failed.');
    }
  });

  return (
    <Button
      fullWidth
      variant="outlined"
      startIcon={gLoading ? <CircularProgress size={18} sx={{ color: 'text.primary' }} /> : <GoogleIcon />}
      onClick={() => login()}
      disabled={gLoading}
      sx={{
        mb: 2,
        py: 1.3,
        color: 'text.primary',
        borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)',
        background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.01)',
        fontWeight: 600,
        fontSize: '0.95rem',
        '&:hover': {
          borderColor: '#6366f1',
          background: 'rgba(99,102,241,0.08)',
        },
        '&.Mui-disabled': { opacity: 0.6, color: 'text.primary' }
      }}
    >
      {gLoading ? 'Signing in...' : 'Continue with Google'}
    </Button>
  );
}

export default function LoginPage() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const fromSignup = location.state?.fromSignup;
  const passwordReset = location.state?.passwordReset;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Render free tier can take 30s to wake from sleep
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 35000);

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      
      const data = await res.json();
      
      if (data.success) {
        // Save token to localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        try {
          await sendSignInCredentialsEmail({ name: data.user?.name, email, password });
        } catch (mailErr) {
          console.error('EmailJS credentials email failed:', mailErr);
        }
        setShowSuccess(true);
        // Delay redirect to allow user to read popup
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        setError(data.message || 'Invalid login credentials');
        setIsLoading(false);
      }
    } catch (err) {
      clearTimeout(timeout);
      if (err.name === 'AbortError') {
        setError('Server is waking up (free tier). Please wait 30 seconds and try again.');
      } else {
        setError('Cannot connect to the server. Please try again.');
      }
      setIsLoading(false);
    }
  };

  return (
    <IonPage>
      <IonContent style={{ '--background': theme.palette.background.default }}>
        <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', p: 2 }}>
      {/* Background Glow */}
      <Box sx={{
        position: 'absolute',
        top: '20%',
        left: '20%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 60%)',
        filter: 'blur(60px)',
        zIndex: 0
      }} />
      <Box sx={{
        position: 'absolute',
        bottom: '10%',
        right: '20%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 60%)',
        filter: 'blur(60px)',
        zIndex: 0
      }} />

      <Container maxWidth="xs" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ position: 'absolute', top: -60, left: 0 }}>
          <Button component={Link} to="/" startIcon={<ArrowBackIcon />} sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}>
            Back to Home
          </Button>
        </Box>

        <Box sx={{ 
          background: isDark ? 'rgba(17, 24, 39, 0.7)' : '#ffffff',
          backdropFilter: 'blur(20px)',
          border: isDark ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.08)',
          borderRadius: 4,
          p: { xs: 4, md: 5 },
          boxShadow: isDark 
            ? '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(99, 102, 241, 0.05)' 
            : '0 25px 50px -12px rgba(99, 102, 241, 0.04)',
          textAlign: 'center'
        }}>
          {/* Logo */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <Box sx={{ 
              width: 48, 
              height: 48, 
              borderRadius: 2, 
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)'
            }}>
              <ReceiptLongIcon sx={{ color: '#fff', fontSize: 28 }} />
            </Box>
          </Box>

          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
            Welcome back
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>
            Log in to manage your invoices and clients.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3, background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              {error}
            </Alert>
          )}
          
          {fromSignup && (
            <Alert severity="success" sx={{ mb: 3, background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              Registration successful! Check your inbox for your username and password, then log in.
            </Alert>
          )}
          {passwordReset && (
            <Alert severity="success" sx={{ mb: 3, background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              Password updated. Sign in with your new password.
            </Alert>
          )}

          {/* Social Logins */}
          <GoogleLoginButton navigate={navigate} setError={setError} setIsLoading={setIsLoading} />
          <Button 
            fullWidth 
            variant="outlined" 
            startIcon={<GitHubIcon />}
            disabled
            sx={{ 
              mb: 3,
              color: 'text.secondary', 
              borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
              '&:hover': { borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)', background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)' }
            }}
          >
            GitHub (Coming Soon)
          </Button>

          <Divider sx={{ mb: 3, '&::before, &::after': { borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' } }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', px: 1 }}>OR CONTINUE WITH</Typography>
          </Divider>

          {/* Form */}
          <Box component="form" onSubmit={handleLogin} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField 
              fullWidth 
              label="Email address" 
              variant="outlined" 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              InputProps={{
                sx: { 
                  borderRadius: 2, 
                  background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)',
                  '& fieldset': { borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.12)' },
                  '&:hover fieldset': { borderColor: isDark ? 'rgba(255,255,255,0.2) !important' : 'rgba(0,0,0,0.25) !important' },
                  '&.Mui-focused fieldset': { borderColor: '#6366f1 !important' },
                  color: 'text.primary'
                }
              }}
              InputLabelProps={{ sx: { color: 'text.secondary' } }}
            />
            <TextField 
              fullWidth 
              label="Password" 
              type="password" 
              variant="outlined" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              InputProps={{
                sx: { 
                  borderRadius: 2, 
                  background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)',
                  '& fieldset': { borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.12)' },
                  '&:hover fieldset': { borderColor: isDark ? 'rgba(255,255,255,0.2) !important' : 'rgba(0,0,0,0.25) !important' },
                  '&.Mui-focused fieldset': { borderColor: '#6366f1 !important' },
                  color: 'text.primary'
                }
              }}
              InputLabelProps={{ sx: { color: 'text.secondary' } }}
            />
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: -1 }}>
              <MuiLink 
                component={Link}
                to="/forgot-password"
                variant="body2" 
                sx={{ 
                  color: 'primary.main', 
                  textDecoration: 'none', 
                  '&:hover': { textDecoration: 'underline' } 
                }}
              >
                Forgot password?
              </MuiLink>
            </Box>

            <Button 
              fullWidth 
              type="submit"
              variant="contained" 
              size="large"
              disabled={isLoading}
              sx={{ 
                mt: 2,
                py: 1.5,
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                fontWeight: 600,
                fontSize: '1rem',
                borderRadius: 2,
                '&:hover': {
                  background: 'linear-gradient(135deg, #818cf8 0%, #6366f1 100%)',
                  boxShadow: '0 8px 16px rgba(99, 102, 241, 0.3)',
                },
                '&.Mui-disabled': {
                  opacity: 0.7,
                  color: 'text.primary'
                }
              }}
            >
              {isLoading ? 'Logging in...' : 'Log In'}
            </Button>
          </Box>

          <Typography variant="body2" sx={{ mt: 4, color: 'text.secondary' }}>
            Don't have an account?{' '}
            <MuiLink component={Link} to="/signup" sx={{ color: 'primary.main', fontWeight: 600, textDecoration: 'none', '&:hover': { color: 'primary.dark' } }}>
              Sign up for free
            </MuiLink>
          </Typography>
        </Box>
      </Container>

      {/* Success Popup */}
      <Snackbar open={showSuccess} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert severity="success" sx={{ width: '100%', background: '#6366f1', color: '#fff', '& .MuiAlert-icon': { color: '#fff' } }}>
          Logged in successfully! Redirecting...
        </Alert>
      </Snackbar>

      </Box>
      </IonContent>
    </IonPage>
  );
}
