// navigation/routes.ts
// Centralized navigation routes and types

import { RootStackParamList } from '../types';

// ============================================================
// ROUTE NAMES (Type-safe route constants)
// ============================================================

export const Routes = {
  // Auth
  Auth: 'Auth' as const,
  
  // Customer
  Chat: 'Chat' as const,
  Profile: 'Profile' as const,
  NearbyCooks: 'NearbyCooks' as const,
  MealDetails: 'MealDetails' as const,
  Payment: 'Payment' as const,
  OrderConfirmation: 'OrderConfirmation' as const,
  
  // Cook
  CookDashboard: 'CookDashboard' as const,
  CookProfile: 'CookProfile' as const,
  CookMeals: 'CookMeals' as const,
  CookAvailability: 'CookAvailability' as const,
  CookOrders: 'CookOrders' as const,
  AddMeal: 'AddMeal' as const,
  AddAvailability: 'AddAvailability' as const,
} as const;

export type RouteName = typeof Routes[keyof typeof Routes];

// ============================================================
// ROUTE PARAMS TYPE HELPERS
// ============================================================

export type RouteParams<T extends RouteName> = T extends keyof RootStackParamList 
  ? RootStackParamList[T] 
  : never;

export type ScreenProps<T extends RouteName> = {
  route: { params: RouteParams<T> };
  navigation: any; // NavigationProp<RootStackParamList, T>
};

// ============================================================
// NAVIGATION HELPERS
// ============================================================

/**
 * Type-safe navigation params builder
 */
export const buildParams = {
  auth: () => undefined,
  chat: () => undefined,
  profile: () => undefined,
  nearbyCooks: (latitude: number, longitude: number) => ({ latitude, longitude }),
  mealDetails: (meal?: any, cook?: any) => ({ meal, cook }),
  payment: (order: any) => ({ order }),
  orderConfirmation: (order: any, transactionId: string) => ({ order, transactionId }),
  cookDashboard: () => undefined,
  cookProfile: () => undefined,
  cookMeals: () => undefined,
  cookAvailability: () => undefined,
  cookOrders: () => undefined,
  addMeal: (mealId?: string) => (mealId ? { mealId } : undefined),
  addAvailability: (availabilityId?: string) => (availabilityId ? { availabilityId } : undefined),
} as const;

/**
 * Navigate with type-safe params
 */
export const navigateTo = {
  auth: (navigation: any) => navigation.navigate(Routes.Auth, buildParams.auth()),
  chat: (navigation: any) => navigation.navigate(Routes.Chat, buildParams.chat()),
  profile: (navigation: any) => navigation.navigate(Routes.Profile, buildParams.profile()),
  nearbyCooks: (navigation: any, latitude: number, longitude: number) => 
    navigation.navigate(Routes.NearbyCooks, buildParams.nearbyCooks(latitude, longitude)),
  mealDetails: (navigation: any, meal?: any, cook?: any) => 
    navigation.navigate(Routes.MealDetails, buildParams.mealDetails(meal, cook)),
  payment: (navigation: any, order: any) => 
    navigation.navigate(Routes.Payment, buildParams.payment(order)),
  orderConfirmation: (navigation: any, order: any, transactionId: string) => 
    navigation.navigate(Routes.OrderConfirmation, buildParams.orderConfirmation(order, transactionId)),
  cookDashboard: (navigation: any) => navigation.navigate(Routes.CookDashboard, buildParams.cookDashboard()),
  cookProfile: (navigation: any) => navigation.navigate(Routes.CookProfile, buildParams.cookProfile()),
  cookMeals: (navigation: any) => navigation.navigate(Routes.CookMeals, buildParams.cookMeals()),
  cookAvailability: (navigation: any) => navigation.navigate(Routes.CookAvailability, buildParams.cookAvailability()),
  cookOrders: (navigation: any) => navigation.navigate(Routes.CookOrders, buildParams.cookOrders()),
  addMeal: (navigation: any, mealId?: string) => 
    navigation.navigate(Routes.AddMeal, buildParams.addMeal(mealId)),
  addAvailability: (navigation: any, availabilityId?: string) => 
    navigation.navigate(Routes.AddAvailability, buildParams.addAvailability(availabilityId)),
};

// ============================================================
// DEEP LINKING CONFIG
// ============================================================

export const linkingConfig = {
  prefixes: ['maa://', 'https://maa.app'],
  config: {
    screens: {
      Auth: 'auth',
      Chat: 'chat',
      Profile: 'profile',
      NearbyCooks: 'nearby-cooks',
      MealDetails: 'meal-details',
      Payment: 'payment',
      OrderConfirmation: 'order-confirmation',
      CookDashboard: 'cook/dashboard',
      CookProfile: 'cook/profile',
      CookMeals: 'cook/meals',
      CookAvailability: 'cook/availability',
      CookOrders: 'cook/orders',
      AddMeal: 'cook/meals/add',
      AddAvailability: 'cook/availability/add',
    },
  },
};

// ============================================================
// NAVIGATION OPTIONS
// ============================================================

export const screenOptions = {
  headerShown: false,
  animation: 'slide_from_right',
  cardStyleInterpolator: ({ current: { progress } }: any) => {
    const opacity = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });
    return { cardStyle: { opacity } };
  },
};

export const stackScreenOptions = {
  ...screenOptions,
  headerBackVisible: false,
  gestureEnabled: true,
  cardOverlayEnabled: true,
};

export default {
  Routes,
  buildParams,
  navigateTo,
  linkingConfig,
  screenOptions,
  stackScreenOptions,
};