// screens/AddMealScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Text, TextInput, Button, Appbar, Switch } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAppSelector } from '../hooks/redux';
import { RootStackParamList } from '../types';
import { cookApi } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';

type NavigationProp = StackNavigationProp<RootStackParamList, 'AddMeal'>;
type RoutePropType = RouteProp<RootStackParamList, 'AddMeal'>;

const CATEGORIES = ['veg', 'non-veg', 'vegan', 'dessert', 'beverage', 'snack'];
const CUISINES = ['indian', 'chinese', 'italian', 'mexican', 'thai', 'japanese', 'american', 'continental'];
const SPICE_LEVELS = ['mild', 'medium', 'hot', 'extra-hot'];

const AddMealScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RoutePropType>();
  const { colors } = useAppSelector((state) => state.theme);
  
  const mealId = route.params?.mealId;
  const isEditing = !!mealId;

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'veg',
    cuisine: 'indian',
    price: '',
    originalPrice: '',
    imageUrl: '',
    ingredients: '',
    allergens: '',
    prepTimeMins: '30',
    serves: '1',
    isVegetarian: true,
    isVegan: false,
    spiceLevel: 'medium',
    tags: '',
  });

  useEffect(() => {
    if (isEditing && mealId) {
      loadMeal();
    }
  }, [mealId]);

  const loadMeal = async () => {
    try {
      setIsLoading(true);
      const response = await cookApi.getMeal(mealId!);
      if (response.data.success && response.data.meal) {
        const meal = response.data.meal;
        setFormData({
          name: meal.name,
          description: meal.description || '',
          category: meal.category,
          cuisine: meal.cuisine,
          price: meal.price.toString(),
          originalPrice: meal.originalPrice?.toString() || '',
          imageUrl: meal.imageUrl || '',
          ingredients: meal.ingredients.join(', '),
          allergens: meal.allergens.join(', '),
          prepTimeMins: meal.prepTimeMins.toString(),
          serves: meal.serves.toString(),
          isVegetarian: meal.isVegetarian,
          isVegan: meal.isVegan,
          spiceLevel: meal.spiceLevel,
          tags: meal.tags.join(', '),
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load meal');
    } finally {
      setIsLoading(false);
    }
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Meal name is required');
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      Alert.alert('Error', 'Valid price is required');
      return;
    }

    try {
      setIsLoading(true);
      const data = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category,
        cuisine: formData.cuisine,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : parseFloat(formData.price),
        imageUrl: formData.imageUrl.trim(),
        ingredients: formData.ingredients.split(',').map(s => s.trim()).filter(Boolean),
        allergens: formData.allergens.split(',').map(s => s.trim()).filter(Boolean),
        prepTimeMins: parseInt(formData.prepTimeMins) || 30,
        serves: parseInt(formData.serves) || 1,
        isVegetarian: formData.isVegetarian,
        isVegan: formData.isVegan,
        spiceLevel: formData.spiceLevel,
        tags: formData.tags.split(',').map(s => s.trim()).filter(Boolean),
      };

      if (isEditing) {
        await cookApi.updateMeal(mealId!, data);
        Alert.alert('Success', 'Meal updated!');
      } else {
        await cookApi.createMeal(data);
        Alert.alert('Success', 'Meal created!');
      }
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to save meal');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !formData.name) {
    return <LoadingSpinner text="Loading meal..." />;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Appbar.Header style={{ backgroundColor: colors.surface }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={isEditing ? 'Edit Meal' : 'Add Meal'} titleStyle={{ color: colors.text }} />
      </Appbar.Header>

      <ScrollView style={styles.content}>
        <Card style={[styles.card, { backgroundColor: colors.surface }]}>
          <View style={styles.cardContent}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Basic Info</Text>

            <TextInput
              label="Meal Name"
              value={formData.name}
              onChangeText={(text) => updateField('name', text)}
              mode="outlined"
              style={styles.input}
            />

            <TextInput
              label="Description"
              value={formData.description}
              onChangeText={(text) => updateField('description', text)}
              mode="outlined"
              style={styles.input}
              multiline
              placeholder="Describe your meal..."
            />

            <View style={styles.selectRow}>
              <TextInput
                label="Category"
                value={formData.category}
                onChangeText={(text) => updateField('category', text)}
                mode="outlined"
                style={[styles.input, styles.halfInput]}
                editable={false}
              />
              <TextInput
                label="Cuisine"
                value={formData.cuisine}
                onChangeText={(text) => updateField('cuisine', text)}
                mode="outlined"
                style={[styles.input, styles.halfInput]}
                editable={false}
              />
            </View>

            <View style={styles.selectRow}>
              <TextInput
                label="Price (₹)"
                value={formData.price}
                onChangeText={(text) => updateField('price', text)}
                mode="outlined"
                style={[styles.input, styles.halfInput]}
                keyboardType="numeric"
              />
              <TextInput
                label="Original Price (₹)"
                value={formData.originalPrice}
                onChangeText={(text) => updateField('originalPrice', text)}
                mode="outlined"
                style={[styles.input, styles.halfInput]}
                keyboardType="numeric"
              />
            </View>

            <TextInput
              label="Image URL"
              value={formData.imageUrl}
              onChangeText={(text) => updateField('imageUrl', text)}
              mode="outlined"
              style={styles.input}
              placeholder="https://example.com/image.jpg"
            />
          </View>
        </Card>

        <Card style={[styles.card, { backgroundColor: colors.surface }]}>
          <View style={styles.cardContent}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Details</Text>

            <View style={styles.selectRow}>
              <TextInput
                label="Prep Time (mins)"
                value={formData.prepTimeMins}
                onChangeText={(text) => updateField('prepTimeMins', text)}
                mode="outlined"
                style={[styles.input, styles.halfInput]}
                keyboardType="numeric"
              />
              <TextInput
                label="Serves"
                value={formData.serves}
                onChangeText={(text) => updateField('serves', text)}
                mode="outlined"
                style={[styles.input, styles.halfInput]}
                keyboardType="numeric"
              />
            </View>

            <TextInput
              label="Spice Level"
              value={formData.spiceLevel}
              onChangeText={(text) => updateField('spiceLevel', text)}
              mode="outlined"
              style={styles.input}
              editable={false}
            />

            <TextInput
              label="Ingredients (comma separated)"
              value={formData.ingredients}
              onChangeText={(text) => updateField('ingredients', text)}
              mode="outlined"
              style={styles.input}
              multiline
              placeholder="e.g., chicken, rice, spices, onions"
            />

            <TextInput
              label="Allergens (comma separated)"
              value={formData.allergens}
              onChangeText={(text) => updateField('allergens', text)}
              mode="outlined"
              style={styles.input}
              placeholder="e.g., nuts, dairy, gluten"
            />

            <TextInput
              label="Tags (comma separated)"
              value={formData.tags}
              onChangeText={(text) => updateField('tags', text)}
              mode="outlined"
              style={styles.input}
              placeholder="e.g., lunch, dinner, party, healthy"
            />
          </View>
        </Card>

        <Card style={[styles.card, { backgroundColor: colors.surface }]}>
          <View style={styles.cardContent}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Dietary Options</Text>

            <View style={styles.switchRow}>
              <Text style={[styles.switchLabel, { color: colors.text }]}>Vegetarian</Text>
              <Switch
                value={formData.isVegetarian}
                onValueChange={(value) => updateField('isVegetarian', value)}
                color={colors.primary}
              />
            </View>

            <View style={styles.switchRow}>
              <Text style={[styles.switchLabel, { color: colors.text }]}>Vegan</Text>
              <Switch
                value={formData.isVegan}
                onValueChange={(value) => updateField('isVegan', value)}
                color={colors.primary}
              />
            </View>
          </View>
        </Card>

        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={isLoading}
          style={[styles.submitButton, { backgroundColor: colors.primary }]}
        >
          {isEditing ? 'Update Meal' : 'Create Meal'}
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
  input: {
    marginBottom: 16,
  },
  selectRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  halfInput: {
    flex: 1,
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
  submitButton: {
    marginTop: 16,
    paddingVertical: 12,
  },
});

export default AddMealScreen;