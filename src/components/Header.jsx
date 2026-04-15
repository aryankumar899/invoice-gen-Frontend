import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Container,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Drawer,
  useTheme,
  useMediaQuery
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

const navItems = ['Features', 'Dashboard', 'Testimonials', 'FAQ'];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const scrollToEl = (id) => {
    const el = document.getElementById(id.toLowerCase());
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setMobileOpen(false);
    }
  };

  return (
    <>
      <AppBar 
        position="fixed" 
        elevation={scrolled ? 4 : 0}
        sx={{
          background: scrolled ? 'rgba(17, 24, 39, 0.8)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
          transition: 'all 0.3s ease-in-out',
          py: scrolled ? 1 : 2
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
            {/* Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }} onClick={() => window.scrollTo(0, 0)}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  width: 40, 
                  height: 40, 
                  borderRadius: 2, 
                  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
                }}
              >
                <ReceiptLongIcon sx={{ color: '#fff' }} />
              </Box>
              <Typography variant="h6" component="div" sx={{ fontWeight: 800, letterSpacing: '-0.02em', background: 'linear-gradient(to right, #fff, #a5b4fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Invoice AI
              </Typography>
            </Box>

            {/* Desktop Navigation */}
            {!isMobile && (
              <Box sx={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                {navItems.map((item) => (
                  <Typography
                    key={item}
                    onClick={() => scrollToEl(item)}
                    sx={{
                      cursor: 'pointer',
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      color: 'text.secondary',
                      position: 'relative',
                      transition: 'color 0.2s',
                      '&:hover': {
                        color: 'text.primary',
                        '&::after': {
                          width: '100%',
                        }
                      },
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: -4,
                        left: 0,
                        width: '0%',
                        height: 2,
                        background: 'linear-gradient(to right, #6366f1, #a5b4fc)',
                        transition: 'width 0.3s ease-in-out',
                        borderRadius: 2,
                      }
                    }}
                  >
                    {item}
                  </Typography>
                ))}
              </Box>
            )}

            {/* Action Buttons */}
            {!isMobile ? (
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button component={Link} to="/login" variant="text" sx={{ color: 'text.primary', '&:hover': { background: 'rgba(255,255,255,0.05)' } }}>
                  Login
                </Button>
                <Button component={Link} to="/signup" variant="contained" color="primary">
                  Sign Up
                </Button>
              </Box>
            ) : (
              <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle}>
                <MenuIcon />
              </IconButton>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250, background: 'rgba(17, 24, 39, 0.95)', backdropFilter: 'blur(10px)' },
        }}
      >
        <Box sx={{ p: 2 }}>
          <List>
            {navItems.map((item) => (
              <ListItem key={item} disablePadding>
                <ListItemText 
                  primary={item} 
                  sx={{ textAlign: 'center', my: 1, cursor: 'pointer', '&:hover': { color: '#6366f1' } }} 
                  onClick={() => scrollToEl(item)}
                  primaryTypographyProps={{ fontWeight: 600, fontFamily: 'Space Grotesk' }}
                />
              </ListItem>
            ))}
          </List>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 4, px: 2 }}>
            <Button component={Link} to="/login" variant="outlined" fullWidth color="inherit" onClick={handleDrawerToggle}>Login</Button>
            <Button component={Link} to="/signup" variant="contained" fullWidth color="primary" onClick={handleDrawerToggle}>Sign Up</Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}