// services/api/order.ts
// Order API endpoints

import { apiClient } from './client';
import { 
  Order, 
  Ingredient,
  ConfirmOrderRequest, 
  ConfirmOrderResponse,
  BargainOrderRequest,
  BargainOrderResponse,
  ApiResponse 
} from '../../types';

export const orderApi = {
  /**
   * Confirm order with selected ingredients
   */
  async confirmOrder(request: ConfirmOrderRequest): Promise<ApiResponse<ConfirmOrderResponse>> {
    return apiClient.post<ConfirmOrderResponse>('/api/orders/confirm', request);
  },

  /**
   * Bargain on order price
   */
  async bargainOrder(request: BargainOrderRequest): Promise<ApiResponse<BargainOrderResponse>> {
    return apiClient.post<BargainOrderResponse>('/api/orders/bargain', request);
  },

  /**
   * Get order details
   */
  async getOrder(orderId: string): Promise<ApiResponse<Order>> {
    return apiClient.get<Order>(`/api/orders/${orderId}`);
  },

  /**
   * Get user's order history
   */
  async getOrderHistory(page = 1, limit = 20): Promise<ApiResponse<Order[]>> {
    return apiClient.get<Order[]>(`/api/orders?page=${page}&limit=${limit}`);
  },

  /**
   * Cancel order
   */
  async cancelOrder(orderId: string, reason?: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>(`/api/orders/${orderId}/cancel`, { reason });
  },

  /**
   * Reorder previous order
   */
  async reorder(orderId: string): Promise<ApiResponse<Order>> {
    return apiClient.post<Order>(`/api/orders/${orderId}/reorder`);
  },

  /**
   * Rate order
   */
  async rateOrder(orderId: string, rating: number, review?: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>(`/api/orders/${orderId}/rate`, { rating, review });
  },

  /**
   * Track order status
   */
  async trackOrder(orderId: string): Promise<ApiResponse<{
    status: string;
    estimatedTime: number;
    location?: { latitude: number; longitude: number };
    updates: Array<{ status: string; timestamp: string; message: string }>;
  }>> {
    return apiClient.get(`/api/orders/${orderId}/track`);
  },
};

export default orderApi;