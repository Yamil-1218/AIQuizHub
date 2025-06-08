import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../index'

interface UserData {
  id: string
  role: 'student' | 'instructor'
  email: string
  fullName?: string
  institution?: string
  department?: string
}

interface AuthState {
  user: UserData | null
  loading: boolean
  initialized: boolean
  error: string | null
  justLoggedOut: boolean    
}

const initialState: AuthState = {
  user: null,
  loading: false,
  initialized: false,
  error: null,
  justLoggedOut: false,      
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserData>) => {
      state.user = action.payload
      state.loading = false
      state.initialized = true
      state.error = null
      state.justLoggedOut = false
    },
    updateUser: (state, action: PayloadAction<Partial<UserData>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    logout: (state) => {
      state.user = null
      state.loading = false
      state.initialized = true
      state.error = null
      state.justLoggedOut = true
    },
    setInitialized: (state) => {
      state.initialized = true
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
      state.loading = false
    },
    resetJustLoggedOut: (state) => {
      state.justLoggedOut = false
    },
  },
})

export const {
  setUser,
  updateUser,
  setLoading,
  logout,
  setInitialized,
  setError,
  resetJustLoggedOut,
} = authSlice.actions

export const selectCurrentUser = (state: RootState) => state.auth.user
export const selectAuthLoading = (state: RootState) => state.auth.loading
export const selectAuthInitialized = (state: RootState) => state.auth.initialized
export const selectAuthError = (state: RootState) => state.auth.error

export default authSlice.reducer
