import React from 'react';
import { Box, Container, Typography, Grid, Card } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import InsightsIcon from '@mui/icons-material/Insights';
import PeopleIcon from '@mui/icons-material/People';
import SecurityIcon from '@mui/icons-material/Security';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import LanguageIcon from '@mui/icons-material/Language';

const features = [
  {
    title: 'AI Invoice Generator',
    description: 'Create perfect invoices from simple text prompts in seconds.',
    icon: AutoAwesomeIcon,
    color: '#6366f1' // Indigo
  },
  {
    title: 'Smart Analytics',
    description: 'Real-time financial insights and automated reports.',
    icon: InsightsIcon,
    color: '#ec4899' // Pink
  },
  {
    title: 'Client Management',
    description: 'Manage clients easily. Keep records and track communication.',
    icon: PeopleIcon,
    color: '#10b981' // Emerald
  },
  {
    title: 'Secure Payments',
    description: 'Safe, fast, and globally compliant transactions.',
    icon: SecurityIcon,
    color: '#f59e0b' // Amber
  },
  {
    title: 'Lightning Fast',
    description: 'Optimized dashboard that loads instantly without lag.',
    icon: ElectricBoltIcon,
    color: '#8b5cf6' // Purple
  },
  {
    title: 'Multi-Currency',
    description: 'Bill clients worldwide with automatic currency conversion.',
    icon: LanguageIcon,
    color: '#0ea5e9' // Sky Blue
  }
];

export default function Features() {
  return (
    <Box id="features" sx={{ py: { xs: 10, md: 15 }, position: 'relative' }}>
      <Container maxWidth="xl">
        <Box sx={{ textAlign: 'center', mb: { xs: 5, md: 8 }, maxWidth: 700, mx: 'auto' }}>
          <Typography variant="caption" sx={{ color: '#ec4899', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Powerful Features
          </Typography>
          <Typography variant="h2" sx={{ my: 2, fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3.75rem' } }}>
            Everything you need, nothing you don't.
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 400 }}>
            Our platform is carefully crafted to ensure you spend less time managing invoices and more time growing your business.
          </Typography>
        </Box>

        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { 
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)'
          }, 
          gap: { xs: 2, md: 4 }
        }}>
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <Box key={idx}>
                <Card sx={{ 
                  p: { xs: 3, md: 4 }, 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: { xs: 1.5, md: 2 },
                  background: 'rgba(17, 24, 39, 0.4)',
                  borderColor: 'rgba(255,255,255,0.02)',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    borderColor: 'rgba(255,255,255,0.1)',
                    boxShadow: `0 10px 40px -10px ${feature.color}40`,
                    '& .icon-wrapper': {
                      background: feature.color,
                      color: '#fff',
                      transform: 'scale(1.1)'
                    }
                  }
                }}>
                  {/* Hover Glow Background */}
                  <Box sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '150px',
                    height: '150px',
                    background: `radial-gradient(circle, ${feature.color}15 0%, transparent 70%)`,
                    borderRadius: '50%',
                    transform: 'translate(30%, -30%)'
                  }} />

                  <Box 
                    className="icon-wrapper"
                    sx={{ 
                      width: { xs: 40, md: 50 }, 
                      height: { xs: 40, md: 50 }, 
                      borderRadius: 3, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      background: `rgba(${feature.color === '#6366f1' ? '99,102,241' : feature.color === '#ec4899' ? '236,72,153' : feature.color === '#10b981' ? '16,185,129' : feature.color === '#f59e0b' ? '245,158,11' : feature.color === '#8b5cf6' ? '139,92,246' : '14,165,233'}, 0.1)`,
                      color: feature.color,
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <Icon sx={{ fontSize: { xs: 20, md: 24 } }} />
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#fff', mt: 1, fontSize: { xs: '1.1rem', md: '1.5rem' } }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6, fontSize: { xs: '0.85rem', md: '1rem' } }}>
                    {feature.description}
                  </Typography>
                </Card>
              </Box>
            )
          })}
        </Box>
      </Container>
    </Box>
  );
}
