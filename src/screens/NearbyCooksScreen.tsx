// screens/NearbyCooksScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Alert, ScrollView, Switch, TextInput, SafeAreaView } from 'react-native';
import { Card, Text, Button, Appbar, Chip, Avatar, IconButton } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAppSelector } from '../hooks/redux';
import { RootStackParamList, Cook, Meal } from '../types';
import { cookApi } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';

type NavigationProp = StackNavigationProp<RootStackParamList, 'NearbyCooks'>;
type RoutePropType = RouteProp<RootStackParamList, 'NearbyCooks'>;

const CATEGORIES = ['All', 'veg', 'non-veg', 'vegan', 'dessert', 'snack'];
const CUISINES = ['All', 'indian', 'chinese', 'italian', 'mexican', 'thai'];

const NearbyCooksScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RoutePropType>();
  const { colors } = useAppSelector((state) => state.theme);
  
  const { latitude, longitude } = route.params;
  
  const [cooks, setCooks] = useState<Cook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [isVeg, setIsVeg] = useState(false);
  const [isVegan, setIsVegan] = useState(false);
  const [maxPrice, setMaxPrice] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadNearbyCooks();
  }, [selectedCategory, selectedCuisine, isVeg, isVegan, maxPrice]);

  const loadNearbyCooks = async () => {
    try {
      setIsLoading(true);
      const response = await cookApi.findNearbyCooks({
        latitude,
        longitude,
        radiusKm: 10,
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        cuisine: selectedCuisine !== 'All' ? selectedCuisine : undefined,
        isVeg,
        isVegan,
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
        limit: 20,
      });
      if (response.data.success && response.data.cooks) {
        setCooks(response.data.cooks);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to find nearby cooks');
    } finally {
      setIsLoading(false);
    }
  };

  const getSampleMeals = async (cookId: string): Promise<Meal[]> => {
    // For demo, return sample meals
    return [
      { id: '1', cookId, name: 'Butter Chicken', description: 'Creamy tomato-based curry', category: 'non-veg', cuisine: 'indian', price: 250, originalPrice: 300, imageUrl: '', ingredients: ['chicken', 'tomato', 'cream', 'spices'], allergens: ['dairy'], prepTimeMins: 45, serves: 2, isAvailable: true, isVegetarian: false, isVegan: false, spiceLevel: 'medium', tags: ['dinner', 'popular'], createdAt: '', updatedAt: '' },
      { id: '2', cookId, name: 'Veg Biryani', description: 'Fragrant rice with vegetables', category: 'veg', cuisine: 'indian', price: 180, originalPrice: 200, imageUrl: '', ingredients: ['rice', 'vegetables', 'spices'], allergens: [], prepTimeMins: 30, serves: 2, isAvailable: true, isVegetarian: true, isVegan: true, spiceLevel: 'mild', tags: ['lunch', 'healthy'], createdAt: '', updatedAt: '' },
    ];
  };

  const renderCook = ({ item }: { item: Cook }) => (
    <Card style={[styles.cookCard, { backgroundColor: colors.surface }]}>
      <View style={styles.cookContent}>
        <View style={styles.cookHeader}>
          <Avatar.Text
            size={50}
            label={item.displayName?.charAt(0) || 'C'}
            style={{ backgroundColor: colors.primary }}
          />
          <View style={styles.cookInfo}>
            <Text style={[styles.cookName, { color: colors.text }]}>{item.displayName}</Text>
            <Text style={[styles.cookBio, { color: colors.textSecondary }]}>{item.bio || 'Home cook'}</Text>
            <View style={styles.cookMeta}>
              <Text style={[styles.metaItem, { color: colors.textSecondary }]}>
                ⭐ {item.rating.toFixed(1)} • {item.totalOrders} orders
              </Text>
              <Text style={[styles.metaItem, { color: colors.textSecondary }]}>
                📍 {item.location?.address || `${item.serviceRadiusKm}km radius`}
              </Text>
            </View>
          </View>
          {item.isActive && (
            <Chip
              icon="check-circle"
              style={styles.activeChip}
              textStyle={styles.activeChipText}
            >
              Available
            </Chip>
          )}
        </View>

        <Button
          mode="outlined"
          onPress={() => navigation.navigate('MealDetails', { cook: item })}
          style={styles.viewMealsButton}
          icon="food"
        >
          View Meals
        </Button>
      </View>
    </Card>
  );

  const renderFilterChip = ({ item }: { item: string }) => (
    <Chip
      key={item}
      onPress={() => {
        if (item === 'All') {
          setSelectedCategory('All');
        } else {
          setSelectedCategory(item);
        }
      }}
      selected={selectedCategory === item}
      style={styles.filterChip}
    >
      {item}
    </Chip>
  );

  const renderCuisineChip = ({ item }: { item: string }) => (
    <Chip
      key={item}
      onPress={() => {
        if (item === 'All') {
          setSelectedCuisine('All');
        } else {
          setSelectedCuisine(item);
        }
      }}
      selected={selectedCuisine === item}
      style={styles.filterChip}
    >
      {item}
    </Chip>
  );

  if (isLoading) {
    return <LoadingSpinner text="Finding nearby home cooks..." />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Appbar.Header style={{ backgroundColor: colors.surface }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Nearby Home Cooks" titleStyle={{ color: colors.text }} />
        <Appbar.Action
          icon={showFilters ? 'filter' : 'filter-outline'}
          onPress={() => setShowFilters(!showFilters)}
          iconColor={colors.text}
        />
      </Appbar.Header>

      {showFilters && (
        <View style={styles.filtersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            <Text style={[styles.filterLabel, { color: colors.text }]}>Category: </Text>
            <FlatList
              data={CATEGORIES}
              keyExtractor={(item) => item}
              renderItem={renderFilterChip}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterContent}
            />
          </ScrollView>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            <Text style={[styles.filterLabel, { color: colors.text }]}>Cuisine: </Text>
            <FlatList
              data={CUISINES}
              keyExtractor={(item) => item}
              renderItem={renderCuisineChip}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterContent}
            />
          </ScrollView>

          <View style={styles.filterRow}>
            <View style={styles.switchFilter}>
              <Text style={[styles.switchLabel, { color: colors.text }]}>Veg Only</Text>
              <Switch value={isVeg} onValueChange={setIsVeg} trackColor={{ true: colors.primary }} thumbColor={isVeg ? colors.primary : undefined} />
            </View>
            <View style={styles.switchFilter}>
              <Text style={[styles.switchLabel, { color: colors.text }]}>Vegan</Text>
              <Switch value={isVegan} onValueChange={setIsVegan} trackColor={{ true: colors.primary }} thumbColor={isVegan ? colors.primary : undefined} />
            </View>
          </View>

          <View style={styles.priceFilter}>
            <Text style={[styles.filterLabel, { color: colors.text }]}>Max Price: </Text>
            <TextInput
              value={maxPrice}
              onChangeText={setMaxPrice}
              style={styles.priceInput}
              keyboardType="numeric"
              placeholder="₹"
            />
          </View>
        </View>
      )}

      <FlatList
        data={cooks}
        keyExtractor={(item) => item.id}
        renderItem={renderCook}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No home cooks found
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
              Try adjusting your filters or location
            </Text>
          </View>
        }
      />
    </SafeAreaView>
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
  cookCard: {
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  cookContent: {
    padding: 16,
  },
  cookHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cookInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 12,
  },
  cookName: {
    fontSize: 18,
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
  activeChip: {
    backgroundColor: '#E8F5E9',
  },
  activeChipText: {
    color: '#2E7D32',
  },
  viewMealsButton: {
    width: '100%',
    marginTop: 12,
  },
  filtersContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  filterScroll: {
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 8,
    alignSelf: 'center',
  },
  filterContent: {
    gap: 8,
  },
  filterChip: {
    // Chip styles handled by component
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  switchFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  switchLabel: {
    fontSize: 14,
  },
  priceFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  priceInput: {
    width: 80,
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
});

export default NearbyCooksScreen;