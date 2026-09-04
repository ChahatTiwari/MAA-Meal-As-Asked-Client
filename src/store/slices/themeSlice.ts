// store/slices/themeSlice.ts
// Theme Redux slice with TypeScript types

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { theme, type ThemeColors } from '../../theme';

interface ThemeState {
  isDark: boolean;
  colors: ThemeColors;
}

const getColors = (isDark: boolean): ThemeColors => {
  return isDark ? theme.colors.dark : theme.colors.light;
};

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
    setTheme: (state, action: PayloadAction<boolean>) => {
      state.isDark = action.payload;
      state.colors = getColors(action.payload);
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;