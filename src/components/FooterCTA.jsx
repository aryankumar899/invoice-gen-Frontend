import React from 'react';
import { Box, Container, Typography, Button, IconButton } from '@mui/material';
import TwitterIcon from '@mui/icons-material/Twitter';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

export default function FooterCTA() {
  return (
    <Box sx={{ position: 'relative', mt: { xs: 5, md: 10 } }}>
      {/* CTA Section */}
      <Container maxWidth="lg">
        <Box 
          sx={{ 
            p: { xs: 4, md: 8 }, 
            textAlign: 'center', 
            borderRadius: 6,
            background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(236,72,153,0.1) 100%)',
            border: '1px solid rgba(255,255,255,0.05)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Glow Behind CTA */}
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 60%)',
            zIndex: 0
          }} />

          <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 600, mx: 'auto' }}>
            <Typography variant="h2" sx={{ mb: 2, color: '#fff', fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3.75rem' } }}>
              Start Creating Smart Invoices Today 🚀
            </Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 400, mb: 4, fontSize: { xs: '0.95rem', sm: '1.25rem' } }}>
              Join thousands of modern businesses using our AI platform to scale their revenue ops.
            </Typography>
            <Button 
              variant="contained" 
              size="large"
              fullWidth={false}
              sx={{ 
                px: { xs: 4, md: 6 }, 
                py: { xs: 1.5, md: 2 }, 
                fontSize: { xs: '1rem', md: '1.2rem' },
                width: { xs: '100%', sm: 'auto' },
                borderRadius: '50px',
                background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #f472b6 0%, #a78bfa 100%)',
                  boxShadow: '0 10px 25px rgba(236,72,153,0.4)'
                }
              }}
            >
              Start Free Trial
            </Button>
          </Box>
        </Box>
      </Container>

      {/* Simple Footer */}
      <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.05)', mt: 10, py: 4, background: '#030712' }}>
        <Container maxWidth="xl" sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Invoice AI. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton sx={{ color: 'text.secondary', '&:hover': { color: '#6366f1' } }}><TwitterIcon /></IconButton>
            <IconButton sx={{ color: 'text.secondary', '&:hover': { color: '#fff' } }}><GitHubIcon /></IconButton>
            <IconButton sx={{ color: 'text.secondary', '&:hover': { color: '#0ea5e9' } }}><LinkedInIcon /></IconButton>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
