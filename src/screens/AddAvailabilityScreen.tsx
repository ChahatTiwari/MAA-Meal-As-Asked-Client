// screens/AddAvailabilityScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, ScrollView, Switch, TextInput } from 'react-native';
import { Card, Text, Button, Appbar } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAppSelector } from '../hooks/redux';
import { RootStackParamList, Availability } from '../types';
import { cookApi } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';

type NavigationProp = StackNavigationProp<RootStackParamList, 'AddAvailability'>;
type RoutePropType = RouteProp<RootStackParamList, 'AddAvailability'>;

const DAYS = [
  { value: 0, name: 'Sunday' },
  { value: 1, name: 'Monday' },
  { value: 2, name: 'Tuesday' },
  { value: 3, name: 'Wednesday' },
  { value: 4, name: 'Thursday' },
  { value: 5, name: 'Friday' },
  { value: 6, name: 'Saturday' },
];

const AddAvailabilityScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RoutePropType>();
  const { colors } = useAppSelector((state) => state.theme);
  
  const availabilityId = route.params?.availabilityId;
  const isEditing = !!availabilityId;

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    dayOfWeek: 0,
    startTime: '09:00',
    endTime: '21:00',
    isActive: true,
  });

  useEffect(() => {
    if (isEditing && availabilityId) {
      loadAvailability();
    }
  }, [availabilityId]);

  const loadAvailability = async () => {
    try {
      setIsLoading(true);
      const response = await cookApi.getAvailabilities();
      if (response.data.success && response.data.availabilities) {
        const availability = response.data.availabilities.find((a: Availability) => a.id === availabilityId);
        if (availability) {
          setFormData({
            dayOfWeek: availability.dayOfWeek,
            startTime: availability.startTime,
            endTime: availability.endTime,
            isActive: availability.isActive,
          });
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load availability');
    } finally {
      setIsLoading(false);
    }
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const data = {
        dayOfWeek: formData.dayOfWeek,
        startTime: formData.startTime,
        endTime: formData.endTime,
        isActive: formData.isActive,
      };

      if (isEditing) {
        await cookApi.updateAvailability(availabilityId!, data);
        Alert.alert('Success', 'Availability updated!');
      } else {
        await cookApi.createAvailability(data);
        Alert.alert('Success', 'Availability created!');
      }
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to save availability');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const showTimePicker = (field: 'startTime' | 'endTime') => {
    const [hours, minutes] = formData[field].split(':').map(Number);
    const is24Hours = true;
    
    // Simple time picker using prompt for now
    const newTime = prompt(`Enter ${field === 'startTime' ? 'start' : 'end'} time (HH:MM 24hr):`, formData[field]);
    if (newTime && /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(newTime)) {
      updateField(field, newTime);
    }
  };

  if (isLoading && !formData.dayOfWeek) {
    return <LoadingSpinner text="Loading availability..." />;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Appbar.Header style={{ backgroundColor: colors.surface }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={isEditing ? 'Edit Availability' : 'Add Availability'} titleStyle={{ color: colors.text }} />
      </Appbar.Header>

      <ScrollView style={styles.content}>
        <Card style={[styles.card, { backgroundColor: colors.surface }]}>
          <View style={styles.cardContent}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Select Day</Text>

            <View style={styles.daySelector}>
              {DAYS.map((day) => (
                <Button
                  key={day.value}
                  mode={formData.dayOfWeek === day.value ? 'contained' : 'outlined'}
                  onPress={() => updateField('dayOfWeek', day.value)}
                  style={[
                    styles.dayButton,
                    formData.dayOfWeek === day.value && { backgroundColor: colors.primary }
                  ]}
                >
                  <Text style={[
                    styles.dayButtonText,
                    formData.dayOfWeek === day.value ? { color: 'white' } : { color: colors.text }
                  ]}>
                    {day.name}
                  </Text>
                </Button>
              ))}
            </View>
          </View>
        </Card>

        <Card style={[styles.card, { backgroundColor: colors.surface }]}>
          <View style={styles.cardContent}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Available Hours</Text>

            <View style={styles.timeRow}>
              <View style={styles.timePicker}>
                <Text style={[styles.timeLabel, { color: colors.textSecondary }]}>From</Text>
                <Button
                  mode="outlined"
                  onPress={() => showTimePicker('startTime')}
                  style={styles.timeButton}
                >
                  <Text style={[styles.timeButtonText, { color: colors.text }]}>
                    {formatTime(formData.startTime)}
                  </Text>
                </Button>
              </View>
              <View style={styles.timeDivider}>
                <Text style={[styles.timeDividerText, { color: colors.textSecondary }]}>to</Text>
              </View>
              <View style={styles.timePicker}>
                <Text style={[styles.timeLabel, { color: colors.textSecondary }]}>To</Text>
                <Button
                  mode="outlined"
                  onPress={() => showTimePicker('endTime')}
                  style={styles.timeButton}
                >
                  <Text style={[styles.timeButtonText, { color: colors.text }]}>
                    {formatTime(formData.endTime)}
                  </Text>
                </Button>
              </View>
            </View>
          </View>
        </Card>

        <Card style={[styles.card, { backgroundColor: colors.surface }]}>
          <View style={styles.cardContent}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Status</Text>

            <View style={styles.switchRow}>
              <Text style={[styles.switchLabel, { color: colors.text }]}>Active</Text>
              <Switch
                value={formData.isActive}
                onValueChange={(value) => updateField('isActive', value)}
                trackColor={{ true: colors.primary }}
                thumbColor={formData.isActive ? colors.primary : undefined}
              />
            </View>

            <Text style={[styles.hintText, { color: colors.textSecondary }]}>
              When inactive, customers cannot place orders during this time slot
            </Text>
          </View>
        </Card>

        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={isLoading}
          style={[styles.submitButton, { backgroundColor: colors.primary }]}
        >
          {isEditing ? 'Update Availability' : 'Create Availability'}
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
    paddingBottom: 100,
  },
  card: {
    borderRadius: 12,
    marginBottom: 16,
  },
  cardContent: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  daySelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dayButton: {
    flex: 1,
    minWidth: '30%',
    paddingVertical: 8,
  },
  dayButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timePicker: {
    flex: 1,
  },
  timeLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  timeButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  timeButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  timeDivider: {
    paddingHorizontal: 8,
  },
  timeDividerText: {
    fontSize: 16,
    fontWeight: '500',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  switchLabel: {
    fontSize: 16,
  },
  hintText: {
    fontSize: 12,
    marginTop: 8,
    fontStyle: 'italic',
  },
  submitButton: {
    marginTop: 16,
    paddingVertical: 12,
  },
});

export default AddAvailabilityScreen;