import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, IconButton, Chip, Button, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import InvoiceWeather from '../components/InvoiceWeather';
import InvoiceFingerprint from '../components/InvoiceFingerprint';
import DueConstellation from '../components/DueConstellation';
import HuntQueue from '../components/HuntQueue';
import API_BASE_URL from '../config/api';

export default function DashboardHome() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [invoices, setInvoices] = useState([]);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const currency = user.currency || '₹';

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/invoices`, {
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
  const cardSx = {
    p: 3,
    borderRadius: 3,
    bgcolor: 'background.paper',
    border: '1px solid',
    borderColor: 'divider',
    boxShadow: isDark ? 'none' : '0 1px 3px rgba(15, 23, 42, 0.06)',
    position: 'relative',
    overflow: 'hidden',
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2, mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5, fontSize: { xs: '1.5rem', sm: '1.85rem' } }}>
            Dashboard
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Welcome back{user.name ? `, ${user.name}` : ''}. Here is your financial overview.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/dashboard/create')}
          sx={{ fontWeight: 600, borderRadius: 2, whiteSpace: 'nowrap', px: 3 }}
        >
          Create Invoice
        </Button>
      </Box>

      <InvoiceWeather invoices={invoices} currency={currency} />
      <DueConstellation invoices={invoices} currency={currency} />
      <HuntQueue invoices={invoices} currency={currency} />

      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        {stats.map((stat, i) => (
          <Grid item xs={12} sm={6} lg={3} key={i}>
            <Paper sx={cardSx}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 600 }}>{stat.title}</Typography>
                <Box sx={{ color: stat.color }}>{stat.icon}</Box>
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', mb: 1, fontSize: { xs: '1.3rem', md: '1.5rem' } }}>
                {stat.value}
              </Typography>
              <Typography variant="caption" sx={{ color: stat.color, fontWeight: 600, background: `${stat.color}15`, px: 1, py: 0.5, borderRadius: 1 }}>
                {stat.change}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ ...cardSx, p: 0 }}>
        <Box sx={{ p: { xs: 2, md: 3 }, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', fontSize: { xs: '1rem', md: '1.15rem' } }}>
            Recent Invoices
          </Typography>
          <Button variant="text" onClick={() => navigate('/dashboard/invoices')} sx={{ fontWeight: 600 }}>
            View All
          </Button>
        </Box>

        <Box sx={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <Box sx={{ display: 'table', width: '100%', minWidth: 560 }}>
            <Box sx={{ display: 'table-header-group', bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)' }}>
              <Box sx={{ display: 'table-row' }}>
                {['Invoice ID', 'Client', 'Date', 'Amount', 'Status', 'Actions'].map((head) => (
                  <Box key={head} sx={{ display: 'table-cell', p: { xs: 1.5, md: 2 }, color: 'text.secondary', fontWeight: 600, fontSize: 13, whiteSpace: 'nowrap' }}>{head}</Box>
                ))}
              </Box>
            </Box>
            <Box sx={{ display: 'table-row-group' }}>
              {recentInvoices.map((inv, index) => (
                <Box
                  key={inv._id}
                  sx={{
                    display: 'table-row',
                    borderBottom: index !== recentInvoices.length - 1 ? '1px solid' : 'none',
                    borderColor: 'divider',
                    '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' },
                  }}
                >
                  <Box sx={{ display: 'table-cell', p: { xs: 1.5, md: 2 }, whiteSpace: 'nowrap' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <InvoiceFingerprint seed={inv.invoiceId} />
                      <Box sx={{ color: 'primary.main', fontWeight: 700, cursor: 'pointer', fontSize: 14 }} onClick={() => navigate(`/dashboard/invoice/${inv._id}`)}>
                        {inv.invoiceId}
                      </Box>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'table-cell', p: { xs: 1.5, md: 2 }, color: 'text.primary', fontSize: 14, whiteSpace: 'nowrap' }}>{inv.clientName}</Box>
                  <Box sx={{ display: 'table-cell', p: { xs: 1.5, md: 2 }, color: 'text.secondary', fontSize: 14, whiteSpace: 'nowrap' }}>{new Date(inv.date).toLocaleDateString()}</Box>
                  <Box sx={{ display: 'table-cell', p: { xs: 1.5, md: 2 }, color: 'text.primary', fontWeight: 600, fontSize: 14, whiteSpace: 'nowrap' }}>{currency}{inv.totalAmount?.toFixed(2)}</Box>
                  <Box sx={{ display: 'table-cell', p: { xs: 1.5, md: 2 } }}>
                    <Chip
                      label={inv.status}
                      size="small"
                      sx={{
                        fontWeight: 600,
                        background: inv.status === 'Paid' ? 'rgba(16, 185, 129, 0.12)' : inv.status === 'Pending' ? 'rgba(245, 158, 11, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                        color: inv.status === 'Paid' ? '#059669' : inv.status === 'Pending' ? '#d97706' : '#dc2626',
                        borderRadius: 1,
                      }}
                    />
                  </Box>
                  <Box sx={{ display: 'table-cell', p: { xs: 1.5, md: 2 }, whiteSpace: 'nowrap' }}>
                    <IconButton size="small" onClick={() => navigate(`/dashboard/create?edit=${inv._id}`)} sx={{ color: 'text.secondary' }} title="Edit">
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              ))}
              {recentInvoices.length === 0 && (
                <Box sx={{ display: 'table-row' }}>
                  <Box sx={{ display: 'table-cell', p: 4, color: 'text.secondary', textAlign: 'center' }} colSpan={6}>
                    No invoices yet.
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
