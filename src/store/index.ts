import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './slices/authSlice';
import membersReducer from './slices/membersSlice';
import machineRecordsReducer from './slices/machineRecordsSlice';
import settingsReducer from './slices/settingsSlice';
import profileReducer from './slices/profileSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  members: membersReducer,
  machineRecords: machineRecordsReducer,
  settings: settingsReducer,
  profile: profileReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'members', 'machineRecords', 'settings', 'profile'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
