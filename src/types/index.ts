// types/index.ts
export interface User {
  id: string;
  email: string;
  name: string;
  token: string;
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: string;
  type?: 'text' | 'ingredient-table' | 'order-status' | 'payment';
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
  status: 'pending' | 'accepted' | 'declined' | 'bargaining' | 'confirmed' | 'completed';
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

export type RootStackParamList = {
  Auth: undefined;
  Chat: undefined;
  Profile: undefined;
  Payment: { order: Order };
};