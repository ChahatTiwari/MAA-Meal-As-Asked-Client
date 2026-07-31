// import React, { createContext, useContext, useState } from 'react';
// import { useColorScheme } from 'react-native';

// interface ThemeContextType {
//   isDark: boolean;
//   toggleTheme: () => void;
//   colors: {
//     primary: string;
//     background: string;
//     surface: string;
//     text: string;
//     textSecondary: string;
//   };
// }

// const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const systemColorScheme = useColorScheme();
//   const [isDark, setIsDark] = useState(systemColorScheme === 'dark');

//   const colors = {
//     primary: '#FF6B35',
//     background: isDark ? '#121212' : '#F7F9FC',
//     surface: isDark ? '#1E1E1E' : '#FFFFFF',
//     text: isDark ? '#FFFFFF' : '#2C3E50',
//     textSecondary: isDark ? '#B0B0B0' : '#7F8C8D',
//   };

//   const toggleTheme = () => setIsDark(!isDark);

//   return (
//     <ThemeContext.Provider value={{ isDark, toggleTheme, colors }}>
//       {children}
//     </ThemeContext.Provider>
//   );
// };

// export const useTheme = () => {
//   const context = useContext(ThemeContext);
//   if (context === undefined) {
//     throw new Error('useTheme must be used within a ThemeProvider');
//   }
//   return context;
// };