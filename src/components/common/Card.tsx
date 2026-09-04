// components/common/Card.tsx
// Reusable Card component with consistent styling

import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { theme, type ThemeColors } from '../../theme';

interface CardProps {
  children: React.ReactNode;
  variant?: 'elevated' | 'outlined' | 'filled';
  padding?: 'none' | 'small' | 'medium' | 'large';
  onPress?: () => void;
  style?: any;
  themeColors?: ThemeColors;
  borderRadius?: number;
  elevation?: number;
}

const Card: React.FC<CardProps> = ({
  children,
  variant = 'elevated',
  padding = 'medium',
  onPress,
  style,
  themeColors,
  borderRadius,
  elevation,
}) => {
  const colors = themeColors || theme.colors.light;

  const paddingStyles = {
    none: 0,
    small: theme.spacing.component.cardPaddingSm,
    medium: theme.spacing.component.cardPadding,
    large: theme.spacing.component.cardPaddingLg,
  }[padding];

  const variantStyles = {
    elevated: {
      backgroundColor: colors.surface,
      borderWidth: 0,
      shadow: theme.shadows.named.md,
      elevation: elevation ?? 3,
    },
    outlined: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.outline,
      shadow: theme.shadows.named.none,
      elevation: 0,
    },
    filled: {
      backgroundColor: colors.surfaceVariant,
      borderWidth: 0,
      shadow: theme.shadows.named.none,
      elevation: 0,
    },
  }[variant];

  const containerStyle: any = [
    styles.container,
    {
      backgroundColor: variantStyles.backgroundColor,
      borderWidth: variantStyles.borderWidth,
      borderColor: variantStyles.borderColor,
      borderRadius: borderRadius ?? theme.borders.radius.card,
      padding: paddingStyles,
      ...variantStyles.shadow,
      elevation: variantStyles.elevation,
    },
    style,
  ];

  const Component = onPress ? Pressable : View;

  return (
    <Component
      style={containerStyle}
      onPress={onPress}
      android_ripple={onPress ? { color: colors.primary + '20' } : undefined}
      accessibilityRole={onPress ? 'button' : undefined}
    >
      {children}
    </Component>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
});

export default Card;