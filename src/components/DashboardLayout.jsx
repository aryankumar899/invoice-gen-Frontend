import React, { useState } from 'react';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Typography, Avatar, IconButton, Divider, AppBar, Toolbar, useTheme, useMediaQuery } from '@mui/material';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import MenuIcon from '@mui/icons-material/Menu';

const DRAWER_WIDTH = 260;

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Create Invoice', icon: <AddCircleIcon />, path: '/dashboard/create' },
    { text: 'My Invoices', icon: <ReceiptIcon />, path: '/dashboard/invoices' },
    { text: 'Clients', icon: <PeopleIcon />, path: '/dashboard/clients' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/dashboard/settings' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const user = JSON.parse(localStorage.getItem('user') || '{"name": "Admin User", "email": "admin@example.com"}');
  const userInitials = user.name ? user.name.charAt(0).toUpperCase() : 'A';

  const drawerContent = (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4, mt: 1, px: 2 }}>
          <Box sx={{ 
            width: 36, height: 36, borderRadius: 2, 
            background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)'
          }}>
            <ReceiptIcon sx={{ color: '#fff', fontSize: 20 }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-0.5px' }}>
            Invoice AI
          </Typography>
        </Box>

        <List sx={{ flex: 1 }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItem 
                button 
                key={item.text} 
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  background: isActive ? 'linear-gradient(90deg, rgba(99,102,241,0.1) 0%, transparent 100%)' : 'transparent',
                  borderLeft: isActive ? '3px solid #6366f1' : '3px solid transparent',
                  color: isActive ? '#fff' : 'text.secondary',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    background: 'rgba(255,255,255,0.05)',
                    color: '#fff',
                    '& .MuiListItemIcon-root': { color: '#6366f1' }
                  }
                }}
              >
                <ListItemIcon sx={{ color: isActive ? '#6366f1' : 'text.secondary', minWidth: 40, transition: 'all 0.2s ease' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: isActive ? 600 : 500, fontSize: '0.95rem' }} />
              </ListItem>
            );
          })}
        </List>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)', mb: 2 }} />
        
        {/* User Profile / Logout */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, borderRadius: 2, background: 'rgba(0,0,0,0.2)' }}>
          <Avatar src={user.avatar} sx={{ width: 36, height: 36, background: '#6366f1' }}>{!user.avatar && userInitials}</Avatar>
          <Box sx={{ flex: 1, overflow: 'hidden' }}>
            <Typography variant="body2" sx={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</Typography>
          </Box>
          <IconButton onClick={handleLogout} sx={{ color: 'text.secondary', '&:hover': { color: '#ef4444' } }}>
            <LogoutIcon fontSize="small" />
          </IconButton>
        </Box>
    </>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: '#0B0F19' }}>
      {/* Mobile AppBar */}
      {isMobile && (
        <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1, background: 'rgba(17, 24, 39, 0.9)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <Toolbar>
            <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 800 }}>
              Invoice AI
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      {/* Sidebar Navigation Container */}
      <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH, background: 'rgba(17, 24, 39, 0.95)', borderRight: '1px solid rgba(255, 255, 255, 0.05)', color: '#fff', p: 2 },
          }}
        >
          {drawerContent}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH, background: 'rgba(17, 24, 39, 0.8)', backdropFilter: 'blur(20px)', borderRight: '1px solid rgba(255, 255, 255, 0.05)', color: '#fff', p: 2 },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Main Content Area */}
      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 4, lg: 5 }, mt: { xs: 7, md: 0 }, width: { md: `calc(100% - ${DRAWER_WIDTH}px)` }, position: 'relative', overflowY: 'auto' }}>
        {/* Background ambient glows */}
        <Box sx={{ position: 'absolute', top: '-10%', right: '10%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)', filter: 'blur(60px)', zIndex: 0, pointerEvents: 'none' }} />
        
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Outlet /> {/* This will render the currently matched child route */}
        </Box>
      </Box>
    </Box>
  );
}
