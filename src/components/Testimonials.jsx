import React from 'react';
import { Box, Container, Typography, Card, Avatar, Rating, useTheme } from '@mui/material';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Founder, TechFlow',
    avatar: 'https://i.pravatar.cc/150?img=47',
    content: 'This app saved me 10+ hours every week. Invoicing is effortless and the AI features are simply mind-blowing. Highly recommended!',
    rating: 5
  },
  {
    name: 'Michael Chen',
    role: 'Freelance Designer',
    avatar: 'https://i.pravatar.cc/150?img=11',
    content: 'Probably the best invoicing tool I’ve used. The UI is incredibly clean, and the payment tracking gives me huge peace of mind.',
    rating: 5
  },
  {
    name: 'Jessica Alba',
    role: 'Agency Owner',
    avatar: 'https://i.pravatar.cc/150?img=32',
    content: 'I moved from Stripe directly to Invoice AI. The automation flows are so much smoother and the pricing is very reasonable.',
    rating: 5
  },
  {
    name: 'David Smith',
    role: 'CEO, Nexus Corp',
    avatar: 'https://i.pravatar.cc/150?img=59',
    content: 'The dashboard gives me insights that completely changed our revenue model. The best financial tool we’ve integrated this year.',
    rating: 5
  },
  {
    name: 'Emma Watson',
    role: 'Independent Consultant',
    avatar: 'https://i.pravatar.cc/150?img=44',
    content: 'Stunning interface and lightning fast. Sending beautifully crafted invoices has genuinely helped me land bigger clients.',
    rating: 5
  }
];

// Duplicate the array to create a seamless infinite scroll
const autoScrollItems = [...testimonials, ...testimonials];

export default function Testimonials() {
  const theme = useTheme();

  return (
    <Box id="testimonials" sx={{ py: { xs: 10, md: 15 }, background: 'rgba(3, 7, 18, 0.5)', overflow: 'hidden' }}>
      <Container maxWidth="xl" sx={{ mb: 6 }}>
        <Typography variant="h2" sx={{ textAlign: 'center' }}>
          Loved by builders & makers
        </Typography>
      </Container>

      {/* Auto Scrolling Marquee */}
      <Box 
        sx={{ 
          display: 'flex', 
          overflow: 'hidden', 
          position: 'relative',
          width: '100%',
          '&::before, &::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            width: '150px',
            height: '100%',
            zIndex: 2,
            pointerEvents: 'none'
          },
          '&::before': {
            left: 0,
            background: 'linear-gradient(to right, #030712 0%, transparent 100%)'
          },
          '&::after': {
            right: 0,
            background: 'linear-gradient(to left, #030712 0%, transparent 100%)'
          }
        }}
      >
        <Box 
          sx={{
            display: 'flex',
            gap: 4,
            width: 'max-content',
            animation: 'scroll 40s linear infinite',
            '@keyframes scroll': {
              '0%': { transform: 'translateX(0)' },
              '100%': { transform: 'translateX(-50%)' }
            },
            '&:hover': {
              animationPlayState: 'paused'
            },
            px: 2
          }}
        >
          {autoScrollItems.map((test, idx) => (
            <Card key={idx} sx={{ 
              width: { xs: '300px', sm: '350px', md: '450px' },
              p: 4, 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 3,
              background: 'linear-gradient(145deg, rgba(31, 41, 55, 0.4) 0%, rgba(17, 24, 39, 0.9) 100%)',
              border: '1px solid rgba(255,255,255,0.05)',
              transition: 'all 0.3s ease',
              whiteSpace: 'normal', // Allow text to wrap inside the card
              flexShrink: 0,
              '&:hover': {
                transform: 'translateY(-5px)',
                borderColor: 'rgba(99, 102, 241, 0.4)',
                boxShadow: '0 10px 40px -10px rgba(99, 102, 241, 0.2)'
              }
            }}>
              <Rating value={test.rating} readOnly sx={{ color: '#f59e0b' }} />
              <Typography variant="body1" sx={{ color: 'text.primary', fontSize: '1.05rem', flex: 1, fontStyle: 'italic', lineHeight: 1.7 }}>
                "{test.content}"
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
                <Avatar src={test.avatar} sx={{ width: 48, height: 48 }} />
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#fff' }}>{test.name}</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>{test.role}</Typography>
                </Box>
              </Box>
            </Card>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
