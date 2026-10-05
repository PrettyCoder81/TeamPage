import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Divider,
  InputAdornment,
  IconButton,
  Link,
  Alert,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';
import { useAppDispatch, useAppSelector } from '../store';
import { useNavigate } from 'react-router-dom';
import { login, clearError } from '../store/slices/authSlice';
import { toastActions } from '../utils/toast';

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error: authError } = useAppSelector((state) => state.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    dispatch(clearError());

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      await dispatch(login({ email, password })).unwrap();
      toastActions.loginSuccess();
      navigate('/dashboard');
    } catch (err) {
      // Error is handled by Redux state
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        p: 2,
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 440 }}>
        {/* Logo */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '1.8rem',
              color: '#fff',
              mb: 2,
              boxShadow: '0 10px 30px rgba(99, 102, 241, 0.4)',
            }}
          >
            T
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff', mb: 0.5 }}>
            Welcome Back
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
            Sign in to your Team Portal account
          </Typography>
        </Box>

        {/* Login Card */}
        <Card sx={{ borderRadius: 4, boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
          <CardContent sx={{ p: 4 }}>
            {(error || authError) && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                {error || authError}
              </Alert>
            )}

            <form onSubmit={handleLogin}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ mb: 2 }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: '#94a3b8' }} />
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ mb: 2 }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: '#94a3b8' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      size="small"
                      sx={{ color: '#6366f1' }}
                    />
                  }
                  label={<Typography variant="body2">Remember me</Typography>}
                />
                <Link
                  href="#"
                  variant="body2"
                  sx={{ color: '#6366f1', textDecoration: 'none', fontWeight: 500 }}
                >
                  Forgot password?
                </Link>
              </Box>

              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  bgcolor: '#6366f1',
                  '&:hover': { bgcolor: '#4f46e5' },
                  borderRadius: 2,
                  py: 1.5,
                  fontWeight: 600,
                  fontSize: '1rem',
                  boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
                }}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                OR
              </Typography>
            </Divider>

            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<GoogleIcon />}
                sx={{
                  borderColor: '#e2e8f0',
                  color: '#475569',
                  borderRadius: 2,
                  py: 1.2,
                  textTransform: 'none',
                  fontWeight: 500,
                  '&:hover': { borderColor: '#6366f1', bgcolor: 'rgba(99, 102, 241, 0.04)' },
                }}
              >
                Google
              </Button>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<GitHubIcon />}
                sx={{
                  borderColor: '#e2e8f0',
                  color: '#475569',
                  borderRadius: 2,
                  py: 1.2,
                  textTransform: 'none',
                  fontWeight: 500,
                  '&:hover': { borderColor: '#6366f1', bgcolor: 'rgba(99, 102, 241, 0.04)' },
                }}
              >
                GitHub
              </Button>
            </Box>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" component="span" color="text.secondary">
                Don't have an account?{' '}
              </Typography>
              <Button
                onClick={() => navigate('/register')}
                size="small"
                sx={{ textTransform: 'none', fontWeight: 600, color: '#6366f1', p: 0, minWidth: 'auto' }}
              >
                Sign Up
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Hint */}
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
            Demo: Use email with "admin" for admin role (e.g. admin@team.com)
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;
