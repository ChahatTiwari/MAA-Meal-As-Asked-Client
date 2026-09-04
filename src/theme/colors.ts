// theme/colors.ts
// Centralized color palette for the MAA app

export const colors = {
  // Primary brand colors
  primary: {
    50: '#FFF3E0',
    100: '#FFE0B2',
    200: '#FFCC80',
    300: '#FFB74D',
    400: '#FFA726',
    500: '#FF6B35', // Main brand color
    600: '#E85A2A',
    700: '#D14D22',
    800: '#B8401C',
    900: '#9F3417',
  },

  // Secondary colors
  secondary: {
    50: '#E8F5E9',
    100: '#C8E6C9',
    200: '#A5D6A7',
    300: '#81C784',
    400: '#66BB6A',
    500: '#4CAF50',
    600: '#43A047',
    700: '#388E3C',
    800: '#2E7D32',
    900: '#1B5E20',
  },

  // Accent colors
  accent: {
    50: '#FCE4EC',
    100: '#F8BBD0',
    200: '#F48FB1',
    300: '#F06292',
    400: '#EC407A',
    500: '#E91E63',
    600: '#D81B60',
    700: '#C2185B',
    800: '#AD1457',
    900: '#880E4F',
  },

  // Status colors
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',

  // Neutral colors (light theme)
  neutral: {
    0: '#FFFFFF',
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
    950: '#121212',
  },

  // Semantic color aliases for light theme
  light: {
    background: '#F7F9FC',
    surface: '#FFFFFF',
    surfaceVariant: '#F5F5F5',
    outline: '#E0E0E0',
    text: '#2C3E50',
    textSecondary: '#7F8C8D',
    textDisabled: '#BDBDBD',
    primary: '#FF6B35',
    primaryContainer: '#FFF3E0',
    secondary: '#4CAF50',
    secondaryContainer: '#E8F5E9',
    error: '#F44336',
    errorContainer: '#FFEBEE',
    warning: '#FF9800',
    warningContainer: '#FFF3E0',
    success: '#4CAF50',
    successContainer: '#E8F5E9',
    onPrimary: '#FFFFFF',
    onSurface: '#2C3E50',
    onBackground: '#2C3E50',
    onError: '#FFFFFF',
    shadow: 'rgba(0, 0, 0, 0.1)',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },

  // Semantic color aliases for dark theme
  dark: {
    background: '#121212',
    surface: '#1E1E1E',
    surfaceVariant: '#2C2C2C',
    outline: '#424242',
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    textDisabled: '#757575',
    primary: '#FFB74D',
    primaryContainer: '#E65100',
    secondary: '#81C784',
    secondaryContainer: '#1B5E20',
    error: '#EF5350',
    errorContainer: '#B71C1C',
    warning: '#FFB74D',
    warningContainer: '#E65100',
    success: '#81C784',
    successContainer: '#1B5E20',
    onPrimary: '#000000',
    onSurface: '#FFFFFF',
    onBackground: '#FFFFFF',
    onError: '#000000',
    shadow: 'rgba(0, 0, 0, 0.3)',
    overlay: 'rgba(0, 0, 0, 0.7)',
  },
} as const;

export type ColorScale = typeof colors.primary;
export type SemanticColors = typeof colors.light;
export type ThemeColors = typeof colors.light | typeof colors.dark;

export default colors;