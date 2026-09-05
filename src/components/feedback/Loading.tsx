// components/feedback/Loading.tsx
// Loading states and spinners

import React from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { theme, type ThemeColors } from '../../theme';

interface LoadingProps {
  text?: string;
  size?: 'small' | 'large';
  color?: string;
  overlay?: boolean;
  themeColors?: ThemeColors;
  style?: any;
}

const Loading: React.FC<LoadingProps> = ({
  text,
  size = 'large',
  color,
  overlay = false,
  themeColors,
  style,
}) => {
  const colors = themeColors || theme.colors.light;
  const spinnerColor = color || colors.primary;

  const containerStyle: any = [
    styles.container,
    overlay && styles.overlay,
    style,
  ];

  const contentStyle: any = [
    styles.content,
    {
      backgroundColor: overlay ? colors.surface : 'transparent',
    },
  ];

  return (
    <View style={containerStyle}>
      <View style={contentStyle}>
        <ActivityIndicator size={size} color={spinnerColor} />
        {text && (
          <Text style={[
            styles.text,
            { color: colors.text, marginTop: theme.spacing.sm }
          ]}>
            {text}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 100,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.lg,
    borderRadius: theme.borders.radius.card,
    minWidth: 120,
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default Loading;

/**
 * Loading overlay for inline use
 */
export const LoadingOverlay: React.FC<{ 
  visible: boolean; 
  text?: string; 
  themeColors?: ThemeColors;
  children: React.ReactNode;
}> = ({ visible, text, themeColors, children }) => {
  if (!visible) return <>{children}</>;
  
  return (
    <View style={overlayStyles.overlayContainer}>
      {children}
      <Loading text={text} overlay themeColors={themeColors} />
    </View>
  );
};

const overlayStyles = StyleSheet.create({
  overlayContainer: {
    position: 'relative',
  },
});

/**
 * Skeleton loader for content placeholders
 */
export const Skeleton: React.FC<{
  width?: number | string;
  height?: number;
  borderRadius?: number;
  themeColors?: ThemeColors;
  style?: any;
}> = ({ width = '100%', height = 16, borderRadius, themeColors, style }) => {
  const colors = themeColors || theme.colors.light;
  
  return (
    <View
      style={[
        skeletonStyles.skeleton,
        {
          width,
          height,
          borderRadius: borderRadius ?? theme.borders.radius.sm,
          backgroundColor: colors.outline + '40',
        },
        style,
      ]}
    />
  );
};

const skeletonStyles = StyleSheet.create({
  skeleton: {
    overflow: 'hidden',
  },
});