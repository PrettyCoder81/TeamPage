import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
  notifications: {
    email: boolean;
    push: boolean;
    jobCompleted: boolean;
    jobFailed: boolean;
    weeklyReport: boolean;
    mentions: boolean;
  };
  appearance: {
    theme: 'light' | 'dark' | 'system';
    compactMode: boolean;
    language: string;
  };
  security: {
    twoFactorEnabled: boolean;
    sessionTimeout: number;
  };
}

const initialState: SettingsState = {
  notifications: {
    email: true,
    push: true,
    jobCompleted: true,
    jobFailed: true,
    weeklyReport: false,
    mentions: true,
  },
  appearance: {
    theme: 'light',
    compactMode: false,
    language: 'en',
  },
  security: {
    twoFactorEnabled: false,
    sessionTimeout: 30,
  },
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateNotifications: (state, action: PayloadAction<Partial<SettingsState['notifications']>>) => {
      state.notifications = { ...state.notifications, ...action.payload };
    },
    updateAppearance: (state, action: PayloadAction<Partial<SettingsState['appearance']>>) => {
      state.appearance = { ...state.appearance, ...action.payload };
    },
    updateSecurity: (state, action: PayloadAction<Partial<SettingsState['security']>>) => {
      state.security = { ...state.security, ...action.payload };
    },
  },
});

export const { updateNotifications, updateAppearance, updateSecurity } = settingsSlice.actions;
export default settingsSlice.reducer;
