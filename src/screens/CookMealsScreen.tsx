// screens/CookMealsScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Alert, Image, RefreshControl, Modal } from 'react-native';
import { Card, Text, Button, Appbar, FAB, IconButton, Switch } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector } from '../hooks/redux';
import { RootStackParamList, Meal } from '../types';
import { cookApi } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import type { StackNavigationProp } from '@react-navigation/stack';

type NavigationProp = StackNavigationProp<RootStackParamList, 'CookMeals'>;

const CookMealsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { colors } = useAppSelector((state) => state.theme);
  
  const [meals, setMeals] = useState<Meal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadMeals();
  }, []);

  const loadMeals = async () => {
    try {
      setIsLoading(true);
      const response = await cookApi.getMeals();
      if (response.data.success && response.data.meals) {
        setMeals(response.data.meals);
      }
    } catch (error: any) {
      Alert.alert('Error', 'Failed to load meals');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadMeals();
  };

  const [selectedMealId, setSelectedMealId] = useState<string | null>(null);
  const [showActions, setShowActions] = useState(false);

  const handleEditMeal = (meal: Meal) => {
    navigation.navigate('AddMeal', { mealId: meal.id });
  };

  const handleDeleteMeal = async (mealId: string) => {
    Alert.alert(
      'Delete Meal',
      'Are you sure you want to delete this meal?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await cookApi.deleteMeal(mealId);
              setMeals(meals.filter(m => m.id !== mealId));
              Alert.alert('Success', 'Meal deleted');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete meal');
            }
          },
        },
      ]
    );
  };

  const handleShowActions = (mealId: string) => {
    setSelectedMealId(mealId);
    setShowActions(true);
  };

  const handleActionPress = (action: 'edit' | 'delete') => {
    if (!selectedMealId) return;
    setShowActions(false);
    if (action === 'edit') {
      const meal = meals.find(m => m.id === selectedMealId);
      if (meal) handleEditMeal(meal);
    } else {
      handleDeleteMeal(selectedMealId);
    }
  };

  const handleToggleAvailability = async (meal: Meal) => {
    try {
      await cookApi.updateMeal(meal.id, { ...meal, isAvailable: !meal.isAvailable });
      setMeals(meals.map(m => m.id === meal.id ? { ...m, isAvailable: !m.isAvailable } : m));
    } catch (error) {
      Alert.alert('Error', 'Failed to update availability');
    }
  };

  const renderMeal = ({ item }: { item: Meal }) => (
    <Card style={[styles.mealCard, { backgroundColor: colors.surface }]}>
      <View style={styles.mealContent}>
        <View style={styles.mealMain}>
          {item.imageUrl && (
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.mealImage}
              resizeMode="cover"
            />
          )}
          <View style={styles.mealInfo}>
            <View style={styles.mealHeader}>
              <Text style={[styles.mealName, { color: colors.text }]}>{item.name}</Text>
              <View style={styles.mealBadges}>
                {item.isVegetarian && <Text style={[styles.badge, styles.veg]}>🌱 Veg</Text>}
                {item.isVegan && <Text style={[styles.badge, styles.vegan]}>🌿 Vegan</Text>}
                {!item.isAvailable && <Text style={[styles.badge, styles.unavailable]}>Unavailable</Text>}
              </View>
            </View>
            <Text style={[styles.mealCuisine, { color: colors.textSecondary }]}>
              {item.cuisine} • {item.category} • {item.spiceLevel}
            </Text>
            <Text style={[styles.mealDescription, { color: colors.textSecondary }]}>
              {item.description}
            </Text>
            <View style={styles.mealPriceRow}>
              <Text style={[styles.mealPrice, { color: colors.primary }]}>
                ₹{item.price}
                {item.originalPrice > item.price && (
                  <Text style={styles.originalPrice}> ₹{item.originalPrice}</Text>
                )}
              </Text>
              <Text style={[styles.mealServes, { color: colors.textSecondary }]}>
                Serves {item.serves} • {item.prepTimeMins} mins
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.mealActions}>
          <Switch
            value={item.isAvailable}
            onValueChange={() => handleToggleAvailability(item)}
            color={colors.primary}
          />
          <IconButton
            icon="dots-vertical"
            iconColor={colors.textSecondary}
            size={24}
            onPress={() => handleShowActions(item.id)}
          />
        </View>

        <Modal visible={showActions} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Button mode="text" onPress={() => handleActionPress('edit')}>
                <IconButton icon="pencil" size={20} iconColor={colors.text} />
                Edit
              </Button>
              <Button mode="text" onPress={() => handleActionPress('delete')}>
                <IconButton icon="delete" size={20} iconColor="#E74C3C" />
                Delete
              </Button>
              <Button mode="text" onPress={() => setShowActions(false)} style={styles.cancelButton}>
                Cancel
              </Button>
            </View>
          </View>
        </Modal>
      </View>
    </Card>
  );

  if (isLoading) {
    return <LoadingSpinner text="Loading meals..." />;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Appbar.Header style={{ backgroundColor: colors.surface }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="My Meals" titleStyle={{ color: colors.text }} />
      </Appbar.Header>

      <FlatList
        data={meals}
        keyExtractor={(item) => item.id}
        renderItem={renderMeal}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No meals yet
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
              Add your first meal to start receiving orders
            </Text>
          </View>
        }
      />

      <FAB
        style={[styles.fab, { backgroundColor: colors.primary }]}
        icon="plus"
        onPress={() => navigation.navigate('AddMeal')}
        label="Add Meal"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  mealCard: {
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  mealContent: {
    padding: 12,
  },
  mealMain: {
    flexDirection: 'row',
  },
  mealImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  mealInfo: {
    flex: 1,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  mealName: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  mealBadges: {
    flexDirection: 'row',
    gap: 4,
  },
  badge: {
    fontSize: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: '#E8F5E9',
  },
  veg: {
    backgroundColor: '#E8F5E9',
  },
  vegan: {
    backgroundColor: '#E8F5E9',
  },
  unavailable: {
    backgroundColor: '#FFEBEE',
  },
  mealCuisine: {
    fontSize: 12,
    marginBottom: 4,
  },
  mealDescription: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  mealPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mealPrice: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  originalPrice: {
    textDecorationLine: 'line-through',
    color: '#9E9E9E',
    fontSize: 14,
    fontWeight: 'normal',
    marginLeft: 4,
  },
  mealServes: {
    fontSize: 12,
  },
  mealActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
  },
  cancelButton: {
    marginTop: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 20,
  },
});

export default CookMealsScreen;