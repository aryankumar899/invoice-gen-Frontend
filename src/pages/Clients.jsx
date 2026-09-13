import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, TextField, Button, IconButton, Dialog, DialogTitle,
  DialogContent, DialogContentText, DialogActions, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Snackbar, Alert, Chip, Avatar, InputAdornment,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import AiInvoiceDropzone from '../components/AiInvoiceDropzone';
import { clientAura } from '../utils/invoiceMagic';
import API_BASE_URL from '../config/api';

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '' });
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const showMessage = (message, severity = 'error') => setSnackbar({ open: true, message, severity });
  const handleCloseSnackbar = () => setSnackbar(prev => ({ ...prev, open: false }));

  const confirmDelete = (id) => setDeleteId(id);
  const handleCancelDelete = () => setDeleteId(null);

  useEffect(() => {
    fetchClients();
    (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/invoices`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (res.ok) setInvoices(await res.json());
      } catch { /* ignore */ }
    })();
  }, []);

  const fetchClients = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/clients`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      setClients(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpen = () => {
    setFormData({ name: '', email: '', phone: '', address: '' });
    setEditingId(null);
    setOpen(true);
  };

  const handleEdit = (client) => {
    setFormData({ name: client.name, email: client.email, phone: client.phone, address: client.address });
    setEditingId(client._id);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSave = async () => {
    if (!formData.name) {
      showMessage("Client name is required.");
      return;
    }
    if (formData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        showMessage("Please provide a valid email format.");
        return;
      }
    }

    setSaving(true);
    try {
      const url = editingId ? `${API_BASE_URL}/api/clients/${editingId}` : `${API_BASE_URL}/api/clients`;
      const method = editingId ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        fetchClients();
        handleClose();
        showMessage('Client saved successfully!', 'success');
      } else {
        const data = await res.json();
        showMessage(data.message || 'Error saving client.');
      }
    } catch (err) {
      console.error(err);
      showMessage('Error connecting to server.');
    } finally {
      setSaving(false);
    }
  };

  const executeDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/clients/${deleteId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        fetchClients();
        showMessage('Client deleted', 'success');
      }
    } catch (err) {
      console.error(err);
      showMessage('Failed to delete client');
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2, mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', fontSize: { xs: '1.5rem', sm: '2rem' } }}>Clients</Typography>
          <Typography sx={{ color: 'text.secondary', mt: 0.5 }}>People you bill. Add one by hand or let AI read a card.</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen} sx={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', whiteSpace: 'nowrap', px: 2.5, py: 1.1, borderRadius: 2, fontWeight: 700 }}>
          Add Client
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ bgcolor: 'background.paper', borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
        <Table sx={{ minWidth: { xs: '90vw', sm: '400px' } }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 600, px: { xs: 1.5, md: 2 }, fontSize: { xs: '0.78rem', md: '0.875rem' } }}>Name</TableCell>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 600, px: { xs: 1.5, md: 2 }, fontSize: { xs: '0.78rem', md: '0.875rem' }, display: { xs: 'none', sm: 'table-cell' } }}>Pay aura</TableCell>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 600, px: { xs: 1.5, md: 2 }, fontSize: { xs: '0.78rem', md: '0.875rem' }, display: { xs: 'none', sm: 'table-cell' } }}>Email</TableCell>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 600, px: { xs: 1.5, md: 2 }, fontSize: { xs: '0.78rem', md: '0.875rem' }, display: { xs: 'none', md: 'table-cell' } }}>Phone</TableCell>
              <TableCell align="right" sx={{ color: 'text.secondary', fontWeight: 600, px: { xs: 1, md: 2 }, fontSize: { xs: '0.78rem', md: '0.875rem' } }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell sx={{ color: 'text.primary', px: { xs: 1.5, md: 2 }, fontSize: { xs: '0.8rem', md: '0.875rem' } }}>{client.name}</TableCell>
                <TableCell sx={{ px: { xs: 1.5, md: 2 }, display: { xs: 'none', sm: 'table-cell' } }}>
                  {(() => {
                    const aura = clientAura(invoices, client.name);
                    return <Chip size="small" label={`${aura.label} · ${aura.hint}`} sx={{ fontWeight: 700, color: aura.color, borderColor: aura.color }} variant="outlined" />;
                  })()}
                </TableCell>
                <TableCell sx={{ color: 'text.secondary', px: { xs: 1.5, md: 2 }, fontSize: { xs: '0.8rem', md: '0.875rem' }, display: { xs: 'none', sm: 'table-cell' } }}>{client.email}</TableCell>
                <TableCell sx={{ color: 'text.secondary', px: { xs: 1.5, md: 2 }, fontSize: { xs: '0.8rem', md: '0.875rem' }, display: { xs: 'none', md: 'table-cell' } }}>{client.phone}</TableCell>
                <TableCell align="right" sx={{ px: { xs: 0.5, md: 2 }, whiteSpace: 'nowrap' }}>
                  <IconButton size="small" onClick={() => handleEdit(client)} sx={{ color: '#818cf8' }}><EditIcon fontSize="small" /></IconButton>
                  <IconButton size="small" onClick={() => confirmDelete(client._id)} sx={{ color: '#ef4444' }}><DeleteIcon fontSize="small" /></IconButton>
                </TableCell>
              </TableRow>
            ))}
            {clients.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ color: 'text.secondary', py: 4 }}>No clients found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            bgcolor: 'background.paper',
            color: 'text.primary',
            borderRadius: 4,
            border: '1px solid',
            borderColor: 'divider',
            overflow: 'hidden',
          },
        }}
      >
        <Box sx={{ px: { xs: 2.5, sm: 3.5 }, py: 2.5, background: 'linear-gradient(135deg, rgba(99,102,241,0.16), rgba(236,72,153,0.1))' }}>
          <Typography sx={{ fontWeight: 800, fontSize: { xs: 22, sm: 26 }, color: 'text.primary' }}>
            {editingId ? 'Edit client' : 'Add a new client'}
          </Typography>
          <Typography sx={{ color: 'text.secondary', mt: 0.5 }}>
            Drop a card or invoice, or type the details. Preview updates as you go.
          </Typography>
        </Box>

        <DialogContent sx={{ px: { xs: 2.5, sm: 3.5 }, py: 3 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.15fr 0.85fr' }, gap: 3 }}>
            <Box>
              <Box sx={{ mb: 2.5, p: 1.5, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'action.hover' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.25 }}>
                  <AutoAwesomeIcon sx={{ color: 'primary.main', fontSize: 18 }} />
                  <Typography sx={{ fontWeight: 800, fontSize: 13, letterSpacing: 0.6, color: 'text.secondary' }}>AI FILL</Typography>
                </Box>
                <AiInvoiceDropzone
                  mode="client"
                  compact
                  onError={showMessage}
                  onExtracted={(data) => {
                    setFormData((prev) => ({
                      name: data.name || prev.name,
                      email: data.email || prev.email,
                      phone: data.phone || prev.phone,
                      address: data.address || prev.address,
                    }));
                    showMessage('Client details filled from the uploaded file.', 'success');
                  }}
                />
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <TextField
                  autoFocus
                  label="Full name"
                  placeholder="e.g. Aryan Kumar"
                  required
                  fullWidth
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><PersonOutlinedIcon fontSize="small" /></InputAdornment>,
                  }}
                />
                <TextField
                  label="Email"
                  placeholder="client@company.com"
                  type="email"
                  fullWidth
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><EmailOutlinedIcon fontSize="small" /></InputAdornment>,
                  }}
                />
                <TextField
                  label="Phone"
                  placeholder="+91 98765 43210"
                  fullWidth
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><PhoneOutlinedIcon fontSize="small" /></InputAdornment>,
                  }}
                />
                <TextField
                  label="Address"
                  placeholder="Street, city, PIN"
                  fullWidth
                  multiline
                  minRows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><PlaceOutlinedIcon fontSize="small" /></InputAdornment>,
                  }}
                  sx={{ gridColumn: { sm: '1 / -1' } }}
                />
              </Box>
            </Box>

            <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'divider', height: 'fit-content' }}>
              <Typography sx={{ fontSize: 12, fontWeight: 800, color: 'text.secondary', letterSpacing: 0.8, mb: 2 }}>LIVE CARD</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Avatar sx={{ width: 56, height: 56, fontWeight: 800, background: 'linear-gradient(135deg, #6366f1, #ec4899)' }}>
                  {(formData.name || 'C').charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 800, color: 'text.primary' }}>{formData.name || 'New client'}</Typography>
                  <Typography sx={{ color: 'text.secondary', fontSize: 13, wordBreak: 'break-all' }}>{formData.email || 'Email not added yet'}</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>{formData.phone || 'No phone'}</Typography>
                <Typography sx={{ fontSize: 13, color: 'text.secondary', whiteSpace: 'pre-line' }}>{formData.address || 'No address'}</Typography>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mt: 2 }}>
                {['name', 'email', 'phone', 'address'].map((key) => (
                  <Chip
                    key={key}
                    size="small"
                    label={formData[key]?.trim() ? key : `Add ${key}`}
                    color={formData[key]?.trim() ? 'success' : 'default'}
                    variant={formData[key]?.trim() ? 'filled' : 'outlined'}
                  />
                ))}
              </Box>
            </Paper>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: { xs: 2.5, sm: 3.5 }, pb: 3, pt: 0, gap: 1 }}>
          <Button onClick={handleClose} sx={{ color: 'text.secondary', borderRadius: 2 }}>Cancel</Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            variant="contained"
            sx={{ px: 3, borderRadius: 2, fontWeight: 700, background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}
          >
            {saving ? 'Saving...' : editingId ? 'Update client' : 'Save client'}
          </Button>
        </DialogActions>
      </Dialog>
      
      <Dialog open={!!deleteId} onClose={handleCancelDelete} PaperProps={{ sx: { bgcolor: 'background.paper', color: 'text.primary' } }}>
        <DialogTitle>Delete Client</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'text.secondary' }}>
            Are you sure you want to delete this client? This cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} sx={{ color: 'text.secondary' }}>Cancel</Button>
          <Button onClick={executeDelete} sx={{ color: '#ef4444' }}>Delete</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%', background: '#1f2937', color: '#fff' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
