import React, { useState } from 'react';
import { IonPage, IonContent } from '@ionic/react';
import { Box, Container, Typography, TextField, Button, Divider, Alert, Snackbar, Link as MuiLink, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useGoogleLogin } from '@react-oauth/google';
import { handleGoogleAuth } from '../config/googleAuth.js';

// ── Google Sign-In Button ─────────────────────────────────────────────────────
function GoogleLoginButton({ navigate, setError, setIsLoading }) {
  const [gLoading, setGLoading] = useState(false);

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
      startIcon={gLoading ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : <GoogleIcon />}
      onClick={() => login()}
      disabled={gLoading}
      sx={{
        mb: 2,
        py: 1.3,
        color: '#fff',
        borderColor: 'rgba(255,255,255,0.15)',
        background: 'rgba(255,255,255,0.03)',
        fontWeight: 600,
        fontSize: '0.95rem',
        '&:hover': {
          borderColor: '#6366f1',
          background: 'rgba(99,102,241,0.08)',
        },
        '&.Mui-disabled': { opacity: 0.6, color: '#fff' }
      }}
    >
      {gLoading ? 'Signing in...' : 'Continue with Google'}
    </Button>
  );
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const fromSignup = location.state?.fromSignup;

  // Reset Password State
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetPassword, setResetPassword] = useState('');
  const [resetConfirm, setResetConfirm] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Render free tier can take 30s to wake from sleep
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 35000);

    try {
      const res = await fetch('https://invoice-generator-vfec.onrender.com/api/auth/login', {
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
        // Show success popup
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

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetError('');
    setResetSuccess('');

    if (resetPassword !== resetConfirm) {
      return setResetError('Passwords do not match');
    }

    try {
      const res = await fetch('https://invoice-generator-vfec.onrender.com/api/auth/resetpassword', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail, password: resetPassword })
      });
      
      const data = await res.json();
      
      if (data.success) {
        setResetSuccess('Password has been successfully reset! You can now log in.');
        setTimeout(() => {
          setResetModalOpen(false);
          setResetEmail('');
          setResetPassword('');
          setResetConfirm('');
          setResetSuccess('');
        }, 2000);
      } else {
        setResetError(data.message || 'Could not reset password. Is email correct?');
      }
    } catch (err) {
      setResetError('Server disconnected.');
    }
  };

  return (
    <IonPage>
      <IonContent>
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
          <Button component={Link} to="/" startIcon={<ArrowBackIcon />} sx={{ color: 'text.secondary', '&:hover': { color: '#fff' } }}>
            Back to Home
          </Button>
        </Box>

        <Box sx={{ 
          background: 'rgba(17, 24, 39, 0.7)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: 4,
          p: { xs: 4, md: 5 },
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(99, 102, 241, 0.05)',
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

          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: '#fff' }}>
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
              Registration successful! Please log in to your account.
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
              borderColor: 'rgba(255,255,255,0.1)',
              '&:hover': { borderColor: 'rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.02)' }
            }}
          >
            GitHub (Coming Soon)
          </Button>

          <Divider sx={{ mb: 3, '&::before, &::after': { borderColor: 'rgba(255,255,255,0.1)' } }}>
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
                  background: 'rgba(0,0,0,0.2)',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2) !important' },
                  '&.Mui-focused fieldset': { borderColor: '#6366f1 !important' },
                  color: '#fff'
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
                  background: 'rgba(0,0,0,0.2)',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2) !important' },
                  '&.Mui-focused fieldset': { borderColor: '#6366f1 !important' },
                  color: '#fff'
                }
              }}
              InputLabelProps={{ sx: { color: 'text.secondary' } }}
            />
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: -1 }}>
              <MuiLink 
                component="button" 
                type="button"
                onClick={() => setResetModalOpen(true)}
                variant="body2" 
                sx={{ 
                  color: '#818cf8', 
                  textDecoration: 'none', 
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
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
                  color: '#fff'
                }
              }}
            >
              {isLoading ? 'Logging in...' : 'Log In'}
            </Button>
          </Box>

          <Typography variant="body2" sx={{ mt: 4, color: 'text.secondary' }}>
            Don't have an account?{' '}
            <MuiLink component={Link} to="/signup" sx={{ color: '#fff', fontWeight: 600, textDecoration: 'none', '&:hover': { color: '#818cf8' } }}>
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

      {/* Reset Password Modal */}
      <Dialog 
        open={resetModalOpen} 
        onClose={() => setResetModalOpen(false)}
        PaperProps={{
          sx: {
            background: 'rgba(17, 24, 39, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 3,
            color: '#fff',
            minWidth: { xs: '90%', sm: '400px' }
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Reset Password</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
            Directly overwrite the password for the given email account.
          </Typography>
          
          {resetError && <Alert severity="error" sx={{ mb: 2, background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>{resetError}</Alert>}
          {resetSuccess && <Alert severity="success" sx={{ mb: 2, background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>{resetSuccess}</Alert>}

          <Box component="form" id="reset-form" onSubmit={handleResetPassword} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField 
              fullWidth 
              label="Account Email" 
              variant="outlined" 
              type="email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              required
              InputProps={{ sx: { color: '#fff', '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' } } }}
              InputLabelProps={{ sx: { color: 'text.secondary' } }}
            />
            <TextField 
              fullWidth 
              label="New Password" 
              variant="outlined" 
              type="password"
              value={resetPassword}
              onChange={(e) => setResetPassword(e.target.value)}
              required
              InputProps={{ sx: { color: '#fff', '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' } } }}
              InputLabelProps={{ sx: { color: 'text.secondary' } }}
            />
            <TextField 
              fullWidth 
              label="Confirm New Password" 
              variant="outlined" 
              type="password"
              value={resetConfirm}
              onChange={(e) => setResetConfirm(e.target.value)}
              required
              InputProps={{ sx: { color: '#fff', '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' } } }}
              InputLabelProps={{ sx: { color: 'text.secondary' } }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={() => setResetModalOpen(false)} sx={{ color: 'text.secondary' }}>Cancel</Button>
          <Button 
            type="submit" 
            form="reset-form"
            variant="contained" 
            sx={{ background: '#6366f1', '&:hover': { background: '#4f46e5' } }}
          >
            Reset
          </Button>
        </DialogActions>
      </Dialog>
      </Box>
      </IonContent>
    </IonPage>
  );
}
