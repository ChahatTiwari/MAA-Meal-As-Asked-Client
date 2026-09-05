// services/storage/index.ts
// Storage module exports

import { secureStorage, STORAGE_KEYS } from './secureStorage';

export { secureStorage, STORAGE_KEYS };

// Define the storage interface for proper typing
export interface StorageService {
  setToken(token: string): Promise<void>;
  getToken(): Promise<string | null>;
  removeToken(): Promise<void>;
  setRefreshToken(token: string): Promise<void>;
  getRefreshToken(): Promise<string | null>;
  removeRefreshToken(): Promise<void>;
  setUser<T>(user: T): Promise<void>;
  getUser<T>(): Promise<T | null>;
  removeUser(): Promise<void>;
  setSettings<T>(settings: T): Promise<void>;
  getSettings<T>(): Promise<T | null>;
  setOnboardingComplete(complete: boolean): Promise<void>;
  isOnboardingComplete(): Promise<boolean>;
  setDeviceToken(token: string): Promise<void>;
  getDeviceToken(): Promise<string | null>;
  removeDeviceToken(): Promise<void>;
  setLastSync(timestamp: number): Promise<void>;
  getLastSync(): Promise<number | null>;
  clearAll(): Promise<void>;
  getAllKeys(): Promise<string[]>;
  hasKey(key: string): Promise<boolean>;
  // Low-level methods for direct key access
  setItemAsync(key: string, value: string): Promise<void>;
  getItemAsync(key: string): Promise<string | null>;
  removeItemAsync(key: string): Promise<void>;
}

export const storage: StorageService = secureStorage;

export default secureStorage;