// store/slices/authSlice.ts
// Authentication Redux slice with TypeScript types

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { storage } from '../../services/storage';
import { User, UserRole, AuthState, AuthTokens } from '../../types';
import { authApi } from '../../services/api';

const initialState: AuthState = {
  user: null,
  isLoading: true,
  error: null,
  role: null,
  isAuthenticated: false,
};

// Async thunks
export const checkAuthState = createAsyncThunk(
  'auth/checkAuthState',
  async (_, { rejectWithValue }) => {
    try {
      const [user, token] = await Promise.all([
        storage.getUser<User>(),
        storage.getToken(),
      ]);

      if (user && token) {
        return { ...user, token, role: user.role || 'customer' };
      }
      return null;
    } catch (error) {
      return rejectWithValue('Failed to restore session');
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials);
      if (response.success && response.data) {
        return response.data;
      }
      return rejectWithValue(response.error || 'Login failed');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const signup = createAsyncThunk(
  'auth/signup',
  async (data: { email: string; password: string; name: string }, { rejectWithValue }) => {
    try {
      const response = await authApi.register(data);
      if (response.success && response.data) {
        return response.data;
      }
      return rejectWithValue(response.error || 'Signup failed');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Signup failed');
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  await authApi.logout();
});

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (data: Partial<User>, { rejectWithValue }) => {
    try {
      const response = await authApi.updateProfile(data);
      if (response.success && response.data) {
        return response.data;
      }
      return rejectWithValue(response.error || 'Failed to update profile');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update profile');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.role = action.payload?.role || null;
      state.isAuthenticated = !!action.payload;
    },
    setTokens: (state, action: PayloadAction<AuthTokens>) => {
      if (state.user) {
        state.user.token = action.payload.accessToken;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Check auth state
      .addCase(checkAuthState.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkAuthState.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.role = action.payload?.role || null;
        state.isAuthenticated = !!action.payload;
      })
      .addCase(checkAuthState.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.role = null;
        state.isAuthenticated = false;
      })

      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.role = action.payload.user.role;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Login failed';
      })

      // Signup
      .addCase(signup.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.role = action.payload.user.role;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(signup.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Signup failed';
      })

      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.role = null;
        state.isLoading = false;
        state.error = null;
        state.isAuthenticated = false;
      })

      // Update profile
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.role = action.payload.role;
      });
  },
});

export const { clearError, setUser, setTokens } = authSlice.actions;
export default authSlice.reducer;