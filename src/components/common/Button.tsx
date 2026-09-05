// components/common/Button.tsx
// Reusable Button component with consistent styling

import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, TouchableOpacityProps } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { theme, type ThemeColors } from '../../theme';

interface ButtonProps extends Omit<TouchableOpacityProps, 'onPress'> {
  children: React.ReactNode;
  variant?: 'contained' | 'outlined' | 'text' | 'elevated' | 'tonal';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onPress?: () => void;
  style?: any;
  themeColors?: ThemeColors;
}

// Props to exclude from spreading to TouchableOpacity
type ButtonNativeProps = Omit<ButtonProps, 'variant' | 'size' | 'fullWidth' | 'loading' | 'leftIcon' | 'rightIcon' | 'themeColors'>;

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'contained',
  size = 'medium',
  fullWidth = false,
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  onPress,
  style,
  themeColors,
  ...nativeProps
}) => {
  const colors = themeColors || theme.colors.light;
  const isDisabled = disabled || loading;

  // Variant styles
  const variantStyles = {
    contained: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
      textColor: colors.onPrimary,
    },
    outlined: {
      backgroundColor: 'transparent',
      borderColor: colors.outline,
      textColor: colors.primary,
    },
    text: {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      textColor: colors.primary,
    },
    elevated: {
      backgroundColor: colors.surface,
      borderColor: 'transparent',
      textColor: colors.primary,
      shadow: theme.shadows.named.md,
    },
    tonal: {
      backgroundColor: colors.primaryContainer,
      borderColor: 'transparent',
      textColor: colors.onPrimaryContainer,
    },
  }[variant];

  // Size styles
  const sizeStyles = {
    small: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      fontSize: 12,
      borderRadius: 8,
      iconSize: 16,
    },
    medium: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      fontSize: 14,
      borderRadius: 12,
      iconSize: 20,
    },
    large: {
      paddingHorizontal: 28,
      paddingVertical: 14,
      fontSize: 16,
      borderRadius: 14,
      iconSize: 24,
    },
  }[size];

  const containerStyle: any = [
    styles.container,
    {
      backgroundColor: variantStyles.backgroundColor,
      borderColor: variantStyles.borderColor,
      borderWidth: variant === 'outlined' ? 1.5 : 0,
      borderRadius: sizeStyles.borderRadius,
      paddingHorizontal: sizeStyles.paddingHorizontal,
      paddingVertical: sizeStyles.paddingVertical,
      width: fullWidth ? '100%' : 'auto',
      opacity: isDisabled ? 0.6 : 1,
      ...variantStyles.shadow,
    },
    style,
  ];

  const textStyle: any = [
    styles.text,
    {
      color: variantStyles.textColor,
      fontSize: sizeStyles.fontSize,
      fontWeight: '600',
    },
  ];

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={isDisabled ? undefined : onPress}
      activeOpacity={0.8}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      {...nativeProps}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variantStyles.textColor}
          style={styles.spinner}
        />
      ) : (
        <>
          {leftIcon && (
            <View style={styles.iconLeft}>
              {leftIcon}
            </View>
          )}
          <Text style={textStyle} numberOfLines={1}>
            {children}
          </Text>
          {rightIcon && (
            <View style={styles.iconRight}>
              {rightIcon}
            </View>
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minHeight: 44,
  },
  text: {
    textAlign: 'center',
    letterSpacing: 0.1,
  },
  iconLeft: {
    marginRight: 4,
  },
  iconRight: {
    marginLeft: 4,
  },
  spinner: {
    marginHorizontal: -4,
  },
});

export default Button;