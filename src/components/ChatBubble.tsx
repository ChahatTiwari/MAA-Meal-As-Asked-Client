// components/ChatBubble.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Message, Order, RootStackParamList } from '../types';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import IngredientTable from './IngredientTable';
import OrderStatus from './OrderStatus';
import CookListCard from './CookListCard';
import OrderConfirmed from './OrderConfirmed';
import { processDemoPayment, setOrder } from '../store/slices/chatSlice';
import type { StackNavigationProp } from '@react-navigation/stack';

type NavigationProp = StackNavigationProp<RootStackParamList, 'Chat'>;

interface ChatBubbleProps {
  message: Message;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const dispatch = useAppDispatch();
  const { colors } = useAppSelector((state) => state.theme);
  const { currentOrder } = useAppSelector((state) => state.chat);
  const navigation = useNavigation<NavigationProp>();
  const isUser = message.sender === 'user';

  const handleSelectCook = (cook: any) => {
    // Create order with cook info and update Redux store
    const orderWithCook: Order = {
      id: currentOrder?.id || 'demo_order_' + Date.now(),
      ingredients: currentOrder?.ingredients || [],
      totalPrice: cook.mealPrice,
      status: 'confirmed',
      restaurant: {
        id: cook.id,
        name: cook.displayName,
        image: '👩‍🍳',
        rating: cook.rating,
        acceptanceRate: 100,
      },
      bargainPrice: null,
      notes: currentOrder?.notes || '',
    } as Order;

    // Update Redux store with the order
    dispatch(setOrder(orderWithCook));

    // Navigate to payment screen
    navigation.navigate('Payment', {
      order: orderWithCook,
    });
  };

  const handleProcessPayment = () => {
    dispatch(processDemoPayment());
  };

  const renderContent = () => {
    switch (message.type) {
      case 'ingredient-table':
        return (
          <View>
            {!!message.text && <Text style={[styles.messageText, styles.contentIntro, { color: colors.text }]}>{message.text}</Text>}
            <IngredientTable ingredients={message.data} />
          </View>
        );
      case 'cook-list':
        return (
          <View>
            <Text style={[styles.messageText, styles.contentIntro, { color: colors.text }]}>{message.text}</Text>
            {message.data && message.data.map((cook: any) => (
              <CookListCard key={cook.id} cook={cook} onSelect={handleSelectCook} />
            ))}
          </View>
        );
      case 'order-confirmed':
        return <OrderConfirmed order={message.data?.order} cook={message.data?.cook} />;
      case 'order-status':
        return <OrderStatus order={message.data} />;
      case 'payment':
        return (
          <View>
            <Text style={[styles.messageText, { color: colors.text }]}>{message.text}</Text>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('Payment', { order: message.data })}
              style={[styles.paymentButton, { backgroundColor: '#27AE60' }]}
              icon="credit-card"
            >
              Proceed to Payment
            </Button>
          </View>
        );
      default:
        return <Text style={[styles.messageText, { color: isUser ? '#fff' : colors.text }]}>{message.text}</Text>;
    }
  };

  return (
    <View style={[
      styles.bubbleContainer,
      isUser ? styles.userBubble : styles.aiBubble,
    ]}>
      <View style={[
        styles.bubble,
        {
          backgroundColor: isUser ? colors.primary : colors.surface,
          shadowColor: colors.text,
        }
      ]}>
        {renderContent()}
        <Text style={[
          styles.timestamp,
          { color: isUser ? 'rgba(255,255,255,0.7)' : colors.textSecondary }
        ]}>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bubbleContainer: {
    marginVertical: 4,
    marginHorizontal: 16,
  },
  userBubble: {
    alignItems: 'flex-end',
  },
  aiBubble: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '92%',
    padding: 12,
    borderRadius: 16,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  contentIntro: {
    marginBottom: 8,
  },
  timestamp: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'right',
  },
  paymentButton: {
    marginTop: 12,
    borderRadius: 8,
  },
});

export default ChatBubble;