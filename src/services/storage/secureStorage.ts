// services/storage/secureStorage.ts
// Secure storage service using Expo SecureStore with localStorage fallback

import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { env } from '../../config/env';

const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  APP_SETTINGS: 'app_settings',
  ONBOARDING_COMPLETE: 'onboarding_complete',
  DEVICE_TOKEN: 'device_token',
  LAST_SYNC: 'last_sync',
} as const;

type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];

/**
 * Check if SecureStore is available
 */
const isSecureStoreAvailable = (): boolean => {
  if (Platform.OS === 'web') return false;
  if (!env.storage.useSecureStore) return false;
  return true;
};

/**
 * Get storage implementation based on platform and availability
 */
const getStorage = () => {
  if (isSecureStoreAvailable()) {
    return SecureStore;
  }
  
  // Fallback to localStorage-like interface
  return {
    setItemAsync: async (key: string, value: string): Promise<void> => {
      if (Platform.OS === 'web' || env.storage.fallbackToLocalStorage) {
        localStorage.setItem(key, value);
      }
    },
    getItemAsync: async (key: string): Promise<string | null> => {
      if (Platform.OS === 'web' || env.storage.fallbackToLocalStorage) {
        return localStorage.getItem(key);
      }
      return null;
    },
    deleteItemAsync: async (key: string): Promise<void> => {
      if (Platform.OS === 'web' || env.storage.fallbackToLocalStorage) {
        localStorage.removeItem(key);
      }
    },
  };
};

/**
 * Secure Storage Service
 */
export const secureStorage = {
  // ============================================================
  // AUTH TOKENS
  // ============================================================

  /**
   * Set auth token
   */
  async setToken(token: string): Promise<void> {
    const storage = getStorage();
    await storage.setItemAsync(STORAGE_KEYS.AUTH_TOKEN, token);
  },

  /**
   * Get auth token
   */
  async getToken(): Promise<string | null> {
    const storage = getStorage();
    return storage.getItemAsync(STORAGE_KEYS.AUTH_TOKEN);
  },

  /**
   * Remove auth token
   */
  async removeToken(): Promise<void> {
    const storage = getStorage();
    await storage.deleteItemAsync(STORAGE_KEYS.AUTH_TOKEN);
  },

  /**
   * Set refresh token
   */
  async setRefreshToken(token: string): Promise<void> {
    const storage = getStorage();
    await storage.setItemAsync(STORAGE_KEYS.REFRESH_TOKEN, token);
  },

  /**
   * Get refresh token
   */
  async getRefreshToken(): Promise<string | null> {
    const storage = getStorage();
    return storage.getItemAsync(STORAGE_KEYS.REFRESH_TOKEN);
  },

  /**
   * Remove refresh token
   */
  async removeRefreshToken(): Promise<void> {
    const storage = getStorage();
    await storage.deleteItemAsync(STORAGE_KEYS.REFRESH_TOKEN);
  },

  // ============================================================
  // USER DATA
  // ============================================================

  /**
   * Set user data
   */
  async setUser<T>(user: T): Promise<void> {
    const storage = getStorage();
    await storage.setItemAsync(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
  },

  /**
   * Get user data
   */
  async getUser<T>(): Promise<T | null> {
    const storage = getStorage();
    const data = await storage.getItemAsync(STORAGE_KEYS.USER_DATA);
    if (!data) return null;
    try {
      return JSON.parse(data) as T;
    } catch {
      return null;
    }
  },

  /**
   * Remove user data
   */
  async removeUser(): Promise<void> {
    const storage = getStorage();
    await storage.deleteItemAsync(STORAGE_KEYS.USER_DATA);
  },

  // ============================================================
  // APP SETTINGS
  // ============================================================

  /**
   * Set app settings
   */
  async setSettings<T>(settings: T): Promise<void> {
    const storage = getStorage();
    await storage.setItemAsync(STORAGE_KEYS.APP_SETTINGS, JSON.stringify(settings));
  },

  /**
   * Get app settings
   */
  async getSettings<T>(): Promise<T | null> {
    const storage = getStorage();
    const data = await storage.getItemAsync(STORAGE_KEYS.APP_SETTINGS);
    if (!data) return null;
    try {
      return JSON.parse(data) as T;
    } catch {
      return null;
    }
  },

  // ============================================================
  // ONBOARDING
  // ============================================================

  /**
   * Set onboarding complete
   */
  async setOnboardingComplete(complete: boolean): Promise<void> {
    const storage = getStorage();
    await storage.setItemAsync(STORAGE_KEYS.ONBOARDING_COMPLETE, String(complete));
  },

  /**
   * Check if onboarding complete
   */
  async isOnboardingComplete(): Promise<boolean> {
    const storage = getStorage();
    const value = await storage.getItemAsync(STORAGE_KEYS.ONBOARDING_COMPLETE);
    return value === 'true';
  },

  // ============================================================
  // DEVICE TOKEN (Push Notifications)
  // ============================================================

  /**
   * Set device push token
   */
  async setDeviceToken(token: string): Promise<void> {
    const storage = getStorage();
    await storage.setItemAsync(STORAGE_KEYS.DEVICE_TOKEN, token);
  },

  /**
   * Get device push token
   */
  async getDeviceToken(): Promise<string | null> {
    const storage = getStorage();
    return storage.getItemAsync(STORAGE_KEYS.DEVICE_TOKEN);
  },

  /**
   * Remove device push token
   */
  async removeDeviceToken(): Promise<void> {
    const storage = getStorage();
    await storage.deleteItemAsync(STORAGE_KEYS.DEVICE_TOKEN);
  },

  // ============================================================
  // SYNC TIMESTAMP
  // ============================================================

  /**
   * Set last sync timestamp
   */
  async setLastSync(timestamp: number = Date.now()): Promise<void> {
    const storage = getStorage();
    await storage.setItemAsync(STORAGE_KEYS.LAST_SYNC, String(timestamp));
  },

  /**
   * Get last sync timestamp
   */
  async getLastSync(): Promise<number | null> {
    const storage = getStorage();
    const value = await storage.getItemAsync(STORAGE_KEYS.LAST_SYNC);
    return value ? parseInt(value, 10) : null;
  },

  // ============================================================
  // UTILITY METHODS
  // ============================================================

  /**
   * Clear all stored data
   */
  async clearAll(): Promise<void> {
    const storage = getStorage();
    await Promise.all(
      Object.values(STORAGE_KEYS).map(key => storage.deleteItemAsync(key))
    );
  },

  /**
   * Get all stored keys
   */
  async getAllKeys(): Promise<string[]> {
    if (Platform.OS === 'web' || env.storage.fallbackToLocalStorage) {
      return Object.keys(localStorage);
    }
    // SecureStore doesn't support getting all keys
    return Object.values(STORAGE_KEYS);
  },

  /**
   * Check if key exists
   */
  async hasKey(key: StorageKey): Promise<boolean> {
    const storage = getStorage();
    const value = await storage.getItemAsync(key);
    return value !== null;
  },

  // ============================================================
  // LOW-LEVEL METHODS
  // ============================================================

  /**
   * Set item directly by key
   */
  async setItemAsync(key: string, value: string): Promise<void> {
    const storage = getStorage();
    await storage.setItemAsync(key, value);
  },

  /**
   * Get item directly by key
   */
  async getItemAsync(key: string): Promise<string | null> {
    const storage = getStorage();
    return storage.getItemAsync(key);
  },

  /**
   * Remove item directly by key
   */
  async removeItemAsync(key: string): Promise<void> {
    const storage = getStorage();
    await storage.deleteItemAsync(key);
  },
};

export { STORAGE_KEYS };

export default secureStorage;