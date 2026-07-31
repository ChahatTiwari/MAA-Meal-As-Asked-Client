// components/OrderStatus.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, Card } from 'react-native-paper';
import { Order } from '../types';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { setOrder, addMessage, acceptBargain } from '../store/slices/chatSlice';

interface OrderStatusProps {
  order: Order;
}

const OrderStatus: React.FC<OrderStatusProps> = ({ order }) => {
  const dispatch = useAppDispatch();
  const { colors } = useAppSelector((state) => state.theme);

  const handleBargainAccept = () => {
    if (order.bargainPrice) {
      dispatch(acceptBargain(order.bargainPrice));
      
      const paymentMessage = {
        id: Date.now().toString(),
        text: `Great! Proceed to payment for ₹${order.bargainPrice}`,
        sender: 'ai' as const,
        timestamp: new Date().toISOString(),
        type: 'payment' as const,
        data: { ...order, totalPrice: order.bargainPrice, status: 'confirmed' as const },
      };
      dispatch(addMessage(paymentMessage));
    }
  };

  const handleBargainDecline = () => {
    const message = {
      id: Date.now().toString(),
      text: 'No problem! What else would you like to eat?',
      sender: 'ai' as const,
      timestamp: new Date().toISOString(),
      type: 'text' as const,
    };
    dispatch(addMessage(message));
    dispatch(setOrder(null));
  };

  const handlePayment = () => {
    const successMessage = {
      id: Date.now().toString(),
      text: '🎉 Payment successful! Your order is being prepared. You\'ll receive updates shortly.',
      sender: 'ai' as const,
      timestamp: new Date().toISOString(),
      type: 'text' as const,
    };
    dispatch(addMessage(successMessage));
  };

  const getStatusColor = () => {
    switch (order.status) {
      case 'accepted': return colors.primary;
      case 'declined': return '#E74C3C';
      case 'confirmed': return '#27AE60';
      default: return colors.textSecondary;
    }
  };

  const getStatusText = () => {
    switch (order.status) {
      case 'accepted':
        return `✅ ${order.restaurant?.name} accepted your order for ₹${order.totalPrice}`;
      case 'declined':
        return `❌ ${order.restaurant?.name} declined your order`;
      case 'confirmed':
        return `🎉 Order confirmed with ${order.restaurant?.name}`;
      default:
        return 'Processing your order...';
    }
  };

  return (
    <Card style={[styles.card, { backgroundColor: colors.surface }]}>
      <View style={styles.container}>
        <Text style={[styles.restaurantName, { color: colors.text }]}>
          {order.restaurant?.image} {order.restaurant?.name}
        </Text>
        
        <Text style={[styles.statusText, { color: getStatusColor() }]}>
          {getStatusText()}
        </Text>

        {order.status === 'declined' && order.bargainPrice && (
          <View style={styles.bargainContainer}>
            <Text style={[styles.bargainText, { color: colors.text }]}>
              💡 Would you like to try bargaining for ₹{order.bargainPrice}?
            </Text>
            <View style={styles.bargainButtons}>
              <Button
                mode="outlined"
                onPress={handleBargainDecline}
                style={styles.bargainButton}
              >
                No, thanks
              </Button>
              <Button
                mode="contained"
                onPress={handleBargainAccept}
                style={[styles.bargainButton, { backgroundColor: colors.primary }]}
              >
                Accept ₹{order.bargainPrice}
              </Button>
            </View>
          </View>
        )}

        {order.status === 'confirmed' && (
          <Button
            mode="contained"
            onPress={handlePayment}
            style={[styles.paymentButton, { backgroundColor: '#27AE60' }]}
            icon="credit-card"
          >
            Proceed to Payment
          </Button>
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginTop: 8,
    borderRadius: 12,
  },
  container: {
    padding: 16,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statusText: {
    fontSize: 16,
    marginBottom: 12,
  },
  bargainContainer: {
    marginTop: 12,
  },
  bargainText: {
    fontSize: 16,
    marginBottom: 12,
  },
  bargainButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bargainButton: {
    flex: 0.48,
  },
  paymentButton: {
    marginTop: 12,
    padding: 4,
  },
});

export default OrderStatus;