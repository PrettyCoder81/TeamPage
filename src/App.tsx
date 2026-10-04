import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Provider } from 'react-redux';
import { store } from './store';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardPage from './pages/DashboardPage';
import MembersPage from './pages/MembersPage';
import MachineRecordsPage from './pages/MachineRecordsPage';

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
};

const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState('/dashboard');

  const renderPage = () => {
    switch (currentPath) {
      case '/dashboard':
        return <DashboardPage />;
      case '/members':
        return <MembersPage />;
      case '/machine-records':
        return <MachineRecordsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <DashboardLayout
          currentPath={currentPath}
          pageTitle={pageTitles[currentPath] || 'Dashboard'}
          onNavigate={setCurrentPath}
        >
          {renderPage()}
        </DashboardLayout>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
