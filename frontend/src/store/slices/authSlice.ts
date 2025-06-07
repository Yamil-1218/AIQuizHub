import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../index';

interface UserData {
  id: string
  role: 'student' | 'instructor'
  email: string
  fullName?: string
  institution?: string
  department?: string
}

interface AuthState {
  user: UserData | null;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserData | null>) => {
      state.user = action.payload;
      state.loading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.loading = false;
    },
  },
});

// Selectores
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectAuthLoading = (state: RootState) => state.auth.loading;

export const { setUser, setLoading, logout } = authSlice.actions;
export default authSlice.reducer;