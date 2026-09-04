// utils/validation.ts
// Centralized validation utilities

import { ValidationRule, FieldValidation, FormValidation } from '../types';

/**
 * Common validation rules
 */
export const validators = {
  /**
   * Required field validation
   */
  required: <T>(message = 'This field is required'): ValidationRule<T> => ({
    validate: (value: T) => {
      if (value === null || value === undefined) return false;
      if (typeof value === 'string') return value.trim().length > 0;
      if (Array.isArray(value)) return value.length > 0;
      return true;
    },
    message,
  }),

  /**
   * Minimum length validation
   */
  minLength: (min: number, message?: string): ValidationRule<string> => ({
    validate: (value: string) => value.length >= min,
    message: message || `Must be at least ${min} characters`,
  }),

  /**
   * Maximum length validation
   */
  maxLength: (max: number, message?: string): ValidationRule<string> => ({
    validate: (value: string) => value.length <= max,
    message: message || `Must be no more than ${max} characters`,
  }),

  /**
   * Email validation
   */
  email: (message = 'Please enter a valid email address'): ValidationRule<string> => ({
    validate: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message,
  }),

  /**
   * Phone number validation (Indian format)
   */
  phone: (message = 'Please enter a valid phone number'): ValidationRule<string> => ({
    validate: (value: string) => /^[\+]?[0-9]{10,15}$/.test(value.replace(/\s|-/g, '')),
    message,
  }),

  /**
   * Password validation
   */
  password: (options: { minLength?: number; requireUppercase?: boolean; requireLowercase?: boolean; requireNumbers?: boolean; requireSpecialChars?: boolean } = {}, message?: string): ValidationRule<string> => {
    const { minLength = 8, requireUppercase = true, requireLowercase = true, requireNumbers = true, requireSpecialChars = false } = options;
    
    return {
      validate: (value: string) => {
        if (value.length < minLength) return false;
        if (requireUppercase && !/[A-Z]/.test(value)) return false;
        if (requireLowercase && !/[a-z]/.test(value)) return false;
        if (requireNumbers && !/[0-9]/.test(value)) return false;
        if (requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(value)) return false;
        return true;
      },
      message: message || `Password must be at least ${minLength} characters${requireUppercase ? ' with uppercase' : ''}${requireLowercase ? ' with lowercase' : ''}${requireNumbers ? ' with numbers' : ''}${requireSpecialChars ? ' with special characters' : ''}`,
    };
  },

  /**
   * Numeric validation
   */
  numeric: (message = 'Please enter a valid number'): ValidationRule<string> => ({
    validate: (value: string) => /^[0-9]+(\.[0-9]+)?$/.test(value),
    message,
  }),

  /**
   * Integer validation
   */
  integer: (message = 'Please enter a valid integer'): ValidationRule<string> => ({
    validate: (value: string) => /^-?[0-9]+$/.test(value),
    message,
  }),

  /**
   * Positive number validation
   */
  positive: (message = 'Please enter a positive number'): ValidationRule<number> => ({
    validate: (value: number) => value > 0,
    message,
  }),

  /**
   * Min value validation
   */
  min: (min: number, message?: string): ValidationRule<number> => ({
    validate: (value: number) => value >= min,
    message: message || `Value must be at least ${min}`,
  }),

  /**
   * Max value validation
   */
  max: (max: number, message?: string): ValidationRule<number> => ({
    validate: (value: number) => value <= max,
    message: message || `Value must be no more than ${max}`,
  }),

  /**
   * Pattern/regex validation
   */
  pattern: (regex: RegExp, message = 'Invalid format'): ValidationRule<string> => ({
    validate: (value: string) => regex.test(value),
    message,
  }),

  /**
   * URL validation
   */
  url: (message = 'Please enter a valid URL'): ValidationRule<string> => ({
    validate: (value: string) => {
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    },
    message,
  }),

  /**
   * Date validation
   */
  date: (message = 'Please enter a valid date'): ValidationRule<string> => ({
    validate: (value: string) => !isNaN(Date.parse(value)),
    message,
  }),

  /**
   * Future date validation
   */
  futureDate: (message = 'Date must be in the future'): ValidationRule<string> => ({
    validate: (value: string) => {
      const date = new Date(value);
      return !isNaN(date.getTime()) && date > new Date();
    },
    message,
  }),

  /**
   * Past date validation
   */
  pastDate: (message = 'Date must be in the past'): ValidationRule<string> => ({
    validate: (value: string) => {
      const date = new Date(value);
      return !isNaN(date.getTime()) && date < new Date();
    },
    message,
  }),

  /**
   * Match another field validation
   */
  matches: (fieldName: string, getFieldValue: (name: string) => any, message = 'Fields do not match'): ValidationRule<any> => ({
    validate: (value: any, allValues?: any) => {
      const otherValue = allValues?.[fieldName] ?? getFieldValue(fieldName);
      return value === otherValue;
    },
    message,
  }),

  /**
   * Custom validation
   */
  custom: <T>(validate: (value: T) => boolean, message: string): ValidationRule<T> => ({
    validate,
    message,
  }),

  /**
   * One of allowed values
   */
  oneOf: <T>(allowedValues: T[], message = 'Invalid value'): ValidationRule<T> => ({
    validate: (value: T) => allowedValues.includes(value),
    message,
  }),
};

/**
 * Validate a single field
 */
export const validateField = <T>(value: T, rules: ValidationRule<T>[]): string | null => {
  for (const rule of rules) {
    if (!rule.validate(value)) {
      return rule.message;
    }
  }
  return null;
};

/**
 * Validate entire form
 */
export const validateForm = <T extends Record<string, any>>(
  values: T,
  validationSchema: FormValidation<T>
): Partial<Record<keyof T, string>> => {
  const errors: Partial<Record<keyof T, string>> = {};
  
  for (const [field, rules] of Object.entries(validationSchema)) {
    if (!rules) continue;
    
    const fieldRules = Array.isArray(rules) ? rules : [rules];
    const value = values[field as keyof T];
    const error = validateField(value, fieldRules as ValidationRule<any>[]);
    
    if (error) {
      errors[field as keyof T] = error;
    }
  }
  
  return errors;
};

/**
 * Create validation schema for common forms
 */
export const validationSchemas = {
  login: {
    email: [validators.required(), validators.email()],
    password: [validators.required()],
  },
  
  register: {
    name: [validators.required(), validators.minLength(2), validators.maxLength(50)],
    email: [validators.required(), validators.email()],
    password: [validators.required(), validators.password()],
    confirmPassword: [validators.required(), validators.matches('password', () => '')],
  },
  
  profile: {
    name: [validators.required(), validators.minLength(2), validators.maxLength(50)],
    email: [validators.required(), validators.email()],
    phone: [validators.phone()],
  },
  
  cookProfile: {
    displayName: [validators.required(), validators.minLength(2), validators.maxLength(50)],
    bio: [validators.maxLength(500)],
    address: [validators.required(), validators.minLength(5)],
    latitude: [validators.required(), validators.numeric()],
    longitude: [validators.required(), validators.numeric()],
    serviceRadiusKm: [validators.required(), validators.numeric(), validators.min(1), validators.max(50)],
  },
  
  meal: {
    name: [validators.required(), validators.minLength(2), validators.maxLength(100)],
    description: [validators.required(), validators.minLength(10), validators.maxLength(1000)],
    category: [validators.required()],
    cuisine: [validators.required()],
    price: [validators.required(), validators.numeric(), validators.positive(), validators.max(10000)],
    originalPrice: [validators.numeric(), validators.positive()],
    prepTimeMins: [validators.required(), validators.integer(), validators.min(1), validators.max(480)],
    serves: [validators.required(), validators.integer(), validators.min(1), validators.max(50)],
    spiceLevel: [validators.required()],
    ingredients: [validators.required()],
  },
  
  availability: {
    dayOfWeek: [validators.required(), validators.integer(), validators.min(0), validators.max(6)],
    startTime: [validators.required(), validators.pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)],
    endTime: [validators.required(), validators.pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)],
  },
  
  payment: {
    upiId: [validators.required(), validators.pattern(/^[\w.-]+@[\w.-]+$/, 'Please enter a valid UPI ID')],
    cardNumber: [validators.required(), validators.pattern(/^[\d\s]{13,19}$/, 'Please enter a valid card number')],
    expiryDate: [validators.required(), validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Please enter valid MM/YY format')],
    cvv: [validators.required(), validators.pattern(/^\d{3,4}$/, 'Please enter a valid CVV')],
    cardHolder: [validators.required(), validators.minLength(2)],
  },
};

/**
 * Format validation errors for display
 */
export const formatErrors = (errors: Partial<Record<string, string>>): string => {
  return Object.values(errors).filter(Boolean).join('\n');
};

/**
 * Check if form has errors
 */
export const hasErrors = (errors: Partial<Record<string, string>>): boolean => {
  return Object.values(errors).some(error => error !== undefined && error !== '');
};

export default {
  validators,
  validateField,
  validateForm,
  validationSchemas,
  formatErrors,
  hasErrors,
};