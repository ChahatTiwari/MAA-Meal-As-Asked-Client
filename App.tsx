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

import AuthScreen from './src/screens/AuthScreen';
import ChatScreen from './src/screens/ChatScreen';
import PaymentScreen from './src/screens/PaymentScreen';
import ProfileScreen from './src/screens/ProfileScreen';

import LoadingSpinner from './src/components/LoadingSpinner';
import LocationPermissionModal from './src/components/locationPopup';

import { RootStackParamList } from './src/types';

const Stack = createStackNavigator<RootStackParamList>();

const AppContent: React.FC = () => {
  const dispatch = useAppDispatch();

  const { user, isLoading } = useAppSelector((state) => state.auth);
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
    return <LoadingSpinner text="Starting FoodChat..." />;
  }

  return (
    <PaperProvider>
      <StatusBar style={isDark ? 'light' : 'dark'} backgroundColor={colors.surface} />

      <NavigationContainer>

        {/* 👇 YOUR CUSTOM LOCATION MODAL */}
        {showLocationModal && (
          <LocationPermissionModal onClose={() => setShowLocationModal(false)} />
        )}

        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {user ? (
            <>
              <Stack.Screen name="Chat" component={ChatScreen} />
              <Stack.Screen name="Profile" component={ProfileScreen} />
              <Stack.Screen name="Payment" component={PaymentScreen} />
            </>
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
