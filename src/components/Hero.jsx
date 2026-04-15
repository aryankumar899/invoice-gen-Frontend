import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ThreeDCard from './ThreeDCard';

export default function Hero() {
  return (
    <Box
      id="hero"
      sx={{
        pt: { xs: 15, md: 20 },
        pb: { xs: 8, md: 12 },
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background glow effects */}
      <Box sx={{
        position: 'absolute',
        top: '10%',
        left: '-10%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        zIndex: 0
      }} />
      
      <Box sx={{
        position: 'absolute',
        bottom: '-10%',
        right: '-10%',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(80px)',
        zIndex: 0
      }} />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' }, 
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: { xs: 6, md: 4 }
          }}
        >
          {/* Left Content */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3, maxWidth: { xs: '100%', md: '50%' } }}>
            <Box 
              sx={{ 
                display: 'inline-block', 
                px: 2, 
                py: 0.5, 
                borderRadius: 'full', 
                border: '1px solid rgba(99,102,241,0.3)',
                background: 'rgba(99,102,241,0.1)',
                width: 'fit-content',
                mb: 2
              }}
            >
              <Typography variant="caption" sx={{ color: '#a5b4fc', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Next Gen Financial Tools
              </Typography>
            </Box>

            <Typography 
              variant="h1" 
              sx={{ 
                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem', lg: '5rem' },
                lineHeight: 1.1,
                color: '#ffffff',
                fontWeight: 800,
                '& span': {
                  background: 'linear-gradient(to right, #6366f1, #ec4899)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }
              }}
            >
              AI-Powered Invoicing for <br />
              <span>Modern Businesses 🚀</span>
            </Typography>

            <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 400, maxWidth: '90%', lineHeight: 1.6, fontSize: { xs: '1rem', md: '1.25rem' } }}>
              Automate your billing process with AI. Generate intelligent invoices, track payments in real-time, and get actionable financial insights all in one minimal, fast dashboard.
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mt: 2 }}>
              <Button 
                variant="contained" 
                color="primary" 
                size="large"
                endIcon={<ArrowForwardIcon />}
                sx={{ 
                  px: 4, 
                  py: 1.5, 
                  fontSize: '1.1rem',
                  fontWeight: 700 
                }}
              >
                Get Started for Free
              </Button>
              <Button 
                variant="outlined" 
                size="large"
                sx={{ 
                  px: 4, 
                  py: 1.5, 
                  fontSize: '1.1rem',
                  color: '#fff',
                  borderColor: 'rgba(255,255,255,0.2)',
                  '&:hover': {
                    borderColor: '#fff',
                    background: 'rgba(255,255,255,0.05)'
                  }
                }}
              >
                Learn More
              </Button>
            </Box>
            
            <Box sx={{ mt: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ display: 'flex', '& > *': { ml: -1 }, pl: 1 }}>
                {[1, 2, 3, 4].map((i) => (
                  <Box 
                    key={i} 
                    sx={{ 
                      width: 32, 
                      height: 32, 
                      borderRadius: '50%', 
                      background: '#374151',
                      border: '2px solid #030712',
                      backgroundImage: `url(https://i.pravatar.cc/100?img=${i + 10})`,
                      backgroundSize: 'cover'
                    }} 
                  />
                ))}
              </Box>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                Joined by 10,000+ top companies
              </Typography>
            </Box>
          </Box>

          {/* Right 3D Visual */}
          <Box sx={{ flex: 1, width: '100%', minWidth: { xs: '100%', md: '50%' }, display: 'flex', justifyContent: 'center' }}>
            <ThreeDCard />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}