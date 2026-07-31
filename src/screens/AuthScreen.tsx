// screens/AuthScreen.tsx
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Text, Card, Switch } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { login, signup, clearError } from '../store/slices/authSlice';
import { toggleTheme } from '../store/slices/themeSlice';
import LoadingSpinner from '../components/LoadingSpinner';

const AuthScreen: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  const { colors, isDark } = useAppSelector((state) => state.theme);

  const handleSubmit = async () => {
    if (!email || !password || (!isLogin && !name)) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      if (isLogin) {
        await dispatch(login({ email, password })).unwrap();
      } else {
        await dispatch(signup({ email, password, name })).unwrap();
      }
    } catch (error) {
      Alert.alert('Error', 'Authentication failed. Please try again.');
    }
  };

  if (isLoading) {
    return <LoadingSpinner text={isLogin ? 'Signing in...' : 'Creating account...'} />;
  }
const handleToggleTheme = () => {
  dispatch(toggleTheme());
};
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
                onValueChange={() => setIsLogin(!isLogin)}
                color={colors.primary}
              />
            </View>

            {!isLogin && (
              <TextInput
                label="Full Name"
                value={name}
                onChangeText={setName}
                mode="outlined"
                style={styles.input}
              />
            )}

            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              mode="outlined"
              style={styles.input}
            />

            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              mode="outlined"
              style={styles.input}
            />

            <Button
              mode="contained"
              onPress={handleSubmit}
              style={[styles.submitButton, { backgroundColor: colors.primary }]}
              contentStyle={styles.buttonContent}
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </Button>
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
    marginBottom: 16,
  },
  submitButton: {
    marginTop: 8,
  },
  buttonContent: {
    paddingVertical: 8,
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