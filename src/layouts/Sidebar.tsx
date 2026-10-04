import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  Typography,
  Divider,
  Avatar,
  Chip,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const drawerWidth = 280;

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
  { path: '/members', label: 'Members', icon: <PeopleIcon /> },
  { path: '/machine-records', label: 'Machine Renting Report', icon: <PrecisionManufacturingIcon /> },
];

const Sidebar: React.FC<SidebarProps> = ({ currentPath, onNavigate }) => {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#1e293b',
          color: '#fff',
          borderRight: 'none',
        },
      }}
    >
      <Toolbar sx={{ px: 3, py: 2, justifyContent: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '1.2rem',
              color: '#fff',
            }}
          >
            T
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: '-0.5px', color: '#fff' }}>
            Team Portal
          </Typography>
        </Box>
      </Toolbar>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />
      <Box sx={{ px: 2, py: 3 }}>
        <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.4)', px: 2, fontSize: '0.7rem', letterSpacing: '1px' }}>
          Navigation
        </Typography>
      </Box>
      <List sx={{ px: 1.5 }}>
        {navItems.map((item) => (
          <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={() => onNavigate(item.path)}
              sx={{
                borderRadius: 2,
                py: 1.2,
                px: 2,
                backgroundColor: currentPath === item.path ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                color: currentPath === item.path ? '#818cf8' : 'rgba(255,255,255,0.7)',
                '&:hover': {
                  backgroundColor: 'rgba(99, 102, 241, 0.1)',
                  color: '#fff',
                },
                '& .MuiListItemIcon-root': {
                  color: 'inherit',
                  minWidth: 40,
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.label}
                slotProps={{ primary: { sx: { fontSize: '0.9rem', fontWeight: currentPath === item.path ? 600 : 400 } } }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Box sx={{ mt: 'auto', p: 2 }}>
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mb: 2 }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 1 }}>
          <Avatar sx={{ width: 36, height: 36, bgcolor: '#6366f1', fontSize: '0.9rem' }}>
            {user?.name?.charAt(0)}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#fff' }}>
              {user?.name}
            </Typography>
            <Chip
              label={user?.role}
              size="small"
              sx={{
                height: 20,
                fontSize: '0.65rem',
                bgcolor: user?.role === 'admin' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)',
                color: user?.role === 'admin' ? '#f87171' : '#4ade80',
                fontWeight: 600,
                textTransform: 'capitalize',
              }}
            />
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
