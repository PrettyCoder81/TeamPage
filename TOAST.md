# Toast Notifications

## Overview

The application uses `react-hot-toast` for displaying toast notifications to provide user feedback for various actions.

## Installation

The toast library is already installed:
```bash
npm install react-hot-toast
```

## Setup

### 1. Toaster Component (App.tsx)

The `Toaster` component is added to the root `App.tsx` file with custom styling:

```typescript
import { Toaster } from 'react-hot-toast';

<Toaster
  position="top-right"
  toastOptions={{
    duration: 4000,
    style: {
      background: '#fff',
      color: '#1e293b',
      borderRadius: '12px',
      padding: '16px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
      fontSize: '14px',
      fontWeight: 500,
    },
    success: {
      duration: 3000,
      iconTheme: {
        primary: '#22c55e',
        secondary: '#fff',
      },
    },
    error: {
      duration: 4000,
      iconTheme: {
        primary: '#ef4444',
        secondary: '#fff',
      },
    },
  }}
/>
```

### 2. Toast Utility (src/utils/toast.ts)

A utility file provides consistent toast functions throughout the app:

```typescript
import toast from 'react-hot-toast';

// Basic toast functions
export const showSuccess = (message: string) => { ... }
export const showError = (message: string) => { ... }
export const showInfo = (message: string) => { ... }
export const showWarning = (message: string) => { ... }
export const showLoading = (message: string) => { ... }

// Common action toasts
export const toastActions = {
  loginSuccess: () => showSuccess('Welcome back! Logged in successfully.'),
  loginError: (message?: string) => showError(message || 'Failed to login...'),
  registerSuccess: () => showSuccess('Account created successfully!'),
  // ... more actions
}
```

## Usage

### Import the toast utility

```typescript
import { toastActions } from '../utils/toast';
```

### Use in components

```typescript
// Success toast
toastActions.loginSuccess();

// Error toast
toastActions.loginError('Invalid credentials');

// Generic toasts
toastActions.saved();
toastActions.deleted();
toastActions.error('Something went wrong');
```

## Implemented Toasts

### Authentication
- ✅ **Login Success**: "Welcome back! Logged in successfully."
- ✅ **Register Success**: "Account created successfully! Welcome aboard."
- ✅ **Logout Success**: "Logged out successfully."

### Machine Records
- ✅ **Record Created**: "Record created successfully."
- ✅ **Record Updated**: "Record updated successfully."
- ✅ **Record Deleted**: "Record deleted successfully."
- ✅ **Record Error**: "Failed to [action] record. Please try again."

### Profile
- ✅ **Profile Updated**: "Profile updated successfully."

### Settings
- ✅ **Settings Updated**: "Settings saved successfully."

## Styling

### Success Toast
- Background: `#f0fdf4` (light green)
- Text: `#166534` (dark green)
- Border: `#bbf7d0`
- Icon: Green checkmark

### Error Toast
- Background: `#fef2f2` (light red)
- Text: `#991b1b` (dark red)
- Border: `#fecaca`
- Icon: Red X

### Info Toast
- Background: `#eff6ff` (light blue)
- Text: `#1e40af` (dark blue)
- Border: `#bfdbfe`
- Icon: ℹ️

### Warning Toast
- Background: `#fef3c7` (light yellow)
- Text: `#92400e` (dark orange)
- Border: `#fde68a`
- Icon: ⚠️

## Configuration

### Position
Default: `top-right`

Available positions:
- `top-left`
- `top-center`
- `top-right`
- `bottom-left`
- `bottom-center`
- `bottom-right`

### Duration
- Success: 3000ms (3 seconds)
- Error: 4000ms (4 seconds)
- Loading: Infinity (manual dismiss)
- Default: 4000ms (4 seconds)

## Advanced Usage

### Loading Toast
```typescript
const toastId = showLoading('Saving...');
// ... do async work
dismissToast(toastId);
showSuccess('Saved!');
```

### Promise Toast
```typescript
toast.promise(
  saveData(),
  {
    loading: 'Saving...',
    success: 'Saved successfully!',
    error: 'Could not save.',
  }
);
```

### Custom Toast
```typescript
toast.custom((t) => (
  <div className={`...`}>
    Custom content
  </div>
));
```

## Best Practices

1. **Use for user actions**: Show toasts when users perform actions (create, update, delete)
2. **Keep messages short**: Toast messages should be concise and clear
3. **Use appropriate types**: Success for positive actions, error for failures
4. **Don't overuse**: Avoid showing toasts for every small action
5. **Provide context**: Include relevant information in error messages

## Files Modified

- `src/App.tsx` - Added Toaster component
- `src/utils/toast.ts` - Created toast utility
- `src/pages/LoginPage.tsx` - Added login success toast
- `src/pages/RegisterPage.tsx` - Added register success toast
- `src/pages/MachineRecordsPage.tsx` - Added CRUD toasts
- `src/pages/ProfilePage.tsx` - Added profile update toast
- `src/pages/SettingsPage.tsx` - Added settings save toasts
- `src/layouts/Header.tsx` - Added logout success toast

## Testing

To test toasts:
1. **Login**: Should see success toast
2. **Register**: Should see success toast
3. **Create Record**: Should see success toast
4. **Update Record**: Should see success toast
5. **Delete Record**: Should see success toast
6. **Update Profile**: Should see success toast
7. **Save Settings**: Should see success toast
8. **Logout**: Should see success toast

## Troubleshooting

### Toasts not showing
- Check that `<Toaster />` is in App.tsx
- Verify import path for toast utility
- Check browser console for errors

### Wrong styling
- Ensure custom styles are applied in Toaster component
- Check CSS specificity issues

### Toasts not dismissing
- Check duration settings
- Verify no infinite loading toasts

## Future Enhancements

- [ ] Add toast for filter changes
- [ ] Add toast for pagination changes
- [ ] Add confirmation toasts for destructive actions
- [ ] Add sound effects (optional)
- [ ] Add toast queue for multiple toasts
- [ ] Add undo functionality for delete actions
