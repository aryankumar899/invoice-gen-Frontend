import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { upiQrUrl } from '../utils/invoiceMagic';

export default function UpiPayCard({ upiId, name, amount, invoiceId, currency = '₹' }) {
  if (!upiId) return null;
  const src = upiQrUrl({ upiId, name, amount, invoiceId });
  return (
    <Paper sx={{ p: 2, borderRadius: 3, border: '1px solid', borderColor: 'divider', textAlign: 'center', minWidth: 180 }}>
      <Typography sx={{ fontSize: 11, fontWeight: 800, color: 'primary.main', mb: 1 }}>UPI SNAP PAY</Typography>
      <Box component="img" src={src} alt="UPI QR" sx={{ width: 160, height: 160, display: 'block', mx: 'auto', bgcolor: '#fff', borderRadius: 1 }} />
      <Typography sx={{ fontSize: 12, mt: 1, color: 'text.secondary' }}>{upiId}</Typography>
      <Typography sx={{ fontSize: 13, fontWeight: 700 }}>{currency}{Number(amount || 0).toFixed(2)}</Typography>
    </Paper>
  );
}
