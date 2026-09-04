// screens/CookProfileScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Text, Button, TextInput, Appbar, Avatar, Switch } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { RootStackParamList } from '../types';
import { cookApi } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import type { StackNavigationProp } from '@react-navigation/stack';

type NavigationProp = StackNavigationProp<RootStackParamList, 'CookProfile'>;

interface CookProfileData {
  id: string;
  userId: string;
  displayName: string;
  bio: string;
  profileImage: string;
  location: {
    type: string;
    coordinates: [number, number];
    address: string;
  };
  serviceRadiusKm: number;
  isActive: boolean;
  rating: number;
  totalOrders: number;
}

const CookProfileScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAppSelector((state) => state.auth);
  const { colors, isDark } = useAppSelector((state) => state.theme);

  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [cook, setCook] = useState<CookProfileData | null>(null);
  
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [serviceRadiusKm, setServiceRadiusKm] = useState('');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const response = await cookApi.getProfile();
      if (response.data.success && response.data.cook) {
        const cookData = response.data.cook;
        setCook(cookData);
        setDisplayName(cookData.displayName);
        setBio(cookData.bio || '');
        setAddress(cookData.location?.address || '');
        setLatitude(cookData.location?.coordinates[1]?.toString() || '');
        setLongitude(cookData.location?.coordinates[0]?.toString() || '');
        setServiceRadiusKm(cookData.serviceRadiusKm?.toString() || '5');
        setIsActive(cookData.isActive);
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        // No cook profile yet
        setCook(null);
      } else {
        Alert.alert('Error', 'Failed to load profile');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!displayName.trim()) {
      Alert.alert('Error', 'Display name is required');
      return;
    }

    try {
      setIsLoading(true);
      const data = {
        displayName: displayName.trim(),
        bio: bio.trim(),
        latitude: parseFloat(latitude) || 0,
        longitude: parseFloat(longitude) || 0,
        address: address.trim(),
        serviceRadiusKm: parseFloat(serviceRadiusKm) || 5,
      };

      if (cook) {
        await cookApi.updateProfile(data);
      } else {
        await cookApi.registerCook({ ...data, isActive });
      }

      Alert.alert('Success', cook ? 'Profile updated!' : 'Cook profile created!');
      setIsEditing(false);
      loadProfile();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to save profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigateMeals = () => navigation.navigate('CookMeals');
  const handleNavigateAvailability = () => navigation.navigate('CookAvailability');
  const handleNavigateOrders = () => navigation.navigate('CookOrders');

  if (isLoading) {
    return <LoadingSpinner text="Loading profile..." />;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Appbar.Header style={{ backgroundColor: colors.surface }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Cook Profile" titleStyle={{ color: colors.text }} />
      </Appbar.Header>

      <ScrollView style={styles.content}>
        {cook ? (
          // Existing profile view
          <>
            <Card style={[styles.profileCard, { backgroundColor: colors.surface }]}>
              <View style={styles.profileHeader}>
                <Avatar.Text
                  size={80}
                  label={displayName?.charAt(0) || 'C'}
                  style={{ backgroundColor: colors.primary }}
                />
                <Text style={[styles.userName, { color: colors.text }]}>
                  {displayName}
                </Text>
                <Text style={[styles.userBio, { color: colors.textSecondary }]}>
                  {bio || 'No bio yet'}
                </Text>
                <View style={styles.statsContainer}>
                  <View style={styles.statItem}>
                    <Text style={[styles.statValue, { color: colors.text }]}>{cook.rating.toFixed(1)} ⭐</Text>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Rating</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={[styles.statValue, { color: colors.text }]}>{cook.totalOrders}</Text>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Orders</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={[styles.statValue, { color: colors.text }]}>
                      {cook.isActive ? 'Active' : 'Inactive'}
                    </Text>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Status</Text>
                  </View>
                </View>
              </View>
            </Card>

            <Card style={[styles.sectionCard, { backgroundColor: colors.surface }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Location & Service</Text>
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Address:</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>{address || 'Not set'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Service Radius:</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>{serviceRadiusKm} km</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Coordinates:</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>{latitude}, {longitude}</Text>
              </View>
            </Card>

            <Card style={[styles.sectionCard, { backgroundColor: colors.surface }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
              <View style={styles.buttonRow}>
                <Button
                  mode="outlined"
                  onPress={handleNavigateMeals}
                  style={styles.actionButton}
                  icon="food"
                >
                  My Meals
                </Button>
                <Button
                  mode="outlined"
                  onPress={handleNavigateAvailability}
                  style={styles.actionButton}
                  icon="calendar-clock"
                >
                  Availability
                </Button>
              </View>
              <View style={styles.buttonRow}>
                <Button
                  mode="outlined"
                  onPress={handleNavigateOrders}
                  style={styles.actionButton}
                  icon="package-variant"
                >
                  My Orders
                </Button>
                <Button
                  mode="contained"
                  onPress={() => setIsEditing(true)}
                  style={[styles.actionButton, { backgroundColor: colors.primary }]}
                  icon="pencil"
                >
                  Edit Profile
                </Button>
              </View>
            </Card>

            {isActive && (
              <Card style={[styles.sectionCard, { backgroundColor: colors.surface }]}>
                <View style={styles.statusRow}>
                  <Text style={[styles.statusText, { color: colors.text }]}>Accepting Orders</Text>
                  <Switch
                    value={isActive}
                    onValueChange={(value) => {
                      setIsActive(value);
                      if (cook) {
                        cookApi.updateProfile({
                          displayName,
                          bio,
                          latitude: parseFloat(latitude) || 0,
                          longitude: parseFloat(longitude) || 0,
                          address,
                          serviceRadiusKm: parseFloat(serviceRadiusKm) || 5,
                        });
                      }
                    }}
                    color={colors.primary}
                  />
                </View>
              </Card>
            )}
          </>
        ) : (
          // Create profile view
          <Card style={[styles.profileCard, { backgroundColor: colors.surface }]}>
            <View style={styles.profileHeader}>
              <Avatar.Text
                size={80}
                label={user?.name?.charAt(0) || 'C'}
                style={{ backgroundColor: colors.primary }}
              />
              <Text style={[styles.userName, { color: colors.text }]}>
                {user?.name || 'Home Cook'}
              </Text>
              <Text style={[styles.userBio, { color: colors.textSecondary }]}>
                Start your home cooking business
              </Text>
            </View>

            <View style={styles.formContainer}>
              <Text style={[styles.formTitle, { color: colors.text }]}>Create Your Cook Profile</Text>
              
              <TextInput
                label="Display Name"
                value={displayName}
                onChangeText={setDisplayName}
                mode="outlined"
                style={styles.input}
              />

              <TextInput
                label="Bio"
                value={bio}
                onChangeText={setBio}
                mode="outlined"
                style={styles.input}
                multiline
                placeholder="Tell customers about yourself and your cooking..."
              />

              <Text style={[styles.formSectionTitle, { color: colors.text }]}>Location</Text>
              <TextInput
                label="Address"
                value={address}
                onChangeText={setAddress}
                mode="outlined"
                style={styles.input}
                placeholder="Your full address for delivery"
              />

              <View style={styles.coordRow}>
                <TextInput
                  label="Latitude"
                  value={latitude}
                  onChangeText={setLatitude}
                  mode="outlined"
                  style={[styles.input, styles.halfInput]}
                  keyboardType="decimal-pad"
                  placeholder="e.g., 28.6139"
                />
                <TextInput
                  label="Longitude"
                  value={longitude}
                  onChangeText={setLongitude}
                  mode="outlined"
                  style={[styles.input, styles.halfInput]}
                  keyboardType="decimal-pad"
                  placeholder="e.g., 77.2090"
                />
              </View>

              <TextInput
                label="Service Radius (km)"
                value={serviceRadiusKm}
                onChangeText={setServiceRadiusKm}
                mode="outlined"
                style={styles.input}
                keyboardType="numeric"
                placeholder="5"
              />

              <Switch
                value={isActive}
                onValueChange={setIsActive}
                color={colors.primary}
              >
                <Text style={[styles.switchLabel, { color: colors.text }]}>Accept Orders</Text>
              </Switch>

              <Button
                mode="contained"
                onPress={handleSave}
                loading={isLoading}
                style={[styles.submitButton, { backgroundColor: colors.primary }]}
              >
                Create Profile
              </Button>
            </View>
          </Card>
        )}
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
  userBio: {
    fontSize: 16,
    marginTop: 4,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  sectionCard: {
    borderRadius: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 16,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    gap: 8,
  },
  actionButton: {
    flex: 1,
  },
  formContainer: {
    padding: 16,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  formSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 8,
  },
  coordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  halfInput: {
    flex: 1,
  },
  switchLabel: {
    fontSize: 16,
    marginLeft: 8,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '500',
  },
  submitButton: {
    marginTop: 24,
    paddingVertical: 12,
  },
});

export default CookProfileScreen;