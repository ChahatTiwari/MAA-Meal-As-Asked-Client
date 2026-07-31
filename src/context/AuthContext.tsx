// import React, { createContext, useContext, useEffect, useState } from 'react';
// import { User } from '../types';
// import { storage } from '../services/storage';

// interface AuthContextType {
//   user: User | null;
//   isLoading: boolean;
//   login: (email: string, password: string) => Promise<void>;
//   signup: (email: string, password: string, name: string) => Promise<void>;
//   logout: () => Promise<void>;
// }

// // ✅ Exporting AuthContext directly so it can be imported elsewhere
// export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     checkAuthState();
//   }, []);

//   const checkAuthState = async () => {
//     try {
//       const token = await storage.getToken();
//       const userData = await storage.getUser();

//       if (token && userData) {
//         setUser({ ...userData, token });
//       }
//     } catch (error) {
//       console.error('Auth check failed:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const login = async (email: string, password: string) => {
//     setIsLoading(true);
//     try {
//       // Mock login - replace with actual API call
//       const response = await new Promise<{ user: any; token: string }>((resolve) => {
//         setTimeout(() => {
//           resolve({
//             user: { id: '1', email, name: 'John Doe' },
//             token: 'mock-jwt-token-' + Date.now(),
//           });
//         }, 1000);
//       });

//       await storage.setToken(response.token);
//       await storage.setUser(response.user);
//       setUser({ ...response.user, token: response.token });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const signup = async (email: string, password: string, name: string) => {
//     setIsLoading(true);
//     try {
//       // Mock signup - replace with actual API call
//       const response = await new Promise<{ user: any; token: string }>((resolve) => {
//         setTimeout(() => {
//           resolve({
//             user: { id: '1', email, name },
//             token: 'mock-jwt-token-' + Date.now(),
//           });
//         }, 1000);
//       });

//       await storage.setToken(response.token);
//       await storage.setUser(response.user);
//       setUser({ ...response.user, token: response.token });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const logout = async () => {
//     await storage.removeToken();
//     await storage.removeUser();
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // ✅ Custom hook to use AuthContext
// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };
