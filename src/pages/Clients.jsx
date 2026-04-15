import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, TextField, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Snackbar, Alert } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '' });
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const showMessage = (message, severity = 'error') => setSnackbar({ open: true, message, severity });
  const handleCloseSnackbar = () => setSnackbar(prev => ({ ...prev, open: false }));

  const confirmDelete = (id) => setDeleteId(id);
  const handleCancelDelete = () => setDeleteId(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/clients', {
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
    
    try {
      const url = editingId ? `http://localhost:5000/api/clients/${editingId}` : 'http://localhost:5000/api/clients';
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
    }
  };

  const executeDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`http://localhost:5000/api/clients/${deleteId}`, {
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#fff' }}>Clients</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen} sx={{ background: '#6366f1', '&:hover': { background: '#4f46e5' } }}>
          Add Client
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ background: 'rgba(17, 24, 39, 0.7)', backdropFilter: 'blur(20px)', borderRadius: 4, border: '1px solid rgba(255,255,255,0.05)' }}>
        <Table>
          <TableHead sx={{ background: 'rgba(0,0,0,0.2)' }}>
            <TableRow>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Name</TableCell>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Email</TableCell>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Phone</TableCell>
              <TableCell align="right" sx={{ color: 'text.secondary', fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell sx={{ color: '#fff' }}>{client.name}</TableCell>
                <TableCell sx={{ color: '#fff' }}>{client.email}</TableCell>
                <TableCell sx={{ color: '#fff' }}>{client.phone}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleEdit(client)} sx={{ color: '#818cf8', mr: 1 }}><EditIcon /></IconButton>
                  <IconButton onClick={() => confirmDelete(client._id)} sx={{ color: '#ef4444' }}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
            {clients.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ color: 'text.secondary', py: 4 }}>No clients found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} PaperProps={{ sx: { background: '#111827', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' } }}>
        <DialogTitle>{editingId ? 'Edit Client' : 'Add Client'}</DialogTitle>
        <DialogContent sx={{ minWidth: 400 }}>
          <TextField autoFocus margin="dense" label="Name" fullWidth value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} sx={{ input: { color: '#fff' }, label: { color: 'text.secondary' }, '.MuiOutlinedInput-root': { fieldset: { borderColor: 'rgba(255,255,255,0.2)' } } }} />
          <TextField margin="dense" label="Email" fullWidth value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} sx={{ input: { color: '#fff' }, label: { color: 'text.secondary' }, '.MuiOutlinedInput-root': { fieldset: { borderColor: 'rgba(255,255,255,0.2)' } } }} />
          <TextField margin="dense" label="Phone" fullWidth value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} sx={{ input: { color: '#fff' }, label: { color: 'text.secondary' }, '.MuiOutlinedInput-root': { fieldset: { borderColor: 'rgba(255,255,255,0.2)' } } }} />
          <TextField margin="dense" label="Address" fullWidth multiline rows={3} value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} sx={{ textarea: { color: '#fff' }, label: { color: 'text.secondary' }, '.MuiOutlinedInput-root': { fieldset: { borderColor: 'rgba(255,255,255,0.2)' } } }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} sx={{ color: 'text.secondary' }}>Cancel</Button>
          <Button onClick={handleSave} sx={{ color: '#6366f1' }}>Save</Button>
        </DialogActions>
      </Dialog>
      
      <Dialog open={!!deleteId} onClose={handleCancelDelete} PaperProps={{ sx: { background: '#111827', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' } }}>
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
