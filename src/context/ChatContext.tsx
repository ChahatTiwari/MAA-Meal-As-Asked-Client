// import React, { createContext, useContext, useReducer,useEffect } from 'react';
// import { Message, Order, Ingredient } from '../types';

// interface ChatState {
//   messages: Message[];
//   currentOrder: Order | null;
//   isLoading: boolean;
// }

// type ChatAction =
//   | { type: 'ADD_MESSAGE'; payload: Message }
//   | { type: 'SET_LOADING'; payload: boolean }
//   | { type: 'SET_ORDER'; payload: Order | null }
//   | { type: 'UPDATE_INGREDIENTS'; payload: Ingredient[] }
//   | { type: 'RESET_CHAT' };

// const initialState: ChatState = {
//   messages: [
//     {
//       id: '1',
//       text: 'What would you like to eat? 🍽️',
//       sender: 'ai',
//       timestamp: new Date(),
//       type: 'text',
//     }
//   ],
//   currentOrder: { id: 'order123',
//   ingredients: [
//     { id: 'ing1', name: 'Tomato', selected: true, notes: 'Ripe', price: 10 },
//     { id: 'ing2', name: 'Cheese', selected: true, notes: 'Cheddar', price: 50 }
//   ],
//   totalPrice: 60,
//   status: 'pending',
//   restaurant: {
//     id: 'rest001',
//     name: 'Pizza Palace',
//     image: 'https://example.com/image.jpg',
//     rating: 4.5,
//     acceptanceRate: 90
//   },
//   bargainPrice: 55 },
//   isLoading: false,
// };

// const chatReducer = (state: ChatState, action: ChatAction): 
// ChatState => {
//   switch (action.type) {
//     case 'ADD_MESSAGE':
//       return {
//         ...state,
//         messages: [...state.messages, action.payload],
//       };
//     case 'SET_LOADING':
//       return {
//         ...state,
//         isLoading: action.payload,
//       };
//     case 'SET_ORDER':
//       return {
//         ...state,
//         currentOrder: action.payload,
//       };
//     case 'UPDATE_INGREDIENTS':
//       return {
//         ...state,
//         currentOrder: state.currentOrder
//           ? { ...state.currentOrder, ingredients: action.payload }
//            : state.currentOrder,
//       };
//     case 'RESET_CHAT':
//       return initialState;
//     default:
//       return state;
//   }
// };
// const ChatContext = createContext<{
//   state: ChatState;
//   dispatch: React.Dispatch<ChatAction>;
// } | undefined>(undefined);

// export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [state, dispatch] = useReducer(chatReducer, initialState);
//   useEffect(() => {
//     console.log('Current Order:', state.currentOrder);
//   }, [state.currentOrder]);

//   return (
//     <ChatContext.Provider value={{ state, dispatch }}>
//       {children}
//     </ChatContext.Provider>
//   );
// };

// export const useChat = () => {
//   const context = useContext(ChatContext);
//   if (context === undefined) {
//     throw new Error('useChat must be used within a ChatProvider');
//   }
//   return context;
// };