// screens/AuthScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Text, Card, Switch, HelperText } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { login, signup, clearError } from '../store/slices/authSlice';
import { toggleTheme } from '../store/slices/themeSlice';
import LoadingSpinner from '../components/LoadingSpinner';
import { DEMO_ACCOUNTS } from '../services/mockData';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

const AuthScreen: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [nameError, setNameError] = useState('');

  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  const { colors, isDark } = useAppSelector((state) => state.theme);

  // Clear error when switching between login/signup
  useEffect(() => {
    dispatch(clearError());
    setEmailError('');
    setPasswordError('');
    setNameError('');
  }, [isLogin, dispatch]);

  const validateEmail = (value: string): string => {
    if (!value.trim()) return 'Email is required';
    if (!EMAIL_REGEX.test(value.trim())) return 'Please enter a valid email address';
    return '';
  };

  const validatePassword = (value: string): string => {
    if (!value) return 'Password is required';
    if (value.length < MIN_PASSWORD_LENGTH) return `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
    return '';
  };

  const validateName = (value: string): string => {
    if (!value.trim()) return 'Full name is required';
    if (value.trim().length < 2) return 'Name must be at least 2 characters';
    return '';
  };

  const handleSubmit = async () => {
    // Clear previous errors
    setEmailError('');
    setPasswordError('');
    setNameError('');

    // Validate all fields
    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);
    const nameErr = isLogin ? '' : validateName(name);

    setEmailError(emailErr);
    setPasswordError(passwordErr);
    setNameError(nameErr);

    // If any validation fails, show alert and stop
    if (emailErr || passwordErr || nameErr) {
      Alert.alert('Validation Error', emailErr || passwordErr || nameErr);
      return;
    }

    try {
      if (isLogin) {
        await dispatch(login({ email: email.trim(), password })).unwrap();
      } else {
        await dispatch(signup({ email: email.trim(), password, name: name.trim() })).unwrap();
      }
    } catch (err: any) {
      // Show the specific error from the store if available
      const errorMessage = err?.message || error || 'Authentication failed. Please try again.';
      Alert.alert('Error', errorMessage);
    }
  };

  const handleToggleMode = () => {
    setIsLogin(!isLogin);
  };

  const handleDemoFill = (email: string, password: string) => {
    setEmail(email);
    setPassword(password);
    setEmailError('');
    setPasswordError('');
  };

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  if (isLoading) {
    return <LoadingSpinner text={isLogin ? 'Signing in...' : 'Creating account...'} />;
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>🍽️ MAA</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            AI-powered food ordering
          </Text>
        </View>

        <Card style={[styles.card, { backgroundColor: colors.surface }]}>
          <View style={styles.cardContent}>
            <View style={styles.toggleContainer}>
              <Text style={[styles.toggleText, { color: colors.text }]}>
                {isLogin ? 'Sign In' : 'Sign Up'}
              </Text>
              <Switch
                value={!isLogin}
                onValueChange={handleToggleMode}
                color={colors.primary}
              />
            </View>

            {!isLogin && (
              <>
                <TextInput
                  label="Full Name"
                  value={name}
                  onChangeText={(text) => {
                    setName(text);
                    if (nameError) setNameError('');
                  }}
                  mode="outlined"
                  style={styles.input}
                  error={!!nameError}
                />
                {!!nameError && (
                  <HelperText type="error" visible={!!nameError}>
                    {nameError}
                  </HelperText>
                )}
              </>
            )}

            <TextInput
              label="Email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (emailError) setEmailError('');
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              mode="outlined"
              style={styles.input}
              error={!!emailError}
            />
            {!!emailError && (
              <HelperText type="error" visible={!!emailError}>
                {emailError}
              </HelperText>
            )}

            <TextInput
              label="Password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (passwordError) setPasswordError('');
              }}
              secureTextEntry
              mode="outlined"
              style={styles.input}
              error={!!passwordError}
            />
            {!!passwordError && (
              <HelperText type="error" visible={!!passwordError}>
                {passwordError}
              </HelperText>
            )}

            {!!error && (
              <HelperText type="error" visible={!!error} style={styles.storeError}>
                {error}
              </HelperText>
            )}

            <Button
              mode="contained"
              onPress={handleSubmit}
              disabled={isLoading}
              loading={isLoading}
              style={[styles.submitButton, { backgroundColor: colors.primary }]}
              contentStyle={styles.buttonContent}
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </Button>

            {isLogin && (
              <View style={styles.demoSection}>
                <Text style={[styles.demoTitle, { color: colors.textSecondary }]}>
                  🎬 Demo Accounts
                </Text>
                <View style={styles.demoButtons}>
                  {DEMO_ACCOUNTS.map((account) => (
                    <Button
                      key={account.email}
                      mode="outlined"
                      onPress={() => handleDemoFill(account.email, account.password)}
                      style={styles.demoButton}
                      textColor={colors.primary}
                    >
                      {account.label}
                    </Button>
                  ))}
                </View>
                <Text style={[styles.demoHint, { color: colors.textSecondary }]}>
                  Tap to fill credentials, then press Sign In
                </Text>
              </View>
            )}
          </View>
        </Card>

        <View style={styles.themeToggle}>
          <Text style={[styles.themeText, { color: colors.textSecondary }]}>
            Dark Mode
          </Text>
          <Switch
            value={isDark}
            onValueChange={handleToggleTheme}
            color={colors.primary}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    minHeight: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  card: {
    borderRadius: 16,
    elevation: 4,
  },
  cardContent: {
    padding: 20,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  toggleText: {
    fontSize: 18,
    fontWeight: '600',
  },
  input: {
    marginBottom: 4,
  },
  submitButton: {
    marginTop: 16,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  storeError: {
    marginTop: 8,
    textAlign: 'center',
  },
  demoSection: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
  },
  demoButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  demoButton: {
    flex: 1,
  },
  demoHint: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
  themeToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 30,
    paddingHorizontal: 4,
  },
  themeText: {
    fontSize: 16,
  },
});

export default AuthScreen;