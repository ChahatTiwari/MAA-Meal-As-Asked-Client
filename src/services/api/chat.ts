// services/api/chat.ts
// Chat API endpoints

import { apiClient } from './client';
import { 
  SendMessageRequest, 
  SendMessageResponse, 
  Message,
  ApiResponse 
} from '../../types';

export const chatApi = {
  /**
   * Send message to AI chat
   */
  async sendMessage(request: SendMessageRequest): Promise<ApiResponse<SendMessageResponse>> {
    return apiClient.post<SendMessageResponse>('/api/chat/message', request);
  },

  /**
   * Get chat history
   */
  async getHistory(orderId?: string, limit = 50, offset = 0): Promise<ApiResponse<Message[]>> {
    const params = new URLSearchParams();
    if (orderId) params.append('order_id', orderId);
    params.append('limit', limit.toString());
    params.append('offset', offset.toString());
    
    return apiClient.get<Message[]>(`/api/chat/history?${params.toString()}`);
  },

  /**
   * Clear chat history
   */
  async clearHistory(orderId?: string): Promise<ApiResponse<void>> {
    const params = orderId ? `?order_id=${orderId}` : '';
    return apiClient.delete<void>(`/api/chat/history${params}`);
  },

  /**
   * Get AI suggestions for dish
   */
  async getSuggestions(query: string): Promise<ApiResponse<string[]>> {
    return apiClient.post<string[]>('/api/chat/suggestions', { query });
  },

  /**
   * Report message (for inappropriate content)
   */
  async reportMessage(messageId: string, reason: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>('/api/chat/report', { message_id: messageId, reason });
  },
};

export default chatApi;