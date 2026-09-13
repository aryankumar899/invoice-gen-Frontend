import React from 'react';
import { Box, Typography, LinearProgress, Chip } from '@mui/material';
import { getInvoiceScore } from '../utils/invoiceMagic';

export default function CompletenessCompass(props) {
  const { score, missing } = getInvoiceScore(props);
  const color = score >= 80 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444';
  return (
    <Box sx={{ p: 2, mb: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography sx={{ fontWeight: 800, color: 'text.primary' }}>Completeness compass</Typography>
        <Typography sx={{ fontWeight: 800, color }}>{score} / 100</Typography>
      </Box>
      <LinearProgress variant="determinate" value={score} sx={{ height: 8, borderRadius: 4, mb: 1.5, '& .MuiLinearProgress-bar': { bgcolor: color } }} />
      {missing.length > 0 ? (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
          {missing.map((m) => <Chip key={m} size="small" label={`Add ${m}`} />)}
        </Box>
      ) : (
        <Typography sx={{ fontSize: 13, color: '#059669' }}>Ready to send. This invoice has a clean signal.</Typography>
      )}
    </Box>
  );
}
