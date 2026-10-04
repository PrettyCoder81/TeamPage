import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import membersReducer from './slices/membersSlice';
import machineRecordsReducer from './slices/machineRecordsSlice';
import settingsReducer from './slices/settingsSlice';
import profileReducer from './slices/profileSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    members: membersReducer,
    machineRecords: machineRecordsReducer,
    settings: settingsReducer,
    profile: profileReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
