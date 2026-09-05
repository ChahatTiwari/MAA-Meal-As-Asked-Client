import axios, { AxiosError } from "axios";
import { API_BASE_URL } from "../utils/constants";
import { storage } from "./storage";
import { DEMO_MODE } from "./mockData";
import { mockAuthApi, mockChatApi, mockOrderApi, mockPaymentApi, mockCookApi } from "./mockApi";
import { CookOrderStatus } from "../types";

/* =========================================================
   MAIN API CLIENT
   ========================================================= */

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

api.interceptors.request.use(async (config) => {
  try {
    const token = await storage.getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.warn("Failed to get auth token:", error);
  }

  return config;
});

/* =========================================================
   AUTH API
   ========================================================= */

export const authApi = {
  login: async (email: string, password: string) => {
    if (DEMO_MODE) return mockAuthApi.login(email, password);
    const response = await api.post("/api/auth/login", { email, password, login_type: "email" });
    return response;
  },

  register: async (email: string, password: string, name: string) => {
    if (DEMO_MODE) return mockAuthApi.signup(email, password, name);
    const response = await api.post("/api/auth/register", { email, password, name, login_type: "email" });
    return response;
  },

  signup: async (email: string, password: string, name: string) => {
    return authApi.register(email, password, name);
  },

  logout: async () => {
    if (DEMO_MODE) return mockAuthApi.logout();
    const response = await api.post("/api/auth/logout");
    return response;
  },

  updateProfile: async (data: Partial<any>) => {
    if (DEMO_MODE) return mockAuthApi.updateProfile(data);
    const response = await api.put("/api/auth/profile", data);
    return response;
  },
};

/* =========================================================
   CHAT API
   ========================================================= */

export const chatApi = {
  sendMessage: async (message: string, orderId?: string) => {
    if (DEMO_MODE) return mockChatApi.sendMessage(message, orderId);
    if (!message || !message.trim()) {
      return {
        data: {
          response: "Please enter a dish name.",
          ingredients: [],
          order_id: orderId || "",
          show_ingredient_table: false,
          total_price: 0,
          error: "EMPTY_MESSAGE",
        },
      };
    }

    try {
      const body: any = { message: message.trim() };
      if (orderId) {
        body.order_id = orderId;
      }

      const response = await api.post("/api/chat/message", body);
      return response;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<any>;
      let errorMessage = "Failed to send message";

      if (axiosError.response?.data?.message) {
        errorMessage = axiosError.response.data.message;
      } else if (axiosError.message) {
        errorMessage = axiosError.message;
      }

      return {
        data: {
          response: errorMessage,
          ingredients: [],
          order_id: orderId || "",
          show_ingredient_table: false,
          total_price: 0,
          error: errorMessage,
        },
      };
    }
  },
};

/* =========================================================
   ORDER API
   ========================================================= */

export const orderApi = {
  confirmOrder: async (orderId: string, selectedIngredients: any[]) => {
    if (DEMO_MODE) return mockOrderApi.confirmOrder(orderId, selectedIngredients);
    const response = await api.post("/api/orders/confirm", {
      order_id: orderId,
      selected_ingredients: selectedIngredients,
    });
    return response;
  },

  bargainOrder: async (orderId: string, offerPrice: number) => {
    if (DEMO_MODE) return mockOrderApi.bargainOrder(orderId, offerPrice);
    const response = await api.post("/api/orders/bargain", {
      order_id: orderId,
      offer_price: offerPrice,
    });
    return response;
  },

  getOrder: async (orderId: string) => {
    if (DEMO_MODE) return mockOrderApi.getOrder(orderId);
    const response = await api.get(`/api/orders/${orderId}`);
    return response;
  },
};

/* =========================================================
   PAYMENT API
   ========================================================= */

export const paymentApi = {
  processPayment: async (orderId: string, paymentMethod: string) => {
    if (DEMO_MODE) return mockPaymentApi.processPayment(orderId, paymentMethod);
    const response = await api.post("/api/payment/process", {
      order_id: orderId,
      payment_method: paymentMethod,
    });
    return response;
  },
};

/* =========================================================
   COOK API
   ========================================================= */

export const cookApi = {
  registerCook: async (data: {
    displayName: string;
    bio: string;
    latitude: number;
    longitude: number;
    address: string;
    serviceRadiusKm: number;
    isActive?: boolean;
  }) => {
    if (DEMO_MODE) return mockCookApi.registerCook(data);
    const response = await api.post("/api/cook/register", data);
    return response;
  },

  getProfile: async () => {
    if (DEMO_MODE) return mockCookApi.getProfile();
    const response = await api.get("/api/cook/profile");
    return response;
  },

  updateProfile: async (data: {
    displayName: string;
    bio: string;
    latitude: number;
    longitude: number;
    address: string;
    serviceRadiusKm: number;
    isActive?: boolean;
  }) => {
    if (DEMO_MODE) return mockCookApi.updateProfile(data);
    const response = await api.put("/api/cook/profile", data);
    return response;
  },

  createMeal: async (data: any) => {
    if (DEMO_MODE) return mockCookApi.createMeal(data);
    const response = await api.post("/api/cook/meals", data);
    return response;
  },

  getMeals: async () => {
    if (DEMO_MODE) return mockCookApi.getMeals();
    const response = await api.get("/api/cook/meals");
    return response;
  },

  getMeal: async (mealId: string) => {
    if (DEMO_MODE) return mockCookApi.getMeal(mealId);
    const response = await api.get(`/api/cook/meals/${mealId}`);
    return response;
  },

  updateMeal: async (mealId: string, data: any) => {
    if (DEMO_MODE) return mockCookApi.updateMeal(mealId, data);
    const response = await api.put(`/api/cook/meals/${mealId}`, data);
    return response;
  },

  deleteMeal: async (mealId: string) => {
    if (DEMO_MODE) return mockCookApi.deleteMeal(mealId);
    const response = await api.delete(`/api/cook/meals/${mealId}`);
    return response;
  },

  createAvailability: async (data: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    isActive: boolean;
  }) => {
    if (DEMO_MODE) return mockCookApi.createAvailability(data);
    const response = await api.post("/api/cook/availability", data);
    return response;
  },

  getAvailabilities: async () => {
    if (DEMO_MODE) return mockCookApi.getAvailabilities();
    const response = await api.get("/api/cook/availability");
    return response;
  },

  updateAvailability: async (availabilityId: string, data: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    isActive: boolean;
  }) => {
    if (DEMO_MODE) return mockCookApi.updateAvailability(availabilityId, data);
    const response = await api.put(`/api/cook/availability/${availabilityId}`, data);
    return response;
  },

  deleteAvailability: async (availabilityId: string) => {
    if (DEMO_MODE) return mockCookApi.deleteAvailability(availabilityId);
    const response = await api.delete(`/api/cook/availability/${availabilityId}`);
    return response;
  },

  getOrders: async (status?: string) => {
    if (DEMO_MODE) return mockCookApi.getOrders(status);
    const params = status ? `?status=${status}` : '';
    const response = await api.get(`/api/cook/orders${params}`);
    return response;
  },

  updateOrderStatus: async (orderId: string, status: CookOrderStatus) => {
    if (DEMO_MODE) return mockCookApi.updateOrderStatus(orderId, status);
    const response = await api.put(`/api/cook/orders/${orderId}/status`, { status });
    return response;
  },

  findNearbyCooks: async (data: {
    latitude: number;
    longitude: number;
    radiusKm?: number;
    category?: string;
    cuisine?: string;
    isVeg?: boolean;
    isVegan?: boolean;
    maxPrice?: number;
    limit?: number;
  }) => {
    if (DEMO_MODE) return mockCookApi.findNearbyCooks(data);
    const response = await api.post("/api/public/nearby-cooks", data);
    return response;
  },
};

/* =========================================================
   DEFAULT EXPORT
   ========================================================= */

export default api;