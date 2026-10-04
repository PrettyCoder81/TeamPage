import React from 'react';
import { Box, Toolbar } from '@mui/material';
import Sidebar from './Sidebar';
import Header from './Header';

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentPath: string;
  pageTitle: string;
  onNavigate: (path: string) => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, currentPath, pageTitle, onNavigate }) => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Sidebar currentPath={currentPath} onNavigate={onNavigate} />
      <Box sx={{ flexGrow: 1 }}>
        <Header title={pageTitle} onNavigate={onNavigate} />
        <Toolbar />
        <Box sx={{ p: 4 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
