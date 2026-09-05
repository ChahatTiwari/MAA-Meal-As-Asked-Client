// components/IngredientTable.tsx

import React, { useEffect, useRef } from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
  useWindowDimensions,
  Platform,
} from 'react-native';

import {
  TextInput,
  Button,
  Checkbox,
  IconButton,
} from 'react-native-paper';

import { Ingredient } from '../types';

import {
  useAppDispatch,
  useAppSelector,
} from '../hooks/redux';

import {
  updateIngredients,
  updateOrderNotes,
  confirmDemoIngredients,
  addMessage,
  setLoading,
  toggleIngredientSelection,
} from '../store/slices/chatSlice';


// ======================================================
// PROPS
// ======================================================

interface IngredientTableProps {
  ingredients?: Ingredient[];
}


// ======================================================
// COMPONENT
// ======================================================

const IngredientTable: React.FC<IngredientTableProps> = ({
  ingredients: propIngredients = [],
}) => {

  // ====================================================
  // REDUX
  // ====================================================

  const dispatch = useAppDispatch();

  const { colors } = useAppSelector(
    (state) => state.theme
  );

  const { currentOrder } = useAppSelector(
    (state) => state.chat
  );


  // ====================================================
  // SCREEN SIZE
  // ====================================================

  const { width, height } = useWindowDimensions();

  const isSmallMobile = width < 360;
  const isMobile = width < 600;
  const isTablet = width >= 600 && width < 1024;
  const isDesktop = width >= 1024;


  // ====================================================
  // INGREDIENTS
  // ====================================================

  const ingredients =
    propIngredients.length > 0
      ? propIngredients
      : currentOrder?.ingredients || [];


  // ====================================================
  // ANIMATION
  // ====================================================

  const fadeAnim = useRef(
    new Animated.Value(0)
  ).current;

  const scaleAnim = useRef(
    new Animated.Value(0.98)
  ).current;


  useEffect(() => {

    Animated.parallel([

      Animated.timing(
        fadeAnim,
        {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }
      ),

      Animated.spring(
        scaleAnim,
        {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }
      ),

    ]).start();

  }, [fadeAnim, scaleAnim]);


  // ====================================================
  // EMPTY STATE
  // ====================================================

  if (!ingredients || ingredients.length === 0) {
    return null;
  }


  // ====================================================
  // RESPONSIVE VALUES
  // ====================================================

  const horizontalMargin = isSmallMobile
    ? 4
    : isMobile
    ? 6
    : 10;

  const cardPadding = isSmallMobile
    ? 10
    : isMobile
    ? 12
    : 16;


  /*
   * IMPORTANT:
   *
   * Do NOT use flex: 1 here.
   *
   * This component lives inside a FlatList.
   * Giving the internal ScrollView flex: 1 can
   * result in it receiving almost zero height.
   *
   * Instead, explicitly calculate the height.
   */

  const ingredientListHeight = isSmallMobile
    ? Math.min(220, height * 0.30)
    : isMobile
    ? Math.min(260, height * 0.34)
    : isTablet
    ? Math.min(300, height * 0.38)
    : Math.min(340, height * 0.40);


  // ====================================================
  // CALCULATIONS
  // ====================================================

  const selectedIngredients = ingredients.filter(
    (ingredient: Ingredient) => ingredient.selected
  );

  const selectedCount = selectedIngredients.length;

  const totalPrice = selectedIngredients.reduce(
    (sum: number, ingredient: Ingredient) => sum + ingredient.price,
    0
  );

  const allSelected =
    ingredients.length > 0 &&
    ingredients.every(
      (ingredient: Ingredient) => ingredient.selected
    );


  // ====================================================
  // UPDATE SINGLE INGREDIENT
  // ====================================================

  const handleIngredientToggle = (
    ingredientId: string
  ) => {

    const ingredient = ingredients.find(
      (ing: Ingredient) => ing.id === ingredientId
    );

    if (!ingredient) return;

    const newSelected = !ingredient.selected;

    const updatedIngredients = ingredients.map(
      (ing: Ingredient) => {

        if (ing.id !== ingredientId) {
          return ing;
        }

        return {
          ...ing,
          selected: newSelected,
        };
      }
    );

    dispatch(
      updateIngredients(updatedIngredients)
    );

    dispatch(
      toggleIngredientSelection({
        ingredientId,
        selected: newSelected,
      })
    );
  };


  // ====================================================
  // SELECT / DESELECT ALL
  // ====================================================

  const handleSelectAll = () => {

    const shouldSelectAll = !allSelected;

    const updatedIngredients = ingredients.map(
      (ingredient: Ingredient) => ({
        ...ingredient,
        selected: shouldSelectAll,
      })
    );

    dispatch(
      updateIngredients(updatedIngredients)
    );
  };


  // ====================================================
  // CONFIRM ORDER
  // ====================================================

  const handleConfirmOrder = async () => {

    const selected = ingredients.filter(
      (ingredient: Ingredient) => ingredient.selected
    );


    // --------------------------------------------------
    // NOTHING SELECTED
    // --------------------------------------------------

    if (selected.length === 0) {

      const warningMessage = {

        id: `${Date.now()}-warning`,

        text:
          '⚠️ Please select at least one ingredient to place your order.',

        sender: 'ai' as const,

        timestamp:
          new Date().toISOString(),

        type: 'text' as const,
      };


      dispatch(
        addMessage(warningMessage)
      );

      return;
    }


    // --------------------------------------------------
    // START LOADING
    // --------------------------------------------------

    dispatch(setLoading(true));


    try {

      await dispatch(
        confirmDemoIngredients(selected)
      ).unwrap();

    } catch (error) {

      console.error(
        'Order confirmation failed:',
        error
      );

      dispatch(setLoading(false));


      const errorMessage = {

        id: `${Date.now()}-error`,

        text:
          '❌ Sorry, there was an error placing your order. Please try again.',

        sender: 'ai' as const,

        timestamp:
          new Date().toISOString(),

        type: 'text' as const,
      };


      dispatch(
        addMessage(errorMessage)
      );
    }
  };


  // ====================================================
  // RENDER
  // ====================================================

  return (

    <Animated.View
      style={[
        styles.container,

        {
          backgroundColor: colors.surface,

          opacity: fadeAnim,

          transform: [
            {
              scale: scaleAnim,
            },
          ],

          marginHorizontal:
            horizontalMargin,

          width:
            isDesktop
              ? '90%'
              : isTablet
              ? '94%'
              : '96%',

          maxWidth:
            isDesktop
              ? 850
              : 760,
        },
      ]}
    >

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <View
        style={[
          styles.header,
          {
            paddingHorizontal: cardPadding,
          },
        ]}
      >

        {/* TOP ROW */}

        <View style={styles.headerTop}>

          <Text
            style={[
              styles.title,
              {
                color: colors.text,

                fontSize:
                  isSmallMobile
                    ? 15
                    : 17,
              },
            ]}
            numberOfLines={1}
          >
            🛒 Select Ingredients
          </Text>


          <Text
            style={[
              styles.runningTotal,
              {
                color: colors.primary,

                fontSize:
                  isSmallMobile
                    ? 18
                    : 21,
              },
            ]}
          >
            ₹{totalPrice}
          </Text>

        </View>


        {/* SECOND ROW */}

        <View style={styles.headerBottom}>

          <Text
            style={[
              styles.itemCount,
              {
                color:
                  colors.textSecondary,
              },
            ]}
          >
            {selectedCount} of {ingredients.length}{' '}
            selected
          </Text>


          <TouchableOpacity
            onPress={handleSelectAll}
            style={styles.selectAllButton}
            activeOpacity={0.7}
          >

            <Checkbox
              status={
                allSelected
                  ? 'checked'
                  : 'unchecked'
              }
              color={colors.primary}
              uncheckedColor={
                colors.textSecondary
              }
            />

            <Text
              style={[
                styles.selectAllText,
                {
                  color:
                    colors.primary,
                },
              ]}
            >
              {allSelected
                ? 'Deselect All'
                : 'Select All'}
            </Text>

          </TouchableOpacity>

        </View>

      </View>


      {/* ================================================= */}
      {/* INGREDIENT LIST */}
      {/* ================================================= */}

      <View
        style={[
          styles.ingredientsWrapper,
          {
            height: ingredientListHeight,
          },
        ]}
      >

        <ScrollView
          style={styles.ingredientsList}
          contentContainerStyle={
            styles.ingredientsContent
          }
          showsVerticalScrollIndicator={true}
          nestedScrollEnabled={true}
          keyboardShouldPersistTaps="handled"
        >

          {ingredients.map((ingredient: Ingredient) => (

            <TouchableOpacity
              key={ingredient.id}
              style={[
                styles.row,

                {
                  borderBottomColor:
                    colors.textSecondary + '18',

                  backgroundColor:
                    ingredient.selected
                      ? colors.primary + '08'
                      : 'transparent',
                },
              ]}
              onPress={() =>
                handleIngredientToggle(
                  ingredient.id
                )
              }
              activeOpacity={0.7}
            >

              {/* CHECKBOX */}

              <View style={styles.checkboxWrapper}>

                <Checkbox
                  status={
                    ingredient.selected
                      ? 'checked'
                      : 'unchecked'
                  }
                  color={colors.primary}
                  uncheckedColor={
                    colors.textSecondary + '90'
                  }
                />

              </View>


              {/* INGREDIENT NAME */}

              <View
                style={styles.ingredientInfo}
              >

                <Text
                  style={[
                    styles.ingredientName,
                    {
                      color: colors.text,
                    },
                  ]}
                  numberOfLines={2}
                >
                  {ingredient.name}
                </Text>


                <Text
                  style={[
                    styles.ingredientPrice,
                    {
                      color:
                        colors.primary,
                    },
                  ]}
                >
                  ₹{ingredient.price}
                </Text>

              </View>

            </TouchableOpacity>

          ))}

        </ScrollView>

      </View>


      {/* ================================================= */}
      {/* SPECIAL INSTRUCTIONS */}
      {/* ================================================= */}

      <View
        style={[
          styles.notesContainer,
          {
            paddingHorizontal:
              cardPadding,
          },
        ]}
      >

        <TextInput
          style={styles.notesInput}

          placeholder="Special instructions..."

          value={
            currentOrder?.notes || ''
          }

          onChangeText={(text) => {

            dispatch(
              updateOrderNotes(text)
            );

          }}

          mode="outlined"

          dense

          multiline

          maxLength={200}

          textColor={colors.text}

          placeholderTextColor={
            colors.textSecondary
          }

          outlineColor={
            colors.textSecondary + '40'
          }

          activeOutlineColor={
            colors.primary
          }

          right={
            currentOrder?.notes
              ? (
                <TextInput.Icon
                  icon="check"
                  color={colors.primary}
                />
              )
              : undefined
          }
        />

      </View>


      {/* ================================================= */}
      {/* FOOTER */}
      {/* ================================================= */}

      <View
        style={[
          styles.footer,
          {
            paddingHorizontal:
              cardPadding,
          },
        ]}
      >

        <View
          style={[
            styles.footerDivider,
            {
              backgroundColor:
                colors.textSecondary + '25',
            },
          ]}
        />


        <Button
          mode="contained"

          onPress={handleConfirmOrder}

          style={[
            styles.confirmButton,
            {
              backgroundColor:
                colors.primary,
            },
          ]}

          contentStyle={
            styles.buttonContent
          }

          icon="cart-check"

          labelStyle={[
            styles.buttonLabel,
            {
              fontSize:
                isSmallMobile
                  ? 13
                  : 15,
            },
          ]}
        >
          Confirm & Find MAA
        </Button>

      </View>

    </Animated.View>
  );
};


// ======================================================
// STYLES
// ======================================================

const styles = StyleSheet.create({

  // ====================================================
  // MAIN CARD
  // ====================================================

  container: {

    alignSelf: 'center',

    borderRadius: 16,

    marginTop: 8,

    marginBottom: 12,

    overflow: 'hidden',

    elevation: 3,

    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.1,

    shadowRadius: 5,
  },


  // ====================================================
  // HEADER
  // ====================================================

  header: {

    paddingTop: 12,

    paddingBottom: 10,

    borderBottomWidth: 1,

    borderBottomColor: '#E0E0E0',
  },


  headerTop: {

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',

    gap: 8,
  },


  title: {

    flex: 1,

    fontWeight: '700',

    flexShrink: 1,
  },


  runningTotal: {

    fontWeight: '800',

    flexShrink: 0,
  },


  headerBottom: {

    marginTop: 5,

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',

    gap: 8,
  },


  itemCount: {

    flex: 1,

    fontSize: 12,

    fontWeight: '500',

    flexShrink: 1,
  },


  selectAllButton: {

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'center',

    minHeight: 40,

    flexShrink: 0,
  },


  selectAllText: {

    fontSize: 11,

    fontWeight: '600',

    marginLeft: -4,
  },


  // ====================================================
  // INGREDIENTS
  // ====================================================

  ingredientsWrapper: {

    width: '100%',

    overflow: 'hidden',
  },


  ingredientsList: {

    width: '100%',

    flex: 1,
  },


  ingredientsContent: {

    paddingVertical: 2,

    paddingBottom: 4,
  },


  row: {

    width: '100%',

    minHeight: 48,

    flexDirection: 'row',

    alignItems: 'center',

    borderBottomWidth: 0.5,

    paddingVertical: 4,

    paddingHorizontal: 6,
  },


  checkboxWrapper: {

    width: 44,

    height: 44,

    justifyContent: 'center',

    alignItems: 'center',
  },


  ingredientInfo: {

    flex: 1,

    minWidth: 0,

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',

    paddingRight: 8,

    gap: 10,
  },


  ingredientName: {

    flex: 1,

    minWidth: 0,

    fontSize: 15,

    fontWeight: '500',

    lineHeight: 20,
  },


  ingredientPrice: {

    flexShrink: 0,

    fontSize: 15,

    fontWeight: '700',

    marginLeft: 8,
  },


  // ====================================================
  // NOTES
  // ====================================================

  notesContainer: {

    width: '100%',

    paddingTop: 8,

    paddingBottom: 6,
  },


  notesInput: {

    width: '100%',

    fontSize: 13,

    maxHeight: 48,
  },


  // ====================================================
  // FOOTER
  // ====================================================

  footer: {

    width: '100%',

    paddingTop: 6,

    paddingBottom: 12,
  },


  footerDivider: {

    width: '100%',

    height: 1,

    marginBottom: 10,
  },


  confirmButton: {

    width: '100%',

    borderRadius: 14,

    elevation: 2,
  },


  buttonContent: {

    minHeight: 50,

    paddingVertical: 4,

    paddingHorizontal: 8,
  },


  buttonLabel: {

    color: '#FFFFFF',

    fontWeight: '700',
  },

});

export default IngredientTable;