import React, { useState } from 'react';
import { IonPage, IonContent } from '@ionic/react';
import { Box, Container, Typography, TextField, Button, Alert, Link as MuiLink, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import API_BASE_URL from '../config/api';
import { emailJsReady, sendResetLinkEmail } from '../utils/emailjsClient';

export default function ForgotPasswordPage() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [devResetLink, setDevResetLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setDevResetLink('');
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message || 'Could not send the reset email.');
      } else {
        if (data.mail && emailJsReady()) {
          try {
            await sendResetLinkEmail(data.mail);
            setSuccess('Reset link sent to your email. Check your inbox.');
          } catch (mailErr) {
            const detail = mailErr?.text || mailErr?.message || 'EmailJS could not send.';
            setError(`Email did not send: ${detail}`);
            if (data.devResetLink) setDevResetLink(data.devResetLink);
          }
        } else {
          setSuccess(data.message || 'If that email is registered, a reset link has been sent.');
          if (data.devResetLink) setDevResetLink(data.devResetLink);
        }
      }
    } catch {
      setError('Cannot connect to the server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <IonPage>
      <IonContent style={{ '--background': theme.palette.background.default }}>
        <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', p: 2 }}>
          <Container maxWidth="xs" sx={{ position: 'relative', zIndex: 1 }}>
            <Box sx={{ position: 'absolute', top: -60, left: 0 }}>
              <Button component={Link} to="/login" startIcon={<ArrowBackIcon />} sx={{ color: 'text.secondary' }}>
                Back to login
              </Button>
            </Box>
            <Box sx={{
              background: isDark ? 'rgba(17, 24, 39, 0.7)' : '#ffffff',
              backdropFilter: 'blur(20px)',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.08)',
              borderRadius: 4,
              p: { xs: 4, md: 5 },
              textAlign: 'center',
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                <Box sx={{ width: 48, height: 48, borderRadius: 2, background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ReceiptLongIcon sx={{ color: '#fff', fontSize: 28 }} />
                </Box>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>Forgot password</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>
                Enter your account email. We will send a 30-minute reset link through EmailJS.
              </Typography>
              {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
              {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
              {devResetLink && (
                <Alert severity="info" sx={{ mb: 3, textAlign: 'left' }}>
                  Development reset link:{' '}
                  <MuiLink component={Link} to={devResetLink.replace(window.location.origin, '')} sx={{ fontWeight: 700 }}>
                    Open reset page
                  </MuiLink>
                </Alert>
              )}
              <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  fullWidth
                  label="Email address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button type="submit" variant="contained" disabled={isLoading} sx={{ py: 1.5, background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', fontWeight: 600 }}>
                  {isLoading ? 'Sending link...' : 'Send reset link'}
                </Button>
              </Box>
              <Typography variant="body2" sx={{ mt: 4, color: 'text.secondary' }}>
                Remembered it?{' '}
                <MuiLink component={Link} to="/login" sx={{ color: 'primary.main', fontWeight: 600, textDecoration: 'none' }}>
                  Log in
                </MuiLink>
              </Typography>
            </Box>
          </Container>
        </Box>
      </IonContent>
    </IonPage>
  );
}
