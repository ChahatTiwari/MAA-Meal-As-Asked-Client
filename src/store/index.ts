// store/index.ts
// Redux store configuration

import { configureStore, type Middleware } from '@reduxjs/toolkit';
import authReducer, { type AuthState } from './slices/authSlice';
import chatReducer, { type ChatState } from './slices/chatSlice';
import themeReducer, { type ThemeState } from './slices/themeSlice';
import { loggerMiddleware } from './middleware/logger';
import { persistenceMiddleware } from './middleware/persistence';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    theme: themeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['chat/addMessage', 'chat/addUserMessage'],
        ignoredPaths: ['chat.messages'],
      },
    }).concat(loggerMiddleware, persistenceMiddleware),
  devTools: __DEV__,
});

export type RootState = {
  auth: AuthState;
  chat: ChatState;
  theme: ThemeState;
};
export type AppDispatch = typeof store.dispatch;

// Selectors
export * from './selectors';