import React, { useState } from 'react';
import { Box, Container, Typography, TextField, Button, Divider, Alert, Snackbar, Link as MuiLink, CircularProgress } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useGoogleLogin } from '@react-oauth/google';

// ── Google Sign-Up Button ─────────────────────────────────────────────────────
function GoogleSignUpButton({ navigate, setError }) {
  const [gLoading, setGLoading] = useState(false);

  const login = useGoogleLogin({
    flow: 'implicit',
    onSuccess: async (tokenResponse) => {
      setGLoading(true);
      setError('');
      try {
        const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
        }).then(r => r.json());

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
          setError(data.message || 'Google sign-up failed. Please try again.');
        }
      } catch (err) {
        setError('Google sign-up error. Please try again.');
      } finally {
        setGLoading(false);
      }
    },
    onError: () => setError('Google sign-up was cancelled or failed.')
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
          borderColor: '#ec4899',
          background: 'rgba(236,72,153,0.08)',
        },
        '&.Mui-disabled': { opacity: 0.6, color: '#fff' }
      }}
    >
      {gLoading ? 'Signing up...' : 'Continue with Google'}
    </Button>
  );
}

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('https://invoice-generator-vfec.onrender.com/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      
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
        setError(data.message || 'Registration failed. Try again.');
        setIsLoading(false);
      }
    } catch (err) {
      setError('Cannot connect to the server');
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', p: 2 }}>
      {/* Background Glow */}
      <Box sx={{
        position: 'absolute',
        top: '20%',
        right: '20%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 60%)',
        filter: 'blur(60px)',
        zIndex: 0
      }} />
      <Box sx={{
        position: 'absolute',
        bottom: '10%',
        left: '20%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 60%)',
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
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(236, 72, 153, 0.05)',
          textAlign: 'center'
        }}>
          {/* Logo */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <Box sx={{ 
              width: 48, 
              height: 48, 
              borderRadius: 2, 
              background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: '0 4px 15px rgba(236, 72, 153, 0.4)'
            }}>
              <ReceiptLongIcon sx={{ color: '#fff', fontSize: 28 }} />
            </Box>
          </Box>

          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: '#fff' }}>
            Create an account
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>
            Start generating beautiful AI invoices today.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3, background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              {error}
            </Alert>
          )}

          {/* Social Logins */}
          <GoogleSignUpButton navigate={navigate} setError={setError} />
          <Button 
            fullWidth 
            variant="outlined" 
            startIcon={<GitHubIcon />}
            disabled
            sx={{ 
              mb: 3,
              color: 'text.secondary', 
              borderColor: 'rgba(255,255,255,0.1)',
            }}
          >
            GitHub (Coming Soon)
          </Button>

          <Divider sx={{ mb: 3, '&::before, &::after': { borderColor: 'rgba(255,255,255,0.1)' } }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', px: 1 }}>OR CONTINUE WITH</Typography>
          </Divider>

          {/* Form */}
          <Box component="form" onSubmit={handleSignup} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField 
              fullWidth 
              label="Full Name" 
              variant="outlined" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              InputProps={{
                sx: { 
                  borderRadius: 2, 
                  background: 'rgba(0,0,0,0.2)',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2) !important' },
                  '&.Mui-focused fieldset': { borderColor: '#ec4899 !important' },
                  color: '#fff'
                }
              }}
              InputLabelProps={{ sx: { color: 'text.secondary' } }}
            />
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
                  '&.Mui-focused fieldset': { borderColor: '#ec4899 !important' },
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
                  '&.Mui-focused fieldset': { borderColor: '#ec4899 !important' },
                  color: '#fff'
                }
              }}
              InputLabelProps={{ sx: { color: 'text.secondary' } }}
            />

            <Button 
              fullWidth 
              type="submit"
              variant="contained" 
              size="large"
              disabled={isLoading}
              sx={{ 
                mt: 2,
                py: 1.5,
                background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
                fontWeight: 600,
                fontSize: '1rem',
                borderRadius: 2,
                '&:hover': {
                  background: 'linear-gradient(135deg, #f472b6 0%, #ec4899 100%)',
                  boxShadow: '0 8px 16px rgba(236, 72, 153, 0.3)',
                },
                '&.Mui-disabled': {
                  opacity: 0.7,
                  color: '#fff'
                }
              }}
            >
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </Button>
          </Box>

          <Typography variant="body2" sx={{ mt: 4, color: 'text.secondary' }}>
            Already have an account?{' '}
            <MuiLink component={Link} to="/login" sx={{ color: '#fff', fontWeight: 600, textDecoration: 'none', '&:hover': { color: '#f472b6' } }}>
              Log in
            </MuiLink>
          </Typography>
        </Box>
      </Container>
      
      {/* Success Popup */}
      <Snackbar open={showSuccess} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert severity="success" sx={{ width: '100%', background: '#10b981', color: '#fff', '& .MuiAlert-icon': { color: '#fff' } }}>
          Account created successfully! Redirecting...
        </Alert>
      </Snackbar>
    </Box>
  );
}
