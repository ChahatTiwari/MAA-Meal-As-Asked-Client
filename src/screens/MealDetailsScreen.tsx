// screens/MealDetailsScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Text, Button, Appbar, Chip, Avatar } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { RootStackParamList, Meal } from '../types';
import { cookApi } from '../services/api';
import { addUserMessage, sendMessage } from '../store/slices/chatSlice';
import LoadingSpinner from '../components/LoadingSpinner';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';

type NavigationProp = StackNavigationProp<RootStackParamList, 'MealDetails'>;
type RoutePropType = RouteProp<RootStackParamList, 'MealDetails'>;

const MealDetailsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RoutePropType>();
  const dispatch = useAppDispatch();
  const { colors } = useAppSelector((state) => state.theme);
  
  const cook = route.params?.cook;
  const [meals, setMeals] = useState<Meal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMeals();
  }, [cook]);

  const loadMeals = async () => {
    try {
      setIsLoading(true);
      const response = await cookApi.getMeals();
      if (response.data.success && response.data.meals) {
        setMeals(response.data.meals);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load meals');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOrder = async (meal: Meal) => {
    // Navigate to chat with pre-filled message about this meal
    const message = `I'd like to order ${meal.name} from ${cook?.displayName}. It serves ${meal.serves} people for ₹${meal.price}.`;
    
    dispatch(addUserMessage(message));
    dispatch(sendMessage({ message }));
    
    navigation.navigate('Chat');
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'veg': return '#4CAF50';
      case 'vegan': return '#8BC34A';
      case 'non-veg': return '#FF5722';
      case 'dessert': return '#E91E63';
      case 'beverage': return '#2196F3';
      default: return '#9E9E9E';
    }
  };

  if (isLoading) {
    return <LoadingSpinner text="Loading meals..." />;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Appbar.Header style={{ backgroundColor: colors.surface }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={cook?.displayName || 'Meals'} titleStyle={{ color: colors.text }} />
      </Appbar.Header>

      <ScrollView style={styles.content}>
        {cook && (
          <Card style={[styles.cookCard, { backgroundColor: colors.surface }]}>
            <View style={styles.cookHeader}>
              <Avatar.Text
                size={50}
                label={cook.displayName?.charAt(0) || 'C'}
                style={{ backgroundColor: colors.primary }}
              />
              <View style={styles.cookInfo}>
                <Text style={[styles.cookName, { color: colors.text }]}>{cook.displayName}</Text>
                <Text style={[styles.cookBio, { color: colors.textSecondary }]}>{cook.bio || 'Home cook'}</Text>
                <View style={styles.cookMeta}>
                  <Text style={[styles.metaItem, { color: colors.textSecondary }]}>
                    ⭐ {cook.rating.toFixed(1)} • {cook.totalOrders} orders
                  </Text>
                  <Text style={[styles.metaItem, { color: colors.textSecondary }]}>
                    📍 {cook.serviceRadiusKm}km radius
                  </Text>
                </View>
              </View>
            </View>
          </Card>
        )}

        <Text style={[styles.sectionTitle, { color: colors.text }, { marginLeft: 4 }]}>Available Meals</Text>

        {meals.map((meal) => (
          <Card key={meal.id} style={[styles.mealCard, { backgroundColor: colors.surface }]}>
            <View style={styles.mealContent}>
              <View style={styles.mealHeader}>
                <Text style={[styles.mealName, { color: colors.text }]}>{meal.name}</Text>
                <View style={styles.mealBadges}>
                  <Chip
                    style={[styles.categoryChip, { backgroundColor: getCategoryColor(meal.category) + '20' }]}
                    textStyle={[styles.categoryChipText, { color: getCategoryColor(meal.category) }]}
                  >
                    {meal.category}
                  </Chip>
                  {meal.isVegetarian && (
                    <Chip icon="leaf" style={styles.dietChip}>
                      Veg
                    </Chip>
                  )}
                  {meal.isVegan && (
                    <Chip icon="leaf" style={styles.dietChip}>
                      Vegan
                    </Chip>
                  )}
                </View>
              </View>

              <Text style={[styles.mealDescription, { color: colors.textSecondary }]}>
                {meal.description}
              </Text>

              <View style={styles.mealMeta}>
                <View style={styles.metaRow}>
                  <Text style={[styles.metaLabel, { color: colors.textSecondary }]}>Cuisine:</Text>
                  <Text style={[styles.metaValue, { color: colors.text }]}>{meal.cuisine}</Text>
                </View>
                <View style={styles.metaRow}>
                  <Text style={[styles.metaLabel, { color: colors.textSecondary }]}>Spice:</Text>
                  <Text style={[styles.metaValue, { color: colors.text }]}>{meal.spiceLevel}</Text>
                </View>
                <View style={styles.metaRow}>
                  <Text style={[styles.metaLabel, { color: colors.textSecondary }]}>Prep Time:</Text>
                  <Text style={[styles.metaValue, { color: colors.text }]}>{meal.prepTimeMins} mins</Text>
                </View>
                <View style={styles.metaRow}>
                  <Text style={[styles.metaLabel, { color: colors.textSecondary }]}>Serves:</Text>
                  <Text style={[styles.metaValue, { color: colors.text }]}>{meal.serves} people</Text>
                </View>
              </View>

              {meal.ingredients.length > 0 && (
                <View style={styles.ingredientsSection}>
                  <Text style={[styles.ingredientsTitle, { color: colors.text }]}>Ingredients</Text>
                  <View style={styles.ingredientsChips}>
                    {meal.ingredients.slice(0, 8).map((ing: string, i: number) => (
                      <Chip key={i} style={styles.ingredientChip}>{ing}</Chip>
                    ))}
                    {meal.ingredients.length > 8 && (
                      <Chip style={styles.ingredientChip}>{`+${meal.ingredients.length - 8} more`}</Chip>
                    )}
                  </View>
                </View>
              )}

              {meal.allergens.length > 0 && (
                <View style={styles.allergensSection}>
                  <Text style={[styles.allergensTitle, { color: '#E74C3C' }]}>Allergens: {meal.allergens.join(', ')}</Text>
                </View>
              )}

              <View style={styles.mealFooter}>
                <View style={styles.priceContainer}>
                  <Text style={[styles.mealPrice, { color: colors.primary }]}>₹{meal.price}</Text>
                  {meal.originalPrice > meal.price && (
                    <Text style={styles.originalPrice}>₹{meal.originalPrice}</Text>
                  )}
                </View>
                <Button
                  mode="contained"
                  onPress={() => handleOrder(meal)}
                  disabled={!meal.isAvailable}
                  style={[styles.orderButton, { backgroundColor: colors.primary }]}
                  icon="cart-plus"
                >
                  {meal.isAvailable ? 'Order Now' : 'Unavailable'}
                </Button>
              </View>
            </View>
          </Card>
        ))}
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
    paddingBottom: 20,
  },
  cookCard: {
    borderRadius: 12,
    marginBottom: 16,
  },
  cookHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  cookInfo: {
    flex: 1,
    marginLeft: 12,
  },
  cookName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  cookBio: {
    fontSize: 14,
    marginTop: 2,
  },
  cookMeta: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
  },
  metaItem: {
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 8,
  },
  mealCard: {
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  mealContent: {
    padding: 16,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  mealName: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  mealBadges: {
    flexDirection: 'row',
    gap: 4,
  },
  categoryChip: {
    // Chip styles
  },
  categoryChipText: {
    fontWeight: '600',
  },
  dietChip: {
    backgroundColor: '#E8F5E9',
  },
  mealDescription: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 12,
  },
  mealMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  metaRow: {
    flexDirection: 'row',
    gap: 4,
  },
  metaLabel: {
    fontSize: 13,
  },
  metaValue: {
    fontSize: 13,
    fontWeight: '500',
  },
  ingredientsSection: {
    marginBottom: 12,
  },
  ingredientsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  ingredientsChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  ingredientChip: {
    backgroundColor: '#F5F5F5',
  },
  allergensSection: {
    marginBottom: 12,
    padding: 8,
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
  },
  allergensTitle: {
    fontSize: 13,
    fontWeight: '500',
  },
  mealFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  mealPrice: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  originalPrice: {
    textDecorationLine: 'line-through',
    color: '#9E9E9E',
    fontSize: 16,
  },
  orderButton: {
    flex: 1,
    minWidth: 120,
  },
});

export default MealDetailsScreen;