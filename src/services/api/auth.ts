// services/api/auth.ts
// Authentication API endpoints

import { apiClient } from './client';
import { storage } from '../storage';
import { 
  LoginCredentials, 
  RegisterData, 
  User, 
  AuthTokens,
  ApiResponse 
} from '../../types';

export const authApi = {
  /**
   * Login user with email/password
   */
  async login(credentials: LoginCredentials): Promise<ApiResponse<{ user: User; tokens: AuthTokens }>> {
    const response = await apiClient.post<{ user: User; tokens: AuthTokens }>(
      '/api/auth/login',
      credentials
    );
    
    // Store tokens if successful
    if (response.success && response.data) {
      await this.storeAuthData(response.data.user, response.data.tokens);
    }
    
    return response;
  },

  /**
   * Register new user
   */
  async register(data: RegisterData): Promise<ApiResponse<{ user: User; tokens: AuthTokens }>> {
    const response = await apiClient.post<{ user: User; tokens: AuthTokens }>(
      '/api/auth/register',
      data
    );
    
    if (response.success && response.data) {
      await this.storeAuthData(response.data.user, response.data.tokens);
    }
    
    return response;
  },

  /**
   * Logout user
   */
  async logout(): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.post<void>('/api/auth/logout');
      await this.clearAuthData();
      return response;
    } catch {
      // Even if API fails, clear local data
      await this.clearAuthData();
      return { success: true };
    }
  },

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<ApiResponse<AuthTokens>> {
    return apiClient.post<AuthTokens>('/api/auth/refresh', { refresh_token: refreshToken });
  },

  /**
   * Get current user profile
   */
  async getProfile(): Promise<ApiResponse<User>> {
    return apiClient.get<User>('/api/auth/profile');
  },

  /**
   * Update user profile
   */
  async updateProfile(data: Partial<User>): Promise<ApiResponse<User>> {
    return apiClient.put<User>('/api/auth/profile', data);
  },

  /**
   * Change password
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>('/api/auth/change-password', { currentPassword, newPassword });
  },

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>('/api/auth/forgot-password', { email });
  },

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>('/api/auth/reset-password', { token, newPassword });
  },

  /**
   * Store auth data in secure storage
   */
  async storeAuthData(user: User, tokens: AuthTokens): Promise<void> {
    await storage.setToken(tokens.accessToken);
    if (tokens.refreshToken) {
      await storage.setRefreshToken(tokens.refreshToken);
    }
    await storage.setUser(user);
    apiClient.setAuthToken(tokens.accessToken);
  },

  /**
   * Clear auth data from storage
   */
  async clearAuthData(): Promise<void> {
    await storage.removeToken();
    await storage.removeRefreshToken();
    await storage.removeUser();
    apiClient.clearAuthToken();
  },

  /**
   * Check if user is authenticated
   */
  async checkAuth(): Promise<boolean> {
    const token = await storage.getToken();
    const user = await storage.getUser();
    return !!token && !!user;
  },
};

export default authApi;