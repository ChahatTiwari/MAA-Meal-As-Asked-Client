// screens/CookAvailabilityScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { Card, Text, Button, Appbar, Switch } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector } from '../hooks/redux';
import { RootStackParamList, Availability } from '../types';
import { cookApi } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import type { StackNavigationProp } from '@react-navigation/stack';

type NavigationProp = StackNavigationProp<RootStackParamList, 'CookAvailability'>;

const DAYS = [
  { value: 0, name: 'Sunday', short: 'Sun' },
  { value: 1, name: 'Monday', short: 'Mon' },
  { value: 2, name: 'Tuesday', short: 'Tue' },
  { value: 3, name: 'Wednesday', short: 'Wed' },
  { value: 4, name: 'Thursday', short: 'Thu' },
  { value: 5, name: 'Friday', short: 'Fri' },
  { value: 6, name: 'Saturday', short: 'Sat' },
];

const CookAvailabilityScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { colors } = useAppSelector((state) => state.theme);
  
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAvailabilities();
  }, []);

  const loadAvailabilities = async () => {
    try {
      setIsLoading(true);
      const response = await cookApi.getAvailabilities();
      if (response.data.success && response.data.availabilities) {
        setAvailabilities(response.data.availabilities);
      }
    } catch (error: any) {
      Alert.alert('Error', 'Failed to load availability');
    } finally {
      setIsLoading(false);
    }
  };

  const getAvailabilityForDay = (dayOfWeek: number) => {
    return availabilities.find(a => a.dayOfWeek === dayOfWeek);
  };

  const handleToggleAvailability = async (dayOfWeek: number, currentAvailability: Availability | undefined) => {
    const existing = currentAvailability;
    const newIsActive = !existing?.isActive;
    const startTime = existing?.startTime || '09:00';
    const endTime = existing?.endTime || '21:00';

    try {
      if (existing) {
        await cookApi.updateAvailability(existing.id, {
          dayOfWeek,
          startTime,
          endTime,
          isActive: newIsActive,
        });
        setAvailabilities(availabilities.map(a => 
          a.id === existing.id ? { ...a, isActive: newIsActive } : a
        ));
      } else {
        const response = await cookApi.createAvailability({
          dayOfWeek,
          startTime,
          endTime,
          isActive: true,
        });
        if (response.data.success && response.data.availability) {
          setAvailabilities([...availabilities, response.data.availability]);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update availability');
    }
  };

  const handleTimeChange = async (dayOfWeek: number, type: 'start' | 'end', time: string) => {
    const existing = getAvailabilityForDay(dayOfWeek);
    if (!existing) return;

    const newStartTime = type === 'start' ? time : existing.startTime;
    const newEndTime = type === 'end' ? time : existing.endTime;

    try {
      await cookApi.updateAvailability(existing.id, {
        dayOfWeek,
        startTime: newStartTime,
        endTime: newEndTime,
        isActive: existing.isActive,
      });
      setAvailabilities(availabilities.map(a => 
        a.id === existing.id ? { ...a, startTime: newStartTime, endTime: newEndTime } : a
      ));
    } catch (error) {
      Alert.alert('Error', 'Failed to update time');
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  if (isLoading) {
    return <LoadingSpinner text="Loading availability..." />;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Appbar.Header style={{ backgroundColor: colors.surface }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Availability" titleStyle={{ color: colors.text }} />
      </Appbar.Header>

      <ScrollView style={styles.content}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Set your available hours for each day
        </Text>

        {DAYS.map((day) => {
          const availability = getAvailabilityForDay(day.value);
          const isActive = availability?.isActive || false;
          const startTime = availability?.startTime || '09:00';
          const endTime = availability?.endTime || '21:00';

          return (
            <Card key={day.value} style={[styles.dayCard, { backgroundColor: colors.surface }]}>
              <View style={styles.dayHeader}>
                <View style={styles.dayInfo}>
                  <Text style={[styles.dayName, { color: colors.text }]}>{day.name}</Text>
                  <Text style={[styles.dayShort, { color: colors.textSecondary }]}>{day.short}</Text>
                </View>
                <Switch
                  value={isActive}
                  onValueChange={() => handleToggleAvailability(day.value, availability)}
                  trackColor={{ true: colors.primary }}
                  thumbColor={isActive ? colors.primary : undefined}
                />
              </View>

              {isActive && (
                <View style={styles.timeRow}>
                  <View style={styles.timePicker}>
                    <Text style={[styles.timeLabel, { color: colors.textSecondary }]}>From</Text>
                    <Button
                      mode="outlined"
                      onPress={() => {
                        // Use a simple time picker approach
                        const newTime = prompt('Enter start time (HH:MM 24hr):', startTime);
                        if (newTime && /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(newTime)) {
                          handleTimeChange(day.value, 'start', newTime);
                        }
                      }}
                      style={styles.timeButton}
                    >
                      <Text style={[styles.timeButtonText, { color: colors.text }]}>{formatTime(startTime)}</Text>
                    </Button>
                  </View>
                  <View style={styles.timeDivider}>
                    <Text style={[styles.timeDividerText, { color: colors.textSecondary }]}>to</Text>
                  </View>
                  <View style={styles.timePicker}>
                    <Text style={[styles.timeLabel, { color: colors.textSecondary }]}>To</Text>
                    <Button
                      mode="outlined"
                      onPress={() => {
                        const newTime = prompt('Enter end time (HH:MM 24hr):', endTime);
                        if (newTime && /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(newTime)) {
                          handleTimeChange(day.value, 'end', newTime);
                        }
                      }}
                      style={styles.timeButton}
                    >
                      <Text style={[styles.timeButtonText, { color: colors.text }]}>{formatTime(endTime)}</Text>
                    </Button>
                  </View>
                </View>
              )}
            </Card>
          );
        })}

        <Card style={[styles.tipCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.tipTitle, { color: colors.text }]}>💡 Tips</Text>
          <Text style={[styles.tipText, { color: colors.textSecondary }]}>
            • Set your available hours when you can accept and prepare orders
            <Text style={{ marginTop: 4 }}>• Customers can only order during your available hours</Text>
            <Text style={{ marginTop: 4 }}>• Keep your schedule updated to avoid cancellations</Text>
          </Text>
        </Card>
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
  sectionTitle: {
    fontSize: 16,
    marginBottom: 16,
    fontWeight: '500',
  },
  dayCard: {
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dayName: {
    fontSize: 18,
    fontWeight: '600',
  },
  dayShort: {
    fontSize: 14,
    backgroundColor: '#E0E0E0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
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
    paddingVertical: 8,
  },
  timeButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  timeDivider: {
    paddingHorizontal: 16,
  },
  timeDividerText: {
    fontSize: 16,
    fontWeight: '500',
  },
  tipCard: {
    borderRadius: 12,
    marginTop: 16,
    padding: 16,
    backgroundColor: '#FFF3E0',
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#E65100',
  },
  tipText: {
    fontSize: 14,
    lineHeight: 22,
  },
});

export default CookAvailabilityScreen;