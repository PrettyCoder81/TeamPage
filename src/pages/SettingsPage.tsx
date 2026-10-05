import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  Alert,
  Snackbar,
  Slider,
  SelectChangeEvent,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PaletteIcon from '@mui/icons-material/Palette';
import SecurityIcon from '@mui/icons-material/Security';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { updateNotifications, updateAppearance, updateSecurity } from '../store/slices/settingsSlice';
import { setUser } from '../store/slices/authSlice';
import { toastActions } from '../utils/toast';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <Box role="tabpanel" hidden={value !== index} sx={{ py: 3 }}>
    {value === index && children}
  </Box>
);

const SettingsPage: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const settings = useSelector((state: RootState) => state.settings);

  const [tabValue, setTabValue] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  // Account settings state
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSaveAccount = () => {
    if (user) {
      dispatch(setUser({ ...user, name, email }));
      toastActions.settingsUpdated();
    }
  };

  const handleSaveNotifications = () => {
    toastActions.settingsUpdated();
  };

  const handleSaveAppearance = () => {
    toastActions.settingsUpdated();
  };

  const handleSaveSecurity = () => {
    if (newPassword && newPassword !== confirmPassword) {
      toastActions.error('Passwords do not match');
      return;
    }
    toastActions.settingsUpdated();
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
        Settings
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Manage your account settings and preferences
      </Typography>

      <Card sx={{ borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab icon={<PersonIcon />} label="Account" iconPosition="start" />
            <Tab icon={<NotificationsIcon />} label="Notifications" iconPosition="start" />
            <Tab icon={<PaletteIcon />} label="Appearance" iconPosition="start" />
            <Tab icon={<SecurityIcon />} label="Security" iconPosition="start" />
          </Tabs>
        </Box>

        <CardContent sx={{ p: 4 }}>
          {/* Account Tab */}
          <TabPanel value={tabValue} index={0}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#1e293b' }}>
              Account Information
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Grid>
              <Grid size={12}>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="contained"
                    onClick={handleSaveAccount}
                    sx={{
                      bgcolor: '#6366f1',
                      '&:hover': { bgcolor: '#4f46e5' },
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      px: 4,
                    }}
                  >
                    Save Changes
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Notifications Tab */}
          <TabPanel value={tabValue} index={1}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#1e293b' }}>
              Notification Preferences
            </Typography>
            <Grid container spacing={3}>
              <Grid size={12}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#64748b' }}>
                  Notification Channels
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.notifications.email}
                        onChange={(e) => dispatch(updateNotifications({ email: e.target.checked }))}
                      />
                    }
                    label="Email Notifications"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.notifications.push}
                        onChange={(e) => dispatch(updateNotifications({ push: e.target.checked }))}
                      />
                    }
                    label="Push Notifications"
                  />
                </Box>
              </Grid>
              <Grid size={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#64748b' }}>
                  Notification Types
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.notifications.jobCompleted}
                        onChange={(e) => dispatch(updateNotifications({ jobCompleted: e.target.checked }))}
                      />
                    }
                    label="Job Completed"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.notifications.jobFailed}
                        onChange={(e) => dispatch(updateNotifications({ jobFailed: e.target.checked }))}
                      />
                    }
                    label="Job Failed"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.notifications.weeklyReport}
                        onChange={(e) => dispatch(updateNotifications({ weeklyReport: e.target.checked }))}
                      />
                    }
                    label="Weekly Report"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.notifications.mentions}
                        onChange={(e) => dispatch(updateNotifications({ mentions: e.target.checked }))}
                      />
                    }
                    label="Mentions"
                  />
                </Box>
              </Grid>
              <Grid size={12}>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="contained"
                    onClick={handleSaveNotifications}
                    sx={{
                      bgcolor: '#6366f1',
                      '&:hover': { bgcolor: '#4f46e5' },
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      px: 4,
                    }}
                  >
                    Save Preferences
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Appearance Tab */}
          <TabPanel value={tabValue} index={2}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#1e293b' }}>
              Appearance Settings
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Theme</InputLabel>
                  <Select
                    value={settings.appearance.theme}
                    label="Theme"
                    onChange={(e: SelectChangeEvent) => dispatch(updateAppearance({ theme: e.target.value as 'light' | 'dark' | 'system' }))}
                  >
                    <MenuItem value="light">Light</MenuItem>
                    <MenuItem value="dark">Dark</MenuItem>
                    <MenuItem value="system">System</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Language</InputLabel>
                  <Select
                    value={settings.appearance.language}
                    label="Language"
                    onChange={(e: SelectChangeEvent) => dispatch(updateAppearance({ language: e.target.value }))}
                  >
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="es">Spanish</MenuItem>
                    <MenuItem value="fr">French</MenuItem>
                    <MenuItem value="de">German</MenuItem>
                    <MenuItem value="zh">Chinese</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.appearance.compactMode}
                      onChange={(e) => dispatch(updateAppearance({ compactMode: e.target.checked }))}
                    />
                  }
                  label="Compact Mode"
                />
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', ml: 4 }}>
                  Reduce spacing and padding for a more compact interface
                </Typography>
              </Grid>
              <Grid size={12}>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="contained"
                    onClick={handleSaveAppearance}
                    sx={{
                      bgcolor: '#6366f1',
                      '&:hover': { bgcolor: '#4f46e5' },
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      px: 4,
                    }}
                  >
                    Save Appearance
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Security Tab */}
          <TabPanel value={tabValue} index={3}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#1e293b' }}>
              Security Settings
            </Typography>
            <Grid container spacing={3}>
              <Grid size={12}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#64748b' }}>
                  Change Password
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={12}>
                    <TextField
                      fullWidth
                      label="Current Password"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="New Password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Confirm New Password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid size={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#64748b' }}>
                  Two-Factor Authentication
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.security.twoFactorEnabled}
                      onChange={(e) => dispatch(updateSecurity({ twoFactorEnabled: e.target.checked }))}
                    />
                  }
                  label="Enable Two-Factor Authentication"
                />
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', ml: 4 }}>
                  Add an extra layer of security to your account
                </Typography>
              </Grid>
              <Grid size={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#64748b' }}>
                  Session Timeout
                </Typography>
                <Box sx={{ px: 2 }}>
                  <Slider
                    value={settings.security.sessionTimeout}
                    onChange={(_, value) => dispatch(updateSecurity({ sessionTimeout: value as number }))}
                    min={5}
                    max={120}
                    step={5}
                    marks={[
                      { value: 5, label: '5m' },
                      { value: 30, label: '30m' },
                      { value: 60, label: '1h' },
                      { value: 120, label: '2h' },
                    ]}
                    valueLabelDisplay="auto"
                    sx={{
                      '& .MuiSlider-thumb': { bgcolor: '#6366f1' },
                      '& .MuiSlider-track': { bgcolor: '#6366f1' },
                    }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                    Automatically log out after {settings.security.sessionTimeout} minutes of inactivity
                  </Typography>
                </Box>
              </Grid>
              <Grid size={12}>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="contained"
                    onClick={handleSaveSecurity}
                    sx={{
                      bgcolor: '#6366f1',
                      '&:hover': { bgcolor: '#4f46e5' },
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      px: 4,
                    }}
                  >
                    Save Security Settings
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </TabPanel>
        </CardContent>
      </Card>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })} sx={{ borderRadius: 2 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SettingsPage;
