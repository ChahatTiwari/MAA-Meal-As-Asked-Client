// hooks/useForm.ts
// Form hook with validation

import { useState, useCallback, useMemo } from 'react';
import { validateForm, validateField } from '../utils/validation';
import { FieldValidation, FormValidation } from '../types';

interface UseFormOptions<T extends Record<string, any>> {
  initialValues: T;
  validationSchema?: FormValidation<T>;
  onSubmit: (values: T) => Promise<void> | void;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

interface UseFormReturn<T extends Record<string, any>> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
  setValue: (field: keyof T, value: any) => void;
  setValues: (values: Partial<T>) => void;
  setFieldTouched: (field: keyof T, touched?: boolean) => void;
  handleChange: (field: keyof T) => (value: any) => void;
  handleBlur: (field: keyof T) => () => void;
  handleSubmit: () => Promise<void>;
  resetForm: () => void;
  validateField: (field: keyof T) => string | null;
  validateAll: () => Partial<Record<keyof T, string>>;
}

export const useForm = <T extends Record<string, any>>({
  initialValues,
  validationSchema = {} as FormValidation<T>,
  onSubmit,
  validateOnChange = true,
  validateOnBlur = true,
}: UseFormOptions<T>): UseFormReturn<T> => {
  const [values, setValuesState] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateAll = useCallback(() => {
    const newErrors = validateForm(values, validationSchema);
    setErrors(newErrors);
    return newErrors;
  }, [values, validationSchema]);

  const validateFieldFn = useCallback((field: keyof T) => {
    const rules = validationSchema[field];
    if (!rules) return null;
    
    const fieldRules = Array.isArray(rules) ? rules : [rules];
    const error = validateField(values[field], fieldRules as any[]);
    
    setErrors(prev => ({ ...prev, [field]: error || undefined }));
    return error;
  }, [values, validationSchema]);

  const setValue = useCallback((field: keyof T, value: any) => {
    setValuesState(prev => ({ ...prev, [field]: value }));
    
    if (validateOnChange && validationSchema[field]) {
      const rules = validationSchema[field];
      const fieldRules = Array.isArray(rules) ? rules : [rules];
      const error = validateField(value, fieldRules as any[]);
      setErrors(prev => ({ ...prev, [field]: error || undefined }));
    }
  }, [validateOnChange, validationSchema]);

  const setValues = useCallback((newValues: Partial<T>) => {
    setValuesState(prev => ({ ...prev, ...newValues }));
  }, []);

  const setFieldTouched = useCallback((field: keyof T, isTouched = true) => {
    setTouched(prev => ({ ...prev, [field]: isTouched }));
    
    if (validateOnBlur && isTouched && validationSchema[field]) {
      validateFieldFn(field);
    }
  }, [validateOnBlur, validateFieldFn]);

  const handleChange = useCallback((field: keyof T) => (value: any) => {
    setValue(field, value);
  }, [setValue]);

  const handleBlur = useCallback((field: keyof T) => () => {
    setFieldTouched(field, true);
  }, [setFieldTouched]);

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    
    // Mark all fields as touched
    const allTouched = Object.keys(values).reduce(
      (acc, key) => ({ ...acc, [key]: true }), 
      {} as Partial<Record<keyof T, boolean>>
    );
    setTouched(allTouched);
    
    // Validate all fields
    const newErrors = validateAll();
    const hasErrors = Object.values(newErrors).some(e => e);
    
    if (hasErrors) {
      setIsSubmitting(false);
      return;
    }
    
    try {
      await onSubmit(values);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validateAll, onSubmit]);

  const resetForm = useCallback(() => {
    setValuesState(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  const isValid = useMemo(() => {
    if (!validationSchema || Object.keys(validationSchema).length === 0) return true;
    return Object.keys(validationSchema).every(key => !errors[key as keyof T]);
  }, [errors, validationSchema]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    setValue,
    setValues,
    setFieldTouched,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    validateField: validateFieldFn,
    validateAll,
  };
};

export default useForm;