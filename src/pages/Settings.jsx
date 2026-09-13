import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, TextField, Button, Grid, Avatar, Snackbar, Alert, MenuItem } from '@mui/material';
import API_BASE_URL from '../config/api';

export default function Settings() {
  const [profile, setProfile] = useState({
    name: '',
    companyName: '',
    currency: '₹',
    email: '',
    phone: '',
    address: '',
    avatar: '',
    upiId: ''
  });

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const showMessage = (message, severity = 'error') => setSnackbar({ open: true, message, severity });
  const handleCloseSnackbar = () => setSnackbar(prev => ({ ...prev, open: false }));

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.id) {
      setProfile({
        name: user.name || '',
        companyName: user.companyName || '',
        currency: user.currency || '₹',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        avatar: user.avatar || '',
        upiId: user.upiId || ''
      });
    }
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showMessage("Image must be smaller than 2MB", 'warning');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(profile)
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('user', JSON.stringify(data.data));
        showMessage('Settings saved successfully!', 'success');
        setTimeout(() => window.location.reload(), 1500);
      } else {
        showMessage(data.message || 'Failed to save settings');
      }
    } catch (err) {
      console.error(err);
      showMessage('Error connecting to server');
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', mb: 4, fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' } }}>Settings</Typography>

      <Paper sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'center', sm: 'center' }, mb: 4, gap: 3 }}>
          <Avatar src={profile.avatar} sx={{ width: { xs: 64, sm: 80 }, height: { xs: 64, sm: 80 }, background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)', fontSize: '2rem', flexShrink: 0 }}>
            {!profile.avatar && (profile.name ? profile.name.charAt(0).toUpperCase() : 'U')}
          </Avatar>
          <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
            <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 600, fontSize: { xs: '1rem', sm: '1.25rem' } }}>Profile Picture</Typography>
            <Button component="label" variant="outlined" size="small" sx={{ mt: 1, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
              Upload New Image
              <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
            </Button>
          </Box>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Full Name" name="name" value={profile.name} onChange={handleChange} />
          </Grid>
          <Grid item xs={8} sm={4}>
            <TextField fullWidth label="Company Name" name="companyName" value={profile.companyName} onChange={handleChange} />
          </Grid>
          <Grid item xs={4} sm={2}>
             <TextField select fullWidth label="Currency" name="currency" value={profile.currency} onChange={handleChange}>
               <MenuItem value="₹">₹ (INR)</MenuItem>
               <MenuItem value="$">$ (USD)</MenuItem>
               <MenuItem value="€">€ (EUR)</MenuItem>
               <MenuItem value="£">£ (GBP)</MenuItem>
             </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Email" name="email" value={profile.email} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Phone" name="phone" value={profile.phone} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="UPI ID (Snap Pay)" name="upiId" value={profile.upiId} onChange={handleChange} placeholder="name@upi" helperText="Shows a scan-to-pay QR on every invoice." />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth multiline rows={3} label="Address" name="address" value={profile.address} onChange={handleChange} />
          </Grid>
        </Grid>
        <Box sx={{ mt: 4, display: 'flex', justifyContent: { xs: 'stretch', sm: 'flex-end' } }}>
          <Button fullWidth={false} variant="contained" onClick={handleSave} sx={{ background: '#6366f1', '&:hover': { background: '#4f46e5' }, px: 4, width: { xs: '100%', sm: 'auto' } }}>
            Save Changes
          </Button>
        </Box>
      </Paper>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%', background: '#1f2937', color: '#fff' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
