// screens/ProfileScreen.tsx
import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Text, Button, List, Avatar, Appbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { logout } from '../store/slices/authSlice';
import { toggleTheme } from '../store/slices/themeSlice';
import { resetChat } from '../store/slices/chatSlice';

const ProfileScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const { user } = useAppSelector((state) => state.auth);
  const { colors, isDark } = useAppSelector((state) => state.theme);

  const handleClearChat = () => {
    dispatch(resetChat());
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  const handleOrderHistory = () => {
    Alert.alert(
      'Order History',
      'Your past orders will appear here once the backend is connected.',
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Appbar.Header style={{ backgroundColor: colors.surface }}>
        <Appbar.Content 
          title="Profile" 
          titleStyle={{ color: colors.text }}
        />
      </Appbar.Header>

      <ScrollView style={styles.content}>
        <Card style={[styles.profileCard, { backgroundColor: colors.surface }]}>
          <View style={styles.profileHeader}>
            <Avatar.Text 
              size={80} 
              label={user?.name?.charAt(0) || 'U'} 
              style={{ backgroundColor: colors.primary }}
            />
            <Text style={[styles.userName, { color: colors.text }]}>
              {user?.name || 'User'}
            </Text>
            <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
              {user?.email}
            </Text>
          </View>
        </Card>

        <Card style={[styles.settingsCard, { backgroundColor: colors.surface }]}>
          <List.Item
            title="Dark Mode"
            description="Toggle app theme"
            left={props => <List.Icon {...props} icon="theme-light-dark" color={colors.text} />}
            right={() => (
              <Button onPress={handleToggleTheme}>
                {isDark ? 'Disable' : 'Enable'}
              </Button>
            )}
            titleStyle={{ color: colors.text }}
            descriptionStyle={{ color: colors.textSecondary }}
          />
          
          <List.Item
            title="Clear Chat History"
            description="Remove all chat messages"
            left={props => <List.Icon {...props} icon="delete" color={colors.text} />}
            right={() => (
              <Button onPress={handleClearChat} textColor={colors.primary}>
                Clear
              </Button>
            )}
            titleStyle={{ color: colors.text }}
            descriptionStyle={{ color: colors.textSecondary }}
          />
          
          <List.Item
            title="Order History"
            description="View past orders"
            left={props => <List.Icon {...props} icon="history" color={colors.text} />}
            right={props => <List.Icon {...props} icon="chevron-right" color={colors.textSecondary} />}
            onPress={handleOrderHistory}
            titleStyle={{ color: colors.text }}
            descriptionStyle={{ color: colors.textSecondary }}
          />
        </Card>

        <Button
          mode="contained"
          onPress={handleLogout}
          style={[styles.logoutButton, { backgroundColor: '#E74C3C' }]}
          icon="logout"
        >
          Sign Out
        </Button>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  profileCard: {
    borderRadius: 12,
    marginBottom: 16,
  },
  profileHeader: {
    alignItems: 'center',
    padding: 24,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 12,
  },
  userEmail: {
    fontSize: 16,
    marginTop: 4,
  },
  settingsCard: {
    borderRadius: 12,
    marginBottom: 16,
  },
  logoutButton: {
    marginTop: 20,
    padding: 4,
  },
});

export default ProfileScreen;