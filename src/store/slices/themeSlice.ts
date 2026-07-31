// store/slices/themeSlice.ts
import { createSlice } from '@reduxjs/toolkit';

interface ThemeState {
  isDark: boolean;
  colors: {
    primary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
  };
}

const getColors = (isDark: boolean) => ({
  primary: '#FF6B35',
  background: isDark ? '#121212' : '#F7F9FC',
  surface: isDark ? '#1E1E1E' : '#FFFFFF',
  text: isDark ? '#FFFFFF' : '#2C3E50',
  textSecondary: isDark ? '#B0B0B0' : '#7F8C8D',
});

const initialState: ThemeState = {
  isDark: false,
  colors: getColors(false),
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.isDark = !state.isDark;
      state.colors = getColors(state.isDark);
    },
    setTheme: (state, action) => {
      state.isDark = action.payload;
      state.colors = getColors(action.payload);
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;