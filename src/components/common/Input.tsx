// components/common/Input.tsx
// Reusable Input component with validation support

import React from 'react';
import { View, Text, StyleSheet, TextInput as RNTextInput, TextInputProps } from 'react-native';
import { theme, type ThemeColors } from '../../theme';

interface InputProps extends Omit<TextInputProps, 'size' | 'onChangeText'> {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  helperText?: string;
  variant?: 'outlined' | 'filled' | 'standard';
  size?: 'small' | 'medium' | 'large';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  secureTextEntry?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  keyboardType?: TextInputProps['keyboardType'];
  autoCapitalize?: TextInputProps['autoCapitalize'];
  autoComplete?: string;
  disabled?: boolean;
  required?: boolean;
  themeColors?: ThemeColors;
  style?: any;
  inputStyle?: any;
  labelStyle?: any;
  errorStyle?: any;
}

const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  helperText,
  variant = 'outlined',
  size = 'medium',
  leftIcon,
  rightIcon,
  secureTextEntry = false,
  multiline = false,
  numberOfLines,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  autoComplete,
  disabled = false,
  required = false,
  themeColors,
  style,
  inputStyle,
  labelStyle,
  errorStyle,
  ...props
}) => {
  const colors = themeColors || theme.colors.light;
  const hasError = !!error;
  const isFocused = false; // Would need focus state from actual implementation

  const sizeStyles = {
    small: {
      paddingHorizontal: 10,
      paddingVertical: 8,
      fontSize: 13,
      labelFontSize: 11,
      borderRadius: 8,
      iconSize: 18,
    },
    medium: {
      paddingHorizontal: 12,
      paddingVertical: 10,
      fontSize: 15,
      labelFontSize: 12,
      borderRadius: 10,
      iconSize: 20,
    },
    large: {
      paddingHorizontal: 16,
      paddingVertical: 14,
      fontSize: 17,
      labelFontSize: 13,
      borderRadius: 12,
      iconSize: 22,
    },
  }[size];

  const variantStyles = {
    outlined: {
      borderWidth: 1.5,
      backgroundColor: colors.surface,
    },
    filled: {
      borderWidth: 0,
      backgroundColor: colors.surfaceVariant,
    },
    standard: {
      borderWidth: 0,
      borderBottomWidth: 1,
      backgroundColor: 'transparent',
      borderRadius: 0,
    },
  }[variant];

  const borderColor = hasError
    ? colors.error
    : isFocused
    ? colors.primary
    : colors.outline;

  const containerStyle: any = [
    styles.container,
    {
      width: '100%',
    },
    style,
  ];

  const inputContainerStyle: any = [
    styles.inputContainer,
    variantStyles,
    {
      borderColor,
      borderRadius: variant === 'standard' ? 0 : sizeStyles.borderRadius,
      paddingHorizontal: sizeStyles.paddingHorizontal,
      paddingVertical: sizeStyles.paddingVertical,
      backgroundColor: disabled ? colors.surfaceVariant : variantStyles.backgroundColor,
    },
    inputStyle,
  ];

  const inputTextStyle: any = [
    styles.inputText,
    {
      fontSize: sizeStyles.fontSize,
      color: colors.text,
      paddingLeft: leftIcon ? sizeStyles.iconSize + 8 : 0,
      paddingRight: rightIcon ? sizeStyles.iconSize + 8 : 0,
    },
  ];

  const labelTextStyle: any = [
    styles.label,
    {
      fontSize: sizeStyles.labelFontSize,
      color: hasError ? colors.error : colors.textSecondary,
      marginBottom: variant === 'standard' ? 0 : 6,
    },
    labelStyle,
  ];

  const errorTextStyle: any = [
    styles.helperText,
    {
      fontSize: sizeStyles.labelFontSize,
      color: colors.error,
      marginTop: 4,
    },
    errorStyle,
  ];

  const helperTextStyle: any = [
    styles.helperText,
    {
      fontSize: sizeStyles.labelFontSize,
      color: colors.textSecondary,
      marginTop: 4,
    },
  ];

  return (
    <View style={containerStyle}>
      {(label || required) && (
        <Text style={labelTextStyle}>
          {label}
          {required && <Text style={{ color: colors.error, marginLeft: 4 }}> *</Text>}
        </Text>
      )}
      <View style={inputContainerStyle}>
        {leftIcon && (
          <View style={[
            styles.iconWrapper,
            { width: sizeStyles.iconSize, marginRight: 8 }
          ]}>
            {React.isValidElement(leftIcon)
              ? React.cloneElement(leftIcon as React.ReactElement, {
                  size: sizeStyles.iconSize,
                  color: hasError ? colors.error : colors.textSecondary,
                })
              : leftIcon}
          </View>
        )}
        <RNTextInput
          style={inputTextStyle}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textDisabled}
          secureTextEntry={secureTextEntry}
          multiline={multiline}
          numberOfLines={numberOfLines}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          disabled={disabled}
          editable={!disabled}
          selectionColor={colors.primary}
          {...props}
        />
        {rightIcon && (
          <View style={[
            styles.iconWrapper,
            { width: sizeStyles.iconSize, marginLeft: 8 }
          ]}>
            {React.isValidElement(rightIcon)
              ? React.cloneElement(rightIcon as React.ReactElement, {
                  size: sizeStyles.iconSize,
                  color: hasError ? colors.error : colors.textSecondary,
                })
              : rightIcon}
          </View>
        )}
      </View>
      {hasError && <Text style={errorTextStyle}>{error}</Text>}
      {!hasError && helperText && <Text style={helperTextStyle}>{helperText}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputText: {
    flex: 1,
    minWidth: 0,
    fontWeight: '400',
  },
  label: {
    fontWeight: '500',
  },
  helperText: {
    marginLeft: 2,
  },
  iconWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Input;