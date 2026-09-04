// components/feedback/EmptyState.tsx
// Empty state component

import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { theme, type ThemeColors } from '../../theme';
import Button from '../common/Button';

interface EmptyStateProps {
  title: string;
  message?: string;
  icon?: React.ReactNode;
  illustration?: any; // Image source
  actionLabel?: string;
  onAction?: () => void;
  themeColors?: ThemeColors;
  style?: any;
  containerStyle?: any;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  icon,
  illustration,
  actionLabel,
  onAction,
  themeColors,
  style,
  containerStyle,
}) => {
  const colors = themeColors || theme.colors.light;

  return (
    <View style={[
      styles.container,
      { backgroundColor: colors.background },
      containerStyle,
    ]}>
      {(icon || illustration) && (
        <View style={styles.iconContainer}>
          {illustration ? (
            <Image source={illustration} style={styles.illustration} resizeMode="contain" />
          ) : (
            <View style={styles.iconWrapper}>{icon}</View>
          )}
        </View>
      )}
      <Text style={[
        styles.title,
        { color: colors.text }
      ]}>
        {title}
      </Text>
      {message && (
        <Text style={[
          styles.message,
          { color: colors.textSecondary }
        ]}>
          {message}
        </Text>
      )}
      {actionLabel && onAction && (
        <Button
          mode="contained"
          onPress={onAction}
          style={styles.actionButton}
          contentStyle={styles.actionButtonContent}
        >
          {actionLabel}
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  iconContainer: {
    marginBottom: theme.spacing.sm,
  },
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.light.primaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustration: {
    width: 200,
    height: 200,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: theme.spacing.sm,
  },
  message: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 300,
    marginTop: theme.spacing.xs,
  },
  actionButton: {
    marginTop: theme.spacing.md,
    borderRadius: theme.borders.radius.button,
  },
  actionButtonContent: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
});

export default EmptyState;