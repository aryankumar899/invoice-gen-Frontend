import React, { useEffect, useMemo, useState } from 'react';
import { Dialog, TextField, List, ListItemButton, ListItemText, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ACTIONS = [
  { label: 'Go home', hint: 'Dashboard pulse', path: '/dashboard' },
  { label: 'Create invoice', hint: 'New bill', path: '/dashboard/create' },
  { label: 'My invoices', hint: 'All bills', path: '/dashboard/invoices' },
  { label: 'Clients', hint: 'People book', path: '/dashboard/clients' },
  { label: 'Settings / UPI', hint: 'Snap Pay ID', path: '/dashboard/settings' },
];

export default function CommandPalette() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');

  useEffect(() => {
    const openIt = () => { setOpen(true); setQ(''); };
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openIt();
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('open-command-palette', openIt);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('open-command-palette', openIt);
    };
  }, []);

  const hits = useMemo(
    () => ACTIONS.filter((a) => `${a.label} ${a.hint}`.toLowerCase().includes(q.toLowerCase())),
    [q]
  );

  return (
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: 3 } }}>
      <Box sx={{ p: 2 }}>
        <Typography sx={{ fontSize: 12, fontWeight: 700, color: 'text.secondary', mb: 1 }}>QUICK JUMP · Ctrl+K</Typography>
        <TextField
          autoFocus
          fullWidth
          size="small"
          placeholder="Jump somewhere..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <List sx={{ mt: 1 }}>
          {hits.map((a) => (
            <ListItemButton key={a.path} onClick={() => { setOpen(false); navigate(a.path); }} sx={{ borderRadius: 2 }}>
              <ListItemText primary={a.label} secondary={a.hint} />
            </ListItemButton>
          ))}
          {hits.length === 0 && <Typography sx={{ p: 2, color: 'text.secondary' }}>Nothing matches.</Typography>}
        </List>
      </Box>
    </Dialog>
  );
}
