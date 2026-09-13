import React, { useContext, useState } from 'react';
import {
  Box, Typography, IconButton, Drawer, List, ListItemButton, ListItemIcon,
  ListItemText, Divider, Avatar, useMediaQuery, Tooltip
} from '@mui/material';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { ThemeContext } from '../context/ThemeContext';
import { IonPage } from '@ionic/react';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import ReceiptIcon from '@mui/icons-material/Receipt';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import CommandPalette from './CommandPalette';

const DRAWER_WIDTH = 260;

const navItems = [
  { label: 'Home', path: '/dashboard', icon: <DashboardOutlinedIcon /> },
  { label: 'Create Invoice', path: '/dashboard/create', icon: <AddCircleOutlineOutlinedIcon /> },
  { label: 'Invoices', path: '/dashboard/invoices', icon: <ReceiptLongOutlinedIcon /> },
  { label: 'Clients', path: '/dashboard/clients', icon: <PeopleOutlinedIcon /> },
  { label: 'Settings', path: '/dashboard/settings', icon: <SettingsOutlinedIcon /> },
];

function isActive(path, itemPath) {
  if (itemPath === '/dashboard') return path === '/dashboard' || path === '/dashboard/';
  if (itemPath === '/dashboard/invoices') {
    return path.includes('/dashboard/invoice') && !path.startsWith('/dashboard/create');
  }
  return path === itemPath || path.startsWith(`${itemPath}/`);
}

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const { mode, toggleColorMode } = useContext(ThemeContext);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(true);

  const user = JSON.parse(localStorage.getItem('user') || '{"name": "Admin User", "email": "admin@example.com"}');
  const userInitials = user.name ? user.name.charAt(0).toUpperCase() : 'A';
  const currentPath = location.pathname;
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleNav = (path) => {
    navigate(path);
    if (!isDesktop) setMobileOpen(false);
  };

  const toggleDrawer = () => {
    if (isDesktop) setDesktopOpen((prev) => !prev);
    else setMobileOpen((prev) => !prev);
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, px: 2.5, py: 2.25 }}>
        <Box sx={{
          width: 34, height: 34, borderRadius: 1.5,
          background: 'linear-gradient(135deg, #111827 0%, #374151 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          ...(mode === 'dark' && { background: 'linear-gradient(135deg, #f9fafb 0%, #d1d5db 100%)' })
        }}>
          <ReceiptIcon sx={{ color: mode === 'dark' ? '#111827' : '#fff', fontSize: 18 }} />
        </Box>
        <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', color: 'text.primary', letterSpacing: 0 }}>
          Invoice AI
        </Typography>
      </Box>

      <Divider />

      <List sx={{ px: 1.25, py: 1.5, flex: 1 }}>
        {navItems.map((item) => {
          const active = isActive(currentPath, item.path);
          return (
            <ListItemButton
              key={item.path}
              onClick={() => handleNav(item.path)}
              selected={active}
              sx={{
                mb: 0.5,
                borderRadius: 2,
                color: active ? 'text.primary' : 'text.secondary',
                bgcolor: active ? (mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)') : 'transparent',
                '&.Mui-selected': {
                  bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                  '&:hover': { bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)' },
                },
                '&:hover': { bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: active ? 700 : 500, fontSize: '0.95rem' }} />
            </ListItemButton>
          );
        })}
      </List>

      <Divider />
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar sx={{ width: 36, height: 36, bgcolor: mode === 'dark' ? '#f9fafb' : '#111827', color: mode === 'dark' ? '#111827' : '#fff', fontSize: 14, fontWeight: 700 }}>
          {userInitials}
        </Avatar>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography noWrap sx={{ fontSize: 13, fontWeight: 700, color: 'text.primary' }}>{user.name || 'User'}</Typography>
          <Typography noWrap sx={{ fontSize: 12, color: 'text.secondary' }}>{user.email || ''}</Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <IonPage>
      <Box sx={{ display: 'flex', height: '100%', bgcolor: 'background.default', color: 'text.primary' }}>
        {isDesktop && (
          <Drawer
            variant="persistent"
            open={desktopOpen}
            sx={{
              width: desktopOpen ? DRAWER_WIDTH : 0,
              flexShrink: 0,
              '& .MuiDrawer-paper': {
                width: DRAWER_WIDTH,
                boxSizing: 'border-box',
                borderRight: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
                position: 'relative',
              },
            }}
          >
            {drawerContent}
          </Drawer>
        )}

        {!isDesktop && (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            ModalProps={{ keepMounted: true }}
            sx={{
              '& .MuiDrawer-paper': {
                width: DRAWER_WIDTH,
                bgcolor: 'background.paper',
                borderRight: '1px solid',
                borderColor: 'divider',
              },
            }}
          >
            {drawerContent}
          </Drawer>
        )}

        <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Box
            component="header"
            sx={{
              height: 64,
              px: { xs: 1.5, md: 3 },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper',
              flexShrink: 0,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton onClick={toggleDrawer} aria-label="Open menu" sx={{ color: 'text.primary' }}>
                <MenuIcon />
              </IconButton>
              <Typography sx={{ fontWeight: 700, color: 'text.primary', display: { xs: 'none', sm: 'block' } }}>
                {navItems.find((item) => isActive(currentPath, item.path))?.label || 'Dashboard'}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Tooltip title="Quick jump (Ctrl+K)">
                <IconButton
                  onClick={() => window.dispatchEvent(new Event('open-command-palette'))}
                  aria-label="Open command palette"
                  sx={{ color: 'text.secondary', display: { xs: 'none', sm: 'inline-flex' } }}
                >
                  <Typography sx={{ fontSize: 11, fontWeight: 800, px: 0.5 }}>Ctrl+K</Typography>
                </IconButton>
              </Tooltip>
              <Tooltip title={mode === 'dark' ? 'Light theme' : 'Dark theme'}>
                <IconButton onClick={toggleColorMode} aria-label="Toggle theme" sx={{ color: 'text.primary' }}>
                  {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
                </IconButton>
              </Tooltip>
              <Tooltip title="Log out">
                <IconButton onClick={handleLogout} aria-label="Log out" sx={{ color: 'text.secondary' }}>
                  <LogoutRoundedIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Box sx={{ flex: 1, overflow: 'auto', p: { xs: 2, md: 4 } }}>
            <Outlet />
          </Box>
        </Box>
        <CommandPalette />
      </Box>
    </IonPage>
  );
}
