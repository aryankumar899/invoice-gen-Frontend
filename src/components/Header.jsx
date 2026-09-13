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
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { ThemeContext } from '../context/ThemeContext';
import { useContext } from 'react';

const navItems = ['Features', 'Dashboard', 'Testimonials', 'FAQ'];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { mode, toggleColorMode } = useContext(ThemeContext);

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
          background: mode === 'dark' ? 'rgba(3, 7, 18, 0.96)' : 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(16px)',
          borderBottom: `1px solid ${theme.palette.divider}`,
          transition: 'all 0.3s ease-in-out',
          py: scrolled ? 1 : 2,
          zIndex: 1300
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
              <Typography component="div" sx={{ fontWeight: 800, letterSpacing: 0, color: 'text.primary', fontSize: { xs: '1.2rem', md: '1.35rem' } }}>
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
                      fontSize: '1.05rem',
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
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <IconButton
                  onClick={toggleColorMode}
                  aria-label="Toggle theme"
                  sx={{ color: 'text.primary' }}
                >
                  {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
                </IconButton>
                <Button component={Link} to="/login" variant="text" sx={{ color: 'text.primary', fontSize: '1rem', fontWeight: 700, '&:hover': { background: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' } }}>
                  Login
                </Button>
                <Button component={Link} to="/signup" variant="contained" color="primary" sx={{ fontSize: '1rem', fontWeight: 700, px: 2.5 }}>
                  Sign Up
                </Button>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton onClick={toggleColorMode} aria-label="Toggle theme" sx={{ color: 'text.primary' }}>
                  {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
                </IconButton>
                <IconButton sx={{ color: 'text.primary' }} aria-label="open drawer" edge="start" onClick={handleDrawerToggle}>
                  <MenuIcon />
                </IconButton>
              </Box>
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
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250, background: mode === 'dark' ? 'rgba(17, 24, 39, 0.95)' : 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)' },
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
            <Button
              variant="outlined"
              fullWidth
              color="inherit"
              onClick={toggleColorMode}
              startIcon={mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            >
              {mode === 'dark' ? 'Light theme' : 'Dark theme'}
            </Button>
            <Button component={Link} to="/login" variant="outlined" fullWidth color="inherit" onClick={handleDrawerToggle}>Login</Button>
            <Button component={Link} to="/signup" variant="contained" fullWidth color="primary" onClick={handleDrawerToggle}>Sign Up</Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}