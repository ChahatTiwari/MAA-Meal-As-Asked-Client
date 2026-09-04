// store/selectors/index.ts
// Memoized selectors for Redux state

import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../index';

// Auth selectors
export const selectAuth = (state: RootState) => state.auth;
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectUserRole = (state: RootState) => state.auth.role;
export const selectAuthLoading = (state: RootState) => state.auth.isLoading;
export const selectAuthError = (state: RootState) => state.auth.error;

// Chat selectors
export const selectChat = (state: RootState) => state.chat;
export const selectMessages = (state: RootState) => state.chat.messages;
export const selectCurrentOrder = (state: RootState) => state.chat.currentOrder;
export const selectChatLoading = (state: RootState) => state.chat.isLoading;
export const selectChatError = (state: RootState) => state.chat.error;
export const selectDemoFlowStep = (state: RootState) => state.chat.demoFlowStep;
export const selectNearbyCooks = (state: RootState) => state.chat.nearbyCooks;
export const selectSelectedCook = (state: RootState) => state.chat.selectedCook;

// Memoized selectors
export const selectSelectedIngredients = createSelector(
  [selectCurrentOrder],
  (order) => order?.ingredients.filter(ing => ing.selected) || []
);

export const selectOrderTotal = createSelector(
  [selectCurrentOrder],
  (order) => {
    if (!order) return 0;
    return order.ingredients
      .filter(ing => ing.selected)
      .reduce((sum, ing) => sum + ing.price, 0);
  }
);

export const selectLastAiMessage = createSelector(
  [selectMessages],
  (messages) => [...messages].reverse().find(msg => msg.sender === 'ai')
);

export const selectLastIngredientMessage = createSelector(
  [selectMessages],
  (messages) => [...messages].reverse().find(msg => msg.type === 'ingredient-table' && msg.data)
);

// Theme selectors
export const selectTheme = (state: RootState) => state.theme;
export const selectIsDark = (state: RootState) => state.theme.isDark;
export const selectColors = (state: RootState) => state.theme.colors;

// Combined selectors
export const selectIsCook = createSelector(
  [selectUserRole],
  (role) => role === 'cook'
);

export const selectIsCustomer = createSelector(
  [selectUserRole],
  (role) => role === 'customer'
);

export const selectCanOrder = createSelector(
  [selectIsAuthenticated, selectIsCustomer],
  (isAuthenticated, isCustomer) => isAuthenticated && isCustomer
);

export const selectCanManageMeals = createSelector(
  [selectIsAuthenticated, selectIsCook],
  (isAuthenticated, isCook) => isAuthenticated && isCook
);