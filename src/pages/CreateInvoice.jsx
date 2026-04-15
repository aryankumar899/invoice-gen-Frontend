import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Paper, TextField, Button, Grid, IconButton, Divider, Snackbar, Alert } from '@mui/material';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SendIcon from '@mui/icons-material/Send';
import DownloadIcon from '@mui/icons-material/Download';
import SaveIcon from '@mui/icons-material/Save';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function CreateInvoice() {
  const pdfRef = useRef(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const showMessage = (message, severity = 'error') => setSnackbar({ open: true, message, severity });
  const handleCloseSnackbar = () => setSnackbar(prev => ({ ...prev, open: false }));

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const currency = user.currency || '₹';

  const generateInvoiceId = () => `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const [billFrom, setBillFrom] = useState({
    name: user.name || '',
    companyName: user.companyName || '',
    email: user.email || '',
    phone: user.phone || '',
    address: user.address || ''
  });
  const handleBillFromChange = (field, value) => setBillFrom(prev => ({ ...prev, [field]: value }));

  const [invoiceData, setInvoiceData] = useState({
    clientName: '', clientEmail: '', clientAddress: '',
    invoiceId: generateInvoiceId(), date: new Date().toISOString().split('T')[0], dueDate: '', notes: 'Payment is due within 30 days. Thank you for your business!'
  });

  const [bankDetails, setBankDetails] = useState({
    bankName: '', accountName: '', accountNumber: '', routingNumber: ''
  });

  const [items, setItems] = useState([{ id: 1, desc: '', qty: 1, rate: 0 }]);
  const [tax, setTax] = useState(10);
  
  useEffect(() => {
    if (editId) {
      const fetchInvoice = async () => {
        try {
          const res = await fetch(`http://localhost:5000/api/invoices/${editId}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          });
          if (res.ok) {
            const data = await res.json();
            setInvoiceData({
              clientName: data.clientName || '',
              clientEmail: data.clientEmail || '',
              clientAddress: data.clientAddress || '',
              invoiceId: data.invoiceId || '',
              date: data.date ? data.date.split('T')[0] : '',
              dueDate: data.dueDate ? data.dueDate.split('T')[0] : '',
              notes: data.notes || ''
            });
            if (data.billFrom) setBillFrom(prev => ({ ...prev, ...data.billFrom }));
            if (data.bankDetails) setBankDetails({ ...bankDetails, ...data.bankDetails });
            if (data.items && data.items.length > 0) setItems(data.items);
            if (data.tax !== undefined) setTax(data.tax);
          }
        } catch (err) {
          console.error("Error fetching invoice:", err);
        }
      };
      fetchInvoice();
    }
  }, [editId]);

  const handleAddItem = () => {
    setItems([...items, { id: Date.now(), desc: '', qty: 1, rate: 0 }]);
  };

  const handleRemoveItem = (id) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const handleItemChange = (id, field, value) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleChange = (field, value) => setInvoiceData(prev => ({ ...prev, [field]: value }));
  const handleBankChange = (field, value) => setBankDetails(prev => ({ ...prev, [field]: value }));

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + (Number(item.qty) * Number(item.rate)), 0);
  const taxAmount = subtotal * (Number(tax) / 100);
  const total = subtotal + taxAmount;

  // PDF Generation
  const [isGenerating, setIsGenerating] = useState(false);
  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    await handleSaveInvoice(true); // Silent auto-save when pdf is saved

    // Add brief pause for rendering buffer
    await new Promise(resolve => setTimeout(resolve, 50));
    const element = pdfRef.current;
    
    // Using scale 2 or 3 increases quality
    const canvas = await html2canvas(element, { scale: 3, useCORS: true, logging: false });
    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    // A4 ratio
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${invoiceData.invoiceId || 'Invoice'}.pdf`);
    setIsGenerating(false);
  };

  const [isSaving, setIsSaving] = useState(false);
  const handleSaveInvoice = async () => {
    if (!invoiceData.clientName) {
      showMessage("Please provide a Client Name before saving.");
      return;
    }

    if (!invoiceData.invoiceId) {
      showMessage("Invoice ID is required!");
      return;
    }

    if (invoiceData.clientEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(invoiceData.clientEmail)) {
        showMessage("Please provide a valid Client Email format.");
        return;
      }
    }

    setIsSaving(true);
    try {
      const payload = {
        ...invoiceData,
        billFrom,
        items,
        tax,
        bankDetails,
        status: 'Pending'
      };

      let url = 'http://localhost:5000/api/invoices';
      let method = 'POST';
      
      if (editId) {
        url = `http://localhost:5000/api/invoices/${editId}`;
        method = 'PUT';
      }

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        navigate('/dashboard/invoices');
      } else {
        const errData = await res.json();
        showMessage(errData.message || 'Failed to save invoice.');
      }
    } catch (err) {
      console.error(err);
      showMessage('Error saving invoice.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#fff', mb: 0.5 }}>New Invoice</Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>Create and send a professional invoice.</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            variant="contained" 
            onClick={handleSaveInvoice}
            disabled={isSaving}
            startIcon={<SaveIcon />} 
            sx={{ background: '#6366f1', '&:hover': { background: '#4f46e5' } }}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </Box>
      </Box>

      {/* Paper 1: Bill From & Invoice Details */}
      <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, background: 'rgba(17, 24, 39, 0.7)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.05)', mb: 4 }}>
        <Grid container spacing={4}>

          {/* Billed From */}
          <Grid item xs={12} md={6}>
            <Typography variant="overline" sx={{ color: '#10b981', fontWeight: 700, letterSpacing: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              <BusinessIcon fontSize="small" /> Billed From
            </Typography>
            <TextField fullWidth placeholder="Your Name" variant="standard" value={billFrom.name} onChange={(e) => handleBillFromChange('name', e.target.value)} sx={{ mt: 1, '& .MuiInputBase-input': { color: '#fff', fontSize: '1.1rem', fontWeight: 600 } }} InputProps={{ disableUnderline: false }} />
            <TextField fullWidth placeholder="Company Name" variant="standard" value={billFrom.companyName} onChange={(e) => handleBillFromChange('companyName', e.target.value)} sx={{ mt: 2, '& .MuiInputBase-input': { color: 'text.secondary' } }} />
            <TextField fullWidth placeholder="Your Email" variant="standard" value={billFrom.email} onChange={(e) => handleBillFromChange('email', e.target.value)} sx={{ mt: 2, '& .MuiInputBase-input': { color: 'text.secondary' } }} />
            <TextField fullWidth placeholder="Phone" variant="standard" value={billFrom.phone} onChange={(e) => handleBillFromChange('phone', e.target.value)} sx={{ mt: 2, '& .MuiInputBase-input': { color: 'text.secondary' } }} />
            <TextField fullWidth placeholder="Your Address" variant="standard" multiline rows={2} value={billFrom.address} onChange={(e) => handleBillFromChange('address', e.target.value)} sx={{ mt: 2, '& .MuiInputBase-input': { color: 'text.secondary' } }} />
          </Grid>

          {/* Billed To */}
          <Grid item xs={12} md={6}>
            <Typography variant="overline" sx={{ color: '#6366f1', fontWeight: 700, letterSpacing: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              <PersonIcon fontSize="small" /> Billed To
            </Typography>
            <TextField fullWidth placeholder="Client Name" variant="standard" value={invoiceData.clientName} onChange={(e) => handleChange('clientName', e.target.value)} sx={{ mt: 1, '& .MuiInputBase-input': { color: '#fff', fontSize: '1.1rem', fontWeight: 600 } }} InputProps={{ disableUnderline: false }} />
            <TextField fullWidth placeholder="Client Email" variant="standard" value={invoiceData.clientEmail} onChange={(e) => handleChange('clientEmail', e.target.value)} sx={{ mt: 2, '& .MuiInputBase-input': { color: 'text.secondary' } }} />
            <TextField fullWidth placeholder="Client Address" variant="standard" multiline rows={2} value={invoiceData.clientAddress} onChange={(e) => handleChange('clientAddress', e.target.value)} sx={{ mt: 2, '& .MuiInputBase-input': { color: 'text.secondary' } }} />
          </Grid>
          <Grid item xs={12} md={6} sx={{ textAlign: { md: 'right' } }}>
             <Typography variant="overline" sx={{ color: '#ec4899', fontWeight: 700, letterSpacing: 1, display: 'flex', alignItems: 'center', justifyContent: { md: 'flex-end' }, gap: 1 }}>
               <ReceiptIcon fontSize="small" /> Invoice Details
             </Typography>
             <Box sx={{ display: 'flex', justifyContent: { md: 'flex-end' }, alignItems: 'center', mt: 1, gap: 2 }}>
               <Typography variant="body2" sx={{ color: 'text.secondary', width: 100 }}>Invoice #</Typography>
               <TextField variant="outlined" size="small" value={invoiceData.invoiceId} onChange={(e) => handleChange('invoiceId', e.target.value)} sx={{ width: 150, '& .MuiInputBase-input': { color: '#fff' }, fieldset: { borderColor: 'rgba(255,255,255,0.1)' } }} />
             </Box>
             <Box sx={{ display: 'flex', justifyContent: { md: 'flex-end' }, alignItems: 'center', mt: 2, gap: 2 }}>
               <Typography variant="body2" sx={{ color: 'text.secondary', width: 100 }}>Date</Typography>
               <DatePicker
                 value={invoiceData.date ? dayjs(invoiceData.date) : null}
                 onChange={(newValue) => {
                   if (newValue && newValue.isValid()) handleChange('date', newValue.format('YYYY-MM-DD'));
                   else handleChange('date', '');
                 }}
                 slotProps={{
                   textField: {
                     size: "small",
                     sx: { width: 150, '& .MuiInputBase-input': { color: '#fff' }, fieldset: { borderColor: 'rgba(255,255,255,0.1)' }, svg: { color: '#fff' } }
                   }
                 }}
               />
             </Box>
             <Box sx={{ display: 'flex', justifyContent: { md: 'flex-end' }, alignItems: 'center', mt: 2, gap: 2 }}>
               <Typography variant="body2" sx={{ color: 'text.secondary', width: 100 }}>Due Date</Typography>
               <DatePicker
                 value={invoiceData.dueDate ? dayjs(invoiceData.dueDate) : null}
                 onChange={(newValue) => {
                   if (newValue && newValue.isValid()) handleChange('dueDate', newValue.format('YYYY-MM-DD'));
                   else handleChange('dueDate', '');
                 }}
                 slotProps={{
                   textField: {
                     size: "small",
                     sx: { width: 150, '& .MuiInputBase-input': { color: '#fff' }, fieldset: { borderColor: 'rgba(255,255,255,0.1)' }, svg: { color: '#fff' } }
                   }
                 }}
               />
             </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Paper 2: Line Items */}
      <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, background: 'rgba(17, 24, 39, 0.7)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.05)', mb: 4 }}>
        <Typography variant="h6" sx={{ color: '#fff', mb: 4, display: 'flex', alignItems: 'center', gap: 1 }}>
          <FormatListBulletedIcon sx={{ color: '#10b981' }} /> Line Items
        </Typography>
        
        {/* Items Table Header */}
        <Grid container spacing={2} sx={{ mb: 2, px: 2, display: { xs: 'none', md: 'flex' } }}>
          <Grid item md={6}><Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 600 }}>Item Description</Typography></Grid>
          <Grid item md={2}><Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 600 }}>Qty</Typography></Grid>
          <Grid item md={2}><Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 600 }}>Rate</Typography></Grid>
          <Grid item md={2} sx={{ textAlign: 'right' }}><Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 600 }}>Amount</Typography></Grid>
        </Grid>

        {/* Items List */}
        {items.map((item) => (
          <Box key={item.id} sx={{ mb: 2, p: 2, background: 'rgba(0,0,0,0.2)', borderRadius: 2, position: 'relative', '&:hover .delete-btn': { opacity: 1 } }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField fullWidth placeholder="Description of service or product..." variant="standard" value={item.desc} onChange={(e) => handleItemChange(item.id, 'desc', e.target.value)} InputProps={{ disableUnderline: true, sx: { color: '#fff', fontWeight: 500 } }} />
              </Grid>
              <Grid item xs={6} md={2}>
                <TextField fullWidth type="number" placeholder="0" variant="outlined" size="small" value={item.qty} onChange={(e) => handleItemChange(item.id, 'qty', e.target.value)} sx={{ '& .MuiInputBase-input': { color: '#fff' }, fieldset: { borderColor: 'rgba(255,255,255,0.1)' } }} />
              </Grid>
              <Grid item xs={6} md={2}>
                <TextField fullWidth type="number" placeholder="0.00" variant="outlined" size="small" value={item.rate} onChange={(e) => handleItemChange(item.id, 'rate', e.target.value)} sx={{ '& .MuiInputBase-input': { color: '#fff' }, fieldset: { borderColor: 'rgba(255,255,255,0.1)' } }} />
              </Grid>
              <Grid item xs={12} md={2} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                <Typography variant="body1" sx={{ color: '#fff', fontWeight: 600 }}>
                  {currency}{(Number(item.qty) * Number(item.rate)).toFixed(2)}
                </Typography>
              </Grid>
            </Grid>
            <IconButton 
              className="delete-btn"
              onClick={() => handleRemoveItem(item.id)}
              sx={{ position: 'absolute', right: -40, top: '50%', transform: 'translateY(-50%)', color: '#ef4444', opacity: { xs: 1, md: 0 }, transition: 'opacity 0.2s' }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}

        <Button startIcon={<AddIcon />} onClick={handleAddItem} sx={{ mt: 1, color: '#10b981', fontWeight: 600 }}>
          Add Item
        </Button>
      </Paper>

      {/* Paper 3: Details & Calculations */}
      <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, background: 'rgba(17, 24, 39, 0.7)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.05)', mb: 4 }}>
        {/* Bank & Totals Section */}
        <Grid container spacing={4} justifyContent="space-between">
          <Grid item xs={12} md={6}>
            {/* Bank Details */}
            <Typography variant="subtitle2" sx={{ color: '#10b981', mb: 2, fontWeight: 700, letterSpacing: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              <AccountBalanceIcon fontSize="small" /> Bank Transfer Details
            </Typography>
            <Box sx={{ background: 'rgba(0,0,0,0.2)', p: 3, borderRadius: 3, mb: 4 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Bank Name" variant="standard" size="small" value={bankDetails.bankName} onChange={(e) => handleBankChange('bankName', e.target.value)} sx={{ '& .MuiInputBase-input': { color: '#fff' } }} InputLabelProps={{ sx: { color: 'text.secondary' } }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Account Name" variant="standard" size="small" value={bankDetails.accountName} onChange={(e) => handleBankChange('accountName', e.target.value)} sx={{ '& .MuiInputBase-input': { color: '#fff' } }} InputLabelProps={{ sx: { color: 'text.secondary' } }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Account Number" variant="standard" size="small" value={bankDetails.accountNumber} onChange={(e) => handleBankChange('accountNumber', e.target.value)} sx={{ '& .MuiInputBase-input': { color: '#fff' } }} InputLabelProps={{ sx: { color: 'text.secondary' } }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Routing/IFSC Code" variant="standard" size="small" value={bankDetails.routingNumber} onChange={(e) => handleBankChange('routingNumber', e.target.value)} sx={{ '& .MuiInputBase-input': { color: '#fff' } }} InputLabelProps={{ sx: { color: 'text.secondary' } }} />
                </Grid>
              </Grid>
            </Box>

            <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 1, fontWeight: 600 }}>Notes / Terms</Typography>
            <TextField fullWidth multiline rows={4} value={invoiceData.notes} onChange={(e) => handleChange('notes', e.target.value)} variant="outlined" sx={{ '& .MuiInputBase-input': { color: 'text.secondary' }, fieldset: { borderColor: 'rgba(255,255,255,0.1)' } }} />
          </Grid>
          
          <Grid item xs={12} md={5}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, mt: 4 }}>
              <Typography sx={{ color: 'text.secondary', fontWeight: 600 }}>Subtotal</Typography>
              <Typography sx={{ color: '#fff', fontWeight: 600 }}>{currency}{subtotal.toFixed(2)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography sx={{ color: 'text.secondary', fontWeight: 600 }}>Tax (%)</Typography>
              <TextField type="number" variant="outlined" size="small" value={tax} onChange={(e) => setTax(e.target.value)} sx={{ width: 80, '& .MuiInputBase-input': { color: '#fff', textAlign: 'right' }, fieldset: { borderColor: 'rgba(255,255,255,0.1)' } }} />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography sx={{ color: 'text.secondary', fontWeight: 600 }}>Tax Amount</Typography>
              <Typography sx={{ color: '#fff', fontWeight: 600 }}>{currency}{taxAmount.toFixed(2)}</Typography>
            </Box>
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6" sx={{ color: '#fff', fontWeight: 800 }}>Total</Typography>
              <Typography variant="h6" sx={{ color: '#6366f1', fontWeight: 800 }}>{currency}{total.toFixed(2)}</Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%', background: '#1f2937', color: '#fff' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* HIDDEN PDF DOM TEMPLATE */}
      <Box sx={{ position: 'absolute', top: -9999, left: -9999, zIndex: -100 }}>
        <Box ref={pdfRef} sx={{ 
          width: '210mm', minHeight: '297mm', background: '#ffffff', color: '#111827', p: '20mm', boxSizing: 'border-box'
        }}>
          {/* Business Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #f3f4f6', pb: 4, mb: 5 }}>
            <Box>
              <Typography sx={{ fontSize: '2.5rem', fontWeight: 800, color: '#111827', letterSpacing: '-1px', lineHeight: 1 }}>INVOICE</Typography>
              <Typography sx={{ fontSize: '1rem', color: '#6b7280', mt: 1 }}>{invoiceData.invoiceId}</Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, color: '#6366f1' }}>Your Company Name</Typography>
              <Typography sx={{ fontSize: '0.9rem', color: '#6b7280', mt: 0.5 }}>contact@company.com<br />www.company.com</Typography>
            </Box>
          </Box>

          {/* Details Section */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 6 }}>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '1px', mb: 1 }}>Bill To</Typography>
              <Typography sx={{ fontSize: '1.1rem', fontWeight: 700 }}>{invoiceData.clientName || 'Client Name'}</Typography>
              <Typography sx={{ fontSize: '0.95rem', color: '#4b5563', mt: 0.5 }}>{invoiceData.clientAddress || 'Client Address'}</Typography>
              <Typography sx={{ fontSize: '0.95rem', color: '#4b5563' }}>{invoiceData.clientEmail || 'Client Email'}</Typography>
            </Box>
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '200px', mb: 1 }}>
                <Typography sx={{ fontSize: '0.9rem', color: '#6b7280' }}>Invoice Date:</Typography>
                <Typography sx={{ fontSize: '0.9rem', fontWeight: 600 }}>{invoiceData.date || '-'}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '200px' }}>
                <Typography sx={{ fontSize: '0.9rem', color: '#6b7280' }}>Due Date:</Typography>
                <Typography sx={{ fontSize: '0.9rem', fontWeight: 600 }}>{invoiceData.dueDate || '-'}</Typography>
              </Box>
            </Box>
          </Box>

          {/* Invoice Items */}
          <Box sx={{ mb: 6 }}>
            <Box sx={{ display: 'flex', background: '#f9fafb', p: 1.5, borderRadius: '8px', mb: 2 }}>
              <Typography sx={{ flex: 6, fontSize: '0.9rem', fontWeight: 700, color: '#374151' }}>Description</Typography>
              <Typography sx={{ flex: 2, fontSize: '0.9rem', fontWeight: 700, color: '#374151', textAlign: 'center' }}>Qty</Typography>
              <Typography sx={{ flex: 2, fontSize: '0.9rem', fontWeight: 700, color: '#374151', textAlign: 'right' }}>Rate</Typography>
              <Typography sx={{ flex: 2, fontSize: '0.9rem', fontWeight: 700, color: '#374151', textAlign: 'right' }}>Amount</Typography>
            </Box>
            {items.map((item, index) => (
              <Box key={index} sx={{ display: 'flex', p: 1.5, borderBottom: '1px solid #f3f4f6' }}>
                <Typography sx={{ flex: 6, fontSize: '0.95rem', color: '#111827' }}>{item.desc || '-'}</Typography>
                <Typography sx={{ flex: 2, fontSize: '0.95rem', color: '#4b5563', textAlign: 'center' }}>{item.qty || 0}</Typography>
                <Typography sx={{ flex: 2, fontSize: '0.95rem', color: '#4b5563', textAlign: 'right' }}>${Number(item.rate).toFixed(2)}</Typography>
                <Typography sx={{ flex: 2, fontSize: '0.95rem', fontWeight: 600, color: '#111827', textAlign: 'right' }}>${(Number(item.qty) * Number(item.rate)).toFixed(2)}</Typography>
              </Box>
            ))}
          </Box>

          {/* Totals & Payment */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ flex: 1, pr: 8 }}>
              {/* Bank Details in PDF */}
              <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '1px', mb: 1 }}>Payment Info</Typography>
              <Box sx={{ p: 2, background: '#f9fafb', borderRadius: '8px' }}>
                <Typography sx={{ fontSize: '0.9rem', color: '#4b5563', mb: 0.5 }}><strong>Bank:</strong> {bankDetails.bankName || '-'}</Typography>
                <Typography sx={{ fontSize: '0.9rem', color: '#4b5563', mb: 0.5 }}><strong>Account:</strong> {bankDetails.accountName || '-'}</Typography>
                <Typography sx={{ fontSize: '0.9rem', color: '#4b5563', mb: 0.5 }}><strong>Acct #:</strong> {bankDetails.accountNumber || '-'}</Typography>
                <Typography sx={{ fontSize: '0.9rem', color: '#4b5563' }}><strong>Routing/IFSC:</strong> {bankDetails.routingNumber || '-'}</Typography>
              </Box>
            </Box>

            <Box sx={{ width: '300px' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography sx={{ fontSize: '0.95rem', color: '#6b7280' }}>Subtotal</Typography>
                <Typography sx={{ fontSize: '0.95rem', fontWeight: 600, color: '#111827' }}>${subtotal.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography sx={{ fontSize: '0.95rem', color: '#6b7280' }}>Tax ({tax}%)</Typography>
                <Typography sx={{ fontSize: '0.95rem', fontWeight: 600, color: '#111827' }}>${taxAmount.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#f9fafb', p: 2, borderRadius: '8px' }}>
                <Typography sx={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827' }}>Total</Typography>
                <Typography sx={{ fontSize: '1.25rem', fontWeight: 800, color: '#6366f1' }}>${total.toFixed(2)}</Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ mt: 8 }}>
            <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '1px', mb: 1 }}>Notes</Typography>
            <Typography sx={{ fontSize: '0.9rem', color: '#4b5563', fontStyle: 'italic', whiteSpace: 'pre-line' }}>{invoiceData.notes}</Typography>
          </Box>

        </Box>
      </Box>
    </Box>
  );
}
