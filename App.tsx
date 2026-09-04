// App.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as ReduxProvider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { store } from './src/store';

import { useAppDispatch, useAppSelector } from './src/hooks/redux';
import { checkAuthState } from './src/store/slices/authSlice';
import { ToastProvider } from './src/components/feedback/Toast';

import AuthScreen from './src/screens/AuthScreen';
import ChatScreen from './src/screens/ChatScreen';
import PaymentScreen from './src/screens/PaymentScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import CookDashboardScreen from './src/screens/CookDashboardScreen';
import CookProfileScreen from './src/screens/CookProfileScreen';
import CookMealsScreen from './src/screens/CookMealsScreen';
import CookAvailabilityScreen from './src/screens/CookAvailabilityScreen';
import CookOrdersScreen from './src/screens/CookOrdersScreen';
import AddMealScreen from './src/screens/AddMealScreen';
import AddAvailabilityScreen from './src/screens/AddAvailabilityScreen';
import NearbyCooksScreen from './src/screens/NearbyCooksScreen';
import MealDetailsScreen from './src/screens/MealDetailsScreen';
import OrderConfirmationScreen from './src/screens/OrderConfirmationScreen';

import LoadingSpinner from './src/components/LoadingSpinner';
import LocationPermissionModal from './src/components/locationPopup';

import { RootStackParamList, UserRole } from './src/types';
import { theme } from './src/theme';

const Stack = createStackNavigator<RootStackParamList>();

// Paper theme
const paperTheme = {
  ...theme.colors.light,
  colors: {
    primary: theme.colors.light.primary,
    secondary: theme.colors.light.secondary,
    error: theme.colors.light.error,
    warning: theme.colors.light.warning,
    success: theme.colors.light.success,
    background: theme.colors.light.background,
    surface: theme.colors.light.surface,
    text: theme.colors.light.text,
    textSecondary: theme.colors.light.textSecondary,
    onPrimary: theme.colors.light.onPrimary,
    onSurface: theme.colors.light.onSurface,
    onBackground: theme.colors.light.onBackground,
    onError: theme.colors.light.onError,
    disabled: theme.colors.light.textDisabled,
    placeholder: theme.colors.light.textDisabled,
    backdrop: theme.colors.light.overlay,
    notification: theme.colors.light.error,
  },
};

const darkPaperTheme = {
  ...theme.colors.dark,
  colors: {
    primary: theme.colors.dark.primary,
    secondary: theme.colors.dark.secondary,
    error: theme.colors.dark.error,
    warning: theme.colors.dark.warning,
    success: theme.colors.dark.success,
    background: theme.colors.dark.background,
    surface: theme.colors.dark.surface,
    text: theme.colors.dark.text,
    textSecondary: theme.colors.dark.textSecondary,
    onPrimary: theme.colors.dark.onPrimary,
    onSurface: theme.colors.dark.onSurface,
    onBackground: theme.colors.dark.onBackground,
    onError: theme.colors.dark.onError,
    disabled: theme.colors.dark.textDisabled,
    placeholder: theme.colors.dark.textDisabled,
    backdrop: theme.colors.dark.overlay,
    notification: theme.colors.dark.error,
  },
};

const AppContent: React.FC = () => {
  const dispatch = useAppDispatch();

  const { user, role, isLoading } = useAppSelector((state) => state.auth);
  const { colors, isDark } = useAppSelector((state) => state.theme);

  const [showLocationModal, setShowLocationModal] = useState(false);
  const hasShownLocationModal = useRef(false);

  useEffect(() => {
    dispatch(checkAuthState());
  }, [dispatch]);

  useEffect(() => {
    if (user && !hasShownLocationModal.current) {
      hasShownLocationModal.current = true;
      setShowLocationModal(true);
    }
  }, [user]);

  if (isLoading) {
    return <LoadingSpinner text="Starting MAA..." />;
  }

  const currentTheme = isDark ? darkPaperTheme : paperTheme;

  return (
    <PaperProvider theme={currentTheme}>
      <StatusBar style={isDark ? 'light' : 'dark'} backgroundColor={colors.surface} />

      <ToastProvider>
        <NavigationContainer>
          {showLocationModal && (
            <LocationPermissionModal onClose={() => setShowLocationModal(false)} />
          )}

          <Stack.Navigator
            screenOptions={{ headerShown: false }}
            initialRouteName={user ? (role === 'cook' ? 'CookDashboard' : 'Chat') : 'Auth'}
          >
            {user ? (
              role === 'cook' ? (
                <>
                  <Stack.Screen name="CookDashboard" component={CookDashboardScreen} />
                  <Stack.Screen name="CookProfile" component={CookProfileScreen} />
                  <Stack.Screen name="CookMeals" component={CookMealsScreen} />
                  <Stack.Screen name="CookAvailability" component={CookAvailabilityScreen} />
                  <Stack.Screen name="CookOrders" component={CookOrdersScreen} />
                  <Stack.Screen name="AddMeal" component={AddMealScreen} />
                  <Stack.Screen name="AddAvailability" component={AddAvailabilityScreen} />
                </>
              ) : (
                <>
                  <Stack.Screen name="Chat" component={ChatScreen} />
                  <Stack.Screen name="Profile" component={ProfileScreen} />
                  <Stack.Screen name="Payment" component={PaymentScreen} />
                  <Stack.Screen name="OrderConfirmation" component={OrderConfirmationScreen} />
                  <Stack.Screen name="NearbyCooks" component={NearbyCooksScreen} />
                  <Stack.Screen name="MealDetails" component={MealDetailsScreen} />
                </>
              )
            ) : (
              <Stack.Screen name="Auth" component={AuthScreen} />
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </ToastProvider>
    </PaperProvider>
  );
};

const App: React.FC = () => {
  return (
    <ReduxProvider store={store}>
      <AppContent />
    </ReduxProvider>
  );
};

export default App;