// store/middleware/persistence.ts
// Redux persistence middleware for auth state

import { Middleware } from '@reduxjs/toolkit';
import { storage } from '../../services/storage';
import { RootState } from '../index';

const AUTH_STATE_KEY = 'redux_auth_state';

interface PersistedAuthState {
  user: RootState['auth']['user'];
  role: RootState['auth']['role'];
  isAuthenticated: RootState['auth']['isAuthenticated'];
}

export const persistenceMiddleware: Middleware<{}, RootState> = (store) => (next) => (action) => {
  const result = next(action);
  
  // Persist auth state changes
  if (action.type.startsWith('auth/')) {
    const state = store.getState();
    const authState: PersistedAuthState = {
      user: state.auth.user,
      role: state.auth.role,
      isAuthenticated: state.auth.isAuthenticated,
    };
    
    // Debounce persistence
    if (!persistenceMiddleware.debounceTimer) {
      persistenceMiddleware.debounceTimer = setTimeout(async () => {
        try {
          await storage.setItemAsync(AUTH_STATE_KEY, JSON.stringify(authState));
        } catch (error) {
          console.warn('Failed to persist auth state:', error);
        }
        persistenceMiddleware.debounceTimer = null;
      }, 1000);
    }
  }
  
  return result;
};

// Add debounce timer property
(persistenceMiddleware as any).debounceTimer = null;

/**
 * Load persisted auth state
 */
export const loadPersistedAuth = async (): Promise<PersistedAuthState | null> => {
  try {
    const data = await storage.getItemAsync(AUTH_STATE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.warn('Failed to load persisted auth state:', error);
  }
  return null;
};

/**
 * Clear persisted auth state
 */
export const clearPersistedAuth = async (): Promise<void> => {
  try {
    await storage.removeItemAsync(AUTH_STATE_KEY);
  } catch (error) {
    console.warn('Failed to clear persisted auth state:', error);
  }
};

export default persistenceMiddleware;