// components/feedback/Toast.tsx
// Toast/Snackbar notifications

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Animated, Platform } from 'react-native';
import { theme, type ThemeColors } from '../../theme';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastData {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  action?: {
    label: string;
    onPress: () => void;
  };
}

interface ToastContainerProps {
  toasts: ToastData[];
  onDismiss: (id: string) => void;
  themeColors?: ThemeColors;
}

const typeStyles = {
  success: { bg: '#E8F5E9', text: '#2E7D32', icon: '✅' },
  error: { bg: '#FFEBEE', text: '#C62828', icon: '❌' },
  warning: { bg: '#FFF3E0', text: '#E65100', icon: '⚠️' },
  info: { bg: '#E3F2FD', text: '#1565C0', icon: 'ℹ️' },
};

const ToastItem: React.FC<{ toast: ToastData; onDismiss: () => void; themeColors?: ThemeColors }> = ({
  toast,
  onDismiss,
  themeColors,
}) => {
  const colors = themeColors || theme.colors.light;
  const typeStyle = typeStyles[toast.type];
  const [visible, setVisible] = useState(true);
  const fadeAnim = new Animated.Value(0);
  const translateAnim = new Animated.Value(50);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.spring(translateAnim, { toValue: 0, tension: 100, friction: 8, useNativeDriver: true }),
    ]).start();

    if (toast.duration !== 0) {
      const timer = setTimeout(() => {
        dismiss();
      }, toast.duration || 4000);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismiss = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(translateAnim, { toValue: -50, duration: 200, useNativeDriver: true }),
    ]).start(() => {
      setVisible(false);
      onDismiss();
    });
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.toast,
        {
          backgroundColor: typeStyle.bg,
          transform: [{ translateY: translateAnim }],
          opacity: fadeAnim,
        },
      ]}
    >
      <View style={styles.content}>
        <Text style={styles.icon}>{typeStyle.icon}</Text>
        <Text style={[{ color: typeStyle.text }, styles.message]} numberOfLines={3}>
          {toast.message}
        </Text>
      </View>
      {toast.action && (
        <View style={styles.action}>
          <Text
            style={[
              styles.actionText,
              { color: typeStyle.text },
            ]}
            onPress={() => { toast.action!.onPress(); dismiss(); }}
          >
            {toast.action.label}
          </Text>
        </View>
      )}
      <View style={styles.dismiss} onPress={dismiss}>
        <Text style={[{ color: typeStyle.text, opacity: 0.7 }, styles.dismissText]}>✕</Text>
      </View>
    </Animated.View>
  );
};

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss, themeColors }) => {
  if (toasts.length === 0) return null;

  return (
    <View style={styles.container} pointerEvents="box-none">
      {toasts.map(toast => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onDismiss={() => onDismiss(toast.id)}
          themeColors={themeColors}
        />
      ))}
    </View>
  );
};

/**
 * Toast hook for showing notifications
 */
export const useToast = () => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const show = useCallback((message: string, type: ToastType = 'info', options?: {
    duration?: number;
    action?: { label: string; onPress: () => void };
  }) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newToast: ToastData = { id, message, type, ...options };
    setToasts(prev => [...prev, newToast]);
    return id;
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const success = useCallback((message: string, options?: { duration?: number; action?: { label: string; onPress: () => void }; }) => 
    show(message, 'success', options), [show]);
  const error = useCallback((message: string, options?: { duration?: number; action?: { label: string; onPress: () => void }; }) => 
    show(message, 'error', options), [show]);
  const warning = useCallback((message: string, options?: { duration?: number; action?: { label: string; onPress: () => void }; }) => 
    show(message, 'warning', options), [show]);
  const info = useCallback((message: string, options?: { duration?: number; action?: { label: string; onPress: () => void }; }) => 
    show(message, 'info', options), [show]);

  return {
    toasts,
    show,
    dismiss,
    success,
    error,
    warning,
    info,
  };
};

/**
 * Toast Provider Context
 */
import { createContext, useContext, ReactNode } from 'react';

const ToastContext = createContext<ReturnType<typeof useToast> | null>(null);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const toast = useToast();

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toast.toasts} onDismiss={toast.dismiss} />
    </ToastContext.Provider>
  );
};

export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within ToastProvider');
  }
  return context;
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: theme.spacing.xl + (Platform.OS === 'ios' ? 20 : 0),
    left: theme.spacing.md,
    right: theme.spacing.md,
    zIndex: 1000,
    gap: theme.spacing.sm,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
    borderRadius: theme.borders.radius.card,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    minHeight: 56,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: theme.spacing.sm,
  },
  icon: {
    fontSize: 20,
  },
  message: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  action: {
    paddingHorizontal: theme.spacing.sm,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  dismiss: {
    padding: theme.spacing.xs,
  },
  dismissText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ToastContainer;