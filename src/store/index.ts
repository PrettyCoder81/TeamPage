import { configureStore, combineReducers, Middleware } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import membersReducer from './slices/membersSlice';
import machineRecordsReducer from './slices/machineRecordsSlice';
import settingsReducer from './slices/settingsSlice';
import profileReducer from './slices/profileSlice';

const STORAGE_KEY = 'team-portal-state';

// Custom persistence middleware - saves state to localStorage on every action
const persistMiddleware: Middleware = (storeAPI) => (next) => (action) => {
  const result = next(action);
  // Save state after every action (debounced via requestAnimationFrame)
  if (typeof window !== 'undefined') {
    requestAnimationFrame(() => {
      try {
        const state = storeAPI.getState();
        const toPersist = {
          auth: state.auth,
          members: state.members,
          machineRecords: state.machineRecords,
          settings: state.settings,
          profile: state.profile,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(toPersist));
      } catch (e) {
        console.warn('Failed to persist state:', e);
      }
    });
  }
  return result;
};

// Load persisted state from localStorage
function loadPersistedState() {
  if (typeof window === 'undefined') return undefined;
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (!serialized) return undefined;
    return JSON.parse(serialized);
  } catch (e) {
    console.warn('Failed to load persisted state:', e);
    return undefined;
  }
}

const rootReducer = combineReducers({
  auth: authReducer,
  members: membersReducer,
  machineRecords: machineRecordsReducer,
  settings: settingsReducer,
  profile: profileReducer,
});

const persistedState = loadPersistedState();

export const store = configureStore({
  reducer: rootReducer,
  preloadedState: persistedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(persistMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed dispatch hook for use in components
import { useDispatch as useReduxDispatch, TypedUseSelectorHook, useSelector as useReduxSelector } from 'react-redux';

export const useAppDispatch = () => useReduxDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useReduxSelector;
