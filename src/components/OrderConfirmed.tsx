// components/OrderConfirmed.tsx
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Image } from 'react-native';
import { Card, Button, IconButton } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { resetChat } from '../store/slices/chatSlice';

interface OrderConfirmedProps {
  order: any;
  cook: any;
}

const OrderConfirmed: React.FC<OrderConfirmedProps> = ({ order, cook }) => {
  const dispatch = useAppDispatch();
  const { colors } = useAppSelector((state) => state.theme);
  
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Main entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 80,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleTrackOrder = () => {
    // For demo, show order tracking info
    alert('📦 Order Tracking\n\nYour order is being prepared by ' + cook?.displayName + '.\n\nEstimated delivery: 25-30 minutes\n\nYou will receive updates as your order progresses.');
  };

  const handleNewOrder = () => {
    dispatch(resetChat());
  };

  return (
    <Animated.View style={[
      styles.container,
      { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
    ]}>
      <Card style={[styles.card, { backgroundColor: colors.surface }]}>
        <View style={styles.cardContent}>
          {/* Celebration Emoji */}
          <View style={styles.emojiWrapper}>
            <Text style={styles.emoji}>🎉</Text>
          </View>

          {/* Success Text */}
          <Text style={styles.title}>Order Confirmed!</Text>
          <Text style={styles.subtitle}>Your Dal Chawal is being prepared with love</Text>

          {/* Order Details Card */}
          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Order ID</Text>
              <Text style={styles.detailValue}>{order.id}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>MAA / Home Cook</Text>
              <View style={styles.cookInfoRow}>
                <Text style={styles.cookAvatar}>{cook.displayName?.charAt(0) || 'M'}</Text>
                <View>
                  <Text style={styles.cookName}>{cook.displayName}</Text>
                  <Text style={styles.cookRating}>⭐ {cook.rating} • {cook.totalOrders} orders</Text>
                </View>
              </View>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Meal</Text>
              <Text style={styles.detailValue}>Dal Chawal</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Total Paid</Text>
              <Text style={[styles.detailValue, styles.priceText]}>₹{order.totalPrice}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Estimated Ready</Text>
              <Text style={styles.detailValue}>25-30 minutes</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonRow}>
            <Button
              mode="outlined"
              onPress={handleTrackOrder}
              style={styles.trackButton}
              contentStyle={styles.buttonContent}
              icon="map-marker"
              labelStyle={{ fontWeight: '600', fontSize: 14 }}
            >
              Track Order
            </Button>
            <Button
              mode="contained"
              onPress={handleNewOrder}
              style={[styles.newOrderButton, { backgroundColor: colors.primary }]}
              contentStyle={styles.buttonContent}
              icon="plus"
              labelStyle={{ fontWeight: '600', fontSize: 14, color: 'white' }}
            >
              New Order
            </Button>
          </View>

          <Text style={styles.footerText}>
            Thank you for choosing MAA! 🍽️
          </Text>
        </View>
      </Card>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 4,
    marginVertical: 8,
    overflow: 'hidden',
  },
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  cardContent: {
    padding: 24,
    alignItems: 'center',
  },
  emojiWrapper: {
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 60,
    lineHeight: 60,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#2C3E50',
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#7F8C8D',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 22,
  },
  detailsCard: {
    width: '100%',
    backgroundColor: '#F8F9FA',
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  detailLabel: {
    fontSize: 13,
    color: '#7F8C8D',
    fontWeight: '500',
    width: '40%',
  },
  detailValue: {
    fontSize: 14,
    color: '#2C3E50',
    fontWeight: '600',
    width: '60%',
    textAlign: 'right',
  },
  cookInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cookAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cookName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
  },
  cookRating: {
    fontSize: 11,
    color: '#7F8C8D',
    marginTop: 1,
  },
  priceText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FF6B35',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    width: '100%',
    marginTop: 8,
  },
  trackButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#FF6B35',
    borderRadius: 12,
  },
  newOrderButton: {
    flex: 1,
    borderRadius: 12,
  },
  buttonContent: {
    paddingVertical: 12,
  },
  footerText: {
    marginTop: 16,
    fontSize: 13,
    color: '#95A5A6',
    textAlign: 'center',
  },
});

export default OrderConfirmed;