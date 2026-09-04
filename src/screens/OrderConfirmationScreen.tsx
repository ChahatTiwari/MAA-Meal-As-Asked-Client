import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { useAppSelector } from '../hooks/redux';

type ConfirmationRoute = RouteProp<RootStackParamList, 'OrderConfirmation'>;
type NavigationProp = StackNavigationProp<RootStackParamList, 'OrderConfirmation'>;

const OrderConfirmationScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ConfirmationRoute>();
  const { colors } = useAppSelector(state => state.theme);
  const scale = useRef(new Animated.Value(0)).current;
  const float = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scale, { toValue: 1, friction: 4, tension: 70, useNativeDriver: true }).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(float, { toValue: -10, duration: 700, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(float, { toValue: 0, duration: 700, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    ).start();
  }, [float, scale]);

  const { order, transactionId } = route.params;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.confetti}><Text style={styles.confettiText}>🎊  ✨  🎉  ✨  🎊</Text></View>
      <Animated.Text style={[styles.emoji, { transform: [{ scale }, { translateY: float }] }]}>🥳</Animated.Text>
      <Text variant="headlineMedium" style={[styles.title, { color: colors.text }]}>Order Confirmed!</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Your homemade Dal Chawal is on its way to being prepared.</Text>

      <Card style={[styles.card, { backgroundColor: colors.surface }]}>
        <View style={styles.cardContent}>
          <View style={styles.row}><Text style={{ color: colors.textSecondary }}>Order ID</Text><Text style={{ color: colors.text, fontWeight: '700' }}>{order.id}</Text></View>
          <View style={styles.row}><Text style={{ color: colors.textSecondary }}>Prepared by</Text><Text style={{ color: colors.text, fontWeight: '700' }}>{order.restaurant?.name}</Text></View>
          <View style={styles.row}><Text style={{ color: colors.textSecondary }}>Amount paid</Text><Text style={{ color: colors.primary, fontWeight: '800' }}>₹{order.totalPrice}</Text></View>
          <View style={styles.row}><Text style={{ color: colors.textSecondary }}>Transaction</Text><Text style={{ color: colors.text }}>{transactionId}</Text></View>
          <View style={styles.eta}><Text style={styles.etaText}>🕐 Estimated preparation: 30–40 min</Text></View>
        </View>
      </Card>

      <Button mode="contained" icon="map-marker-path" style={styles.trackButton} contentStyle={styles.buttonContent} onPress={() => navigation.navigate('Chat')}>
        Track Order
      </Button>
      <Button mode="text" onPress={() => navigation.navigate('Chat')}>Back to chat</Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  confetti: { position: 'absolute', top: 80 },
  confettiText: { fontSize: 25 },
  emoji: { fontSize: 88, marginBottom: 22 },
  title: { fontWeight: '800', textAlign: 'center' },
  subtitle: { fontSize: 16, textAlign: 'center', lineHeight: 23, marginTop: 10, marginBottom: 24, maxWidth: 330 },
  card: { width: '100%', maxWidth: 420, borderRadius: 18, marginBottom: 24 },
  cardContent: { padding: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 },
  eta: { backgroundColor: '#E8F5E9', padding: 12, borderRadius: 10, marginTop: 4 },
  etaText: { color: '#256D3A', textAlign: 'center', fontWeight: '600' },
  trackButton: { width: '100%', maxWidth: 420, borderRadius: 28 },
  buttonContent: { height: 54 },
});

export default OrderConfirmationScreen;