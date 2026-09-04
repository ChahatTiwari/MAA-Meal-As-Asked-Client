// services/api/payment.ts
// Payment API endpoints

import { apiClient } from './client';
import { 
  PaymentRequest, 
  PaymentResponse,
  PaymentMethod,
  ApiResponse 
} from '../../types';

export const paymentApi = {
  /**
   * Process payment
   */
  async processPayment(request: PaymentRequest): Promise<ApiResponse<PaymentResponse>> {
    return apiClient.post<PaymentResponse>('/api/payment/process', request);
  },

  /**
   * Get payment methods
   */
  async getPaymentMethods(): Promise<ApiResponse<{
    upi: { apps: string[]; upiId?: string };
    cards: Array<{ id: string; last4: string; brand: string; expiry: string }>;
    wallets: string[];
  }>> {
    return apiClient.get('/api/payment/methods');
  },

  /**
   * Save payment method
   */
  async savePaymentMethod(method: PaymentMethod, details: any): Promise<ApiResponse<{ id: string }>> {
    return apiClient.post('/api/payment/methods', { method, details });
  },

  /**
   * Delete payment method
   */
  async deletePaymentMethod(methodId: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`/api/payment/methods/${methodId}`);
  },

  /**
   * Get payment history
   */
  async getPaymentHistory(page = 1, limit = 20): Promise<ApiResponse<PaymentResponse[]>> {
    return apiClient.get<PaymentResponse[]>(`/api/payment/history?page=${page}&limit=${limit}`);
  },

  /**
   * Request refund
   */
  async requestRefund(orderId: string, reason: string): Promise<ApiResponse<{ refundId: string }>> {
    return apiClient.post('/api/payment/refund', { order_id: orderId, reason });
  },

  /**
   * Verify payment (for webhooks/callbacks)
   */
  async verifyPayment(transactionId: string): Promise<ApiResponse<PaymentResponse>> {
    return apiClient.get<PaymentResponse>(`/api/payment/verify/${transactionId}`);
  },
};

export default paymentApi;