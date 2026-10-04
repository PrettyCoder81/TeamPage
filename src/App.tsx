import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Provider } from 'react-redux';
import { useSelector } from 'react-redux';
import { store, RootState } from './store';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardPage from './pages/DashboardPage';
import MembersPage from './pages/MembersPage';
import MachineRecordsPage from './pages/MachineRecordsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#6366f1',
    },
    background: {
      default: '#f8fafc',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/members': 'Members',
  '/machine-records': 'Machine Renting Report',
  '/profile': 'Profile',
  '/settings': 'Settings',
};

const AppContent: React.FC = () => {
  const [currentPath, setCurrentPath] = useState('/dashboard');
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const authPage = useSelector((state: RootState) => state.auth.authPage);

  if (!isAuthenticated) {
    if (authPage === 'register') {
      return <RegisterPage />;
    }
    return <LoginPage />;
  }

  const renderPage = () => {
    switch (currentPath) {
      case '/dashboard':
        return <DashboardPage />;
      case '/members':
        return <MembersPage />;
      case '/machine-records':
        return <MachineRecordsPage />;
      case '/profile':
        return <ProfilePage />;
      case '/settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <DashboardLayout
      currentPath={currentPath}
      pageTitle={pageTitles[currentPath] || 'Dashboard'}
      onNavigate={setCurrentPath}
    >
      {renderPage()}
    </DashboardLayout>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppContent />
      </ThemeProvider>
    </Provider>
  );
};

export default App;
