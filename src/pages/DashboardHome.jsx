import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, IconButton, Chip, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
export default function DashboardHome() {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const currency = user.currency || '₹';

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

  const totalRevenue = invoices.filter(i => i.status === 'Paid').reduce((sum, i) => sum + (i.totalAmount || 0), 0);
  const paidCount = invoices.filter(i => i.status === 'Paid').length;
  const pendingAmount = invoices.filter(i => i.status === 'Pending' || i.status === 'Overdue').reduce((sum, i) => sum + (i.totalAmount || 0), 0);
  const pendingCount = invoices.filter(i => i.status === 'Pending' || i.status === 'Overdue').length;

  const stats = [
    { title: 'Total Revenue', value: `${currency}${totalRevenue.toFixed(2)}`, change: '+0.0%', icon: <AccountBalanceWalletIcon />, color: '#6366f1' },
    { title: 'Invoices Paid', value: paidCount.toString(), change: '+0%', icon: <CheckCircleIcon />, color: '#10b981' },
    { title: 'Pending Amount', value: `${currency}${pendingAmount.toFixed(2)}`, change: `${pendingCount} Pending`, icon: <AccessTimeIcon />, color: '#f59e0b' },
    { title: 'Growth rate', value: '+15.3%', change: 'vs last month', icon: <TrendingUpIcon />, color: '#ec4899' },
  ];

  const recentInvoices = invoices.slice(0, 10);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#fff', mb: 0.5 }}>Dashboard</Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>Welcome back, here is your financial overview.</Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={() => navigate('/dashboard/create')}
          sx={{ 
            background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)', 
            py: 1.5, px: 3, 
            fontWeight: 600, 
            borderRadius: 2,
            boxShadow: '0 8px 20px rgba(99,102,241,0.3)',
            '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 12px 25px rgba(99,102,241,0.4)' }
          }}
        >
          Create Invoice
        </Button>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        {stats.map((stat, i) => (
          <Grid item xs={12} sm={6} lg={3} key={i}>
            <Paper sx={{ 
              p: 3, 
              borderRadius: 4, 
              background: 'rgba(17, 24, 39, 0.6)', 
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.05)',
              position: 'relative',
              overflow: 'hidden',
              transition: 'transform 0.3s ease',
              '&:hover': { transform: 'translateY(-5px)', border: `1px solid ${stat.color}80` }
            }}>
              <Box sx={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, background: `radial-gradient(circle, ${stat.color}30 0%, transparent 70%)`, borderRadius: '50%' }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 600 }}>{stat.title}</Typography>
                <Box sx={{ color: stat.color }}>{stat.icon}</Box>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#fff', mb: 1, letterSpacing: '-1px' }}>{stat.value}</Typography>
              <Typography variant="caption" sx={{ color: stat.color, fontWeight: 600, background: `${stat.color}15`, px: 1, py: 0.5, borderRadius: 1 }}>{stat.change}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Recent Invoices Table */}
      <Paper sx={{ 
        p: 0, 
        borderRadius: 4, 
        background: 'rgba(17, 24, 39, 0.6)', 
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.05)',
        overflow: 'hidden'
      }}>
        <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#fff' }}>Recent Invoices</Typography>
          <Button variant="text" onClick={() => navigate('/dashboard/invoices')} sx={{ color: '#818cf8', fontWeight: 600 }}>View All</Button>
        </Box>
        
        <Box sx={{ width: '100%', overflowX: 'auto' }}>
          <Box sx={{ display: 'table', width: '100%', minWidth: 600 }}>
            <Box sx={{ display: 'table-header-group', background: 'rgba(0,0,0,0.2)' }}>
              <Box sx={{ display: 'table-row' }}>
                {['Invoice ID', 'Client', 'Date', 'Amount', 'Status', 'Actions'].map((head) => (
                  <Box key={head} sx={{ display: 'table-cell', p: 2, color: 'text.secondary', fontWeight: 600, fontSize: '0.85rem' }}>{head}</Box>
                ))}
              </Box>
            </Box>
            <Box sx={{ display: 'table-row-group' }}>
              {recentInvoices.map((inv, index) => (
                <Box key={inv._id} sx={{ display: 'table-row', borderBottom: index !== recentInvoices.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none', '&:hover': { background: 'rgba(255,255,255,0.02)' } }}>
                  <Box sx={{ display: 'table-cell', p: 2, color: '#6366f1', fontWeight: 700, cursor: 'pointer', '&:hover': { color: '#818cf8', textDecoration: 'underline' } }} onClick={() => navigate(`/dashboard/invoice/${inv._id}`)}>{inv.invoiceId}</Box>
                  <Box sx={{ display: 'table-cell', p: 2, color: 'text.secondary' }}>{inv.clientName}</Box>
                  <Box sx={{ display: 'table-cell', p: 2, color: 'text.secondary' }}>{new Date(inv.date).toLocaleDateString()}</Box>
                  <Box sx={{ display: 'table-cell', p: 2, color: '#fff', fontWeight: 600 }}>{currency}{inv.totalAmount?.toFixed(2)}</Box>
                  <Box sx={{ display: 'table-cell', p: 2 }}>
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
                  </Box>
                  <Box sx={{ display: 'table-cell', p: 2 }}>
                    <IconButton size="small" onClick={() => navigate(`/dashboard/create?edit=${inv._id}`)} sx={{ color: '#3b82f6' }} title="Edit">
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
