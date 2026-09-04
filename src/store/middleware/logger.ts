// store/middleware/logger.ts
// Redux logger middleware

import { Middleware } from '@reduxjs/toolkit';
import { logger } from '../../utils/logger';

export const loggerMiddleware: Middleware = (store) => (next) => (action) => {
  if (!__DEV__) return next(action);
  
  const startTime = Date.now();
  const prevState = store.getState();
  
  logger.debug('Action dispatched', { 
    type: action.type, 
    payload: action.payload,
    meta: action.meta 
  }, 'REDUX');
  
  const result = next(action);
  
  const nextState = store.getState();
  const duration = Date.now() - startTime;
  
  logger.debug('Action completed', { 
    type: action.type, 
    duration,
    prevState: prevState,
    nextState: nextState 
  }, 'REDUX');
  
  return result;
};

export default loggerMiddleware;