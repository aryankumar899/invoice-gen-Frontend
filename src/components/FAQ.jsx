import React, { useState } from 'react';
import { Box, Container, Typography, Accordion, AccordionSummary, AccordionDetails, useTheme } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const faqs = [
  {
    q: 'Is it free?',
    a: 'We offer a generous 14-day free trial on our premium plans. You can create up to 5 invoices forever on our free tier.'
  },
  {
    q: 'Can I export invoices as PDF?',
    a: 'Yes! You can instantly generate high-quality PDFs for all your invoices, or send them directly via email with a tracking link.'
  },
  {
    q: 'Is my data secure?',
    a: 'Absolutely. We use bank-level 256-bit AES encryption to ensure all your financial data and customer details remain strictly private.'
  },
  {
    q: 'Can I track payments?',
    a: 'Yes, our platform automatically tracks when your clients open an invoice and when a payment is securely processed through Stripe or PayPal.'
  }
];

export default function FAQ() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [expanded, setExpanded] = useState('panel0');

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <Box id="faq" sx={{ py: { xs: 10, md: 15 }, position: 'relative' }}>
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography component="div" sx={{ mb: 2, color: 'text.primary', fontWeight: 800, letterSpacing: 0, fontSize: { xs: '2rem', md: '3.2rem' } }}>
            Frequently Asked Questions
          </Typography>
          <Typography color="text.secondary" sx={{ fontWeight: 500, fontSize: { xs: '1.1rem', md: '1.3rem' } }}>
            Everything you need to know about Invoice AI.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {faqs.map((faq, idx) => (
            <Accordion 
              key={idx} 
              expanded={expanded === `panel${idx}`} 
              onChange={handleChange(`panel${idx}`)}
              sx={{
                background: isDark ? 'rgba(17, 24, 39, 0.6)' : '#ffffff',
                border: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.08)',
                '&:before': { display: 'none' },
                boxShadow: isDark ? 'none' : '0 4px 20px rgba(0,0,0,0.02)',
                borderRadius: '12px !important',
                transition: 'all 0.3s ease',
                '&.Mui-expanded': {
                  borderColor: 'rgba(99, 102, 241, 0.5)',
                  background: isDark ? 'rgba(17, 24, 39, 0.9)' : '#ffffff',
                }
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: expanded === `panel${idx}` ? '#6366f1' : (isDark ? '#fff' : 'text.primary') }} />}
                sx={{
                  px: 3, 
                  py: 1,
                  '& .MuiTypography-root': {
                    fontWeight: 600,
                    fontSize: { xs: '1.15rem', md: '1.3rem' },
                    color: expanded === `panel${idx}` ? '#6366f1' : 'text.primary',
                    transition: 'color 0.2s ease'
                  }
                }}
              >
                <Typography>{faq.q}</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 3, pb: 3, pt: 0 }}>
                <Typography sx={{ color: 'text.secondary', lineHeight: 1.75, fontSize: { xs: '1.02rem', md: '1.15rem' } }}>
                  {faq.a}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Container>
    </Box>
  );
}