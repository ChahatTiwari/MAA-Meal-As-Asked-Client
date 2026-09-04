import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { storage } from '../../services/storage';
import { User, UserRole } from '../../types';
import { authApi } from '../../services/api';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  role: UserRole | null;
}

const initialState: AuthState = {
  user: null,
  isLoading: true,
  error: null,
  role: null,
};

export const checkAuthState = createAsyncThunk('auth/checkAuthState', async () => {
  const user = await storage.getUser();
  const token = await storage.getToken();

  if (user && token) {
    return { ...user, token, role: user.role || 'customer' };
  }
  return null;
});

// Login action: call backend API
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authApi.login(email, password);
      const user: User = {
        id: response.data.user.id,
        name: response.data.user.name,
        email: response.data.user.email,
        token: response.data.token,
        role: response.data.user.role || 'customer',
      };

      await storage.setUser(user);
      await storage.setToken(user.token);

      return user;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

// Signup action: call backend API
export const signup = createAsyncThunk(
  'auth/signup',
  async ({ email, password, name }: { email: string; password: string; name: string }, { rejectWithValue }) => {
    try {
      const response = await authApi.signup(email, password, name);
      const user: User = {
        id: response.data.user.id,
        name: response.data.user.name,
        email: response.data.user.email,
        token: response.data.token,
        role: response.data.user.role || 'customer',
      };

      await storage.setUser(user);
      await storage.setToken(user.token);

      return user;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Signup failed');
    }
  }
);

// Logout: Remove stored data
export const logout = createAsyncThunk('auth/logout', async () => {
  await storage.removeUser();
  await storage.removeToken();
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuthState.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkAuthState.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.role = action.payload?.role || null;
      })
      .addCase(checkAuthState.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.role = null;
      })

      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.role = action.payload?.role || null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = 'Login failed';
      })

      .addCase(signup.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.role = action.payload?.role || null;
      })
      .addCase(signup.rejected, (state, action) => {
        state.isLoading = false;
        state.error = 'Signup failed';
      })

      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.role = null;
        state.isLoading = false;
        state.error = null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
