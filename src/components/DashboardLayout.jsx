import React from 'react';
import { Box, Typography, Avatar, IconButton, Divider } from '@mui/material';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { 
  IonApp, IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, 
  IonList, IonItem, IonIcon, IonLabel, IonMenuButton, IonButtons, 
  IonPage, IonSplitPane 
} from '@ionic/react';
import { 
  gridOutline, addCircleOutline, receiptOutline, peopleOutline, 
  settingsOutline, logOutOutline, menuOutline 
} from 'ionicons/icons';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import AddCircleIcon from '@mui/icons-material/AddCircle';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: 'Dashboard', icon: gridOutline, path: '/dashboard' },
    { text: 'Create Invoice', icon: addCircleOutline, path: '/dashboard/create' },
    { text: 'My Invoices', icon: receiptOutline, path: '/dashboard/invoices' },
    { text: 'Clients', icon: peopleOutline, path: '/dashboard/clients' },
    { text: 'Settings', icon: settingsOutline, path: '/dashboard/settings' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const user = JSON.parse(localStorage.getItem('user') || '{"name": "Admin User", "email": "admin@example.com"}');
  const userInitials = user.name ? user.name.charAt(0).toUpperCase() : 'A';

  return (
    <IonPage>
      <IonSplitPane contentId="main">
        {/* Native Side Menu */}
        <IonMenu contentId="main" type="overlay">
          <IonHeader>
            <IonToolbar color="dark">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, px: 2, py: 1 }}>
                <Box sx={{ 
                  width: 32, height: 32, borderRadius: 1.5, 
                  background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <ReceiptIcon sx={{ color: '#fff', fontSize: 18 }} />
                </Box>
                <Typography variant="body1" sx={{ fontWeight: 800 }}>Invoice AI</Typography>
              </Box>
            </IonToolbar>
          </IonHeader>

          <IonContent className="ion-padding">
            <IonList lines="none" style={{ background: 'transparent' }}>
              {menuItems.map((item) => (
                <IonItem 
                  key={item.text} 
                  routerLink={item.path} 
                  routerDirection="none"
                  detail={false}
                  onClick={() => navigate(item.path)}
                  style={{
                    '--background': location.pathname === item.path ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                    '--color': location.pathname === item.path ? '#6366f1' : '#9ca3af',
                    borderRadius: '8px',
                    marginBottom: '4px'
                  }}
                >
                  <IonIcon slot="start" icon={item.icon} />
                  <IonLabel>{item.text}</IonLabel>
                </IonItem>
              ))}
              
              <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)', my: 2 }} />
              
              <IonItem button onClick={handleLogout} style={{ '--color': '#9ca3af' }}>
                <IonIcon slot="start" icon={logOutOutline} />
                <IonLabel>Logout</IonLabel>
              </IonItem>
            </IonList>

            {/* User Profile at bottom of menu */}
            <Box sx={{ position: 'absolute', bottom: 16, left: 16, right: 16, p: 2, borderRadius: 2, background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar src={user.avatar} sx={{ width: 32, height: 32, background: '#6366f1' }}>{!user.avatar && userInitials}</Avatar>
              <Box sx={{ flex: 1, overflow: 'hidden' }}>
                <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', color: '#fff' }}>{user.name}</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</Typography>
              </Box>
            </Box>
          </IonContent>
        </IonMenu>

        {/* Main Content Area */}
        <IonPage id="main">
          <IonHeader className="ion-no-border">
            <IonToolbar color="dark" style={{ '--background': '#0B0F19' }}>
              <IonButtons slot="start">
                <IonMenuButton color="primary" />
              </IonButtons>
              <IonTitle style={{ fontSize: '1.1rem', fontWeight: 800 }}>Invoice AI</IonTitle>
            </IonToolbar>
          </IonHeader>

          <IonContent style={{ '--background': '#0B0F19' }}>
            <Box sx={{ p: { xs: 2, md: 4 }, position: 'relative' }}>
              {/* Background ambient glows */}
              <Box sx={{ position: 'absolute', top: '-10%', right: '10%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)', filter: 'blur(60px)', zIndex: 0, pointerEvents: 'none' }} />
              
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Outlet />
              </Box>
            </Box>
          </IonContent>
        </IonPage>
      </IonSplitPane>
    </IonPage>
  );
}
