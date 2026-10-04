import React from 'react';
import { Box, Toolbar } from '@mui/material';
import Sidebar from './Sidebar';
import Header from './Header';

interface DashboardLayoutProps {
  children: React.ReactNode;
  pageTitle: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, pageTitle }) => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1 }}>
        <Header title={pageTitle} />
        <Toolbar />
        <Box sx={{ p: 4 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
