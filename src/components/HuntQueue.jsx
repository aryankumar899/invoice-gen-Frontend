import React from 'react';
import { Box, Paper, Typography, Button, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { huntQueue, nudgeText, whatsappUrl } from '../utils/invoiceMagic';

export default function HuntQueue({ invoices, currency }) {
  const navigate = useNavigate();
  const queue = huntQueue(invoices);
  if (!queue.length) return null;

  return (
    <Paper sx={{ p: { xs: 2, md: 2.5 }, borderRadius: 3, mb: 3, border: '1px solid', borderColor: 'divider' }}>
      <Typography sx={{ fontSize: 12, fontWeight: 800, color: 'text.secondary', mb: 1.5 }}>
        HUNT QUEUE · loudest unpaid first
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
        {queue.map((inv, i) => (
          <Box key={inv._id} sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1, justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, minWidth: 0 }}>
              <Chip size="small" label={`#${i + 1}`} />
              <Box>
                <Typography sx={{ fontWeight: 700, color: 'text.primary', fontSize: 14 }}>
                  {inv.invoiceId} · {inv.clientName}
                </Typography>
                <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
                  {currency}{Number(inv.totalAmount || 0).toFixed(2)}
                  {inv.daysLate ? ` · ${inv.daysLate}d late` : ' · still open'}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button size="small" onClick={() => navigate(`/dashboard/invoice/${inv._id}`)}>Open</Button>
              <Button
                size="small"
                color="success"
                variant="outlined"
                onClick={() => window.open(whatsappUrl('', nudgeText(inv, currency)), '_blank')}
              >
                Nudge
              </Button>
            </Box>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}
