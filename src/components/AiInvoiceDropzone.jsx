import React, { useRef, useState } from 'react';
import { Box, Typography, CircularProgress, useTheme } from '@mui/material';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import API_BASE_URL from '../config/api';

const ACCEPT = 'image/jpeg,image/png,image/webp,image/gif,application/pdf';

export default function AiInvoiceDropzone({ mode = 'invoice', onExtracted, onError, compact = false }) {
  const theme = useTheme();
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState('');

  const upload = async (file) => {
    if (!file) return;
    setFileName(file.name);
    setLoading(true);
    try {
      const body = new FormData();
      body.append('file', file);
      body.append('mode', mode);
      const res = await fetch(`${API_BASE_URL}/api/ai/extract`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        body,
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Could not extract data from this file.');
      }
      onExtracted?.(data.data);
    } catch (err) {
      onError?.(err.message || 'AI extraction failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleFiles = (files) => {
    const file = files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      onError?.('File is too large. Max size is 8MB.');
      return;
    }
    upload(file);
  };

  return (
    <Box
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
      onClick={() => !loading && inputRef.current?.click()}
      sx={{
        cursor: loading ? 'wait' : 'pointer',
        border: '2px dashed',
        borderColor: dragOver ? 'primary.main' : 'divider',
        bgcolor: dragOver ? 'action.hover' : 'background.paper',
        borderRadius: 3,
        p: compact ? 2 : 3,
        textAlign: 'center',
        transition: 'all 0.2s ease',
        '&:hover': { borderColor: 'primary.main', bgcolor: 'action.hover' },
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        hidden
        onChange={(e) => { handleFiles(e.target.files); e.target.value = ''; }}
      />
      {loading ? (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5 }}>
          <CircularProgress size={22} />
          <Typography sx={{ color: 'text.secondary', fontWeight: 600 }}>
            AI is reading {fileName || 'your file'}...
          </Typography>
        </Box>
      ) : (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mb: 0.75 }}>
            <AutoAwesomeIcon sx={{ color: 'primary.main', fontSize: 22 }} />
            <CloudUploadOutlinedIcon sx={{ color: theme.palette.text.secondary, fontSize: 22 }} />
          </Box>
          <Typography sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5 }}>
            {mode === 'client' ? 'Scan invoice to add client' : 'AI scan invoice'}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Drag and drop a photo or PDF here, or click to upload. AI will fill the form.
          </Typography>
        </>
      )}
    </Box>
  );
}
