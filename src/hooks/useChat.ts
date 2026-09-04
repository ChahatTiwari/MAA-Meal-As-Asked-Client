// hooks/useChat.ts
// Chat hook with business logic separated from UI

import { useAppDispatch, useAppSelector } from './redux';
import { 
  sendMessage, 
  confirmOrder, 
  bargainOrder, 
  addUserMessage,
  startDemoOrder,
  confirmDemoIngredients,
  selectDemoCook,
  processDemoPayment,
  resetChat,
  toggleIngredientSelection,
  setOrder,
  updateOrderNotes,
  setDemoFlowStep,
  clearError,
} from '../store/slices/chatSlice';
import { 
  selectMessages, 
  selectCurrentOrder, 
  selectChatLoading, 
  selectChatError,
  selectDemoFlowStep,
  selectNearbyCooks,
  selectSelectedCook,
  selectSelectedIngredients,
  selectOrderTotal,
} from '../store/selectors';
import { Message, Order, Ingredient, Cook } from '../types';
import { useCallback, useMemo } from 'react';

export const useChat = () => {
  const dispatch = useAppDispatch();
  
  // Selectors
  const messages = useAppSelector(selectMessages);
  const currentOrder = useAppSelector(selectCurrentOrder);
  const isLoading = useAppSelector(selectChatLoading);
  const error = useAppSelector(selectChatError);
  const demoFlowStep = useAppSelector(selectDemoFlowStep);
  const nearbyCooks = useAppSelector(selectNearbyCooks);
  const selectedCook = useAppSelector(selectSelectedCook);
  const selectedIngredients = useAppSelector(selectSelectedIngredients);
  const orderTotal = useAppSelector(selectOrderTotal);

  // Actions
  const sendChatMessage = useCallback((message: string, orderId?: string) => {
    return dispatch(sendMessage({ message, orderId })).unwrap();
  }, [dispatch]);

  const sendDemoMessage = useCallback((message: string) => {
    return dispatch(startDemoOrder(message)).unwrap();
  }, [dispatch]);

  const addUserMsg = useCallback((message: string) => {
    dispatch(addUserMessage(message));
  }, [dispatch]);

  const confirmIngredients = useCallback((ingredients: Ingredient[]) => {
    return dispatch(confirmOrder(ingredients)).unwrap();
  }, [dispatch]);

  const confirmDemoIngs = useCallback((ingredients: Ingredient[]) => {
    return dispatch(confirmDemoIngredients(ingredients)).unwrap();
  }, [dispatch]);

  const selectCook = useCallback((cook: Cook) => {
    return dispatch(selectDemoCook(cook)).unwrap();
  }, [dispatch]);

  const processPayment = useCallback(() => {
    return dispatch(processDemoPayment()).unwrap();
  }, [dispatch]);

  const bargain = useCallback((offerPrice: number) => {
    return dispatch(bargainOrder(offerPrice)).unwrap();
  }, [dispatch]);

  const toggleIngredient = useCallback((ingredientId: string, selected: boolean) => {
    dispatch(toggleIngredientSelection({ ingredientId, selected }));
  }, [dispatch]);

  const updateNotes = useCallback((notes: string) => {
    dispatch(updateOrderNotes(notes));
  }, [dispatch]);

  const setOrderData = useCallback((order: Order | null) => {
    dispatch(setOrder(order));
  }, [dispatch]);

  const setFlowStep = useCallback((step: typeof demoFlowStep) => {
    dispatch(setDemoFlowStep(step));
  }, [dispatch]);

  const clearChat = useCallback(() => {
    dispatch(resetChat());
  }, [dispatch]);

  const clearChatError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Computed values
  const canConfirmOrder = useMemo(() => 
    selectedIngredients.length > 0 && !!currentOrder, 
    [selectedIngredients, currentOrder]
  );

  const canBargain = useMemo(() => 
    currentOrder?.status === 'bargaining' && !!currentOrder?.bargainPrice,
    [currentOrder]
  );

  const canPay = useMemo(() => 
    currentOrder?.status === 'confirmed' || currentOrder?.status === 'accepted',
    [currentOrder]
  );

  return {
    // State
    messages,
    currentOrder,
    isLoading,
    error,
    demoFlowStep,
    nearbyCooks,
    selectedCook,
    selectedIngredients,
    orderTotal,
    
    // Computed
    canConfirmOrder,
    canBargain,
    canPay,
    
    // Actions
    sendChatMessage,
    sendDemoMessage,
    addUserMsg,
    confirmIngredients,
    confirmDemoIngs,
    selectCook,
    processPayment,
    bargain,
    toggleIngredient,
    updateNotes,
    setOrderData,
    setFlowStep,
    clearChat,
    clearChatError,
  };
};

export default useChat;