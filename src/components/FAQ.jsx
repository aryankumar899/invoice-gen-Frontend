import React, { useState } from 'react';
import { Box, Container, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
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
  const [expanded, setExpanded] = useState('panel0');

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <Box id="faq" sx={{ py: { xs: 10, md: 15 }, position: 'relative' }}>
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h2" sx={{ mb: 2 }}>
            Frequently Asked Questions
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400 }}>
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
                background: 'rgba(17, 24, 39, 0.6)',
                border: '1px solid rgba(255,255,255,0.05)',
                '&:before': { display: 'none' },
                boxShadow: 'none',
                borderRadius: '12px !important',
                transition: 'all 0.3s ease',
                '&.Mui-expanded': {
                  borderColor: 'rgba(99, 102, 241, 0.5)',
                  background: 'rgba(17, 24, 39, 0.9)',
                }
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: expanded === `panel${idx}` ? '#6366f1' : '#fff' }} />}
                sx={{
                  px: 3, 
                  py: 1,
                  '& .MuiTypography-root': {
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    color: expanded === `panel${idx}` ? '#6366f1' : '#fff',
                    transition: 'color 0.2s ease'
                  }
                }}
              >
                <Typography>{faq.q}</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 3, pb: 3, pt: 0 }}>
                <Typography sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
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