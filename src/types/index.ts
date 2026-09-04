// types/index.ts
export type UserRole = 'customer' | 'cook';

export interface User {
  id: string;
  email: string;
  name: string;
  token: string;
  role: UserRole;
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: string;
  type?: 'text' | 'ingredient-table' | 'order-status' | 'payment' | 'cook-list' | 'order-confirmed';
  data?: any;
}

export interface Ingredient {
  id: string;
  name: string;
  selected: boolean;
  notes: string;
  price: number;
}

export interface Order {
  id: string;
  ingredients: Ingredient[];
  totalPrice: number;
  status: 'pending' | 'searching_cooks' | 'accepted' | 'declined' | 'bargaining' | 'confirmed' | 'completed';
  restaurant?: Restaurant;
  bargainPrice?: number | null;
  notes?: string;
}

export interface Restaurant {
  id: string;
  name: string;
  image: string;
  rating: number;
  acceptanceRate: number;
}

export interface ChatState {
  messages: Message[];
  currentOrder: Order | null;
  isLoading: boolean;
}

// MAA Cook/Home Cook types
export interface Location {
  type: string;
  coordinates: [number, number]; // [longitude, latitude]
  address: string;
}

export interface Cook {
  id: string;
  userId: string;
  displayName: string;
  bio: string;
  profileImage: string;
  location: Location;
  serviceRadiusKm: number;
  isActive: boolean;
  rating: number;
  totalOrders: number;
  mealPrice?: number;
  distanceKm?: number;
  prepTimeMins?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Meal {
  id: string;
  cookId: string;
  name: string;
  description: string;
  category: string;
  cuisine: string;
  price: number;
  originalPrice: number;
  imageUrl: string;
  ingredients: string[];
  allergens: string[];
  prepTimeMins: number;
  serves: number;
  isAvailable: boolean;
  isVegetarian: boolean;
  isVegan: boolean;
  spiceLevel: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Availability {
  id: string;
  cookId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CookOrder {
  id: string;
  cookId: string;
  userId: string;
  mealId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  status: string;
  scheduledFor?: string;
  deliveryType: string;
  deliveryAddress?: Location;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface NearbyCooksRequest {
  latitude: number;
  longitude: number;
  radiusKm?: number;
  category?: string;
  cuisine?: string;
  isVeg?: boolean;
  isVegan?: boolean;
  maxPrice?: number;
  limit?: number;
}

export type RootStackParamList = {
  Auth: undefined;
  Chat: undefined;
  Profile: undefined;
  Payment: { order: Order };
  OrderConfirmation: { order: Order; transactionId: string };
  CookDashboard: undefined;
  CookProfile: undefined;
  CookMeals: undefined;
  CookAvailability: undefined;
  CookOrders: undefined;
  AddMeal: { mealId?: string } | undefined;
  AddAvailability: { availabilityId?: string } | undefined;
  NearbyCooks: { latitude: number; longitude: number };
  MealDetails: { meal?: Meal; cook?: Cook } | undefined;
};
