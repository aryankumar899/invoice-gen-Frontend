import React from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';
import { monthCollect } from '../utils/invoiceMagic';

export default function CollectMeter({ invoices, currency }) {
  const m = monthCollect(invoices);
  const color = m.pct >= 70 ? '#10b981' : m.pct >= 40 ? '#f59e0b' : '#6366f1';
  return (
    <Box sx={{ p: 2, mb: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography sx={{ fontWeight: 800, color: 'text.primary' }}>This-month collect-o-meter</Typography>
        <Typography sx={{ fontWeight: 800, color }}>{m.pct}%</Typography>
      </Box>
      <LinearProgress variant="determinate" value={m.pct} sx={{ height: 8, borderRadius: 4, mb: 1, '& .MuiLinearProgress-bar': { bgcolor: color } }} />
      <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
        {currency}{m.collected.toFixed(0)} in of {currency}{m.billed.toFixed(0)} billed · {m.count} invoices
      </Typography>
    </Box>
  );
}
