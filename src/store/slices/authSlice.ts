import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { storage } from '../../services/storage';
import { User } from '../../types';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isLoading: true,
  error: null,
};

export const checkAuthState = createAsyncThunk('auth/checkAuthState', async () => {
  const user = await storage.getUser();
  const token = await storage.getToken();

  if (user && token) {
    return { ...user, token };  // Redundant to add token if already stored, but fine
  }
  return null;
});

// Login action: just store user data locally
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password, name }: { email: string; password: string, name: string  }) => {
    // Mock a proper user object
    const user: User = {
      id: 'user-1',  // You can generate a UUID here if needed
      name,
      email,
      token: 'dummy-token',
    };

    await storage.setUser(user);
    await storage.setToken(user.token);

    return user;
  }
);


// Signup action works same as login (optional)
export const signup = createAsyncThunk(
  'auth/signup',
  async ({ email, password, name }: { email: string; password: string; name: string }) => {
    const user: User = {
      id: 'user-1',
      name,
      email,
      token: 'dummy-token',
    };

    await storage.setUser(user);
    await storage.setToken(user.token);

    return user;
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
      })
      .addCase(checkAuthState.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
      })

      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
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
      })
      .addCase(signup.rejected, (state, action) => {
        state.isLoading = false;
        state.error = 'Signup failed';
      })

      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isLoading = false;
        state.error = null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
