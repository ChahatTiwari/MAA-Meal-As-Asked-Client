// theme/borders.ts
// Centralized border and radius system for the MAA app

export const borders = {
  // Border widths
  widths: {
    none: 0,
    hairline: 0.5,
    thin: 1,
    medium: 2,
    thick: 3,
    heavier: 4,
  },

  // Border radius
  radius: {
    none: 0,
    xs: 2,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 20,
    '3xl': 24,
    full: 9999,
    // Component-specific
    button: 12,
    buttonSm: 8,
    buttonLg: 16,
    card: 16,
    cardSm: 12,
    cardLg: 20,
    input: 12,
    inputSm: 8,
    badge: 4,
    chip: 8,
    avatar: 9999,
    modal: 20,
    sheet: 24,
    fab: 28,
  },

  // Border styles
  styles: {
    solid: 'solid',
    dashed: 'dashed',
    dotted: 'dotted',
  },

  // Default border colors (will be overridden by theme)
  colors: {
    default: '#E0E0E0',
    light: '#EEEEEE',
    dark: '#BDBDBD',
    focus: '#FF6B35',
    error: '#F44336',
    success: '#4CAF50',
    warning: '#FF9800',
  },
} as const;

export type Borders = typeof borders;

export default borders;