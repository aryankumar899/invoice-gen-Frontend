import React from 'react';
import { Box, Paper, Typography, Button, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getMoneyWeather } from '../utils/invoiceMagic';

export default function InvoiceWeather({ invoices, currency }) {
  const navigate = useNavigate();
  const w = getMoneyWeather(invoices);

  return (
    <Paper sx={{
      p: { xs: 2.5, md: 3 },
      borderRadius: 3,
      mb: 3,
      border: '1px solid',
      borderColor: 'divider',
      background: `linear-gradient(135deg, ${w.tone}18 0%, transparent 55%)`,
    }}>
      <Typography sx={{ fontSize: 12, fontWeight: 700, color: w.tone, mb: 0.5 }}>MONEY WEATHER</Typography>
      <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', mb: 0.75 }}>{w.mood}</Typography>
      <Typography sx={{ color: 'text.secondary', mb: 2, maxWidth: 560 }}>{w.blurb}</Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: w.hottest ? 2 : 0 }}>
        <Chip size="small" label={`${w.overdue.length} overdue · ${currency}${w.overdueAmt.toFixed(0)}`} />
        <Chip size="small" label={`${w.dueSoon.length} due in 7 days · ${currency}${w.soonAmt.toFixed(0)}`} />
      </Box>
      {w.hottest && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1.5 }}>
          <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
            Loudest bill: <b>{w.hottest.invoiceId}</b> · {w.hottest.clientName} · {currency}{Number(w.hottest.totalAmount || 0).toFixed(2)}
          </Typography>
          <Button size="small" variant="outlined" onClick={() => navigate(`/dashboard/invoice/${w.hottest._id}`)}>
            Open it
          </Button>
        </Box>
      )}
    </Paper>
  );
}
