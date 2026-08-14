// components/IngredientTable.tsx
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { TextInput, Checkbox, Button, IconButton } from 'react-native-paper';
import { Ingredient } from '../types';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { updateIngredients, updateOrderNotes, confirmOrder, addMessage, setLoading, toggleIngredientSelection } from '../store/slices/chatSlice';

interface IngredientTableProps {
  ingredients?: Ingredient[];
}

const IngredientTable: React.FC<IngredientTableProps> = ({ ingredients: propIngredients = [] }) => {
  const dispatch = useAppDispatch();
  const { colors } = useAppSelector((state) => state.theme);
  const { currentOrder } = useAppSelector((state) => state.chat);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const ingredients = propIngredients.length > 0 
    ? propIngredients 
    : (currentOrder?.ingredients || []);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const updateIngredient = (id: string, updates: Partial<Ingredient>) => {
    if (propIngredients.length > 0) {
      const updatedIngredients = propIngredients.map(ing =>
        ing.id === id ? { ...ing, ...updates } : ing
      );
      dispatch(updateIngredients(updatedIngredients));
    } else {
      const updatedIngredients = ingredients.map(ing =>
        ing.id === id ? { ...ing, ...updates } : ing
      );
      dispatch(updateIngredients(updatedIngredients));
    }

    if ('selected' in updates) {
      dispatch(toggleIngredientSelection({ 
        ingredientId: id, 
        selected: updates.selected! 
      }));
    }
  };

  const handleSelectAll = () => {
    const allSelected = ingredients.every(ing => ing.selected);
    const updatedIngredients = ingredients.map(ing => ({
      ...ing,
      selected: !allSelected,
    }));
    dispatch(updateIngredients(updatedIngredients));

    // Update each ingredient selection in Redux
    updatedIngredients.forEach(ing => {
      dispatch(toggleIngredientSelection({ 
        ingredientId: ing.id, 
        selected: ing.selected 
      }));
    });
  };

  const handleConfirmOrder = async () => {
    const selectedIngredients = ingredients.filter(ing => ing.selected);
    if (selectedIngredients.length === 0) {
      const warningMessage = {
        id: Date.now().toString(),
        text: '⚠️ Please select at least one ingredient to place your order.',
        sender: 'ai' as const,
        timestamp: new Date().toISOString(),
        type: 'text' as const,
      };
      dispatch(addMessage(warningMessage));
      return;
    }

    dispatch(setLoading(true));

    try {
      await dispatch(confirmOrder(selectedIngredients)).unwrap();
    } catch (error) {
      console.error('Order confirmation failed:', error);
      dispatch(setLoading(false));
      
      // Show error message
      const errorMessage = {
        id: Date.now().toString(),
        text: '❌ Sorry, there was an error placing your order. Please try again.',
        sender: 'ai' as const,
        timestamp: new Date().toISOString(),
        type: 'text' as const,
      };
      dispatch(addMessage(errorMessage));
    }
  };

  // Don't render if no ingredients
  if (!ingredients || ingredients.length === 0) {
    return null;
  }

  const selectedCount = ingredients.filter(ing => ing.selected).length;
  const totalPrice = ingredients.filter(ing => ing.selected).reduce((sum, ing) => sum + ing.price, 0);
  const allSelected = ingredients.length > 0 && ingredients.every(ing => ing.selected);

  return (
    <Animated.View style={[
      styles.container, 
      { 
        backgroundColor: colors.surface,
        opacity: fadeAnim,
        transform: [{ scale: scaleAnim }],
      }
    ]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>🛒 Select Ingredients</Text>
        {ingredients.length > 0 && (
          <TouchableOpacity onPress={handleSelectAll} style={styles.selectAllButton}>
            <IconButton
              icon={allSelected ? "checkbox-marked" : "checkbox-blank-outline"}
              iconColor={colors.primary}
              size={20}
            />
            <Text style={[styles.selectAllText, { color: colors.primary }]}>
              {allSelected ? 'Deselect All' : 'Select All'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      
      {ingredients.map((ingredient, index) => (
        <Animated.View 
          key={ingredient.id} 
          style={[
            styles.row, 
            { 
              borderBottomColor: colors.textSecondary + '20',
              opacity: fadeAnim,
              transform: [{
                translateX: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-20, 0],
                }),
              }],
            }
          ]}
        >
          <TouchableOpacity 
            style={styles.checkboxContainer}
            onPress={() => updateIngredient(ingredient.id, { selected: !ingredient.selected })}
            activeOpacity={0.7}
          >
            <Checkbox
              status={ingredient.selected ? 'checked' : 'unchecked'}
            />
            <View style={styles.ingredientInfo}>
              <Text style={[styles.ingredientName, { color: colors.text }]}>
                {ingredient.name}
              </Text>
              {/* <Text style={[styles.price, { color: colors.primary }]}>
                ₹{ingredient.price}
              </Text> */}
            </View>
          </TouchableOpacity>
          
        </Animated.View>
      ))}
         <Animated.View style={{ opacity: fadeAnim }}>
      <TextInput
        style={styles.notesInput}
        placeholder="Special instructions..."
        value={currentOrder?.notes || ''}
        onChangeText={(text) => {
          dispatch(updateOrderNotes(text));
        }}
        mode="outlined"
        dense
        right={currentOrder?.notes ? <TextInput.Icon icon="check" /> : null}
      />
    </Animated.View>
      
      {selectedCount > 0 && (
        <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
          <View style={styles.summary}>
            <Text style={[styles.total, { color: colors.text }]}>
              💰 Total: ₹{totalPrice}
            </Text>
            <Text style={[styles.itemCount, { color: colors.textSecondary }]}>
              {selectedCount} item{selectedCount !== 1 ? 's' : ''} selected
            </Text>
          </View>
          <Button
            mode="contained"
            onPress={handleConfirmOrder}
            style={[styles.confirmButton, { backgroundColor: colors.primary }]}
            contentStyle={styles.buttonContent}
            icon="cart-check"
          >
            Order Now
          </Button>
        </Animated.View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    paddingVertical: 6,     // reduced vertical padding
    paddingHorizontal: 10,
    marginTop: 6,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 1.5,
    width: '100%',           // make it fill horizontally
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,        // was 16
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  selectAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectAllText: {
    fontSize: 12,
    marginLeft: -8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 0.5,  // thinner divider
    borderBottomColor: '#ddd',
    paddingVertical: 6,      // tighter vertical space
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  ingredientInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 6,
  },
  ingredientName: {
    fontSize: 15,
    flex: 1,
  },
  price: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  notesInput: {
    marginTop: 8,
    fontSize: 14,
    width: '95%',
    alignSelf: 'center',
  },
  footer: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  summary: {
    alignItems: 'center',
    marginBottom: 8,
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemCount: {
    fontSize: 13,
    marginTop: 2,
  },
  confirmButton: {
    borderRadius: 25,
    alignSelf: 'center',
    width: '90%',
  },
  buttonContent: {
    paddingVertical: 6,
  },
});


export default IngredientTable;