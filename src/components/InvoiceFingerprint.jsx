import React from 'react';
import { Box, Tooltip } from '@mui/material';
import { fingerprintCells } from '../utils/invoiceMagic';

export default function InvoiceFingerprint({ seed, color = '#6366f1' }) {
  const cells = fingerprintCells(seed);
  return (
    <Tooltip title="Invoice fingerprint — unique pattern for this ID">
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(5, 6px)', gap: '2px', width: 38 }}>
        {cells.map((on, i) => (
          <Box key={i} sx={{ width: 6, height: 6, borderRadius: 0.4, bgcolor: on ? color : 'action.hover' }} />
        ))}
      </Box>
    </Tooltip>
  );
}
