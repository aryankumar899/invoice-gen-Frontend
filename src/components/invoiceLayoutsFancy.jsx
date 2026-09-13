import React from 'react';
import { Box, Typography } from '@mui/material';

const pdfFont = {
  fontFamily: 'Arial, Helvetica, sans-serif',
  letterSpacing: '0px',
  wordBreak: 'normal',
  '& *': {
    fontFamily: 'Arial, Helvetica, sans-serif !important',
    letterSpacing: '0px !important',
    wordBreak: 'normal',
  },
};

const fmt = (n, cur) => `${cur}${Number(n || 0).toFixed(2)}`;
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

function calc(inv) {
  const sub = (inv.items || []).reduce((s, i) => s + Number(i.qty) * Number(i.rate), 0);
  const tax = sub * (inv.tax || 0) / 100;
  return { sub, tax, total: sub + tax };
}

function FancyItems({ items, currency, headBg, headColor = '#fff', zebra }) {
  return (
    <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
      <Box component="thead">
        <Box component="tr" sx={{ background: headBg }}>
          {['Description', 'Qty', 'Rate', 'Amount'].map((h, i) => (
            <Box component="th" key={h} sx={{
              textAlign: i === 0 ? 'left' : i === 1 ? 'center' : 'right',
              p: '10px 12px', width: i === 0 ? '46%' : '18%',
            }}>
              <Typography sx={{ fontSize: 11, fontWeight: 700, color: headColor }}>{h}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
      <Box component="tbody">
        {(items || []).map((item, i) => (
          <Box component="tr" key={i} sx={{ background: zebra && i % 2 ? '#f8fafc' : '#fff' }}>
            <Box component="td" sx={{ p: '10px 12px', borderBottom: '1px solid #eef2f7' }}>
              <Typography sx={{ fontSize: 13, color: '#334155' }}>{item.desc || '—'}</Typography>
            </Box>
            <Box component="td" sx={{ p: '10px 12px', textAlign: 'center', borderBottom: '1px solid #eef2f7' }}>
              <Typography sx={{ fontSize: 13, color: '#64748b' }}>{item.qty}</Typography>
            </Box>
            <Box component="td" sx={{ p: '10px 12px', textAlign: 'right', borderBottom: '1px solid #eef2f7' }}>
              <Typography sx={{ fontSize: 13, color: '#64748b' }}>{fmt(item.rate, currency)}</Typography>
            </Box>
            <Box component="td" sx={{ p: '10px 12px', textAlign: 'right', borderBottom: '1px solid #eef2f7' }}>
              <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{fmt(Number(item.qty) * Number(item.rate), currency)}</Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function Totals({ sub, tax, total, inv, currency, cfg, invert }) {
  return (
    <Box sx={{ width: 260 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.8 }}>
        <Typography sx={{ fontSize: 13, color: '#64748b' }}>Subtotal</Typography>
        <Typography sx={{ fontSize: 13 }}>{fmt(sub, currency)}</Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.8 }}>
        <Typography sx={{ fontSize: 13, color: '#64748b' }}>Tax ({inv.tax || 0}%)</Typography>
        <Typography sx={{ fontSize: 13 }}>{fmt(tax, currency)}</Typography>
      </Box>
      <Box sx={{
        display: 'flex', justifyContent: 'space-between', mt: 1, p: 1.5, borderRadius: 1,
        background: invert ? `linear-gradient(135deg, ${cfg.primary}, ${cfg.secondary})` : cfg.light,
      }}>
        <Typography sx={{ fontWeight: 800, fontSize: 15, color: invert ? '#fff' : cfg.primary }}>Total</Typography>
        <Typography sx={{ fontWeight: 800, fontSize: 15, color: invert ? '#fff' : cfg.primary }}>{fmt(total, currency)}</Typography>
      </Box>
    </Box>
  );
}

export function LayoutLuxury({ inv, cfg, currency }) {
  const { sub, tax, total } = calc(inv);
  const initial = (inv.billFrom?.companyName || inv.billFrom?.name || 'I').charAt(0);
  return (
    <Box sx={{ background: '#fffdf8', color: '#111', ...pdfFont, width: 794, minHeight: 1123, p: '56px 64px', boxSizing: 'border-box' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Box sx={{
          width: 56, height: 56, borderRadius: '50%', border: `2px solid ${cfg.primary}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Typography sx={{ fontSize: 22, fontWeight: 800, color: cfg.primary }}>{initial}</Typography>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Typography sx={{ fontSize: 11, color: cfg.primary, fontWeight: 700 }}>TAX INVOICE</Typography>
          <Typography sx={{ fontSize: 20, fontWeight: 800, color: '#1c1917' }}>#{inv.invoiceId}</Typography>
        </Box>
      </Box>
      <Box sx={{ height: 2, background: cfg.primary, mt: 2 }} />
      <Box sx={{ height: 1, background: cfg.secondary, mt: '3px', mb: 4 }} />

      <Typography sx={{ fontSize: 28, fontWeight: 800, color: '#1c1917', mb: 0.5 }}>
        {inv.billFrom?.companyName || inv.billFrom?.name || 'Your Company'}
      </Typography>
      <Typography sx={{ fontSize: 12, color: '#78716c', mb: 4 }}>{inv.billFrom?.email} {inv.billFrom?.phone ? ` · ${inv.billFrom.phone}` : ''}</Typography>

      <Box sx={{ display: 'flex', mb: 4 }}>
        <Box sx={{ width: '50%', pr: 3, boxSizing: 'border-box', borderRight: `1px solid ${cfg.primary}33` }}>
          <Typography sx={{ fontSize: 10, fontWeight: 700, color: cfg.primary, mb: 1 }}>PREPARED FOR</Typography>
          <Typography sx={{ fontSize: 15, fontWeight: 700 }}>{inv.clientName}</Typography>
          <Typography sx={{ fontSize: 12, color: '#78716c' }}>{inv.clientEmail}</Typography>
          <Typography sx={{ fontSize: 12, color: '#78716c' }}>{inv.clientAddress}</Typography>
        </Box>
        <Box sx={{ width: '50%', pl: 3, boxSizing: 'border-box' }}>
          <Typography sx={{ fontSize: 10, fontWeight: 700, color: cfg.primary, mb: 1 }}>SCHEDULE</Typography>
          <Typography sx={{ fontSize: 13 }}>Issued {fmtDate(inv.date)}</Typography>
          <Typography sx={{ fontSize: 13, fontWeight: 700, color: cfg.primary, mt: 0.5 }}>Due {fmtDate(inv.dueDate)}</Typography>
        </Box>
      </Box>

      <FancyItems items={inv.items} currency={currency} headBg={cfg.primary} />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}><Totals {...{ sub, tax, total, inv, currency, cfg, invert: true }} /></Box>
      {inv.notes && (
        <Box sx={{ mt: 4, pt: 3, borderTop: `1px solid ${cfg.primary}33` }}>
          <Typography sx={{ fontSize: 10, fontWeight: 700, color: cfg.primary, mb: 1 }}>WITH COMPLIMENTS</Typography>
          <Typography sx={{ fontSize: 13, color: '#57534e', lineHeight: 1.7 }}>{inv.notes}</Typography>
        </Box>
      )}
    </Box>
  );
}

export function LayoutSplit({ inv, cfg, currency }) {
  const { sub, tax, total } = calc(inv);
  return (
    <Box sx={{ background: '#fff', ...pdfFont, width: 794, minHeight: 1123, boxSizing: 'border-box', display: 'flex' }}>
      <Box sx={{
        width: 280, flexShrink: 0, background: `linear-gradient(180deg, ${cfg.primary} 0%, ${cfg.dark} 100%)`,
        p: '48px 28px', display: 'flex', flexDirection: 'column', color: '#fff',
      }}>
        <Typography sx={{ fontSize: 12, opacity: 0.7, mb: 1 }}>INVOICE</Typography>
        <Typography sx={{ fontSize: 22, fontWeight: 800, lineHeight: 1.2, mb: 3 }}>
          {inv.billFrom?.companyName || inv.billFrom?.name}
        </Typography>
        <Box sx={{ height: 3, width: 48, background: cfg.secondary, mb: 4, borderRadius: 2 }} />
        <Typography sx={{ fontSize: 10, opacity: 0.55, mb: 0.5 }}>NUMBER</Typography>
        <Typography sx={{ fontWeight: 700, mb: 3 }}>#{inv.invoiceId}</Typography>
        <Typography sx={{ fontSize: 10, opacity: 0.55, mb: 0.5 }}>ISSUED</Typography>
        <Typography sx={{ mb: 2 }}>{fmtDate(inv.date)}</Typography>
        <Typography sx={{ fontSize: 10, opacity: 0.55, mb: 0.5 }}>DUE</Typography>
        <Typography sx={{ mb: 4 }}>{fmtDate(inv.dueDate)}</Typography>
        <Box sx={{ mt: 'auto', p: 2, borderRadius: 2, background: 'rgba(255,255,255,0.12)' }}>
          <Typography sx={{ fontSize: 11, opacity: 0.7 }}>Amount due</Typography>
          <Typography sx={{ fontSize: 26, fontWeight: 800 }}>{fmt(total, currency)}</Typography>
        </Box>
      </Box>
      <Box sx={{ flex: 1, p: '48px 36px' }}>
        <Box sx={{ display: 'flex', mb: 4 }}>
          <Box sx={{ width: '50%', pr: 2 }}>
            <Typography sx={{ fontSize: 10, fontWeight: 700, color: cfg.primary, mb: 1 }}>FROM</Typography>
            <Typography sx={{ fontWeight: 700, fontSize: 14 }}>{inv.billFrom?.name}</Typography>
            <Typography sx={{ fontSize: 12, color: '#64748b' }}>{inv.billFrom?.email}</Typography>
          </Box>
          <Box sx={{ width: '50%' }}>
            <Typography sx={{ fontSize: 10, fontWeight: 700, color: cfg.primary, mb: 1 }}>BILL TO</Typography>
            <Typography sx={{ fontWeight: 700, fontSize: 14 }}>{inv.clientName}</Typography>
            <Typography sx={{ fontSize: 12, color: '#64748b' }}>{inv.clientEmail}</Typography>
            <Typography sx={{ fontSize: 12, color: '#64748b' }}>{inv.clientAddress}</Typography>
          </Box>
        </Box>
        <FancyItems items={inv.items} currency={currency} headBg={cfg.light} headColor={cfg.primary} zebra />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Box sx={{ width: 220 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.7 }}>
              <Typography sx={{ fontSize: 13, color: '#64748b' }}>Subtotal</Typography>
              <Typography sx={{ fontSize: 13 }}>{fmt(sub, currency)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.7 }}>
              <Typography sx={{ fontSize: 13, color: '#64748b' }}>Tax</Typography>
              <Typography sx={{ fontSize: 13 }}>{fmt(tax, currency)}</Typography>
            </Box>
          </Box>
        </Box>
        {inv.notes && <Typography sx={{ mt: 4, fontSize: 12, color: '#64748b', lineHeight: 1.6 }}>{inv.notes}</Typography>}
      </Box>
    </Box>
  );
}

export function LayoutFrame({ inv, cfg, currency }) {
  const { sub, tax, total } = calc(inv);
  return (
    <Box sx={{ background: '#fff', ...pdfFont, width: 794, minHeight: 1123, p: '28px', boxSizing: 'border-box' }}>
      <Box sx={{ border: `3px solid ${cfg.primary}`, minHeight: 1067, p: '36px 40px', position: 'relative' }}>
        <Box sx={{ position: 'absolute', top: 10, left: 10, width: 14, height: 14, background: cfg.secondary }} />
        <Box sx={{ position: 'absolute', top: 10, right: 10, width: 14, height: 14, background: cfg.secondary }} />
        <Box sx={{ position: 'absolute', bottom: 10, left: 10, width: 14, height: 14, background: cfg.secondary }} />
        <Box sx={{ position: 'absolute', bottom: 10, right: 10, width: 14, height: 14, background: cfg.secondary }} />

        <Typography sx={{ textAlign: 'center', fontSize: 12, fontWeight: 700, color: cfg.primary, mb: 0.5 }}>OFFICIAL DOCUMENT</Typography>
        <Typography sx={{ textAlign: 'center', fontSize: 34, fontWeight: 800, color: '#0f172a', mb: 0.5 }}>INVOICE</Typography>
        <Typography sx={{ textAlign: 'center', fontSize: 14, color: '#64748b', mb: 3 }}>#{inv.invoiceId}</Typography>
        <Box sx={{ height: 1, background: cfg.primary, mb: 4 }} />

        <Box sx={{ display: 'flex', mb: 4 }}>
          <Box sx={{ width: '33.33%', pr: 2 }}>
            <Typography sx={{ fontSize: 10, fontWeight: 700, color: cfg.primary, mb: 1 }}>ISSUER</Typography>
            <Typography sx={{ fontWeight: 700, fontSize: 14 }}>{inv.billFrom?.companyName || inv.billFrom?.name}</Typography>
            <Typography sx={{ fontSize: 12, color: '#64748b' }}>{inv.billFrom?.email}</Typography>
          </Box>
          <Box sx={{ width: '33.33%', pr: 2 }}>
            <Typography sx={{ fontSize: 10, fontWeight: 700, color: cfg.primary, mb: 1 }}>CLIENT</Typography>
            <Typography sx={{ fontWeight: 700, fontSize: 14 }}>{inv.clientName}</Typography>
            <Typography sx={{ fontSize: 12, color: '#64748b' }}>{inv.clientAddress}</Typography>
          </Box>
          <Box sx={{ width: '33.33%' }}>
            <Typography sx={{ fontSize: 10, fontWeight: 700, color: cfg.primary, mb: 1 }}>DATES</Typography>
            <Typography sx={{ fontSize: 12 }}>{fmtDate(inv.date)}</Typography>
            <Typography sx={{ fontSize: 12, fontWeight: 700 }}>Due {fmtDate(inv.dueDate)}</Typography>
          </Box>
        </Box>

        <FancyItems items={inv.items} currency={currency} headBg={cfg.primary} />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}><Totals {...{ sub, tax, total, inv, currency, cfg, invert: true }} /></Box>
        {inv.notes && (
          <Box sx={{ mt: 4, p: 2, border: `1px dashed ${cfg.primary}` }}>
            <Typography sx={{ fontSize: 12, color: '#475569', lineHeight: 1.6 }}>{inv.notes}</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export function LayoutStripe({ inv, cfg, currency }) {
  const { sub, tax, total } = calc(inv);
  const initial = (inv.billFrom?.companyName || inv.billFrom?.name || 'I').charAt(0);
  return (
    <Box sx={{ background: '#fff', ...pdfFont, width: 794, minHeight: 1123, boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ height: 18, background: cfg.primary }} />
      <Box sx={{ height: 6, background: cfg.secondary }} />

      <Box sx={{ px: '56px', py: '40px', flex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{
              width: 52, height: 52, borderRadius: '50%',
              background: `linear-gradient(135deg, ${cfg.primary}, ${cfg.secondary})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: 20 }}>{initial}</Typography>
            </Box>
            <Box>
              <Typography sx={{ fontSize: 20, fontWeight: 800 }}>{inv.billFrom?.companyName || inv.billFrom?.name}</Typography>
              <Typography sx={{ fontSize: 12, color: '#64748b' }}>{inv.billFrom?.email}</Typography>
            </Box>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography sx={{ fontSize: 11, color: '#94a3b8' }}>Invoice</Typography>
            <Typography sx={{ fontSize: 18, fontWeight: 800, color: cfg.primary }}>#{inv.invoiceId}</Typography>
          </Box>
        </Box>

        <Box sx={{
          display: 'flex', background: cfg.light, borderRadius: 2, p: 2.5, mb: 3,
          border: `1px solid ${cfg.primary}22`,
        }}>
          <Box sx={{ width: '40%' }}>
            <Typography sx={{ fontSize: 10, fontWeight: 700, color: cfg.primary, mb: 0.5 }}>BILL TO</Typography>
            <Typography sx={{ fontWeight: 700 }}>{inv.clientName}</Typography>
            <Typography sx={{ fontSize: 12, color: '#64748b' }}>{inv.clientEmail}</Typography>
          </Box>
          <Box sx={{ width: '30%' }}>
            <Typography sx={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', mb: 0.5 }}>ISSUED</Typography>
            <Typography sx={{ fontWeight: 600 }}>{fmtDate(inv.date)}</Typography>
          </Box>
          <Box sx={{ width: '30%' }}>
            <Typography sx={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', mb: 0.5 }}>DUE</Typography>
            <Typography sx={{ fontWeight: 600, color: cfg.primary }}>{fmtDate(inv.dueDate)}</Typography>
          </Box>
        </Box>

        <Box sx={{ border: '1px dashed #cbd5e1', mb: 3 }} />
        <FancyItems items={inv.items} currency={currency} headBg={cfg.primary} zebra />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}><Totals {...{ sub, tax, total, inv, currency, cfg, invert: true }} /></Box>
        {inv.notes && <Typography sx={{ mt: 3, fontSize: 12, color: '#64748b' }}>{inv.notes}</Typography>}
      </Box>

      <Box sx={{
        px: '56px', py: 2, background: cfg.primary, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>Thank you for your business</Typography>
        <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: 16 }}>{fmt(total, currency)}</Typography>
      </Box>
    </Box>
  );
}

export function LayoutEditorial({ inv, cfg, currency }) {
  const { sub, tax, total } = calc(inv);
  return (
    <Box sx={{ background: '#fff', ...pdfFont, width: 794, minHeight: 1123, boxSizing: 'border-box', display: 'flex' }}>
      <Box sx={{ width: 14, background: `linear-gradient(180deg, ${cfg.primary}, ${cfg.secondary})`, flexShrink: 0 }} />
      <Box sx={{ flex: 1, p: '52px 48px 52px 40px', position: 'relative', overflow: 'hidden' }}>
        <Typography sx={{
          position: 'absolute', top: 20, right: 24, fontSize: 120, fontWeight: 800,
          color: `${cfg.primary}12`, lineHeight: 1, userSelect: 'none',
        }}>INV</Typography>

        <Typography sx={{ fontSize: 12, fontWeight: 700, color: cfg.primary, mb: 1 }}>INVOICE {inv.invoiceId}</Typography>
        <Typography sx={{ fontSize: 36, fontWeight: 800, color: '#0f172a', lineHeight: 1.1, mb: 1, position: 'relative' }}>
          {inv.billFrom?.companyName || inv.billFrom?.name || 'Invoice'}
        </Typography>
        <Typography sx={{ fontSize: 13, color: '#64748b', mb: 4 }}>
          Issued {fmtDate(inv.date)} · Due {fmtDate(inv.dueDate)}
        </Typography>

        <Box sx={{ display: 'flex', mb: 4, p: 2, background: cfg.light, borderRadius: 1 }}>
          <Box sx={{ width: '50%' }}>
            <Typography sx={{ fontSize: 10, fontWeight: 700, color: cfg.primary, mb: 0.5 }}>FROM</Typography>
            <Typography sx={{ fontWeight: 700 }}>{inv.billFrom?.name}</Typography>
            <Typography sx={{ fontSize: 12, color: '#64748b' }}>{inv.billFrom?.email}</Typography>
          </Box>
          <Box sx={{ width: '50%' }}>
            <Typography sx={{ fontSize: 10, fontWeight: 700, color: cfg.primary, mb: 0.5 }}>TO</Typography>
            <Typography sx={{ fontWeight: 700 }}>{inv.clientName}</Typography>
            <Typography sx={{ fontSize: 12, color: '#64748b' }}>{inv.clientEmail}</Typography>
            <Typography sx={{ fontSize: 12, color: '#64748b' }}>{inv.clientAddress}</Typography>
          </Box>
        </Box>

        {(inv.items || []).map((item, i) => (
          <Box key={i} sx={{ display: 'flex', py: 1.5, borderBottom: '1px solid #e2e8f0', alignItems: 'flex-start' }}>
            <Typography sx={{ width: 36, fontSize: 13, fontWeight: 800, color: cfg.primary }}>
              {String(i + 1).padStart(2, '0')}
            </Typography>
            <Typography sx={{ flex: 1, fontSize: 14, color: '#334155' }}>{item.desc || '—'}</Typography>
            <Typography sx={{ width: 40, textAlign: 'center', fontSize: 13, color: '#64748b' }}>{item.qty}</Typography>
            <Typography sx={{ width: 90, textAlign: 'right', fontSize: 14, fontWeight: 700 }}>
              {fmt(Number(item.qty) * Number(item.rate), currency)}
            </Typography>
          </Box>
        ))}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mt: 4 }}>
          <Box sx={{ maxWidth: 280 }}>
            {inv.notes && <Typography sx={{ fontSize: 12, color: '#64748b', lineHeight: 1.7 }}>{inv.notes}</Typography>}
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography sx={{ fontSize: 12, color: '#94a3b8' }}>Subtotal {fmt(sub, currency)} · Tax {fmt(tax, currency)}</Typography>
            <Typography sx={{ fontSize: 32, fontWeight: 800, color: cfg.primary, lineHeight: 1.2 }}>{fmt(total, currency)}</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
