import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Box, Typography, Button, Grid, Chip, Paper, IconButton,
  Tooltip, CircularProgress, Snackbar, Alert, Divider
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
import PaletteIcon from '@mui/icons-material/Palette';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// ─── 50 Template Definitions ─────────────────────────────────────────────────
// 10 Layouts × 5 Color Schemes = 50 Templates

const COLOR_SCHEMES = [
  { name: 'Violet',  primary: '#6366f1', secondary: '#ec4899', light: '#eef2ff', dark: '#1e1b4b', text: '#111' },
  { name: 'Azure',   primary: '#2563eb', secondary: '#38bdf8', light: '#eff6ff', dark: '#1e3a5f', text: '#111' },
  { name: 'Emerald', primary: '#059669', secondary: '#10b981', light: '#ecfdf5', dark: '#064e3b', text: '#111' },
  { name: 'Rose',    primary: '#e11d48', secondary: '#fb7185', light: '#fff1f2', dark: '#4c0519', text: '#111' },
  { name: 'Amber',   primary: '#d97706', secondary: '#fbbf24', light: '#fffbeb', dark: '#78350f', text: '#111' },
  { name: 'Teal',    primary: '#0d9488', secondary: '#2dd4bf', light: '#f0fdfa', dark: '#134e4a', text: '#111' },
  { name: 'Indigo',  primary: '#4338ca', secondary: '#818cf8', light: '#eef2ff', dark: '#1e1b4b', text: '#111' },
  { name: 'Purple',  primary: '#7c3aed', secondary: '#a78bfa', light: '#f5f3ff', dark: '#2e1065', text: '#111' },
  { name: 'Slate',   primary: '#334155', secondary: '#64748b', light: '#f8fafc', dark: '#0f172a', text: '#111' },
  { name: 'Fuchsia', primary: '#a21caf', secondary: '#e879f9', light: '#fdf4ff', dark: '#4a044e', text: '#111' },
];

const LAYOUTS = [
  { id: 1, label: 'Minimal' },
  { id: 2, label: 'Classic' },
  { id: 3, label: 'Bold' },
  { id: 4, label: 'Sidebar' },
  { id: 5, label: 'Modern' },
];

// Generate all 50 templates
export const TEMPLATES = [];
LAYOUTS.forEach(layout => {
  COLOR_SCHEMES.forEach(scheme => {
    TEMPLATES.push({
      id: TEMPLATES.length + 1,
      layoutId: layout.id,
      layoutName: layout.label,
      name: `${layout.label} ${scheme.name}`,
      ...scheme,
    });
  });
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

const fmt = (n, cur) => `${cur}${Number(n || 0).toFixed(2)}`;
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

// ─── Layout 1: MINIMAL ───────────────────────────────────────────────────────
function LayoutMinimal({ inv, cfg, currency }) {
  const sub = (inv.items||[]).reduce((s,i)=>s+Number(i.qty)*Number(i.rate),0);
  const tax = sub * (inv.tax||0)/100;
  const total = sub + tax;
  return (
    <Box sx={{ background:'#fff', color:'#111', fontFamily:"'Inter','Helvetica Neue',sans-serif", width:794, minHeight:1123, p:'72px 80px', boxSizing:'border-box' }}>
      {/* Header */}
      <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', mb:6 }}>
        <Box>
          <Typography sx={{ fontSize:11, fontWeight:700, letterSpacing:3, textTransform:'uppercase', color:cfg.primary, mb:1 }}>Invoice</Typography>
          <Typography sx={{ fontSize:32, fontWeight:800, color:'#0f172a', letterSpacing:-1, lineHeight:1 }}>
            {inv.billFrom?.companyName || inv.billFrom?.name || 'Your Company'}
          </Typography>
        </Box>
        <Box sx={{ textAlign:'right' }}>
          <Typography sx={{ fontSize:18, fontWeight:700, color:cfg.primary }}>#{inv.invoiceId}</Typography>
          <Typography sx={{ fontSize:13, color:'#64748b', mt:0.5 }}>{fmtDate(inv.date)}</Typography>
          <Typography sx={{ fontSize:13, color:'#94a3b8' }}>Due {fmtDate(inv.dueDate)}</Typography>
        </Box>
      </Box>

      {/* Parties */}
      <Grid container spacing={6} sx={{ mb:5 }}>
        <Grid item xs={6}>
          <Typography sx={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:2, color:'#94a3b8', mb:1.5 }}>From</Typography>
          <Typography sx={{ fontSize:14, fontWeight:600, color:'#0f172a' }}>{inv.billFrom?.name}</Typography>
          {inv.billFrom?.email && <Typography sx={{ fontSize:13, color:'#64748b' }}>{inv.billFrom.email}</Typography>}
          {inv.billFrom?.phone && <Typography sx={{ fontSize:13, color:'#64748b' }}>{inv.billFrom.phone}</Typography>}
          {inv.billFrom?.address && <Typography sx={{ fontSize:13, color:'#64748b', mt:0.5 }}>{inv.billFrom.address}</Typography>}
        </Grid>
        <Grid item xs={6}>
          <Typography sx={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:2, color:'#94a3b8', mb:1.5 }}>To</Typography>
          <Typography sx={{ fontSize:14, fontWeight:600, color:'#0f172a' }}>{inv.clientName}</Typography>
          {inv.clientEmail && <Typography sx={{ fontSize:13, color:'#64748b' }}>{inv.clientEmail}</Typography>}
          {inv.clientAddress && <Typography sx={{ fontSize:13, color:'#64748b', mt:0.5 }}>{inv.clientAddress}</Typography>}
        </Grid>
      </Grid>

      <Box sx={{ height:1, background:'#e2e8f0', mb:4 }} />

      {/* Table Header */}
      <Grid container sx={{ mb:2 }}>
        <Grid item xs={6}><Typography sx={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:1, color:'#94a3b8' }}>Description</Typography></Grid>
        <Grid item xs={2} sx={{ textAlign:'center' }}><Typography sx={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:1, color:'#94a3b8' }}>Qty</Typography></Grid>
        <Grid item xs={2} sx={{ textAlign:'right' }}><Typography sx={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:1, color:'#94a3b8' }}>Rate</Typography></Grid>
        <Grid item xs={2} sx={{ textAlign:'right' }}><Typography sx={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:1, color:'#94a3b8' }}>Amount</Typography></Grid>
      </Grid>

      {/* Items */}
      {(inv.items||[]).map((item,i) => (
        <Grid key={i} container sx={{ py:1.5, borderBottom:'1px solid #f1f5f9', '&:last-child':{borderBottom:'none'} }}>
          <Grid item xs={6}><Typography sx={{ fontSize:14, color:'#334155' }}>{item.desc || '—'}</Typography></Grid>
          <Grid item xs={2} sx={{ textAlign:'center' }}><Typography sx={{ fontSize:14, color:'#64748b' }}>{item.qty}</Typography></Grid>
          <Grid item xs={2} sx={{ textAlign:'right' }}><Typography sx={{ fontSize:14, color:'#64748b' }}>{fmt(item.rate, currency)}</Typography></Grid>
          <Grid item xs={2} sx={{ textAlign:'right' }}><Typography sx={{ fontSize:14, fontWeight:600, color:'#0f172a' }}>{fmt(Number(item.qty)*Number(item.rate), currency)}</Typography></Grid>
        </Grid>
      ))}

      {/* Totals */}
      <Box sx={{ display:'flex', justifyContent:'flex-end', mt:4 }}>
        <Box sx={{ width:260 }}>
          <Box sx={{ display:'flex', justifyContent:'space-between', py:1 }}>
            <Typography sx={{ fontSize:13, color:'#64748b' }}>Subtotal</Typography>
            <Typography sx={{ fontSize:13 }}>{fmt(sub, currency)}</Typography>
          </Box>
          <Box sx={{ display:'flex', justifyContent:'space-between', py:1, borderBottom:'1px solid #e2e8f0' }}>
            <Typography sx={{ fontSize:13, color:'#64748b' }}>Tax ({inv.tax || 0}%)</Typography>
            <Typography sx={{ fontSize:13 }}>{fmt(tax, currency)}</Typography>
          </Box>
          <Box sx={{ display:'flex', justifyContent:'space-between', py:1.5 }}>
            <Typography sx={{ fontSize:16, fontWeight:800, color:'#0f172a' }}>Total</Typography>
            <Typography sx={{ fontSize:16, fontWeight:800, color:cfg.primary }}>{fmt(total, currency)}</Typography>
          </Box>
        </Box>
      </Box>

      {inv.notes && (
        <Box sx={{ mt:4, pt:3, borderTop:'1px solid #e2e8f0' }}>
          <Typography sx={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:1, color:'#94a3b8', mb:1 }}>Notes</Typography>
          <Typography sx={{ fontSize:13, color:'#64748b', lineHeight:1.6 }}>{inv.notes}</Typography>
        </Box>
      )}
    </Box>
  );
}

// ─── Layout 2: CLASSIC ───────────────────────────────────────────────────────
function LayoutClassic({ inv, cfg, currency }) {
  const sub = (inv.items||[]).reduce((s,i)=>s+Number(i.qty)*Number(i.rate),0);
  const tax = sub * (inv.tax||0)/100;
  const total = sub + tax;
  return (
    <Box sx={{ background:'#fff', color:'#111', fontFamily:"'Inter','Helvetica Neue',sans-serif", width:794, minHeight:1123, boxSizing:'border-box' }}>
      {/* Colored Header Band */}
      <Box sx={{ background:cfg.primary, py:'40px', px:'56px' }}>
        <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <Box>
            <Typography sx={{ color:'rgba(255,255,255,0.7)', fontSize:11, textTransform:'uppercase', letterSpacing:3, mb:1 }}>Tax Invoice</Typography>
            <Typography sx={{ color:'#fff', fontSize:30, fontWeight:800, letterSpacing:-0.5 }}>{inv.billFrom?.companyName || inv.billFrom?.name || 'Your Company'}</Typography>
          </Box>
          <Box sx={{ textAlign:'right' }}>
            <Typography sx={{ color:'rgba(255,255,255,0.7)', fontSize:12, mb:0.5 }}>Invoice No.</Typography>
            <Typography sx={{ color:'#fff', fontSize:22, fontWeight:800 }}>#{inv.invoiceId}</Typography>
          </Box>
        </Box>
        <Box sx={{ display:'flex', gap:5, mt:3 }}>
          <Box><Typography sx={{ color:'rgba(255,255,255,0.6)', fontSize:11, mb:0.5 }}>ISSUE DATE</Typography><Typography sx={{ color:'#fff', fontWeight:600, fontSize:14 }}>{fmtDate(inv.date)}</Typography></Box>
          <Box><Typography sx={{ color:'rgba(255,255,255,0.6)', fontSize:11, mb:0.5 }}>DUE DATE</Typography><Typography sx={{ color:'#fff', fontWeight:600, fontSize:14 }}>{fmtDate(inv.dueDate)}</Typography></Box>
        </Box>
      </Box>

      {/* Parties */}
      <Box sx={{ display:'flex', background:cfg.light, px:'56px', py:'28px', gap:6, borderBottom:`3px solid ${cfg.primary}` }}>
        <Box sx={{ flex:1 }}>
          <Typography sx={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:2, color:cfg.primary, mb:1 }}>Billed By</Typography>
          <Typography sx={{ fontWeight:700, fontSize:15, color:'#0f172a' }}>{inv.billFrom?.name}</Typography>
          <Typography sx={{ fontSize:13, color:'#64748b' }}>{inv.billFrom?.email}</Typography>
          <Typography sx={{ fontSize:13, color:'#64748b' }}>{inv.billFrom?.phone}</Typography>
        </Box>
        <Box sx={{ flex:1 }}>
          <Typography sx={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:2, color:'#64748b', mb:1 }}>Billed To</Typography>
          <Typography sx={{ fontWeight:700, fontSize:15, color:'#0f172a' }}>{inv.clientName}</Typography>
          <Typography sx={{ fontSize:13, color:'#64748b' }}>{inv.clientEmail}</Typography>
          <Typography sx={{ fontSize:13, color:'#64748b' }}>{inv.clientAddress}</Typography>
        </Box>
      </Box>

      <Box sx={{ px:'56px', py:'32px' }}>
        {/* Table */}
        <Box sx={{ border:`1px solid #e2e8f0`, borderRadius:1, overflow:'hidden' }}>
          <Box sx={{ display:'flex', background:cfg.primary, px:2, py:1.5 }}>
            <Typography sx={{ flex:5, color:'#fff', fontSize:12, fontWeight:700, textTransform:'uppercase', letterSpacing:0.5 }}>Description</Typography>
            <Typography sx={{ flex:1, color:'#fff', fontSize:12, fontWeight:700, textAlign:'center' }}>Qty</Typography>
            <Typography sx={{ flex:2, color:'#fff', fontSize:12, fontWeight:700, textAlign:'right' }}>Rate</Typography>
            <Typography sx={{ flex:2, color:'#fff', fontSize:12, fontWeight:700, textAlign:'right' }}>Amount</Typography>
          </Box>
          {(inv.items||[]).map((item,i) => (
            <Box key={i} sx={{ display:'flex', px:2, py:1.5, background:i%2===0?'#fff':cfg.light, borderTop:'1px solid #e2e8f0' }}>
              <Typography sx={{ flex:5, fontSize:13 }}>{item.desc}</Typography>
              <Typography sx={{ flex:1, fontSize:13, textAlign:'center', color:'#64748b' }}>{item.qty}</Typography>
              <Typography sx={{ flex:2, fontSize:13, textAlign:'right', color:'#64748b' }}>{fmt(item.rate, currency)}</Typography>
              <Typography sx={{ flex:2, fontSize:13, fontWeight:600, textAlign:'right' }}>{fmt(Number(item.qty)*Number(item.rate), currency)}</Typography>
            </Box>
          ))}
        </Box>

        {/* Summary */}
        <Box sx={{ display:'flex', justifyContent:'flex-end', mt:3 }}>
          <Box sx={{ width:250, border:`1px solid #e2e8f0`, borderRadius:1, overflow:'hidden' }}>
            <Box sx={{ display:'flex', justifyContent:'space-between', px:2, py:1.5, background:'#f8fafc' }}>
              <Typography sx={{ fontSize:13, color:'#64748b' }}>Subtotal</Typography>
              <Typography sx={{ fontSize:13 }}>{fmt(sub, currency)}</Typography>
            </Box>
            <Box sx={{ display:'flex', justifyContent:'space-between', px:2, py:1.5, background:'#f8fafc', borderTop:'1px solid #e2e8f0' }}>
              <Typography sx={{ fontSize:13, color:'#64748b' }}>Tax ({inv.tax||0}%)</Typography>
              <Typography sx={{ fontSize:13 }}>{fmt(tax, currency)}</Typography>
            </Box>
            <Box sx={{ display:'flex', justifyContent:'space-between', px:2, py:2, background:cfg.primary }}>
              <Typography sx={{ fontWeight:800, color:'#fff', fontSize:15 }}>Total</Typography>
              <Typography sx={{ fontWeight:800, color:'#fff', fontSize:15 }}>{fmt(total, currency)}</Typography>
            </Box>
          </Box>
        </Box>

        {inv.notes && <Box sx={{ mt:4, p:3, background:cfg.light, borderLeft:`4px solid ${cfg.primary}`, borderRadius:1 }}><Typography sx={{ fontSize:13, color:'#475569', lineHeight:1.6 }}>{inv.notes}</Typography></Box>}
        {inv.bankDetails?.bankName && (
          <Box sx={{ mt:3, pt:3, borderTop:'1px solid #e2e8f0' }}>
            <Typography sx={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:2, color:cfg.primary, mb:1 }}>Bank Details</Typography>
            <Typography sx={{ fontSize:13, color:'#475569' }}>{inv.bankDetails.bankName} · A/C: {inv.bankDetails.accountNumber} · {inv.bankDetails.routingNumber}</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}

// ─── Layout 3: BOLD ──────────────────────────────────────────────────────────
function LayoutBold({ inv, cfg, currency }) {
  const sub = (inv.items||[]).reduce((s,i)=>s+Number(i.qty)*Number(i.rate),0);
  const tax = sub * (inv.tax||0)/100;
  const total = sub + tax;
  return (
    <Box sx={{ background:'#fff', fontFamily:"'Inter','Helvetica Neue',sans-serif", width:794, minHeight:1123, boxSizing:'border-box', display:'flex' }}>
      {/* Left Sidebar */}
      <Box sx={{ width:220, background:cfg.dark||cfg.primary, display:'flex', flexDirection:'column', p:'48px 28px', flexShrink:0 }}>
        <Box sx={{ width:52, height:52, background:`linear-gradient(135deg, ${cfg.primary}, ${cfg.secondary})`, borderRadius:2, display:'flex', alignItems:'center', justifyContent:'center', mb:3 }}>
          <Typography sx={{ color:'#fff', fontWeight:900, fontSize:20 }}>{(inv.billFrom?.companyName||inv.billFrom?.name||'C').charAt(0)}</Typography>
        </Box>
        <Typography sx={{ color:'#fff', fontWeight:800, fontSize:16, mb:0.5, lineHeight:1.2 }}>{inv.billFrom?.companyName || inv.billFrom?.name}</Typography>
        <Typography sx={{ color:'rgba(255,255,255,0.5)', fontSize:11, mb:4 }}>{inv.billFrom?.email}</Typography>

        <Typography sx={{ color:'rgba(255,255,255,0.4)', fontSize:9, textTransform:'uppercase', letterSpacing:2, mb:1 }}>Invoice No.</Typography>
        <Typography sx={{ color:'#fff', fontWeight:700, fontSize:14, mb:3 }}>#{inv.invoiceId}</Typography>

        <Typography sx={{ color:'rgba(255,255,255,0.4)', fontSize:9, textTransform:'uppercase', letterSpacing:2, mb:1 }}>Issue Date</Typography>
        <Typography sx={{ color:'rgba(255,255,255,0.85)', fontSize:13, mb:3 }}>{fmtDate(inv.date)}</Typography>

        <Typography sx={{ color:'rgba(255,255,255,0.4)', fontSize:9, textTransform:'uppercase', letterSpacing:2, mb:1 }}>Due Date</Typography>
        <Typography sx={{ color:'rgba(255,255,255,0.85)', fontSize:13, mb:4 }}>{fmtDate(inv.dueDate)}</Typography>

        <Box sx={{ mt:'auto', pt:3, borderTop:'1px solid rgba(255,255,255,0.1)' }}>
          <Typography sx={{ color:'rgba(255,255,255,0.4)', fontSize:9, textTransform:'uppercase', letterSpacing:2, mb:1 }}>Amount Due</Typography>
          <Typography sx={{ color:'#fff', fontWeight:900, fontSize:24, letterSpacing:-1 }}>{fmt(total, currency)}</Typography>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ flex:1, p:'48px 40px' }}>
        <Typography sx={{ fontSize:36, fontWeight:900, color:cfg.primary, letterSpacing:-2, mb:1 }}>INVOICE</Typography>

        <Box sx={{ mb:4 }}>
          <Typography sx={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:2, color:'#94a3b8', mb:1 }}>Billed To</Typography>
          <Typography sx={{ fontWeight:700, fontSize:18, color:'#0f172a' }}>{inv.clientName}</Typography>
          <Typography sx={{ fontSize:13, color:'#64748b' }}>{inv.clientEmail}</Typography>
          <Typography sx={{ fontSize:13, color:'#64748b', mt:0.5 }}>{inv.clientAddress}</Typography>
        </Box>

        <Box sx={{ background:cfg.light, borderRadius:1, overflow:'hidden', mb:3 }}>
          <Box sx={{ display:'flex', px:2, py:1.5 }}>
            <Typography sx={{ flex:5, fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:0.5, color:cfg.primary }}>Item</Typography>
            <Typography sx={{ flex:1, fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:0.5, color:cfg.primary, textAlign:'center' }}>Qty</Typography>
            <Typography sx={{ flex:2, fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:0.5, color:cfg.primary, textAlign:'right' }}>Rate</Typography>
            <Typography sx={{ flex:2, fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:0.5, color:cfg.primary, textAlign:'right' }}>Total</Typography>
          </Box>
          {(inv.items||[]).map((item,i) => (
            <Box key={i} sx={{ display:'flex', px:2, py:1.5, background:'#fff', borderTop:`1px solid ${cfg.light}` }}>
              <Typography sx={{ flex:5, fontSize:13 }}>{item.desc}</Typography>
              <Typography sx={{ flex:1, fontSize:13, textAlign:'center', color:'#64748b' }}>{item.qty}</Typography>
              <Typography sx={{ flex:2, fontSize:13, textAlign:'right', color:'#64748b' }}>{fmt(item.rate, currency)}</Typography>
              <Typography sx={{ flex:2, fontSize:13, fontWeight:700, textAlign:'right', color:'#0f172a' }}>{fmt(Number(item.qty)*Number(item.rate), currency)}</Typography>
            </Box>
          ))}
        </Box>

        <Box sx={{ display:'flex', justifyContent:'flex-end' }}>
          <Box sx={{ width:240 }}>
            <Box sx={{ display:'flex', justifyContent:'space-between', py:1 }}><Typography sx={{ fontSize:13, color:'#64748b' }}>Subtotal</Typography><Typography sx={{ fontSize:13 }}>{fmt(sub, currency)}</Typography></Box>
            <Box sx={{ display:'flex', justifyContent:'space-between', py:1, mb:1 }}><Typography sx={{ fontSize:13, color:'#64748b' }}>Tax ({inv.tax||0}%)</Typography><Typography sx={{ fontSize:13 }}>{fmt(tax, currency)}</Typography></Box>
            <Box sx={{ display:'flex', justifyContent:'space-between', p:2, background:cfg.primary, borderRadius:1 }}>
              <Typography sx={{ fontWeight:800, color:'#fff' }}>Total</Typography>
              <Typography sx={{ fontWeight:800, color:'#fff', fontSize:16 }}>{fmt(total, currency)}</Typography>
            </Box>
          </Box>
        </Box>

        {inv.notes && <Typography sx={{ mt:4, fontSize:12, color:'#94a3b8', fontStyle:'italic', lineHeight:1.6 }}>{inv.notes}</Typography>}
      </Box>
    </Box>
  );
}

// ─── Layout 4: SIDEBAR ───────────────────────────────────────────────────────
function LayoutSidebar({ inv, cfg, currency }) {
  const sub = (inv.items||[]).reduce((s,i)=>s+Number(i.qty)*Number(i.rate),0);
  const tax = sub * (inv.tax||0)/100;
  const total = sub + tax;
  return (
    <Box sx={{ background:'#fff', fontFamily:"'Inter','Helvetica Neue',sans-serif", width:794, minHeight:1123, boxSizing:'border-box' }}>
      {/* Top Accent Line */}
      <Box sx={{ height:6, background:`linear-gradient(90deg, ${cfg.primary}, ${cfg.secondary})` }} />

      <Box sx={{ p:'48px 56px' }}>
        {/* Header */}
        <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', mb:5 }}>
          <Box>
            <Typography sx={{ fontSize:32, fontWeight:900, color:'#0f172a', letterSpacing:-1 }}>{inv.billFrom?.companyName || inv.billFrom?.name || 'Invoice'}</Typography>
            <Typography sx={{ fontSize:13, color:'#94a3b8', mt:0.5 }}>{inv.billFrom?.email} {inv.billFrom?.phone ? `· ${inv.billFrom.phone}` : ''}</Typography>
          </Box>
          <Box sx={{ textAlign:'right', background:cfg.light, px:3, py:2, borderRadius:2 }}>
            <Typography sx={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:2, color:cfg.primary }}>Invoice</Typography>
            <Typography sx={{ fontSize:20, fontWeight:800, color:'#0f172a' }}>#{inv.invoiceId}</Typography>
          </Box>
        </Box>

        {/* Parties Row */}
        <Grid container spacing={4} sx={{ mb:4, pb:4, borderBottom:`2px solid ${cfg.light}` }}>
          <Grid item xs={4}>
            <Typography sx={{ fontSize:9, fontWeight:700, textTransform:'uppercase', letterSpacing:2, color:'#94a3b8', mb:1 }}>Billed From</Typography>
            <Typography sx={{ fontWeight:700, fontSize:14 }}>{inv.billFrom?.name}</Typography>
            <Typography sx={{ fontSize:12, color:'#64748b', mt:0.5 }}>{inv.billFrom?.address}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography sx={{ fontSize:9, fontWeight:700, textTransform:'uppercase', letterSpacing:2, color:'#94a3b8', mb:1 }}>Billed To</Typography>
            <Typography sx={{ fontWeight:700, fontSize:14 }}>{inv.clientName}</Typography>
            <Typography sx={{ fontSize:12, color:'#64748b' }}>{inv.clientEmail}</Typography>
            <Typography sx={{ fontSize:12, color:'#64748b', mt:0.5 }}>{inv.clientAddress}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography sx={{ fontSize:9, fontWeight:700, textTransform:'uppercase', letterSpacing:2, color:'#94a3b8', mb:1 }}>Dates</Typography>
            <Typography sx={{ fontSize:12, color:'#334155' }}>Issued: {fmtDate(inv.date)}</Typography>
            <Typography sx={{ fontSize:12, color:cfg.primary, fontWeight:600, mt:0.5 }}>Due: {fmtDate(inv.dueDate)}</Typography>
          </Grid>
        </Grid>

        {/* Items */}
        <Box sx={{ mb:4 }}>
          <Box sx={{ display:'flex', borderBottom:`2px solid ${cfg.primary}`, pb:1, mb:0.5 }}>
            <Typography sx={{ flex:5, fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:1, color:cfg.primary }}>Description</Typography>
            <Typography sx={{ flex:1, fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:1, color:cfg.primary, textAlign:'center' }}>Qty</Typography>
            <Typography sx={{ flex:2, fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:1, color:cfg.primary, textAlign:'right' }}>Rate</Typography>
            <Typography sx={{ flex:2, fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:1, color:cfg.primary, textAlign:'right' }}>Amount</Typography>
          </Box>
          {(inv.items||[]).map((item,i) => (
            <Box key={i} sx={{ display:'flex', py:1.5, borderBottom:'1px solid #f1f5f9' }}>
              <Typography sx={{ flex:5, fontSize:13, color:'#334155' }}>{item.desc}</Typography>
              <Typography sx={{ flex:1, fontSize:13, textAlign:'center', color:'#64748b' }}>{item.qty}</Typography>
              <Typography sx={{ flex:2, fontSize:13, textAlign:'right', color:'#64748b' }}>{fmt(item.rate, currency)}</Typography>
              <Typography sx={{ flex:2, fontSize:13, fontWeight:600, textAlign:'right' }}>{fmt(Number(item.qty)*Number(item.rate), currency)}</Typography>
            </Box>
          ))}
        </Box>

        {/* Totals + Notes */}
        <Box sx={{ display:'flex', gap:4 }}>
          <Box sx={{ flex:1 }}>
            {inv.notes && <Box sx={{ p:3, background:cfg.light, borderRadius:2, height:'100%' }}><Typography sx={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:1, color:cfg.primary, mb:1 }}>Notes</Typography><Typography sx={{ fontSize:13, color:'#475569', lineHeight:1.6 }}>{inv.notes}</Typography></Box>}
          </Box>
          <Box sx={{ width:240 }}>
            <Box sx={{ display:'flex', justifyContent:'space-between', py:1 }}><Typography sx={{ fontSize:13, color:'#64748b' }}>Subtotal</Typography><Typography sx={{ fontSize:13 }}>{fmt(sub, currency)}</Typography></Box>
            <Box sx={{ display:'flex', justifyContent:'space-between', py:1 }}><Typography sx={{ fontSize:13, color:'#64748b' }}>Tax ({inv.tax||0}%)</Typography><Typography sx={{ fontSize:13 }}>{fmt(tax, currency)}</Typography></Box>
            <Box sx={{ display:'flex', justifyContent:'space-between', mt:1, p:2, background:`linear-gradient(135deg,${cfg.primary},${cfg.secondary})`, borderRadius:2 }}>
              <Typography sx={{ fontWeight:800, color:'#fff', fontSize:16 }}>Total</Typography>
              <Typography sx={{ fontWeight:900, color:'#fff', fontSize:18 }}>{fmt(total, currency)}</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

// ─── Layout 5: MODERN ────────────────────────────────────────────────────────
function LayoutModern({ inv, cfg, currency }) {
  const sub = (inv.items||[]).reduce((s,i)=>s+Number(i.qty)*Number(i.rate),0);
  const tax = sub * (inv.tax||0)/100;
  const total = sub + tax;
  return (
    <Box sx={{ background:'#fff', fontFamily:"'Inter','Helvetica Neue',sans-serif", width:794, minHeight:1123, boxSizing:'border-box' }}>
      {/* Hero Header */}
      <Box sx={{ background:`linear-gradient(135deg, ${cfg.primary} 0%, ${cfg.secondary} 100%)`, p:'48px 56px', position:'relative', overflow:'hidden' }}>
        <Box sx={{ position:'absolute', top:-40, right:-40, width:200, height:200, borderRadius:'50%', background:'rgba(255,255,255,0.08)' }} />
        <Box sx={{ position:'absolute', bottom:-60, right:80, width:150, height:150, borderRadius:'50%', background:'rgba(255,255,255,0.05)' }} />
        <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', position:'relative', zIndex:1 }}>
          <Box>
            <Typography sx={{ color:'rgba(255,255,255,0.75)', fontSize:11, textTransform:'uppercase', letterSpacing:3, mb:1 }}>Invoice</Typography>
            <Typography sx={{ color:'#fff', fontSize:28, fontWeight:900, letterSpacing:-1 }}>{inv.billFrom?.companyName || inv.billFrom?.name || 'Your Company'}</Typography>
            <Typography sx={{ color:'rgba(255,255,255,0.7)', fontSize:13, mt:0.5 }}>{inv.billFrom?.email}</Typography>
          </Box>
          <Box sx={{ textAlign:'right' }}>
            <Typography sx={{ color:'rgba(255,255,255,0.7)', fontSize:12 }}>Invoice #</Typography>
            <Typography sx={{ color:'#fff', fontWeight:900, fontSize:22, letterSpacing:-1 }}>{inv.invoiceId}</Typography>
            <Box sx={{ display:'flex', gap:3, mt:1.5, justifyContent:'flex-end' }}>
              <Box><Typography sx={{ color:'rgba(255,255,255,0.6)', fontSize:10 }}>Issued</Typography><Typography sx={{ color:'#fff', fontWeight:600, fontSize:13 }}>{fmtDate(inv.date)}</Typography></Box>
              <Box><Typography sx={{ color:'rgba(255,255,255,0.6)', fontSize:10 }}>Due</Typography><Typography sx={{ color:'#fff', fontWeight:600, fontSize:13 }}>{fmtDate(inv.dueDate)}</Typography></Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Parties */}
      <Box sx={{ display:'flex', background:'#f8fafc', borderBottom:'1px solid #e2e8f0' }}>
        <Box sx={{ flex:1, px:'56px', py:'24px', borderRight:'1px solid #e2e8f0' }}>
          <Typography sx={{ fontSize:9, fontWeight:700, textTransform:'uppercase', letterSpacing:2, color:cfg.primary, mb:1.5 }}>From</Typography>
          <Typography sx={{ fontWeight:700, fontSize:15, color:'#0f172a' }}>{inv.billFrom?.name}</Typography>
          <Typography sx={{ fontSize:12, color:'#64748b' }}>{inv.billFrom?.address}</Typography>
        </Box>
        <Box sx={{ flex:1, px:'56px', py:'24px' }}>
          <Typography sx={{ fontSize:9, fontWeight:700, textTransform:'uppercase', letterSpacing:2, color:'#94a3b8', mb:1.5 }}>To</Typography>
          <Typography sx={{ fontWeight:700, fontSize:15, color:'#0f172a' }}>{inv.clientName}</Typography>
          <Typography sx={{ fontSize:12, color:'#64748b' }}>{inv.clientEmail}</Typography>
          <Typography sx={{ fontSize:12, color:'#64748b', mt:0.3 }}>{inv.clientAddress}</Typography>
        </Box>
      </Box>

      {/* Items Table */}
      <Box sx={{ px:'56px', pt:'32px', pb:'24px' }}>
        <Box sx={{ borderRadius:2, overflow:'hidden', border:'1px solid #e2e8f0' }}>
          <Box sx={{ display:'flex', background:cfg.primary, px:3, py:2 }}>
            {['Description','Qty','Rate','Amount'].map((h,i) => (
              <Typography key={h} sx={{ flex:i===0?5:2, color:'#fff', fontSize:12, fontWeight:700, letterSpacing:0.5, textAlign:i>0?'right':'left' }}>{h}</Typography>
            ))}
          </Box>
          {(inv.items||[]).map((item,i) => (
            <Box key={i} sx={{ display:'flex', px:3, py:2, background:i%2===0?'#fff':'#f8fafc', borderTop:'1px solid #e2e8f0' }}>
              <Typography sx={{ flex:5, fontSize:14, color:'#334155' }}>{item.desc}</Typography>
              <Typography sx={{ flex:2, fontSize:14, textAlign:'right', color:'#64748b' }}>{item.qty}</Typography>
              <Typography sx={{ flex:2, fontSize:14, textAlign:'right', color:'#64748b' }}>{fmt(item.rate, currency)}</Typography>
              <Typography sx={{ flex:2, fontSize:14, fontWeight:700, textAlign:'right', color:'#0f172a' }}>{fmt(Number(item.qty)*Number(item.rate), currency)}</Typography>
            </Box>
          ))}
        </Box>

        <Box sx={{ display:'flex', justifyContent:'flex-end', mt:3 }}>
          <Box sx={{ width:280 }}>
            <Box sx={{ display:'flex', justifyContent:'space-between', py:1, borderBottom:'1px solid #f1f5f9' }}><Typography sx={{ fontSize:14, color:'#64748b' }}>Subtotal</Typography><Typography sx={{ fontSize:14 }}>{fmt(sub, currency)}</Typography></Box>
            <Box sx={{ display:'flex', justifyContent:'space-between', py:1, borderBottom:'1px solid #f1f5f9' }}><Typography sx={{ fontSize:14, color:'#64748b' }}>Tax ({inv.tax||0}%)</Typography><Typography sx={{ fontSize:14 }}>{fmt(tax, currency)}</Typography></Box>
            <Box sx={{ display:'flex', justifyContent:'space-between', py:2, borderRadius:2, px:2, mt:1, background:`linear-gradient(135deg,${cfg.primary},${cfg.secondary})` }}>
              <Typography sx={{ fontSize:17, fontWeight:900, color:'#fff' }}>Total Due</Typography>
              <Typography sx={{ fontSize:17, fontWeight:900, color:'#fff' }}>{fmt(total, currency)}</Typography>
            </Box>
          </Box>
        </Box>

        {inv.notes && <Box sx={{ mt:4, p:3, borderRadius:2, background:'#f8fafc', border:'1px dashed #e2e8f0' }}><Typography sx={{ fontSize:12, color:'#64748b', lineHeight:1.6 }}>{inv.notes}</Typography></Box>}
        {inv.bankDetails?.bankName && (
          <Box sx={{ mt:3, display:'flex', gap:4, pt:3, borderTop:'1px solid #e2e8f0' }}>
            <Box><Typography sx={{ fontSize:9, fontWeight:700, textTransform:'uppercase', letterSpacing:2, color:cfg.primary, mb:0.5 }}>Bank</Typography><Typography sx={{ fontSize:13 }}>{inv.bankDetails.bankName}</Typography></Box>
            {inv.bankDetails.accountName && <Box><Typography sx={{ fontSize:9, fontWeight:700, textTransform:'uppercase', letterSpacing:2, color:'#94a3b8', mb:0.5 }}>Account</Typography><Typography sx={{ fontSize:13 }}>{inv.bankDetails.accountName}</Typography></Box>}
            {inv.bankDetails.accountNumber && <Box><Typography sx={{ fontSize:9, fontWeight:700, textTransform:'uppercase', letterSpacing:2, color:'#94a3b8', mb:0.5 }}>Number</Typography><Typography sx={{ fontSize:13 }}>{inv.bankDetails.accountNumber}</Typography></Box>}
          </Box>
        )}
      </Box>
    </Box>
  );
}

// ─── Router ───────────────────────────────────────────────────────────────────
function InvoiceTemplate({ inv, templateId, currency }) {
  const tmpl = TEMPLATES.find(t => t.id === templateId) || TEMPLATES[0];
  const cfg = tmpl;
  const props = { inv, cfg, currency };
  if (tmpl.layoutId === 1) return <LayoutMinimal {...props} />;
  if (tmpl.layoutId === 2) return <LayoutClassic {...props} />;
  if (tmpl.layoutId === 3) return <LayoutBold {...props} />;
  if (tmpl.layoutId === 4) return <LayoutSidebar {...props} />;
  if (tmpl.layoutId === 5) return <LayoutModern {...props} />;
  return <LayoutMinimal {...props} />;
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function InvoiceView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const invoiceRef = useRef(null);
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [filterLayout, setFilterLayout] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const currency = user.currency || '₹';

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/invoices/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
        if (res.ok) setInvoice(await res.json());
        else setSnackbar({ open: true, message: 'Invoice not found', severity: 'error' });
      } catch { setSnackbar({ open: true, message: 'Network error', severity: 'error' }); }
      finally { setLoading(false); }
    })();
  }, [id]);

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      const el = invoiceRef.current;
      const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: '#ffffff', logging: false });
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pw = pdf.internal.pageSize.getWidth();
      const ph = (canvas.height * pw) / canvas.width;
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, pw, Math.min(ph, 297));
      pdf.save(`${invoice.invoiceId || 'invoice'}.pdf`);
      setSnackbar({ open: true, message: 'PDF downloaded!', severity: 'success' });
    } catch { setSnackbar({ open: true, message: 'PDF generation failed', severity: 'error' }); }
    finally { setIsGenerating(false); }
  };

  const visibleTemplates = filterLayout ? TEMPLATES.filter(t => t.layoutId === filterLayout) : TEMPLATES;
  const selectedTmpl = TEMPLATES.find(t => t.id === selectedTemplate) || TEMPLATES[0];

  if (loading) return <Box sx={{ display:'flex', justifyContent:'center', alignItems:'center', height:'60vh' }}><CircularProgress sx={{ color:'#6366f1' }} /></Box>;
  if (!invoice) return null;

  return (
    <Box sx={{ maxWidth: 1300, mx: 'auto' }}>
      {/* Top Bar */}
      <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', mb:3, flexWrap:'wrap', gap:2 }}>
        <Box sx={{ display:'flex', alignItems:'center', gap:2 }}>
          <IconButton onClick={() => navigate('/dashboard/invoices')} sx={{ color:'text.secondary', background:'rgba(255,255,255,0.05)', '&:hover':{ color:'#fff' } }}>
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography variant="h5" sx={{ fontWeight:800, color:'#fff' }}>{invoice.invoiceId}</Typography>
            <Box sx={{ display:'flex', alignItems:'center', gap:1, mt:0.5 }}>
              <Chip label={invoice.status} size="small" sx={{ fontWeight:600, fontSize:'0.75rem', background: invoice.status==='Paid'?'rgba(16,185,129,0.15)':invoice.status==='Pending'?'rgba(245,158,11,0.15)':'rgba(239,68,68,0.15)', color: invoice.status==='Paid'?'#10b981':invoice.status==='Pending'?'#f59e0b':'#ef4444' }} />
              <Typography variant="body2" sx={{ color:'text.secondary' }}>{invoice.clientName}</Typography>
            </Box>
          </Box>
        </Box>
        <Box sx={{ display:'flex', gap:1.5 }}>
          <Button variant="outlined" startIcon={<EditIcon />} onClick={() => navigate(`/dashboard/create?edit=${id}`)} sx={{ color:'#3b82f6', borderColor:'#3b82f6', '&:hover':{ background:'rgba(59,130,246,0.1)' } }}>Edit</Button>
          <Button variant="contained" startIcon={isGenerating ? <CircularProgress size={16} color="inherit" /> : <DownloadIcon />} onClick={handleDownloadPDF} disabled={isGenerating} sx={{ background:'linear-gradient(135deg,#6366f1,#ec4899)', fontWeight:700 }}>
            {isGenerating ? 'Generating...' : 'Download PDF'}
          </Button>
        </Box>
      </Box>

      <Box sx={{ display:'flex', gap:3, alignItems:'flex-start' }}>
        {/* Template Panel */}
        <Paper sx={{ width:240, flexShrink:0, background:'rgba(17,24,39,0.8)', backdropFilter:'blur(20px)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:3, p:2.5, maxHeight:'calc(100vh - 180px)', overflowY:'auto' }}>
          <Box sx={{ display:'flex', alignItems:'center', gap:1, mb:2 }}>
            <PaletteIcon sx={{ color:'#6366f1', fontSize:18 }} />
            <Typography sx={{ color:'#fff', fontWeight:700, fontSize:14 }}>Templates</Typography>
            <Typography sx={{ color:'#64748b', fontSize:12, ml:'auto' }}>{TEMPLATES.length}</Typography>
          </Box>

          {/* Layout Filter */}
          <Box sx={{ display:'flex', flexWrap:'wrap', gap:0.5, mb:2 }}>
            <Box onClick={() => setFilterLayout(null)} sx={{ px:1.5, py:0.5, borderRadius:1, background: filterLayout===null ? '#6366f1' : 'rgba(255,255,255,0.05)', cursor:'pointer', fontSize:11, color:filterLayout===null?'#fff':'#64748b', fontWeight:600 }}>All</Box>
            {LAYOUTS.map(l => (
              <Box key={l.id} onClick={() => setFilterLayout(l.id)} sx={{ px:1.5, py:0.5, borderRadius:1, background: filterLayout===l.id ? '#6366f1' : 'rgba(255,255,255,0.05)', cursor:'pointer', fontSize:11, color:filterLayout===l.id?'#fff':'#64748b', fontWeight:600 }}>{l.label}</Box>
            ))}
          </Box>

          {/* Template Grid */}
          <Box sx={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:1 }}>
            {visibleTemplates.map(t => (
              <Tooltip key={t.id} title={t.name} placement="right" arrow>
                <Box onClick={() => setSelectedTemplate(t.id)} sx={{
                  aspectRatio:'1/1.4', borderRadius:1, overflow:'hidden', cursor:'pointer', position:'relative',
                  border: selectedTemplate===t.id ? `2px solid #fff` : '2px solid transparent',
                  boxShadow: selectedTemplate===t.id ? `0 0 0 2px ${t.primary}` : 'none',
                  transition:'all 0.15s ease',
                  background:`linear-gradient(135deg, ${t.primary} 0%, ${t.secondary} 100%)`,
                  '&:hover': { transform:'scale(1.05)' }
                }}>
                  {/* Mini preview */}
                  <Box sx={{ position:'absolute', top:3, left:3, right:3, height:2, background:'rgba(255,255,255,0.6)', borderRadius:0.5 }} />
                  <Box sx={{ position:'absolute', top:7, left:3, right:8, height:1, background:'rgba(255,255,255,0.3)', borderRadius:0.5 }} />
                  <Box sx={{ position:'absolute', top:10, left:3, right:5, height:1, background:'rgba(255,255,255,0.2)', borderRadius:0.5 }} />
                  <Box sx={{ position:'absolute', bottom:3, left:3, right:3 }}>
                    <Box sx={{ height:1.5, background:'rgba(255,255,255,0.5)', borderRadius:0.5, mb:0.5 }} />
                    <Box sx={{ height:1.5, background:'rgba(255,255,255,0.3)', borderRadius:0.5 }} />
                  </Box>
                  {selectedTemplate===t.id && <Box sx={{ position:'absolute', inset:0, background:'rgba(255,255,255,0.15)', display:'flex', alignItems:'center', justifyContent:'center' }}><Box sx={{ width:8, height:8, borderRadius:'50%', background:'#fff' }} /></Box>}
                </Box>
              </Tooltip>
            ))}
          </Box>

          <Box sx={{ mt:2, p:1.5, background:'rgba(255,255,255,0.03)', borderRadius:1, border:'1px solid rgba(255,255,255,0.05)' }}>
            <Typography sx={{ fontSize:11, color:selectedTmpl.primary, fontWeight:700 }}>{selectedTmpl.name}</Typography>
            <Typography sx={{ fontSize:10, color:'#64748b', mt:0.3 }}>{selectedTmpl.layoutName} layout</Typography>
          </Box>
        </Paper>

        {/* Invoice Preview */}
        <Box sx={{ flex:1, overflowX:'auto' }}>
          <Paper sx={{ background:'#e5e7eb', borderRadius:3, p:4, display:'flex', justifyContent:'center' }}>
            <Box sx={{ transform:'scale(0.72)', transformOrigin:'top center', mb: '-250px' }}>
              <Box ref={invoiceRef} sx={{ boxShadow:'0 20px 60px rgba(0,0,0,0.3)', borderRadius:2, overflow:'hidden' }}>
                <InvoiceTemplate inv={invoice} templateId={selectedTemplate} currency={currency} />
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar(p=>({...p,open:false}))} anchorOrigin={{ vertical:'bottom', horizontal:'center' }}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar(p=>({...p,open:false}))} sx={{ background:'#1f2937', color:'#fff' }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
