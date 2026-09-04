// services/mockApi.ts
// Mock API implementations — simulates backend responses with in-memory state
import {
  DEMO_MODE,
  demoCustomer,
  demoCookUser,
  demoCookProfile,
  demoMeals,
  demoAvailabilities,
  demoOrders,
  demoNearbyCooks,
  getDemoChatResponse,
} from './mockData';
import { Meal, Cook, Availability, CookOrder } from '../types';

// In-memory mutable state so demo CRUD operations persist during the session
let mealsState: Meal[] = [...demoMeals];
let availabilitiesState: Availability[] = [...demoAvailabilities];
let ordersState: CookOrder[] = [...demoOrders];
let cookProfileState: any = { ...demoCookProfile };
let nearbyCooksState: Cook[] = [...demoNearbyCooks];

const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

const success = (data: any) => ({ data: { success: true, ...data } });

/* =========================================================
   AUTH MOCK
   ========================================================= */

export const mockAuthApi = {
  login: async (email: string, password: string) => {
    await delay();
    const lowerEmail = email.toLowerCase().trim();

    if (lowerEmail === demoCustomer.email) {
      return success({ user: demoCustomer, token: demoCustomer.token });
    }
    if (lowerEmail === demoCookUser.email) {
      return success({ user: demoCookUser, token: demoCookUser.token });
    }

    // Fallback: accept any valid-looking credentials for demo
    if (email && password && password.length >= 6) {
      return success({
        user: { id: 'demo-user-' + Date.now(), name: email.split('@')[0], email, role: 'customer' as const },
        token: 'demo-token-' + Date.now(),
      });
    }

    throw { response: { data: { message: 'Invalid email or password' } } };
  },

  signup: async (email: string, password: string, name: string) => {
    await delay();
    return success({
      user: { id: 'demo-user-' + Date.now(), name, email, role: 'customer' as const },
      token: 'demo-token-' + Date.now(),
    });
  },
};

/* =========================================================
   CHAT MOCK
   ========================================================= */

export const mockChatApi = {
  sendMessage: async (message: string, orderId?: string) => {
    await delay(600);
    const demoResponse = getDemoChatResponse(message);
    return {
      data: {
        response: demoResponse.response,
        ingredients: demoResponse.ingredients,
        order_id: orderId || 'ORD' + Date.now().toString().slice(-6),
        show_ingredient_table: true,
        total_price: demoResponse.ingredients.reduce((sum: number, ing: any) => sum + (ing.price || 0), 0),
        error: null,
      },
    };
  },
};

/* =========================================================
   ORDER MOCK
   ========================================================= */

export const mockOrderApi = {
  confirmOrder: async (orderId: string, selectedIngredients: any[]) => {
    await delay();
    const total = selectedIngredients.reduce((sum, ing) => sum + (ing.price || 0), 0);
    return success({
      order_id: orderId,
      status: 'pending',
      final_price: total,
      total_price: total,
      message: 'Order placed successfully!',
    });
  },

  bargainOrder: async (orderId: string, offerPrice: number) => {
    await delay();
    return success({
      order_id: orderId,
      accepted: true,
      final_price: offerPrice,
      message: 'Cook accepted your offer! 🎉',
    });
  },

  getOrder: async (orderId: string) => {
    await delay();
    return success({ order: ordersState.find(o => o.id === orderId) || null });
  },
};

/* =========================================================
   PAYMENT MOCK
   ========================================================= */

export const mockPaymentApi = {
  processPayment: async (orderId: string, paymentMethod: string) => {
    await delay();
    return success({
      order_id: orderId,
      payment_method: paymentMethod,
      status: 'completed',
      transaction_id: 'TXN' + Date.now().toString().slice(-8),
      message: 'Payment successful!',
    });
  },
};

/* =========================================================
   COOK MOCK
   ========================================================= */

export const mockCookApi = {
  registerCook: async (data: any) => {
    await delay();
    cookProfileState = {
      ...cookProfileState,
      ...data,
      id: 'cook-1',
      userId: 'demo-cook-user-1',
      rating: 4.8,
      totalOrders: 156,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return success({ cook: cookProfileState });
  },

  getProfile: async () => {
    await delay();
    return success({ cook: cookProfileState });
  },

  updateProfile: async (data: any) => {
    await delay();
    cookProfileState = { ...cookProfileState, ...data, updatedAt: new Date().toISOString() };
    return success({ cook: cookProfileState });
  },

  createMeal: async (data: any) => {
    await delay();
    const newMeal: Meal = {
      id: 'meal-' + Date.now(),
      cookId: 'cook-1',
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mealsState = [newMeal, ...mealsState];
    return success({ meal: newMeal });
  },

  getMeals: async () => {
    await delay();
    return success({ meals: mealsState });
  },

  getMeal: async (mealId: string) => {
    await delay();
    return success({ meal: mealsState.find(m => m.id === mealId) || null });
  },

  updateMeal: async (mealId: string, data: any) => {
    await delay();
    mealsState = mealsState.map(m => m.id === mealId ? { ...m, ...data, updatedAt: new Date().toISOString() } : m);
    return success({ meal: mealsState.find(m => m.id === mealId) });
  },

  deleteMeal: async (mealId: string) => {
    await delay();
    mealsState = mealsState.filter(m => m.id !== mealId);
    return success({ message: 'Meal deleted' });
  },

  createAvailability: async (data: any) => {
    await delay();
    const newAvailability: Availability = {
      id: 'avail-' + Date.now(),
      cookId: 'cook-1',
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    availabilitiesState = [...availabilitiesState, newAvailability];
    return success({ availability: newAvailability });
  },

  getAvailabilities: async () => {
    await delay();
    return success({ availabilities: availabilitiesState });
  },

  updateAvailability: async (availabilityId: string, data: any) => {
    await delay();
    availabilitiesState = availabilitiesState.map(a =>
      a.id === availabilityId ? { ...a, ...data, updatedAt: new Date().toISOString() } : a
    );
    return success({ availability: availabilitiesState.find(a => a.id === availabilityId) });
  },

  deleteAvailability: async (availabilityId: string) => {
    await delay();
    availabilitiesState = availabilitiesState.filter(a => a.id !== availabilityId);
    return success({ message: 'Availability deleted' });
  },

  getOrders: async (status?: string) => {
    await delay();
    const filtered = status ? ordersState.filter(o => o.status === status) : ordersState;
    return success({ orders: filtered });
  },

  updateOrderStatus: async (orderId: string, status: string) => {
    await delay();
    ordersState = ordersState.map(o => o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o);
    return success({ order: ordersState.find(o => o.id === orderId) });
  },

  findNearbyCooks: async (data: any) => {
    await delay();
    let result = [...nearbyCooksState];

    if (data.category && data.category !== 'All') {
      result = result.filter(c => c.isActive);
    }
    if (data.isVeg) {
      result = result.filter(c => c.isActive);
    }
    if (data.isVegan) {
      result = result.filter(c => c.isActive);
    }
    if (data.maxPrice) {
      result = result.filter(c => c.isActive);
    }

    return success({ cooks: result });
  },
};

/* =========================================================
   DEMO MODE FLAG
   ========================================================= */

export const isDemoMode = () => DEMO_MODE;