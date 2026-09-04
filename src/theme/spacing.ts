// theme/spacing.ts
// Centralized spacing system for the MAA app

export const spacing = {
  // Base unit: 4px
  base: 4,

  // Spacing scale
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  11: 44,
  12: 48,
  14: 56,
  16: 64,
  20: 80,
  24: 96,
  28: 112,
  32: 128,

  // Semantic spacing
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
  '4xl': 96,

  // Component-specific spacing
  component: {
    cardPadding: 16,
    cardPaddingSm: 12,
    cardPaddingLg: 24,
    screenPadding: 16,
    screenPaddingSm: 12,
    screenPaddingLg: 24,
    sectionGap: 24,
    itemGap: 16,
    itemGapSm: 8,
    itemGapLg: 24,
    listItemPadding: 16,
    buttonPaddingHorizontal: 16,
    buttonPaddingVertical: 12,
    inputPaddingHorizontal: 12,
    inputPaddingVertical: 10,
    modalPadding: 24,
    toastPadding: 16,
    snackbarPadding: 16,
  },

  // Layout spacing
  layout: {
    headerHeight: 56,
    tabBarHeight: 64,
    fabSize: 56,
    fabMargin: 16,
    bottomSheetHandleHeight: 4,
    bottomSheetHandleWidth: 40,
  },
} as const;

export type Spacing = typeof spacing;
export type SpacingKey = keyof typeof spacing;

export default spacing;