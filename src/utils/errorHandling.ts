// utils/errorHandling.ts
// Centralized error handling utilities

import { env } from '../config/env';
import { ApiError, ApiClientError } from '../services/api/client';

/**
 * Error categories for better handling
 */
export enum ErrorCategory {
  NETWORK = 'NETWORK',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  VALIDATION = 'VALIDATION',
  NOT_FOUND = 'NOT_FOUND',
  SERVER = 'SERVER',
  TIMEOUT = 'TIMEOUT',
  UNKNOWN = 'UNKNOWN',
  USER_CANCELLED = 'USER_CANCELLED',
}

/**
 * Standardized error structure
 */
export interface AppError {
  category: ErrorCategory;
  message: string;
  code?: string;
  originalError?: Error;
  recoverable: boolean;
  userMessage: string;
  timestamp: number;
  context?: Record<string, any>;
}

/**
 * Convert any error to standardized AppError
 */
export const normalizeError = (error: unknown, context?: Record<string, any>): AppError => {
  const timestamp = Date.now();
  
  // Handle ApiClientError (from our API client)
  if (error instanceof ApiClientError) {
    if (error.isNetworkError) {
      return {
        category: error.isTimeout ? ErrorCategory.TIMEOUT : ErrorCategory.NETWORK,
        message: error.message,
        code: error.code,
        originalError: error,
        recoverable: true,
        userMessage: error.isTimeout 
          ? 'Request timed out. Please check your connection and try again.'
          : 'Network error. Please check your internet connection and try again.',
        timestamp,
        context,
      };
    }
    
    if (error.isUnauthorized) {
      return {
        category: ErrorCategory.AUTHENTICATION,
        message: error.message,
        code: 'UNAUTHORIZED',
        originalError: error,
        recoverable: false,
        userMessage: 'Your session has expired. Please log in again.',
        timestamp,
        context,
      };
    }
    
    if (error.isForbidden) {
      return {
        category: ErrorCategory.AUTHORIZATION,
        message: error.message,
        code: 'FORBIDDEN',
        originalError: error,
        recoverable: false,
        userMessage: 'You do not have permission to perform this action.',
        timestamp,
        context,
      };
    }
    
    if (error.isNotFound) {
      return {
        category: ErrorCategory.NOT_FOUND,
        message: error.message,
        code: 'NOT_FOUND',
        originalError: error,
        recoverable: false,
        userMessage: 'The requested resource was not found.',
        timestamp,
        context,
      };
    }
    
    if (error.isServerError) {
      return {
        category: ErrorCategory.SERVER,
        message: error.message,
        code: error.status?.toString(),
        originalError: error,
        recoverable: true,
        userMessage: 'Server error. Please try again later.',
        timestamp,
        context,
      };
    }
  }
  
  // Handle Axios errors directly
  if (isAxiosError(error)) {
    return normalizeAxiosError(error, context);
  }
  
  // Handle standard Error
  if (error instanceof Error) {
    return {
      category: ErrorCategory.UNKNOWN,
      message: error.message,
      originalError: error,
      recoverable: false,
      userMessage: 'An unexpected error occurred. Please try again.',
      timestamp,
      context,
    };
  }
  
  // Handle string errors
  if (typeof error === 'string') {
    return {
      category: ErrorCategory.UNKNOWN,
      message: error,
      recoverable: false,
      userMessage: error,
      timestamp,
      context,
    };
  }
  
  // Unknown error type
  return {
    category: ErrorCategory.UNKNOWN,
    message: 'Unknown error occurred',
    recoverable: false,
    userMessage: 'An unexpected error occurred. Please try again.',
    timestamp,
    context,
  };
};

/**
 * Normalize Axios error
 */
const normalizeAxiosError = (error: any, context?: Record<string, any>): AppError => {
  const timestamp = Date.now();
  const status = error.response?.status;
  const data = error.response?.data;
  
  // Extract error message from response
  let message = error.message;
  let code = error.code;
  
  if (data) {
    if (typeof data === 'string') {
      message = data;
    } else if (data.message) {
      message = data.message;
    } else if (data.error) {
      message = data.error;
    } else if (data.errors) {
      // Validation errors
      const validationErrors = Object.values(data.errors).flat();
      message = validationErrors.join(', ');
      code = 'VALIDATION_ERROR';
    }
  }
  
  if (!status) {
    // Network error
    return {
      category: error.code === 'ECONNABORTED' ? ErrorCategory.TIMEOUT : ErrorCategory.NETWORK,
      message,
      code,
      originalError: error,
      recoverable: true,
      userMessage: error.code === 'ECONNABORTED'
        ? 'Request timed out. Please check your connection and try again.'
        : 'Network error. Please check your internet connection and try again.',
      timestamp,
      context,
    };
  }
  
  switch (status) {
    case 400:
      return {
        category: ErrorCategory.VALIDATION,
        message,
        code: 'BAD_REQUEST',
        originalError: error,
        recoverable: false,
        userMessage: message || 'Invalid request. Please check your input and try again.',
        timestamp,
        context,
      };
    case 401:
      return {
        category: ErrorCategory.AUTHENTICATION,
        message,
        code: 'UNAUTHORIZED',
        originalError: error,
        recoverable: false,
        userMessage: 'Your session has expired. Please log in again.',
        timestamp,
        context,
      };
    case 403:
      return {
        category: ErrorCategory.AUTHORIZATION,
        message,
        code: 'FORBIDDEN',
        originalError: error,
        recoverable: false,
        userMessage: 'You do not have permission to perform this action.',
        timestamp,
        context,
      };
    case 404:
      return {
        category: ErrorCategory.NOT_FOUND,
        message,
        code: 'NOT_FOUND',
        originalError: error,
        recoverable: false,
        userMessage: 'The requested resource was not found.',
        timestamp,
        context,
      };
    case 422:
      return {
        category: ErrorCategory.VALIDATION,
        message,
        code: 'VALIDATION_ERROR',
        originalError: error,
        recoverable: false,
        userMessage: message || 'Validation failed. Please check your input.',
        timestamp,
        context,
      };
    case 429:
      return {
        category: ErrorCategory.SERVER,
        message,
        code: 'RATE_LIMITED',
        originalError: error,
        recoverable: true,
        userMessage: 'Too many requests. Please wait a moment and try again.',
        timestamp,
        context,
      };
    default:
      if (status >= 500) {
        return {
          category: ErrorCategory.SERVER,
          message,
          code: status.toString(),
          originalError: error,
          recoverable: true,
          userMessage: 'Server error. Please try again later.',
          timestamp,
          context,
        };
      }
      
      return {
        category: ErrorCategory.UNKNOWN,
        message,
        code: status.toString(),
        originalError: error,
        recoverable: false,
        userMessage: 'An error occurred. Please try again.',
        timestamp,
        context,
      };
  }
};

/**
 * Type guard for Axios error
 */
const isAxiosError = (error: any): boolean => {
  return error && error.isAxiosError === true;
};

/**
 * Get user-friendly error message
 */
export const getUserMessage = (error: unknown): string => {
  const appError = normalizeError(error);
  return appError.userMessage;
};

/**
 * Check if error is recoverable (can retry)
 */
export const isRecoverable = (error: unknown): boolean => {
  const appError = normalizeError(error);
  return appError.recoverable;
};

/**
 * Check if error is authentication related
 */
export const isAuthError = (error: unknown): boolean => {
  const appError = normalizeError(error);
  return appError.category === ErrorCategory.AUTHENTICATION;
};

/**
 * Check if error is network related
 */
export const isNetworkError = (error: unknown): boolean => {
  const appError = normalizeError(error);
  return appError.category === ErrorCategory.NETWORK || appError.category === ErrorCategory.TIMEOUT;
};

/**
 * Log error (development only or when enabled)
 */
export const logError = (error: unknown, context?: Record<string, any>): void => {
  if (!env.features.enableLogging) return;
  
  const appError = normalizeError(error, context);
  
  console.group(`🚨 Error [${appError.category}]`);
  console.error('Message:', appError.message);
  console.error('User Message:', appError.userMessage);
  console.error('Recoverable:', appError.recoverable);
  console.error('Context:', appError.context);
  console.error('Original Error:', appError.originalError);
  console.groupEnd();
  
  // Could send to crash reporting service here
  if (env.features.enableCrashReporting && env.external.sentryDsn) {
    // Sentry.captureException(appError.originalError || new Error(appError.message));
  }
};

/**
 * Async error wrapper for try/catch
 */
export const tryCatch = async <T>(
  promise: Promise<T>,
  context?: Record<string, any>
): Promise<[T | null, AppError | null]> => {
  try {
    const data = await promise;
    return [data, null];
  } catch (error) {
    const appError = normalizeError(error, context);
    logError(appError, context);
    return [null, appError];
  }
};

/**
 * Retry function with exponential backoff
 */
export const retry = async <T>(
  fn: () => Promise<T>,
  options: {
    maxAttempts?: number;
    baseDelay?: number;
    maxDelay?: number;
    shouldRetry?: (error: AppError) => boolean;
    onRetry?: (error: AppError, attempt: number) => void;
  } = {}
): Promise<T> => {
  const {
    maxAttempts = 3,
    baseDelay = 1000,
    maxDelay = 10000,
    shouldRetry = (error) => error.recoverable,
    onRetry,
  } = options;
  
  let lastError: AppError;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = normalizeError(error);
      
      if (attempt === maxAttempts || !shouldRetry(lastError)) {
        throw lastError;
      }
      
      if (onRetry) {
        onRetry(lastError, attempt);
      }
      
      // Exponential backoff with jitter
      const delay = Math.min(
        baseDelay * Math.pow(2, attempt - 1) + Math.random() * 1000,
        maxDelay
      );
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
};

export default {
  normalizeError,
  getUserMessage,
  isRecoverable,
  isAuthError,
  isNetworkError,
  logError,
  tryCatch,
  retry,
  ErrorCategory,
};