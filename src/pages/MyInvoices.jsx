import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, IconButton, Button, TextField, MenuItem, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TablePagination } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';

export default function MyInvoices() {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [deleteId, setDeleteId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const currency = user.currency || '₹';

  const confirmDelete = (id) => setDeleteId(id);
  const handleCancelDelete = () => setDeleteId(null);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const res = await fetch('https://invoice-generator-vfec.onrender.com/api/invoices', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      setInvoices(data);
    } catch (err) {
      console.error(err);
    }
  };

  const executeDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`https://invoice-generator-vfec.onrender.com/api/invoices/${deleteId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) fetchInvoices();
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteId(null);
    }
  };

  const handleMarkPaid = async (id) => {
    try {
      const res = await fetch(`https://invoice-generator-vfec.onrender.com/api/invoices/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: 'Paid' })
      });
      if (res.ok) fetchInvoices();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = inv.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          inv.invoiceId.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesStatus = true;
    if (statusFilter === 'Paid') {
      matchesStatus = inv.status === 'Paid';
    } else if (statusFilter === 'Pending') {
      matchesStatus = inv.status === 'Pending';
    } else if (statusFilter === 'Unpaid') {
      matchesStatus = inv.status !== 'Paid'; // Covers Pending and Overdue
    }

    return matchesSearch && matchesStatus;
  });

  const paginatedInvoices = filteredInvoices.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
      <Typography variant="h4" sx={{ fontWeight: 800, color: '#fff', mb: 4 }}>My Invoices</Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <TextField
          placeholder="Search client or invoice ID..."
          size="small"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: { xs: 200, sm: 300 }, '& .MuiInputBase-input': { color: '#fff' }, fieldset: { borderColor: 'rgba(255,255,255,0.2)' } }}
        />
        
        <TextField
          select
          size="small"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          sx={{ width: 150, '& .MuiInputBase-input': { color: '#fff' }, fieldset: { borderColor: 'rgba(255,255,255,0.2)' }, '& .MuiSvgIcon-root': { color: '#fff' } }}
        >
          <MenuItem value="All">All Statuses</MenuItem>
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="Unpaid">Unpaid</MenuItem>
          <MenuItem value="Paid">Paid</MenuItem>
        </TextField>
      </Box>

      <TableContainer component={Paper} sx={{ background: 'rgba(17, 24, 39, 0.7)', backdropFilter: 'blur(20px)', borderRadius: 4, border: '1px solid rgba(255,255,255,0.05)' }}>
        <Table>
          <TableHead sx={{ background: 'rgba(0,0,0,0.2)' }}>
            <TableRow>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Invoice ID</TableCell>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Client Name</TableCell>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Date</TableCell>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Amount</TableCell>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Status</TableCell>
              <TableCell align="right" sx={{ color: 'text.secondary', fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedInvoices.map((inv) => (
              <TableRow key={inv._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell sx={{ color: '#6366f1', fontWeight: 700, cursor: 'pointer', '&:hover': { color: '#818cf8', textDecoration: 'underline' } }}
                  onClick={() => navigate(`/dashboard/invoice/${inv._id}`)}
                >{inv.invoiceId}</TableCell>
                <TableCell sx={{ color: '#fff' }}>{inv.clientName}</TableCell>
                <TableCell sx={{ color: '#fff' }}>{new Date(inv.date).toLocaleDateString()}</TableCell>
                <TableCell sx={{ color: '#6366f1', fontWeight: 600 }}>{currency}{inv.totalAmount?.toFixed(2) || '0.00'}</TableCell>
                <TableCell>
                  <Chip 
                    label={inv.status} 
                    size="small"
                    sx={{ 
                      fontWeight: 600,
                      background: inv.status === 'Paid' ? 'rgba(16, 185, 129, 0.1)' : inv.status === 'Pending' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      color: inv.status === 'Paid' ? '#10b981' : inv.status === 'Pending' ? '#f59e0b' : '#ef4444',
                      borderRadius: 1
                    }} 
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => navigate(`/dashboard/create?edit=${inv._id}`)} sx={{ color: '#3b82f6', mr: 1 }} title="Edit">
                    <EditIcon />
                  </IconButton>
                  {inv.status !== 'Paid' && (
                    <IconButton onClick={() => handleMarkPaid(inv._id)} sx={{ color: '#10b981', mr: 1 }} title="Mark as Paid">
                      <CheckCircleIcon />
                    </IconButton>
                  )}
                  <IconButton onClick={() => confirmDelete(inv._id)} sx={{ color: '#ef4444' }} title="Delete">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {filteredInvoices.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ color: 'text.secondary', py: 4 }}>No invoices found matching your criteria.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredInvoices.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            color: 'text.secondary',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            '.MuiTablePagination-selectIcon': { color: '#fff' }
          }}
        />
      </TableContainer>

      <Dialog open={!!deleteId} onClose={handleCancelDelete} PaperProps={{ sx: { background: '#111827', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' } }}>
        <DialogTitle>Delete Invoice</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'text.secondary' }}>
            Are you sure you want to delete this invoice? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} sx={{ color: 'text.secondary' }}>Cancel</Button>
          <Button onClick={executeDelete} sx={{ color: '#ef4444' }}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
