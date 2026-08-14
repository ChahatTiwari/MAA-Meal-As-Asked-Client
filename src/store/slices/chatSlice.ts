// store/slices/chatSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Message, Order, Ingredient } from '../../types';
import { chatApi } from '../../services/api';

interface ChatState {
  messages: Message[];
  currentOrder: Order | null;
  isLoading: boolean;
  error: string | null;
}

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
};

// Helper function to create a new order from ingredients
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
    ingredients: ingredients,
    totalPrice: totalPrice,
    status: 'pending',
    restaurant: randomRestaurant,
    bargainPrice: totalPrice > 0 ? Math.floor(totalPrice * 0.9) : null
  };
};

// Async thunks
export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (message: string, { rejectWithValue }) => {
    try {
      const response = await chatApi.sendMessage(message);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to send message');
    }
  }
);

export const confirmOrder = createAsyncThunk(
  'chat/confirmOrder',
  async (selectedIngredients: Ingredient[], { rejectWithValue }) => {
    try {
      const totalPrice = selectedIngredients.reduce((sum, ing) => sum + ing.price, 0);
      
      const order = {
        id: 'ORDER_' + Date.now(),
        ingredients: selectedIngredients,
        totalPrice,
        status: "pending" as const,
      };

      // Simulate finding restaurant
      await new Promise(resolve => setTimeout(resolve, 2500));

      const restaurants = [
        { id: '1', name: 'Spice Palace', image: '🍛', acceptanceRate: 0.8, rating: 4.8 },
        { id: '2', name: 'Pizza Corner', image: '🍕', acceptanceRate: 0.7, rating: 4.5 },
        { id: '3', name: 'Burger Hub', image: '🍔', acceptanceRate: 0.6, rating: 4.3 },
        { id: '4', name: 'Sushi Express', image: '🍣', acceptanceRate: 0.9, rating: 4.9 },
        { id: '5', name: 'Curry House', image: '🍛', acceptanceRate: 0.75, rating: 4.6 },
        { id: '6', name: 'Pasta Paradise', image: '🍝', acceptanceRate: 0.85, rating: 4.7 }
      ];
      
      const restaurant = restaurants[Math.floor(Math.random() * restaurants.length)];
      const isAccepted = Math.random() < restaurant.acceptanceRate;
      
      return {
        ...order,
        restaurant,
        status: isAccepted ? 'accepted' as const : 'declined' as const,
        bargainPrice: isAccepted ? null : Math.floor(totalPrice * 0.85),
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to confirm order');
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
      // Update the ingredient in the latest message data first
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
      
      // Update current order if it exists
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
    }
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
        
        // Validate the response structure
        if (!action.payload || typeof action.payload !== 'object') {
          state.error = "Invalid response from server";
          return;
        }

        // Add AI response message
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: action.payload.response || "Here's what I found:",
          sender: 'ai',
          timestamp: new Date().toISOString(),
          type: action.payload.ingredients && action.payload.ingredients.length > 0 ? 'ingredient-table' : 'text',
          data: action.payload.ingredients || undefined,
        };
        state.messages.push(aiMessage);
        
        // Create dynamic current order from the received ingredients
        if (action.payload.ingredients && Array.isArray(action.payload.ingredients) && action.payload.ingredients.length > 0) {
          state.currentOrder = createOrderFromIngredients(action.payload.ingredients);
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isLoading = false;
        const errorMessage = action.payload as string || action.error.message || 'Failed to send message';
        state.error = errorMessage;
        
        // Add error message to chat
        const errorChatMessage: Message = {
          id: Date.now().toString(),
          text: `Sorry, I encountered an error: ${errorMessage}. Please try again.`,
          sender: 'ai',
          timestamp: new Date().toISOString(),
          type: 'text',
        };
        state.messages.push(errorChatMessage);
      })
      // Confirm order
      .addCase(confirmOrder.pending, (state) => {
        state.isLoading = true;
        const confirmMessage: Message = {
          id: Date.now().toString(),
          text: `🔄 Order placed! Finding the best restaurant for you...`,
          sender: 'ai',
          timestamp: new Date().toISOString(),
          type: 'text',
        };
        state.messages.push(confirmMessage);
      })
      .addCase(confirmOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload;
        
        const statusMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: '',
          sender: 'ai',
          timestamp: new Date().toISOString(),
          type: 'order-status',
          data: action.payload,
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
  toggleIngredientSelection
} = chatSlice.actions;
export default chatSlice.reducer;