import React from 'react';
import { Box, Container, Typography, Grid, Paper, Card, useTheme } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import DescriptionIcon from '@mui/icons-material/Description';

const StatCard = ({ title, value, change, icon: Icon, color }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  return (
    <Card sx={{ 
      p: 3, 
      borderRadius: 4, 
      background: isDark ? 'rgba(17, 24, 39, 0.6)' : '#ffffff', 
      border: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.08)',
      boxShadow: isDark ? 'none' : '0 4px 20px rgba(0,0,0,0.02)',
      transition: 'all 0.3s ease',
      '&:hover': { 
        transform: 'translateY(-5px)', 
        borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(99, 102, 241, 0.3)',
        boxShadow: isDark ? '0 10px 20px rgba(0,0,0,0.3)' : '0 10px 25px rgba(99,102,241,0.05)'
      }
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ p: 1.5, borderRadius: 2, background: `rgba(${color}, 0.1)`, color: `rgb(${color})` }}>
          <Icon />
        </Box>
        <Box sx={{ px: 1.5, py: 0.5, borderRadius: 10, background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', height: 'fit-content' }}>
          <Typography variant="caption" sx={{ fontWeight: 700 }}>+{change}%</Typography>
        </Box>
      </Box>
      <Typography color="text.secondary" sx={{ mb: 0.5, fontSize: '1rem' }}>{title}</Typography>
      <Typography sx={{ fontWeight: 800, letterSpacing: 0, fontSize: { xs: '1.5rem', md: '1.85rem' } }}>{value}</Typography>
    </Card>
  );
};

export default function DashboardPreview() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  return (
    <Box id="dashboard" sx={{ py: { xs: 8, md: 15 }, position: 'relative' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8, maxWidth: 600, mx: 'auto' }}>
          <Typography component="div" sx={{ mb: 2, color: 'text.primary', fontWeight: 800, letterSpacing: 0, fontSize: { xs: '2rem', md: '3.4rem' } }}>
            Your Financial Command Center
          </Typography>
          <Typography color="text.secondary" sx={{ fontWeight: 500, fontSize: { xs: '1.1rem', md: '1.3rem' }, lineHeight: 1.7 }}>
            Track invoices, monitor payments, and get beautiful real-time analytics without leaving your dashboard.
          </Typography>
        </Box>

        <Box sx={{ 
          position: 'relative', 
          p: { xs: 2, md: 4 }, 
          borderRadius: 6, 
          background: isDark 
            ? 'linear-gradient(180deg, rgba(31,41,55,0.5) 0%, rgba(17,24,39,0.8) 100%)' 
            : 'linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%)',
          border: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.06)',
          boxShadow: isDark ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)' : '0 25px 50px -12px rgba(99, 102, 241, 0.05)'
        }}>
          {/* Mac-like Window Header */}
          <Box sx={{ display: 'flex', gap: 1, mb: 4, px: 1 }}>
            <Box sx={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444' }} />
            <Box sx={{ width: 12, height: 12, borderRadius: '50%', background: '#f59e0b' }} />
            <Box sx={{ width: 12, height: 12, borderRadius: '50%', background: '#10b981' }} />
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {/* Top Row: Stat Cards */}
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, 
              gap: 3 
            }}>
              <StatCard title="Total Revenue" value="$124,500.00" change="12.5" icon={AccountBalanceWalletIcon} color="99, 102, 241" />
              <StatCard title="Invoices Sent" value="342" change="8.2" icon={DescriptionIcon} color="236, 72, 153" />
              <StatCard title="Growth" value="+24%" change="4.1" icon={TrendingUpIcon} color="16, 185, 129" />
            </Box>

            {/* Bottom Row: Main Chart Area */}
            <Paper sx={{ 
              p: { xs: 2, md: 4 }, 
              borderRadius: 4, 
              background: isDark 
                ? 'linear-gradient(to right, rgba(17, 24, 39, 0.4), rgba(31, 41, 55, 0.4))' 
                : 'linear-gradient(to right, #ffffff, #f8fafc)', 
              border: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.06)',
              height: 350,
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 4, zIndex: 1 }}>Revenue Overview</Typography>
              
              <Box sx={{ 
                flex: 1, 
                display: 'flex', 
                alignItems: 'flex-end', 
                gap: { xs: 1, sm: 2, md: 3 }, 
                zIndex: 1,
                mt: 'auto'
              }}>
                {[20, 35, 25, 50, 40, 65, 55, 80, 70, 90, 85, 100].map((h, i) => (
                  <Box 
                    key={i} 
                    sx={{ 
                      flex: 1, 
                      height: `${h}%`, 
                      background: i === 11 ? 'linear-gradient(180deg, #ec4899 0%, rgba(236,72,153,0.1) 100%)' : 'linear-gradient(180deg, #6366f1 0%, rgba(99,102,241,0.1) 100%)',
                      borderRadius: '8px 8px 0 0',
                      position: 'relative',
                      boxShadow: i === 11 ? '0 -10px 20px rgba(236,72,153,0.2)' : 'none',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        height: `${h + 5}%`,
                        background: 'linear-gradient(180deg, #ec4899 0%, rgba(236,72,153,0.2) 100%)',
                        boxShadow: '0 -15px 30px rgba(236,72,153,0.4)',
                        transform: 'scaleY(1.02)'
                      }
                    }} 
                  />
                ))}
              </Box>

              {/* Chart background grid lines */}
              <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, pointerEvents: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', py: { xs: 2, md: 4 } }}>
                {[1, 2, 3, 4, 5].map(line => (
                  <Box key={line} sx={{ width: '100%', borderTop: isDark ? '1px dashed rgba(255,255,255,0.05)' : '1px dashed rgba(0,0,0,0.06)' }} />
                ))}
              </Box>
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
