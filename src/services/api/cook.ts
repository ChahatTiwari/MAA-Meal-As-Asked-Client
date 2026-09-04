// services/api/cook.ts
// Cook/Home Cook API endpoints

import { apiClient } from './client';
import { 
  Cook, 
  Meal, 
  Availability, 
  CookOrder,
  CookRegistrationData,
  CreateAvailabilityRequest,
  NearbyCooksRequest,
  NearbyCooksResponse,
  MealCategory,
  SpiceLevel,
  ApiResponse 
} from '../../types';

export const cookApi = {
  // ============================================================
  // COOK PROFILE
  // ============================================================

  /**
   * Register as a cook
   */
  async registerCook(data: CookRegistrationData): Promise<ApiResponse<Cook>> {
    return apiClient.post<Cook>('/api/cook/register', data);
  },

  /**
   * Get current cook's profile
   */
  async getProfile(): Promise<ApiResponse<Cook>> {
    return apiClient.get<Cook>('/api/cook/profile');
  },

  /**
   * Update cook profile
   */
  async updateProfile(data: Partial<CookRegistrationData>): Promise<ApiResponse<Cook>> {
    return apiClient.put<Cook>('/api/cook/profile', data);
  },

  /**
   * Delete cook profile
   */
  async deleteProfile(): Promise<ApiResponse<void>> {
    return apiClient.delete<void>('/api/cook/profile');
  },

  /**
   * Toggle cook active status
   */
  async toggleActive(isActive: boolean): Promise<ApiResponse<Cook>> {
    return apiClient.put<Cook>('/api/cook/profile', { isActive });
  },

  // ============================================================
  // MEALS
  // ============================================================

  /**
   * Create new meal
   */
  async createMeal(data: {
    name: string;
    description: string;
    category: MealCategory;
    cuisine: string;
    price: number;
    originalPrice?: number;
    imageUrl?: string;
    ingredients: string[];
    allergens: string[];
    prepTimeMins: number;
    serves: number;
    isVegetarian: boolean;
    isVegan: boolean;
    spiceLevel: SpiceLevel;
    tags: string[];
  }): Promise<ApiResponse<Meal>> {
    return apiClient.post<Meal>('/api/cook/meals', data);
  },

  /**
   * Get cook's meals
   */
  async getMeals(page = 1, limit = 20, category?: string): Promise<ApiResponse<Meal[]>> {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (category) params.append('category', category);
    return apiClient.get<Meal[]>(`/api/cook/meals?${params.toString()}`);
  },

  /**
   * Get single meal
   */
  async getMeal(mealId: string): Promise<ApiResponse<Meal>> {
    return apiClient.get<Meal>(`/api/cook/meals/${mealId}`);
  },

  /**
   * Update meal
   */
  async updateMeal(mealId: string, data: Partial<Meal>): Promise<ApiResponse<Meal>> {
    return apiClient.put<Meal>(`/api/cook/meals/${mealId}`, data);
  },

  /**
   * Delete meal
   */
  async deleteMeal(mealId: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/api/cook/meals/${mealId}`);
  },

  /**
   * Toggle meal availability
   */
  async toggleMealAvailability(mealId: string, isAvailable: boolean): Promise<ApiResponse<Meal>> {
    return apiClient.put<Meal>(`/api/cook/meals/${mealId}`, { isAvailable });
  },

  /**
   * Upload meal image
   */
  async uploadMealImage(mealId: string, file: { uri: string; name: string; type: string }): Promise<ApiResponse<{ imageUrl: string }>> {
    return apiClient.upload<{ imageUrl: string }>(`/api/cook/meals/${mealId}/image`, file);
  },

  // ============================================================
  // AVAILABILITY
  // ============================================================

  /**
   * Create availability slot
   */
  async createAvailability(data: CreateAvailabilityRequest): Promise<ApiResponse<Availability>> {
    return apiClient.post<Availability>('/api/cook/availability', data);
  },

  /**
   * Get cook's availabilities
   */
  async getAvailabilities(): Promise<ApiResponse<Availability[]>> {
    return apiClient.get<Availability[]>('/api/cook/availability');
  },

  /**
   * Update availability
   */
  async updateAvailability(availabilityId: string, data: CreateAvailabilityRequest): Promise<ApiResponse<Availability>> {
    return apiClient.put<Availability>(`/api/cook/availability/${availabilityId}`, data);
  },

  /**
   * Delete availability
   */
  async deleteAvailability(availabilityId: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/api/cook/availability/${availabilityId}`);
  },

  // ============================================================
  // ORDERS
  // ============================================================

  /**
   * Get cook's orders
   */
  async getOrders(status?: string, page = 1, limit = 20): Promise<ApiResponse<CookOrder[]>> {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (status) params.append('status', status);
    return apiClient.get<CookOrder[]>(`/api/cook/orders?${params.toString()}`);
  },

  /**
   * Update order status
   */
  async updateOrderStatus(orderId: string, status: CookOrder['status']): Promise<ApiResponse<CookOrder>> {
    return apiClient.put<CookOrder>(`/api/cook/orders/${orderId}/status`, { status });
  },

  /**
   * Get order details for cook
   */
  async getOrderDetails(orderId: string): Promise<ApiResponse<CookOrder>> {
    return apiClient.get<CookOrder>(`/api/cook/orders/${orderId}`);
  },

  // ============================================================
  // PUBLIC / CUSTOMER ENDPOINTS
  // ============================================================

  /**
   * Find nearby cooks
   */
  async findNearbyCooks(request: NearbyCooksRequest): Promise<ApiResponse<NearbyCooksResponse>> {
    return apiClient.post<NearbyCooksResponse>('/api/public/nearby-cooks', request);
  },

  /**
   * Get cook's public profile (for customers)
   */
  async getPublicProfile(cookId: string): Promise<ApiResponse<Cook>> {
    return apiClient.get<Cook>(`/api/public/cooks/${cookId}`);
  },

  /**
   * Get cook's public meals (for customers)
   */
  async getPublicMeals(cookId: string): Promise<ApiResponse<Meal[]>> {
    return apiClient.get<Meal[]>(`/api/public/cooks/${cookId}/meals`);
  },

  // ============================================================
  // EARNINGS & ANALYTICS
  // ============================================================

  /**
   * Get earnings summary
   */
  async getEarnings(period: 'daily' | 'weekly' | 'monthly'): Promise<ApiResponse<{
    total: number;
    orders: number;
    averageOrderValue: number;
    commission: number;
    netEarnings: number;
    breakdown: Array<{ date: string; earnings: number; orders: number }>;
  }>> {
    return apiClient.get(`/api/cook/earnings?period=${period}`);
  },

  /**
   * Get analytics
   */
  async getAnalytics(): Promise<ApiResponse<{
    totalOrders: number;
    completedOrders: number;
    cancelledOrders: number;
    averageRating: number;
    totalCustomers: number;
    topMeals: Array<{ mealId: string; name: string; orders: number; revenue: number }>;
    peakHours: Array<{ hour: number; orders: number }>;
  }>> {
    return apiClient.get('/api/cook/analytics');
  },
};

export default cookApi;