import React, { useState } from 'react';
import { IonPage, IonContent } from '@ionic/react';
import { Box, Container, Typography, TextField, Button, Alert, Link as MuiLink, useTheme } from '@mui/material';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import API_BASE_URL from '../config/api';
import { emailJsReady, sendPasswordChangedEmail } from '../utils/emailjsClient';

export default function ResetPasswordPage() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/resetpassword/${token}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message || 'This reset link is invalid or expired.');
      } else {
        if (data.mail && emailJsReady()) {
          try { await sendPasswordChangedEmail(data.mail); } catch { /* inbox copy is optional */ }
        }
        setSuccess(data.message || 'Password updated. Redirecting to login...');
        setTimeout(() => navigate('/login', { replace: true, state: { passwordReset: true } }), 1600);
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
        <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
          <Container maxWidth="xs">
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
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>Set a new password</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>
                Choose a new password for your Invoice AI account.
              </Typography>
              {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
              {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
              <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField fullWidth label="New password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <TextField fullWidth label="Confirm password" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
                <Button type="submit" variant="contained" disabled={isLoading || !token} sx={{ py: 1.5, background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', fontWeight: 600 }}>
                  {isLoading ? 'Updating...' : 'Update password'}
                </Button>
              </Box>
              <Typography variant="body2" sx={{ mt: 4, color: 'text.secondary' }}>
                <MuiLink component={Link} to="/login" sx={{ color: 'primary.main', fontWeight: 600, textDecoration: 'none' }}>
                  Back to login
                </MuiLink>
              </Typography>
            </Box>
          </Container>
        </Box>
      </IonContent>
    </IonPage>
  );
}
