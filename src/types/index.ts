// types/index.ts
// Shared TypeScript types for the MAA app

// ============================================================
// AUTH & USER TYPES
// ============================================================

export type UserRole = 'customer' | 'cook';

export interface User {
  id: string;
  email: string;
  name: string;
  token: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
  tokenType?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  loginType?: 'email' | 'phone' | 'google' | 'apple';
}

export interface RegisterData extends LoginCredentials {
  name: string;
  phone?: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  role: UserRole | null;
  isAuthenticated: boolean;
}

// ============================================================
// CHAT & MESSAGING TYPES
// ============================================================

export type MessageType = 
  | 'text' 
  | 'ingredient-table' 
  | 'order-status' 
  | 'payment' 
  | 'cook-list' 
  | 'order-confirmed'
  | 'error';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: string;
  type?: MessageType;
  data?: any;
}

export interface ChatState {
  messages: Message[];
  currentOrder: Order | null;
  isLoading: boolean;
  error: string | null;
  demoFlowStep: DemoFlowStep;
  nearbyCooks: Cook[];
  selectedCook: Cook | null;
}

export type DemoFlowStep = 
  | 'idle' 
  | 'ingredients' 
  | 'searching_cooks' 
  | 'cooks_found' 
  | 'payment' 
  | 'confirmed';

export interface SendMessageRequest {
  message: string;
  orderId?: string;
}

export interface SendMessageResponse {
  response: string;
  ingredients?: BackendIngredient[];
  order_id?: string;
  show_ingredient_table?: boolean;
  total_price?: number;
  error?: string;
}

export interface BackendIngredient {
  id: string;
  name: string;
  selected: boolean;
  note?: string;
  notes?: string;
  price?: number;
}

// ============================================================
// INGREDIENT & ORDER TYPES
// ============================================================

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
  status: OrderStatus;
  restaurant?: Restaurant;
  bargainPrice?: number | null;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type OrderStatus = 
  | 'pending' 
  | 'searching_cooks' 
  | 'accepted' 
  | 'declined' 
  | 'bargaining' 
  | 'confirmed' 
  | 'completed' 
  | 'cancelled';

export interface Restaurant {
  id: string;
  name: string;
  image: string;
  rating: number;
  acceptanceRate: number;
}

export interface ConfirmOrderRequest {
  order_id: string;
  selected_ingredients: Ingredient[];
}

export interface ConfirmOrderResponse {
  order_id: string;
  status: OrderStatus;
  final_price: number;
  total_price: number;
  message?: string;
}

export interface BargainOrderRequest {
  order_id: string;
  offer_price: number;
}

export interface BargainOrderResponse {
  order_id: string;
  accepted: boolean;
  final_price: number;
  message?: string;
}

// ============================================================
// PAYMENT TYPES
// ============================================================

export type PaymentMethod = 'upi' | 'card' | 'wallet' | 'cod';
export type UpiApp = 'gpay' | 'phonepe' | 'paytm' | 'bhim' | 'other';

export interface PaymentRequest {
  order_id: string;
  payment_method: PaymentMethod;
  upi_app?: UpiApp;
  upi_id?: string;
  card_details?: CardDetails;
}

export interface CardDetails {
  number: string;
  expiry: string;
  cvv: string;
  holder_name: string;
}

export interface PaymentResponse {
  order_id: string;
  payment_method: PaymentMethod;
  status: PaymentStatus;
  transaction_id: string;
  message?: string;
}

export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';

// ============================================================
// COOK / HOME COOK TYPES
// ============================================================

export interface Location {
  type: 'Point';
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

export interface CookProfile extends Cook {
  meals?: Meal[];
  availabilities?: Availability[];
}

export interface CookRegistrationData {
  displayName: string;
  bio: string;
  latitude: number;
  longitude: number;
  address: string;
  serviceRadiusKm: number;
  isActive?: boolean;
}

export interface Meal {
  id: string;
  cookId: string;
  name: string;
  description: string;
  category: MealCategory;
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
  spiceLevel: SpiceLevel;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export type MealCategory = 
  | 'veg' 
  | 'non-veg' 
  | 'vegan' 
  | 'dessert' 
  | 'beverage' 
  | 'snack' 
  | 'breakfast' 
  | 'lunch' 
  | 'dinner';

export type SpiceLevel = 'mild' | 'medium' | 'hot' | 'extra-hot';

export interface Availability {
  id: string;
  cookId: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAvailabilityRequest {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

export interface CookOrder {
  id: string;
  cookId: string;
  userId: string;
  mealId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  status: CookOrderStatus;
  scheduledFor?: string;
  deliveryType: 'delivery' | 'pickup';
  deliveryAddress?: Location;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export type CookOrderStatus = 
  | 'pending' 
  | 'accepted' 
  | 'preparing' 
  | 'ready' 
  | 'delivered' 
  | 'cancelled';

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

export interface NearbyCooksResponse {
  cooks: Cook[];
  total: number;
}

// ============================================================
// NAVIGATION TYPES
// ============================================================

export type RootStackParamList = {
  // Auth (unauthenticated)
  Auth: undefined;
  
  // Customer flow
  Chat: undefined;
  Profile: undefined;
  NearbyCooks: { latitude: number; longitude: number };
  MealDetails: { meal?: Meal; cook?: Cook } | undefined;
  Payment: { order: Order };
  OrderConfirmation: { order: Order; transactionId: string };
  
  // Cook flow
  CookDashboard: undefined;
  CookProfile: undefined;
  CookMeals: undefined;
  CookAvailability: undefined;
  CookOrders: undefined;
  AddMeal: { mealId?: string } | undefined;
  AddAvailability: { availabilityId?: string } | undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
};

export type CustomerTabParamList = {
  Chat: undefined;
  Explore: undefined;
  Orders: undefined;
  Profile: undefined;
};

export type CookTabParamList = {
  Dashboard: undefined;
  Meals: undefined;
  Orders: undefined;
  Profile: undefined;
};

// ============================================================
// UI STATE TYPES
// ============================================================

export interface LoadingState {
  isLoading: boolean;
  message?: string;
}

export interface ErrorState {
  hasError: boolean;
  message: string | null;
  code?: string;
  recoverable?: boolean;
}

export interface EmptyState {
  isEmpty: boolean;
  message: string;
  actionLabel?: string;
  action?: () => void;
}

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

export interface FilterState<T = Record<string, any>> {
  filters: T;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// ============================================================
// API RESPONSE TYPES
// ============================================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: any;
}

// ============================================================
// WEBSOCKET TYPES
// ============================================================

export interface WebSocketMessage {
  type: string;
  data: any;
}

export interface WebSocketEvents {
  connect: () => void;
  disconnect: (reason: string) => void;
  error: (error: Error) => void;
  message: (message: WebSocketMessage) => void;
  orderUpdate: (data: OrderUpdateData) => void;
  restaurantResponse: (data: RestaurantResponseData) => void;
  paymentSuccess: (data: PaymentSuccessData) => void;
}

export interface OrderUpdateData {
  orderId: string;
  status: OrderStatus;
  message: string;
  order?: Order;
}

export interface RestaurantResponseData {
  orderId: string;
  accepted: boolean;
  restaurant: Restaurant;
  message: string;
}

export interface PaymentSuccessData {
  orderId: string;
  transactionId: string;
  amount: number;
  message: string;
}

// ============================================================
// THEME TYPES
// ============================================================

import { ThemeColors } from '../theme';

export interface ThemeState {
  isDark: boolean;
  colors: ThemeColors;
}

// ============================================================
// FORM VALIDATION TYPES
// ============================================================

export interface ValidationRule<T = any> {
  validate: (value: T) => boolean;
  message: string;
}

export interface FieldValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: ValidationRule;
  message?: string;
}

export type FormValidation<T extends Record<string, any>> = {
  [K in keyof T]?: FieldValidation;
};

// ============================================================
// DEVICE & PLATFORM TYPES
// ============================================================

export interface DeviceInfo {
  platform: 'ios' | 'android' | 'web';
  version: string;
  deviceId?: string;
  pushToken?: string;
  appVersion: string;
  buildNumber: string;
}

export interface NetworkState {
  isConnected: boolean;
  isInternetReachable: boolean | null;
  type: string | null;
}

// ============================================================
// UTILITY TYPES
// ============================================================

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
export type NonEmptyArray<T> = [T, ...T[]];

// Type guards
export const isUser = (obj: any): obj is User => {
  return obj && typeof obj.id === 'string' && typeof obj.email === 'string';
};

export const isOrder = (obj: any): obj is Order => {
  return obj && typeof obj.id === 'string' && Array.isArray(obj.ingredients);
};

export const isCook = (obj: any): obj is Cook => {
  return obj && typeof obj.id === 'string' && typeof obj.displayName === 'string';
};

export const isMeal = (obj: any): obj is Meal => {
  return obj && typeof obj.id === 'string' && typeof obj.name === 'string';
};