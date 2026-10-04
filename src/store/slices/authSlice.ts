import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  authPage: 'login' | 'register';
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  authPage: 'login',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    switchRole: (state, action: PayloadAction<'admin' | 'user'>) => {
      if (state.user) {
        state.user.role = action.payload;
      }
    },
    setAuthPage: (state, action: PayloadAction<'login' | 'register'>) => {
      state.authPage = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, switchRole, setAuthPage, logout } = authSlice.actions;
export default authSlice.reducer;
