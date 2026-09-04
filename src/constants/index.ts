// constants/index.ts
// App constants and enums

// API Configuration
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080';
export const WEBSOCKET_URL = process.env.EXPO_PUBLIC_WEBSOCKET_URL || 'ws://localhost:8080';

// App Configuration
export const APP_NAME = 'MAA';
export const APP_VERSION = '1.0.0';
export const APP_BUILD_NUMBER = '1';

// Demo Mode
export const DEMO_MODE = process.env.EXPO_PUBLIC_DEMO_MODE === 'true' || true;

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  APP_SETTINGS: 'app_settings',
  ONBOARDING_COMPLETE: 'onboarding_complete',
  DEVICE_TOKEN: 'device_token',
  LAST_SYNC: 'last_sync',
} as const;

// Demo Accounts
export const DEMO_ACCOUNTS = [
  {
    label: '👤 Customer',
    email: 'demo@maa.com',
    password: 'demo123',
    name: 'Demo Customer',
  },
  {
    label: '👨‍🍳 Cook',
    email: 'cook@maa.com',
    password: 'cook123',
    name: 'Demo Cook',
  },
] as const;

// Days of week
export const DAYS_OF_WEEK = [
  { value: 0, name: 'Sunday', short: 'Sun' },
  { value: 1, name: 'Monday', short: 'Mon' },
  { value: 2, name: 'Tuesday', short: 'Tue' },
  { value: 3, name: 'Wednesday', short: 'Wed' },
  { value: 4, name: 'Thursday', short: 'Thu' },
  { value: 5, name: 'Friday', short: 'Fri' },
  { value: 6, name: 'Saturday', short: 'Sat' },
] as const;

// Meal Categories
export const MEAL_CATEGORIES = [
  'veg',
  'non-veg',
  'vegan',
  'dessert',
  'beverage',
  'snack',
  'breakfast',
  'lunch',
  'dinner',
] as const;

// Cuisines
export const CUISINES = [
  'indian',
  'chinese',
  'italian',
  'mexican',
  'thai',
  'japanese',
  'american',
  'continental',
] as const;

// Spice Levels
export const SPICE_LEVELS = [
  'mild',
  'medium',
  'hot',
  'extra-hot',
] as const;

// Order Statuses
export const ORDER_STATUSES = [
  'pending',
  'searching_cooks',
  'accepted',
  'declined',
  'bargaining',
  'confirmed',
  'completed',
  'cancelled',
] as const;

export const COOK_ORDER_STATUSES = [
  'pending',
  'accepted',
  'preparing',
  'ready',
  'delivered',
  'cancelled',
] as const;

// Payment Methods
export const PAYMENT_METHODS = [
  'upi',
  'card',
  'wallet',
  'cod',
] as const;

export const UPI_APPS = [
  { id: 'gpay', name: 'Google Pay', icon: 'G', color: '#4285F4' },
  { id: 'phonepe', name: 'PhonePe', icon: 'P', color: '#5F259F' },
  { id: 'paytm', name: 'Paytm', icon: '₮', color: '#00BAF2' },
  { id: 'bhim', name: 'BHIM UPI', icon: 'B', color: '#007BFF' },
] as const;

// Validation Constants
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[\+]?[0-9]{10,15}$/,
  MIN_PASSWORD_LENGTH: 8,
  MAX_NAME_LENGTH: 50,
  MIN_NAME_LENGTH: 2,
  MAX_BIO_LENGTH: 500,
  MAX_MESSAGE_LENGTH: 500,
  MAX_DESCRIPTION_LENGTH: 1000,
  MAX_ADDRESS_LENGTH: 200,
  MIN_PRICE: 1,
  MAX_PRICE: 10000,
  MIN_PREP_TIME: 1,
  MAX_PREP_TIME: 480,
  MIN_SERVES: 1,
  MAX_SERVES: 50,
  MIN_SERVICE_RADIUS: 1,
  MAX_SERVICE_RADIUS: 50,
} as const;

// Animation Durations
export const ANIMATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 800,
} as const;

// Z-Index Layers
export const Z_INDEX = {
  BASE: 0,
  DROPDOWN: 100,
  STICKY: 200,
  FIXED: 300,
  MODAL_BACKDROP: 400,
  MODAL: 500,
  POPOVER: 600,
  TOOLTIP: 700,
  TOAST: 800,
} as const;

// Breakpoints
export const BREAKPOINTS = {
  SMALL_MOBILE: 360,
  MOBILE: 600,
  TABLET: 1024,
  DESKTOP: 1280,
} as const;

// Default Values
export const DEFAULTS = {
  SERVICE_RADIUS_KM: 5,
  PREP_TIME_MINS: 30,
  SERVES: 1,
  MEAL_PRICE: 150,
  ORDER_LIMIT: 20,
  PAGE_LIMIT: 20,
  SEARCH_RADIUS_KM: 10,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK: 'Network error. Please check your connection and try again.',
  TIMEOUT: 'Request timed out. Please try again.',
  UNAUTHORIZED: 'Your session has expired. Please log in again.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER: 'Server error. Please try again later.',
  VALIDATION: 'Please check your input and try again.',
  UNKNOWN: 'An unexpected error occurred. Please try again.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN: 'Welcome back!',
  SIGNUP: 'Account created successfully!',
  LOGOUT: 'You have been logged out.',
  PROFILE_UPDATED: 'Profile updated successfully!',
  MEAL_CREATED: 'Meal created successfully!',
  MEAL_UPDATED: 'Meal updated successfully!',
  MEAL_DELETED: 'Meal deleted successfully!',
  AVAILABILITY_CREATED: 'Availability added successfully!',
  AVAILABILITY_UPDATED: 'Availability updated successfully!',
  AVAILABILITY_DELETED: 'Availability deleted successfully!',
  ORDER_PLACED: 'Order placed successfully!',
  PAYMENT_SUCCESS: 'Payment successful!',
  COOK_REGISTERED: 'Cook profile created successfully!',
} as const;