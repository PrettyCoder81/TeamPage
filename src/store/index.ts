import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import membersReducer from './slices/membersSlice';
import machineRecordsReducer from './slices/machineRecordsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    members: membersReducer,
    machineRecords: machineRecordsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
