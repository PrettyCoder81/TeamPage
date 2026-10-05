import toast from 'react-hot-toast';

// Success toasts
export const showSuccess = (message: string) => {
  toast.success(message, {
    style: {
      background: '#f0fdf4',
      color: '#166534',
      border: '1px solid #bbf7d0',
    },
  });
};

// Error toasts
export const showError = (message: string) => {
  toast.error(message, {
    style: {
      background: '#fef2f2',
      color: '#991b1b',
      border: '1px solid #fecaca',
    },
  });
};

// Info toasts
export const showInfo = (message: string) => {
  toast(message, {
    icon: 'ℹ️',
    style: {
      background: '#eff6ff',
      color: '#1e40af',
      border: '1px solid #bfdbfe',
    },
  });
};

// Warning toasts
export const showWarning = (message: string) => {
  toast(message, {
    icon: '⚠️',
    style: {
      background: '#fef3c7',
      color: '#92400e',
      border: '1px solid #fde68a',
    },
  });
};

// Loading toast (returns toast ID for later dismissal)
export const showLoading = (message: string) => {
  return toast.loading(message, {
    style: {
      background: '#f8fafc',
      color: '#475569',
      border: '1px solid #e2e8f0',
    },
  });
};

// Dismiss a specific toast
export const dismissToast = (toastId: string) => {
  toast.dismiss(toastId);
};

// Dismiss all toasts
export const dismissAllToasts = () => {
  toast.dismiss();
};

// Common action toasts
export const toastActions = {
  // Auth
  loginSuccess: () => showSuccess('Welcome back! Logged in successfully.'),
  loginError: (message?: string) => showError(message || 'Failed to login. Please check your credentials.'),
  registerSuccess: () => showSuccess('Account created successfully! Welcome aboard.'),
  registerError: (message?: string) => showError(message || 'Failed to create account. Please try again.'),
  logoutSuccess: () => showSuccess('Logged out successfully.'),

  // Records
  recordCreated: () => showSuccess('Record created successfully.'),
  recordUpdated: () => showSuccess('Record updated successfully.'),
  recordDeleted: () => showSuccess('Record deleted successfully.'),
  recordError: (action: string) => showError(`Failed to ${action} record. Please try again.`),

  // Profile
  profileUpdated: () => showSuccess('Profile updated successfully.'),
  profileError: () => showError('Failed to update profile. Please try again.'),

  // Settings
  settingsUpdated: () => showSuccess('Settings saved successfully.'),
  settingsError: () => showError('Failed to save settings. Please try again.'),

  // Generic
  saved: () => showSuccess('Changes saved successfully.'),
  deleted: () => showSuccess('Deleted successfully.'),
  error: (message?: string) => showError(message || 'Something went wrong. Please try again.'),
};
