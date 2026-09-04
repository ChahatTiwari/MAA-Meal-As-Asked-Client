// store/index.ts
// Redux store configuration

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import chatReducer from './slices/chatSlice';
import themeReducer from './slices/themeSlice';
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

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Selectors
export * from './selectors';