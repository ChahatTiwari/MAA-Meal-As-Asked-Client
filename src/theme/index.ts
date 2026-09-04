// theme/index.ts
// Main theme entry point - combines all design tokens

import { colors, type ThemeColors } from './colors';
import { typography, type Typography } from './typography';
import { spacing, type Spacing } from './spacing';
import { shadows, type Shadows } from './shadows';
import { borders, type Borders } from './borders';

export type { ThemeColors, Typography, Spacing, Shadows, Borders };

// Complete theme object
export const theme = {
  colors,
  typography,
  spacing,
  shadows,
  borders,
} as const;

// Helper to get theme colors based on mode
export const getThemeColors = (isDark: boolean): ThemeColors => {
  return isDark ? colors.dark : colors.light;
};

// Theme type for consumers
export type Theme = typeof theme;

export default theme;