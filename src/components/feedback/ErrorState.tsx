// components/feedback/ErrorState.tsx
// Error state component

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme, type ThemeColors } from '../../theme';
import Button from '../common/Button';

interface ErrorStateProps {
  title?: string;
  message: string;
  code?: string;
  recoverable?: boolean;
  onRetry?: () => void;
  onDismiss?: () => void;
  themeColors?: ThemeColors;
  style?: any;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message,
  code,
  recoverable = true,
  onRetry,
  onDismiss,
  themeColors,
  style,
}) => {
  const colors = themeColors || theme.colors.light;

  return (
    <View style={[
      styles.container,
      { backgroundColor: colors.background },
      style,
    ]}>
      <View style={styles.iconWrapper}>
        <Text style={styles.icon}>⚠️</Text>
      </View>
      <Text style={[
        styles.title,
        { color: colors.text }
      ]}>
        {title}
      </Text>
      <Text style={[
        styles.message,
        { color: colors.textSecondary }
      ]}>
        {message}
      </Text>
      {code && __DEV__ && (
        <Text style={[
          styles.code,
          { color: colors.textDisabled }
        ]}>
          Error code: {code}
        </Text>
      )}
      <View style={styles.actions}>
        {recoverable && onRetry && (
          <Button
            variant="contained"
            onPress={onRetry}
            style={styles.retryButton}
            leftIcon={<Text style={styles.buttonIcon}>🔄</Text>}
          >
            Try Again
          </Button>
        )}
        {onDismiss && (
          <Button
            variant="outlined"
            onPress={onDismiss}
            style={styles.dismissButton}
          >
            Dismiss
          </Button>
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
    padding: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.light.errorContainer,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  icon: {
    fontSize: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  message: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 300,
    marginTop: theme.spacing.xs,
  },
  code: {
    fontSize: 12,
    fontFamily: 'monospace',
    marginTop: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    backgroundColor: theme.colors.light.surfaceVariant,
    borderRadius: theme.borders.radius.sm,
  },
  actions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginTop: theme.spacing.lg,
    width: '100%',
    maxWidth: 300,
    justifyContent: 'center',
  },
  retryButton: {
    flex: 1,
    borderRadius: theme.borders.radius.button,
  },
  dismissButton: {
    flex: 1,
    borderRadius: theme.borders.radius.button,
  },
  buttonContent: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  buttonIcon: {
    fontSize: 16,
    marginRight: 4,
  },
});

export default ErrorState;

/**
 * Inline error banner
 */
export const ErrorBanner: React.FC<{
  message: string;
  onDismiss?: () => void;
  themeColors?: ThemeColors;
  actionLabel?: string;
  onAction?: () => void;
}> = ({ message, onDismiss, themeColors, actionLabel, onAction }) => {
  const colors = themeColors || theme.colors.light;

  return (
    <View style={[
      bannerStyles.banner,
      { backgroundColor: colors.errorContainer }
    ]}>
      <View style={bannerStyles.bannerContent}>
        <Text style={[
          bannerStyles.bannerText,
          { color: colors.onErrorContainer }
        ]}>
          {message}
        </Text>
        {actionLabel && onAction && (
          <Button
            variant="text"
            onPress={onAction}
            style={bannerStyles.bannerAction}
          >
            {actionLabel}
          </Button>
        )}
        {onDismiss && (
          <TouchableOpacity style={bannerStyles.bannerDismiss} onPress={onDismiss}>
            <Text style={[
              bannerStyles.bannerDismissText,
              { color: colors.onErrorContainer }
            ]}>
              ✕
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const bannerStyles = StyleSheet.create({
  banner: {
    padding: theme.spacing.md,
    borderRadius: theme.borders.radius.md,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
  },
  bannerText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  bannerAction: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  bannerDismiss: {
    padding: 4,
  },
  bannerDismissText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});