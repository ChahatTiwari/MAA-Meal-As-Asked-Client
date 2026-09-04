// services/api/index.ts
// API module exports

export { apiClient, ApiClientError } from './client';
export { authApi } from './auth';
export { chatApi } from './chat';
export { orderApi } from './order';
export { paymentApi } from './payment';
export { cookApi } from './cook';

// Re-export types
export type { 
  AxiosRequestConfig, 
  AxiosResponse, 
  AxiosError 
} from './client';