// App.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as ReduxProvider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { store } from '../client/src/store';

import { useAppDispatch, useAppSelector } from './src/hooks/redux';
import { checkAuthState } from './src/store/slices/authSlice';

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
import MealDetailsScreen from '../client/src/screens/MealDetailsScreen';
import OrderConfirmationScreen from './src/screens/OrderConfirmationScreen';

import LoadingSpinner from './src/components/LoadingSpinner';
import LocationPermissionModal from './src/components/locationPopup';

import { RootStackParamList, UserRole } from './src/types';

const Stack = createStackNavigator<RootStackParamList>();

const AppContent: React.FC = () => {
  const dispatch = useAppDispatch();

  const { user, role, isLoading } = useAppSelector((state) => state.auth);
  const { colors, isDark } = useAppSelector((state) => state.theme);

  // 👇 ADD THIS — to control your modal
  const [showLocationModal, setShowLocationModal] = useState(false);
  const hasShownLocationModal = useRef(false);

  useEffect(() => {
    dispatch(checkAuthState());
  }, [dispatch]);

  // 👇 Open permission modal only on fresh login (not on app restart)
  useEffect(() => {
    if (user && !hasShownLocationModal.current) {
      hasShownLocationModal.current = true;
      setShowLocationModal(true);
    }
  }, [user]);

  if (isLoading) {
    return <LoadingSpinner text="Starting MAA..." />;
  }

  return (
    <PaperProvider>
      <StatusBar style={isDark ? 'light' : 'dark'} backgroundColor={colors.surface} />

      <NavigationContainer>

        {/* 👇 YOUR CUSTOM LOCATION MODAL */}
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
