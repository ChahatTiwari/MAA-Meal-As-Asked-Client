// services/api/client.ts
// Centralized API client with interceptors, retry logic, and error handling

import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';
import { env } from '../../config/env';
import { storage } from '../storage';
import { ApiError, ApiResponse, AuthTokens } from '../../types';

/**
 * Custom API Error class for better error handling
 */
export class ApiClientError extends Error {
  public readonly code?: string;
  public readonly status?: number;
  public readonly details?: any;
  public readonly isNetworkError: boolean;
  public readonly isTimeout: boolean;
  public readonly isUnauthorized: boolean;
  public readonly isForbidden: boolean;
  public readonly isNotFound: boolean;
  public readonly isServerError: boolean;

  constructor(error: AxiosError | Error, public readonly originalError: AxiosError | Error) {
    super(error.message);
    this.name = 'ApiClientError';
    
    if (axios.isAxiosError(error)) {
      this.code = error.code;
      this.status = error.response?.status;
      this.details = error.response?.data;
      this.isNetworkError = error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK' || !error.response;
      this.isTimeout = error.code === 'ECONNABORTED';
      this.isUnauthorized = error.response?.status === 401;
      this.isForbidden = error.response?.status === 403;
      this.isNotFound = error.response?.status === 404;
      this.isServerError = (error.response?.status ?? 0) >= 500;
    } else {
      this.isNetworkError = true;
      this.isTimeout = false;
      this.isUnauthorized = false;
      this.isForbidden = false;
      this.isNotFound = false;
      this.isServerError = false;
    }
  }
}

/**
 * Request/Response interceptors configuration
 */
interface InterceptorConfig {
  onRequest?: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>;
  onRequestError?: (error: Error) => Promise<Error>;
  onResponse?: (response: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>;
  onResponseError?: (error: AxiosError) => Promise<AxiosError>;
}

/**
 * API Client class
 */
export class ApiClient {
  private client: AxiosInstance;
  private authToken: string | null = null;
  private refreshPromise: Promise<string | null> | null = null;
  private interceptors: InterceptorConfig = {};

  constructor(config?: Partial<AxiosRequestConfig>) {
    this.client = axios.create({
      baseURL: env.api.baseUrl,
      timeout: env.api.timeout,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      ...config,
    });

    this.setupInterceptors();
  }

  /**
   * Set up request/response interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor - add auth token
    this.client.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        // Skip auth for public endpoints
        const isPublicEndpoint = config.url?.startsWith('/api/public/') || 
                                 config.url?.startsWith('/api/auth/');
        
        if (!isPublicEndpoint) {
          const token = await this.getAuthToken();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }

        // Add request ID for tracing
        config.headers['X-Request-ID'] = this.generateRequestId();
        
        // Add device info headers
        config.headers['X-App-Version'] = env.app.version;
        config.headers['X-Build-Number'] = env.app.buildNumber;

        // Apply custom request interceptor
        if (this.interceptors.onRequest) {
          return this.interceptors.onRequest(config);
        }

        return config;
      },
      (error) => {
        if (this.interceptors.onRequestError) {
          return this.interceptors.onRequestError(error);
        }
        return Promise.reject(error);
      }
    );

    // Response interceptor - handle errors, token refresh
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        if (this.interceptors.onResponse) {
          return this.interceptors.onResponse(response);
        }
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // Handle 401 - attempt token refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            const newToken = await this.refreshAuthToken();
            if (newToken) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed, clear auth and redirect to login
            await this.clearAuth();
          }
        }

        // Apply custom response error interceptor
        if (this.interceptors.onResponseError) {
          return this.interceptors.onResponseError(error);
        }

        // Transform error
        throw new ApiClientError(error, error);
      }
    );
  }

  /**
   * Get auth token from storage
   */
  private async getAuthToken(): Promise<string | null> {
    if (this.authToken) {
      return this.authToken;
    }
    
    try {
      const token = await storage.getToken();
      this.authToken = token;
      return token;
    } catch {
      return null;
    }
  }

  /**
   * Refresh auth token
   */
  private async refreshAuthToken(): Promise<string | null> {
    // Prevent multiple simultaneous refresh attempts
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = (async () => {
      try {
        // Try to get refresh token from storage
        const refreshToken = await storage.getRefreshToken();
        if (!refreshToken) {
          return null;
        }

        // Call refresh endpoint
        const response = await this.client.post<ApiResponse<AuthTokens>>('/api/auth/refresh', {
          refresh_token: refreshToken,
        });

        if (response.data.success && response.data.data) {
          const { accessToken, refreshToken: newRefreshToken } = response.data.data;
          await storage.setToken(accessToken);
          if (newRefreshToken) {
            await storage.setRefreshToken(newRefreshToken);
          }
          this.authToken = accessToken;
          return accessToken;
        }
      } catch {
        // Refresh failed
      }
      return null;
    })();

    const result = await this.refreshPromise;
    this.refreshPromise = null;
    return result;
  }

  /**
   * Clear auth tokens
   */
  private async clearAuth(): Promise<void> {
    this.authToken = null;
    await storage.removeToken();
    await storage.removeRefreshToken();
    await storage.removeUser();
  }

  /**
   * Generate unique request ID
   */
  private generateRequestId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Set custom interceptors
   */
  setInterceptors(interceptors: InterceptorConfig): void {
    this.interceptors = { ...this.interceptors, ...interceptors };
  }

  /**
   * Generic request method with retry logic
   */
  private async request<T>(
    method: 'get' | 'post' | 'put' | 'patch' | 'delete',
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    let lastError: Error | null = null;
    const maxRetries = env.api.retryAttempts;
    const baseDelay = env.api.retryDelay;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const response = await this.client.request<ApiResponse<T>>({
          method,
          url,
          data,
          ...config,
        });

        // Transform response to standard format
        return {
          success: response.data.success ?? true,
          data: response.data.data,
          message: response.data.message,
          error: response.data.error,
        };
      } catch (error) {
        lastError = error as Error;
        
        // Don't retry on client errors (4xx) except 401 (handled by interceptor)
        if (axios.isAxiosError(error) && error.response) {
          const status = error.response.status;
          if (status >= 400 && status < 500 && status !== 401) {
            throw error;
          }
        }

        // Don't retry on last attempt
        if (attempt === maxRetries) {
          break;
        }

        // Exponential backoff with jitter
        const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError;
  }

  // HTTP Methods
  get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request('get', url, undefined, config);
  }

  post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request('post', url, data, config);
  }

  put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request('put', url, data, config);
  }

  patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request('patch', url, data, config);
  }

  delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request('delete', url, undefined, config);
  }

  /**
   * Upload file with progress
   */
  upload<T>(
    url: string,
    file: { uri: string; name: string; type: string },
    onProgress?: (progress: number) => void,
    additionalData?: Record<string, any>
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file as any);
    
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
    }

    return this.request('post', url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          onProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
        }
      },
    });
  }

  /**
   * Get raw axios instance for advanced usage
   */
  getAxiosInstance(): AxiosInstance {
    return this.client;
  }

  /**
   * Set auth token manually (e.g., after login)
   */
  setAuthToken(token: string): void {
    this.authToken = token;
  }

  /**
   * Clear auth token
   */
  clearAuthToken(): void {
    this.authToken = null;
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export types
export type { AxiosRequestConfig, AxiosResponse, AxiosError };