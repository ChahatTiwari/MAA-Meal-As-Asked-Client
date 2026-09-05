// store/slices/chatSlice.ts
// Chat Redux slice with TypeScript types

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  Message, 
  Order, 
  Ingredient, 
  Cook,
  ChatState,
  DemoFlowStep,
  SendMessageRequest,
  SendMessageResponse,
  ConfirmOrderRequest,
  BargainOrderRequest,
} from '../../types';
import { chatApi, orderApi } from '../../services/api';

// Re-export ChatState for store configuration
export type { ChatState };

// Demo data
const DAL_CHAWAL_INGREDIENTS: Ingredient[] = [
  { id: '1', name: 'Rice', selected: true, notes: '', price: 30 },
  { id: '2', name: 'Pulses (Dal)', selected: true, notes: '', price: 40 },
  { id: '3', name: 'Salt', selected: true, notes: '', price: 5 },
  { id: '4', name: 'Red Chilli Powder', selected: true, notes: '', price: 10 },
  { id: '5', name: 'Oil', selected: true, notes: '', price: 15 },
  { id: '6', name: 'Onion', selected: true, notes: '', price: 10 },
  { id: '7', name: 'Tomato', selected: true, notes: '', price: 10 },
  { id: '8', name: 'Spices (Turmeric, Cumin, Coriander)', selected: true, notes: '', price: 20 },
];

const MOCK_NEARBY_COOKS: Cook[] = [
  {
    id: 'cook1',
    userId: 'user1',
    displayName: 'Priya Sharma',
    bio: 'Home cook with 10+ years experience. Specializes in North Indian comfort food.',
    profileImage: '',
    location: { type: 'Point', coordinates: [77.2090, 28.6139], address: 'Sector 15, Noida' },
    serviceRadiusKm: 5,
    isActive: true,
    rating: 4.8,
    totalOrders: 156,
    mealPrice: 140,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: 'cook2',
    userId: 'user2',
    displayName: 'Meera Patel',
    bio: 'Traditional Gujarati and North Indian meals made with love. Fresh ingredients daily.',
    profileImage: '',
    location: { type: 'Point', coordinates: [77.2200, 28.6200], address: 'Sector 18, Noida' },
    serviceRadiusKm: 3,
    isActive: true,
    rating: 4.9,
    totalOrders: 203,
    mealPrice: 150,
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z',
  },
  {
    id: 'cook3',
    userId: 'user3',
    displayName: 'Sunita Devi',
    bio: 'Authentic home-style Dal Chawal and more. Pure vegetarian kitchen.',
    profileImage: '',
    location: { type: 'Point', coordinates: [77.1900, 28.6000], address: 'Sector 12, Noida' },
    serviceRadiusKm: 4,
    isActive: true,
    rating: 4.7,
    totalOrders: 89,
    mealPrice: 130,
    createdAt: '2024-03-10T00:00:00Z',
    updatedAt: '2024-03-10T00:00:00Z',
  },
];

const createOrderFromIngredients = (ingredients: Ingredient[]): Order => {
  const selectedIngredients = ingredients.filter(ing => ing.selected);
  const totalPrice = selectedIngredients.reduce((sum, ing) => sum + ing.price, 0);
  
  const restaurants = [
    { id: 'rest001', name: 'Pizza Palace', image: '🍕', rating: 4.5, acceptanceRate: 90 },
    { id: 'rest002', name: 'Burger King', image: '🍔', rating: 4.2, acceptanceRate: 85 },
    { id: 'rest003', name: 'Spice Garden', image: '🌶️', rating: 4.7, acceptanceRate: 88 },
    { id: 'rest004', name: 'Fresh Greens', image: '🥗', rating: 4.4, acceptanceRate: 92 },
    { id: 'rest005', name: 'Noodle House', image: '🍜', rating: 4.6, acceptanceRate: 87 }
  ];
  
  const randomRestaurant = restaurants[Math.floor(Math.random() * restaurants.length)];
  
  return {
    id: 'order_' + Date.now(),
    ingredients,
    totalPrice,
    status: 'pending',
    restaurant: randomRestaurant,
    bargainPrice: totalPrice > 0 ? Math.floor(totalPrice * 0.9) : null,
  };
};

const convertIngredients = (backendIngredients: any[]): Ingredient[] => {
  return backendIngredients.map((ing, index) => ({
    id: ing.id || index.toString(),
    name: ing.name,
    selected: ing.selected ?? true,
    notes: ing.note || ing.notes || '',
    price: ing.price || Math.floor(Math.random() * 50) + 10,
  }));
};

const initialState: ChatState = {
  messages: [
    {
      id: '1',
      text: 'What would you like to eat? 🍽️',
      sender: 'ai',
      timestamp: new Date().toISOString(),
      type: 'text',
    }
  ],
  currentOrder: null,
  isLoading: false,
  error: null,
  demoFlowStep: 'idle',
  nearbyCooks: [],
  selectedCook: null,
};

// Async thunks
export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (request: SendMessageRequest, { rejectWithValue }) => {
    try {
      const response = await chatApi.sendMessage(request.message, request.orderId);
      const data = response.data;
      if (data && (data as any).response) {
        return data as SendMessageResponse;
      }
      return rejectWithValue((data as any)?.error || 'Failed to send message');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to send message');
    }
  }
);

export const confirmOrder = createAsyncThunk(
  'chat/confirmOrder',
  async (selectedIngredients: Ingredient[], { getState, rejectWithValue }) => {
    try {
      const state = getState() as { chat: ChatState };
      if (!state.chat.currentOrder) return rejectWithValue('Order not found');
      
      const response = await orderApi.confirmOrder(state.chat.currentOrder.id, selectedIngredients);
      const data = response.data;
      if (data) {
        return data;
      }
      return rejectWithValue((data as any)?.error || 'Failed to confirm order');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to confirm order');
    }
  }
);

export const bargainOrder = createAsyncThunk(
  'chat/bargainOrder',
  async (offerPrice: number, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { chat: ChatState };
      if (!state.chat.currentOrder) return rejectWithValue('Order not found');
      
      const response = await orderApi.bargainOrder(state.chat.currentOrder.id, offerPrice);
      const data = response.data;
      if (data) {
        return data;
      }
      return rejectWithValue((data as any)?.error || 'Failed to bargain');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to bargain');
    }
  }
);

// Demo thunks
export const startDemoOrder = createAsyncThunk(
  'chat/startDemoOrder',
  async (userMessage: string, { dispatch, rejectWithValue }) => {
    try {
      dispatch(addUserMessage(userMessage));
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const aiMessage: Message = {
        id: Date.now().toString(),
        text: 'Perfect choice! Dal Chawal is a classic comfort meal. Here are the ingredients for a delicious homemade Dal Chawal. You can select/unselect ingredients to customize your meal.',
        sender: 'ai',
        timestamp: new Date().toISOString(),
        type: 'ingredient-table',
        data: DAL_CHAWAL_INGREDIENTS,
      };
      
      return { aiMessage, ingredients: DAL_CHAWAL_INGREDIENTS };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to start demo order');
    }
  }
);

export const confirmDemoIngredients = createAsyncThunk(
  'chat/confirmDemoIngredients',
  async (selectedIngredients: Ingredient[], { dispatch, rejectWithValue }) => {
    try {
      const totalPrice = selectedIngredients.reduce((sum, ing) => sum + ing.price, 0);
      
      const order: Order = {
        id: 'demo_order_' + Date.now(),
        ingredients: selectedIngredients,
        totalPrice,
        status: 'searching_cooks',
        restaurant: undefined,
        bargainPrice: null,
      };
      
      const confirmMessage: Message = {
        id: Date.now().toString(),
        text: `✅ Ingredients confirmed! Total: ₹${totalPrice}\n\n🔍 Finding MAA nearby...`,
        sender: 'ai',
        timestamp: new Date().toISOString(),
        type: 'text',
      };
      dispatch(addMessage(confirmMessage));
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return { order, cooks: MOCK_NEARBY_COOKS };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to confirm ingredients');
    }
  }
);

export const selectDemoCook = createAsyncThunk(
  'chat/selectDemoCook',
  async (cook: Cook, { dispatch, rejectWithValue, getState }) => {
    try {
      const state = getState() as { chat: ChatState };
      if (!state.chat.currentOrder) {
        return rejectWithValue('Order not found');
      }

      const order: Order = {
        ...state.chat.currentOrder,
        totalPrice: cook.mealPrice!,
        status: 'confirmed',
        restaurant: {
          id: cook.id,
          name: cook.displayName,
          image: '👩‍🍳',
          rating: cook.rating,
          acceptanceRate: 100,
        },
      };
      const message: Message = {
        id: Date.now().toString(),
        text: `Great! You selected ${cook.displayName} (⭐ ${cook.rating}) - ₹${cook.mealPrice}\n\nProceeding to payment...`,
        sender: 'ai',
        timestamp: new Date().toISOString(),
        type: 'text',
      };
      dispatch(addMessage(message));
      
      return { cook, order };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to select cook');
    }
  }
);

export const processDemoPayment = createAsyncThunk(
  'chat/processDemoPayment',
  async (_, { dispatch, rejectWithValue, getState }) => {
    try {
      const state = getState() as any;
      const order = state.chat.currentOrder;
      
      if (!order) {
        return rejectWithValue('Order not found');
      }

      const cook = state.chat.selectedCook || {
        id: order.restaurant?.id,
        displayName: order.restaurant?.name,
        rating: order.restaurant?.rating,
        totalOrders: 100,
        mealPrice: order.totalPrice,
      };

      if (!cook.displayName) {
        return rejectWithValue('Cook information not found');
      }
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const finalOrder: Order = {
        ...order,
        id: order.id || 'ORDER_' + Date.now(),
        status: 'confirmed',
        totalPrice: cook.mealPrice || order.totalPrice,
        restaurant: {
          id: cook.id || order.restaurant?.id,
          name: cook.displayName || order.restaurant?.name,
          image: '👩‍🍳',
          rating: cook.rating || order.restaurant?.rating,
          acceptanceRate: 100,
        },
      };
      
      return { order: finalOrder, cook };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Payment failed');
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    addUserMessage: (state, action: PayloadAction<string>) => {
      const userMessage: Message = {
        id: Date.now().toString(),
        text: action.payload,
        sender: 'user',
        timestamp: new Date().toISOString(),
        type: 'text',
      };
      state.messages.push(userMessage);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setOrder: (state, action: PayloadAction<Order | null>) => {
      state.currentOrder = action.payload;
    },
    updateIngredients: (state, action: PayloadAction<Ingredient[]>) => {
      if (state.currentOrder) {
        state.currentOrder.ingredients = action.payload;
        const selectedIngredients = action.payload.filter(ing => ing.selected);
        state.currentOrder.totalPrice = selectedIngredients.reduce((sum, ing) => sum + ing.price, 0);
        state.currentOrder.bargainPrice = state.currentOrder.totalPrice > 0 
          ? Math.floor(state.currentOrder.totalPrice * 0.9) 
          : null;
      }
    },
    updateOrderNotes: (state, action: PayloadAction<string>) => {
      if (state.currentOrder) {
        state.currentOrder.notes = action.payload;
      }
    },
    resetChat: () => {
      return initialState;
    },
    clearError: (state) => {
      state.error = null;
    },
    acceptBargain: (state, action: PayloadAction<number>) => {
      if (state.currentOrder && state.currentOrder.bargainPrice) {
        state.currentOrder.totalPrice = action.payload;
        state.currentOrder.status = 'confirmed';
      }
    },
    createOrderFromCurrentIngredients: (state) => {
      const latestIngredientMessage = state.messages
        .slice()
        .reverse()
        .find(msg => msg.type === 'ingredient-table' && msg.data);
      
      if (latestIngredientMessage && latestIngredientMessage.data) {
        state.currentOrder = createOrderFromIngredients(latestIngredientMessage.data);
      }
    },
    toggleIngredientSelection: (state, action: PayloadAction<{ ingredientId: string; selected: boolean }>) => {
      const latestIngredientMessage = state.messages
        .slice()
        .reverse()
        .find(msg => msg.type === 'ingredient-table' && msg.data);
      
      if (latestIngredientMessage && latestIngredientMessage.data) {
        const messageIngredient = latestIngredientMessage.data.find((ing: Ingredient) => ing.id === action.payload.ingredientId);
        if (messageIngredient) {
          messageIngredient.selected = action.payload.selected;
        }
      }
      
      if (state.currentOrder) {
        const ingredient = state.currentOrder.ingredients.find(ing => ing.id === action.payload.ingredientId);
        if (ingredient) {
          ingredient.selected = action.payload.selected;
          const selectedIngredients = state.currentOrder.ingredients.filter(ing => ing.selected);
          state.currentOrder.totalPrice = selectedIngredients.reduce((sum, ing) => sum + ing.price, 0);
          state.currentOrder.bargainPrice = state.currentOrder.totalPrice > 0 
            ? Math.floor(state.currentOrder.totalPrice * 0.9) 
            : null;
        }
      }
    },
    setDemoFlowStep: (state, action: PayloadAction<DemoFlowStep>) => {
      state.demoFlowStep = action.payload;
    },
    setNearbyCooks: (state, action: PayloadAction<Cook[]>) => {
      state.nearbyCooks = action.payload;
    },
    setSelectedCook: (state, action: PayloadAction<Cook | null>) => {
      state.selectedCook = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Send message
      .addCase(sendMessage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        
        if (!action.payload || typeof action.payload !== 'object') {
          state.error = "Invalid response from server";
          return;
        }

        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: action.payload.response || "Here's what I found:",
          sender: 'ai',
          timestamp: new Date().toISOString(),
          type: action.payload.ingredients && action.payload.ingredients.length > 0 ? 'ingredient-table' : 'text',
          data: action.payload.ingredients ? convertIngredients(action.payload.ingredients) : undefined,
        };
        state.messages.push(aiMessage);
        
        if (action.payload.ingredients && Array.isArray(action.payload.ingredients) && action.payload.ingredients.length > 0) {
          state.currentOrder = createOrderFromIngredients(convertIngredients(action.payload.ingredients));
          state.currentOrder.id = action.payload.order_id || state.currentOrder.id;
          state.demoFlowStep = 'ingredients';
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isLoading = false;
        const errorMessage = action.payload as string || action.error.message || 'Failed to send message';
        state.error = errorMessage;
        
        const errorChatMessage: Message = {
          id: Date.now().toString(),
          text: `Sorry, I encountered an error: ${errorMessage}. Please try again.`,
          sender: 'ai',
          timestamp: new Date().toISOString(),
          type: 'text',
        };
        state.messages.push(errorChatMessage);
      })
      // Start demo order
      .addCase(startDemoOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(startDemoOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.messages.push(action.payload.aiMessage);
        state.currentOrder = createOrderFromIngredients(action.payload.ingredients);
        state.demoFlowStep = 'ingredients';
      })
      .addCase(startDemoOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Failed to start order';
      })
      // Confirm order
      .addCase(confirmOrder.pending, (state) => {
        state.isLoading = true;
        const confirmMessage: Message = {
          id: Date.now().toString(),
          text: `🔄 Order placed! Finding the best home cook for you...`,
          sender: 'ai',
          timestamp: new Date().toISOString(),
          type: 'text',
        };
        state.messages.push(confirmMessage);
      })
      .addCase(confirmOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        
        const backendOrder = action.payload;
        if (state.currentOrder && backendOrder) {
          state.currentOrder = {
            ...state.currentOrder,
            id: backendOrder.order_id || backendOrder.id || state.currentOrder.id,
            status: backendOrder.status || 'pending',
            totalPrice: backendOrder.final_price || backendOrder.total_price || state.currentOrder.totalPrice,
            bargainPrice: backendOrder.final_price ? Math.floor(backendOrder.final_price * 0.9) : state.currentOrder.bargainPrice,
          };
        }
        
        const statusMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: '',
          sender: 'ai',
          timestamp: new Date().toISOString(),
          type: 'order-status',
          data: state.currentOrder,
        };
        state.messages.push(statusMessage);
      })
      .addCase(confirmOrder.rejected, (state, action) => {
        state.isLoading = false;
        const errorMessage = action.payload as string || action.error.message || 'Failed to confirm order';
        state.error = errorMessage;
        
        const errorMessage2: Message = {
          id: Date.now().toString(),
          text: `Sorry, failed to confirm order: ${errorMessage}`,
          sender: 'ai',
          timestamp: new Date().toISOString(),
          type: 'text',
        };
        state.messages.push(errorMessage2);
      })
      // Bargain order
      .addCase(bargainOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(bargainOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        const backendResponse = action.payload;
        
        if (state.currentOrder && backendResponse) {
          state.currentOrder = {
            ...state.currentOrder,
            status: backendResponse.accepted ? 'confirmed' : 'bargaining',
            totalPrice: backendResponse.final_price || state.currentOrder.totalPrice,
            bargainPrice: backendResponse.accepted ? null : backendResponse.final_price,
          };
        }
        
        const statusMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: backendResponse.message || '',
          sender: 'ai',
          timestamp: new Date().toISOString(),
          type: 'order-status',
          data: state.currentOrder,
        };
        state.messages.push(statusMessage);
      })
      .addCase(bargainOrder.rejected, (state, action) => {
        state.isLoading = false;
        const errorMessage = action.payload as string || action.error.message || 'Failed to bargain';
        state.error = errorMessage;
        
        const errorMessage2: Message = {
          id: Date.now().toString(),
          text: `Sorry, failed to process bargain: ${errorMessage}`,
          sender: 'ai',
          timestamp: new Date().toISOString(),
          type: 'text',
        };
        state.messages.push(errorMessage2);
      })
      // Demo ingredient confirmation
      .addCase(confirmDemoIngredients.pending, (state) => {
        state.isLoading = true;
        state.demoFlowStep = 'searching_cooks';
      })
      .addCase(confirmDemoIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload.order;
        state.nearbyCooks = action.payload.cooks;
        state.demoFlowStep = 'cooks_found';
        state.messages.push({
          id: (Date.now() + 1).toString(),
          text: 'These nearby MAAs can prepare your Dal Chawal. Choose the one you prefer:',
          sender: 'ai',
          timestamp: new Date().toISOString(),
          type: 'cook-list',
          data: action.payload.cooks,
        });
      })
      .addCase(confirmDemoIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.demoFlowStep = 'ingredients';
        state.error = action.payload as string || 'Failed to find nearby MAAs';
      })
      .addCase(selectDemoCook.fulfilled, (state, action) => {
        state.selectedCook = action.payload.cook;
        state.currentOrder = action.payload.order;
        state.demoFlowStep = 'payment';
      })
      .addCase(processDemoPayment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(processDemoPayment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload.order;
        state.demoFlowStep = 'confirmed';
        state.messages.push({
          id: (Date.now() + 1).toString(),
          text: '🎉 Order Confirmed!',
          sender: 'ai',
          timestamp: new Date().toISOString(),
          type: 'order-confirmed',
          data: { order: action.payload.order, cook: action.payload.cook },
        });
      })
      .addCase(processDemoPayment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Payment failed';
        state.messages.push({
          id: Date.now().toString(),
          text: `❌ Payment failed: ${action.payload}. Please try again.`,
          sender: 'ai',
          timestamp: new Date().toISOString(),
          type: 'text',
        });
      });
  },
});

export const { 
  addMessage, 
  addUserMessage,
  setLoading, 
  setOrder, 
  updateIngredients, 
  updateOrderNotes,
  resetChat, 
  clearError,
  acceptBargain,
  createOrderFromCurrentIngredients,
  toggleIngredientSelection,
  setDemoFlowStep,
  setNearbyCooks,
  setSelectedCook,
} = chatSlice.actions;

export default chatSlice.reducer;