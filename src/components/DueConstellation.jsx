import React from 'react';
import { Box, Paper, Typography, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { dueConstellation } from '../utils/invoiceMagic';

export default function DueConstellation({ invoices, currency }) {
  const navigate = useNavigate();
  const days = dueConstellation(invoices, 14);
  const lit = days.filter((d) => d.items.length > 0).length;

  return (
    <Paper sx={{ p: { xs: 2, md: 2.5 }, borderRadius: 3, mb: 3, border: '1px solid', borderColor: 'divider' }}>
      <Typography sx={{ fontSize: 12, fontWeight: 800, color: 'text.secondary', mb: 1.5 }}>
        DUE CONSTELLATION · {lit} lit days
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1 }}>
        {days.map((d) => {
          const heat = d.items.length;
          const amt = d.items.reduce((s, i) => s + (i.totalAmount || 0), 0);
          return (
            <Tooltip
              key={d.key}
              title={heat ? `${heat} due · ${currency}${amt.toFixed(0)}` : 'Clear sky'}
            >
              <Box
                onClick={() => heat && navigate('/dashboard/invoices')}
                sx={{
                  p: 1,
                  borderRadius: 2,
                  textAlign: 'center',
                  cursor: heat ? 'pointer' : 'default',
                  border: '1px solid',
                  borderColor: heat ? 'primary.main' : 'divider',
                  bgcolor: heat ? 'action.selected' : 'transparent',
                }}
              >
                <Typography sx={{ fontSize: 10, color: 'text.secondary', fontWeight: 700 }}>{d.dow}</Typography>
                <Typography sx={{ fontWeight: 800, fontSize: 15, color: 'text.primary' }}>{d.day}</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.4, mt: 0.4, minHeight: 8 }}>
                  {d.items.slice(0, 3).map((inv) => (
                    <Box key={inv._id} sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'primary.main' }} />
                  ))}
                </Box>
              </Box>
            </Tooltip>
          );
        })}
      </Box>
    </Paper>
  );
}
