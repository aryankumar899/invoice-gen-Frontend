export function daysFromToday(date) {
  if (!date) return null;
  const a = new Date();
  a.setHours(0, 0, 0, 0);
  const b = new Date(date);
  b.setHours(0, 0, 0, 0);
  return Math.round((b - a) / 86400000);
}

export function getMoneyWeather(invoices = []) {
  const open = invoices.filter((i) => i.status !== 'Paid');
  const overdue = open.filter((i) => i.status === 'Overdue' || (i.dueDate && daysFromToday(i.dueDate) < 0));
  const dueSoon = open.filter((i) => {
    const d = daysFromToday(i.dueDate);
    return d !== null && d >= 0 && d <= 7;
  });
  const overdueAmt = overdue.reduce((s, i) => s + (i.totalAmount || 0), 0);
  const soonAmt = dueSoon.reduce((s, i) => s + (i.totalAmount || 0), 0);
  const pendingAmt = open.reduce((s, i) => s + (i.totalAmount || 0), 0);

  let mood = 'Clear sky';
  let blurb = 'Books look calm. Cash is flowing without storm clouds.';
  let tone = '#10b981';
  if (overdue.length >= 3 || overdueAmt > pendingAmt * 0.4) {
    mood = 'Money monsoon';
    blurb = 'Overdue invoices are flooding in. Nudge the loudest clients first.';
    tone = '#ef4444';
  } else if (overdue.length > 0 || dueSoon.length > 0) {
    mood = 'Heat haze';
    blurb = 'A few payments are warming up. Collect this week and stay sunny.';
    tone = '#f59e0b';
  }

  const hottest = [...overdue, ...dueSoon].sort((a, b) => (b.totalAmount || 0) - (a.totalAmount || 0))[0] || null;
  return { mood, blurb, tone, overdue, dueSoon, overdueAmt, soonAmt, pendingAmt, hottest };
}

export function getInvoiceScore({ invoiceData, items, billFrom, bankDetails, upiId }) {
  const checks = [
    { ok: !!invoiceData.clientName?.trim(), label: 'Client name', pts: 22 },
    { ok: !!invoiceData.clientEmail?.trim(), label: 'Client email', pts: 10 },
    { ok: items.some((i) => i.desc?.trim() && Number(i.rate) > 0), label: 'A priced item', pts: 24 },
    { ok: !!invoiceData.dueDate, label: 'Due date', pts: 14 },
    { ok: !!billFrom.name?.trim() || !!billFrom.companyName?.trim(), label: 'Your identity', pts: 12 },
    { ok: !!bankDetails.bankName || !!bankDetails.accountNumber || !!upiId, label: 'Pay path', pts: 18 },
  ];
  const score = checks.reduce((s, c) => s + (c.ok ? c.pts : 0), 0);
  return { score, checks, missing: checks.filter((c) => !c.ok).map((c) => c.label) };
}

export function itemMemory(invoices = []) {
  const map = new Map();
  invoices.forEach((inv) => {
    (inv.items || []).forEach((item) => {
      const key = (item.desc || '').trim();
      if (!key) return;
      if (!map.has(key)) map.set(key, { desc: key, rate: Number(item.rate) || 0, uses: 0 });
      const row = map.get(key);
      row.uses += 1;
      row.rate = Number(item.rate) || row.rate;
    });
  });
  return [...map.values()].sort((a, b) => b.uses - a.uses).slice(0, 8);
}

export function findTwin(invoices, clientName, amount) {
  if (!clientName || !amount) return null;
  const week = 7 * 86400000;
  return invoices.find((inv) => {
    const sameClient = (inv.clientName || '').toLowerCase() === clientName.toLowerCase();
    const sameAmt = Math.abs((inv.totalAmount || 0) - amount) < 0.05;
    const recent = Date.now() - new Date(inv.date || inv.createdAt).getTime() < week;
    return sameClient && sameAmt && recent;
  }) || null;
}

export function nudgeText(inv, currency = '₹') {
  const days = daysFromToday(inv.dueDate);
  const dueLine = days === null
    ? 'This invoice is waiting on payment.'
    : days < 0
      ? `This was due ${Math.abs(days)} day${Math.abs(days) === 1 ? '' : 's'} ago.`
      : days === 0
        ? 'This is due today.'
        : `This is due in ${days} days.`;
  return `Hi ${inv.clientName || 'there'},\n\nGentle nudge on invoice ${inv.invoiceId} for ${currency}${Number(inv.totalAmount || 0).toFixed(2)}. ${dueLine}\n\nYou can reply here and I will send payment details.\n\nThanks!`;
}

export function whatsappUrl(phone, text) {
  const digits = String(phone || '').replace(/\D/g, '');
  const base = digits ? `https://wa.me/${digits}` : 'https://wa.me/';
  return `${base}?text=${encodeURIComponent(text)}`;
}

export function upiQrUrl({ upiId, name, amount, invoiceId }) {
  if (!upiId) return '';
  const pay = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(name || 'Invoice AI')}&am=${encodeURIComponent(Number(amount || 0).toFixed(2))}&cu=INR&tn=${encodeURIComponent(invoiceId || 'Invoice')}`;
  return `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(pay)}`;
}

export function fingerprintCells(seed = '') {
  let h = 0;
  for (let i = 0; i < seed.length; i += 1) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return Array.from({ length: 15 }, (_, i) => ((h >> (i % 24)) + i * 7) % 2 === 0);
}

function localYmd(value) {
  const x = new Date(value);
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`;
}

export function dueConstellation(invoices = [], days = 14) {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    const key = localYmd(d);
    const items = invoices.filter((inv) => {
      if (!inv.dueDate || inv.status === 'Paid') return false;
      return localYmd(inv.dueDate) === key;
    });
    return {
      date: d,
      key,
      items,
      dow: d.toLocaleDateString('en-IN', { weekday: 'short' }),
      day: d.getDate(),
    };
  });
}

export function huntQueue(invoices = []) {
  return invoices
    .filter((i) => i.status !== 'Paid')
    .map((i) => {
      const late = daysFromToday(i.dueDate);
      const daysLate = late === null ? 0 : Math.max(0, -late);
      const heat = (i.totalAmount || 0) * (1 + daysLate * 0.15);
      return { ...i, daysLate, heat };
    })
    .sort((a, b) => b.heat - a.heat)
    .slice(0, 5);
}

export function clientAura(invoices = [], clientName = '') {
  const mine = invoices.filter(
    (i) => (i.clientName || '').toLowerCase() === clientName.toLowerCase()
  );
  if (!mine.length) return { label: 'New orbit', color: '#64748b', hint: 'No bills yet' };
  const overdue = mine.filter((i) => i.status === 'Overdue').length;
  const paid = mine.filter((i) => i.status === 'Paid').length;
  const pending = mine.filter((i) => i.status === 'Pending').length;
  if (overdue >= 2 || overdue / mine.length > 0.4) {
    return { label: 'Slow drift', color: '#ef4444', hint: `${overdue} overdue` };
  }
  if (paid && paid >= mine.length * 0.7) {
    return { label: 'Swift pay', color: '#10b981', hint: `${paid} settled` };
  }
  return { label: 'Steady glow', color: '#f59e0b', hint: `${pending} open` };
}

export function weaveNotes(tone, { clientName, invoiceId, dueDate, currency = '₹', total }) {
  const due = dueDate
    ? new Date(dueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : 'the due date';
  const who = clientName || 'there';
  const id = invoiceId || 'this invoice';
  const amt = `${currency}${Number(total || 0).toFixed(2)}`;
  if (tone === 'warm') {
    return `Hey ${who},\n\nLoved working with you. ${id} for ${amt} is ready whenever you are — ideally by ${due}. No rush, just a clean close.\n\nThank you!`;
  }
  if (tone === 'strict') {
    return `${who},\n\n${id} for ${amt} is payable by ${due}. Please settle in full to keep the account current. Follow-up starts automatically after the due date.\n\nRegards`;
  }
  return `Dear ${who},\n\nPlease find ${id} for ${amt}. Payment is due by ${due}. Kindly arrange settlement at your earliest convenience.\n\nThank you for your business.`;
}

export function luckySendWindow(invoices = []) {
  const hours = invoices
    .map((i) => new Date(i.createdAt || i.date).getHours())
    .filter((h) => !Number.isNaN(h));
  const bucket = new Array(24).fill(0);
  hours.forEach((h) => { bucket[h] += 1; });
  let best = 10;
  bucket.forEach((n, h) => { if (n > bucket[best]) best = h; });
  if (!hours.length) best = 10;
  const pad = (h) => `${String(h).padStart(2, '0')}:00`;
  return { label: `${pad(best)}–${pad((best + 1) % 24)}` };
}

export function dueDateWarning(dueDate) {
  if (!dueDate) return null;
  const day = new Date(dueDate).getDay();
  if (day === 0) return 'Sunday orbit — many clients skip weekend bills. Shift to Monday?';
  if (day === 6) return 'Saturday drop — payments often wait until Monday.';
  return null;
}

export function monthCollect(invoices = []) {
  const now = new Date();
  const mine = invoices.filter((i) => {
    const d = new Date(i.date || i.createdAt);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const billed = mine.reduce((s, i) => s + (i.totalAmount || 0), 0);
  const collected = mine.filter((i) => i.status === 'Paid').reduce((s, i) => s + (i.totalAmount || 0), 0);
  const pct = billed ? Math.round((collected / billed) * 100) : 0;
  return { billed, collected, pct, count: mine.length };
}
