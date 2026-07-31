// screens/PaymentScreen.tsx
import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Card, Text, TextInput, Button, Appbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector } from '../hooks/redux';
import { Order, RootStackParamList } from '../types';

interface PaymentScreenProps {
  route: {
    params: {
      order: Order;
    };
  };
}

const PaymentScreen: React.FC<PaymentScreenProps> = ({ route }) => {
  const { order } = route.params;
  const navigation = useNavigation();
  const { colors } = useAppSelector((state) => state.theme);
  
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    if (!cardNumber || !expiryDate || !cvv || !cardHolder) {
      Alert.alert('Error', 'Please fill in all payment details');
      return;
    }

    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      Alert.alert(
        'Payment Successful! 🎉',
        `Your order has been confirmed.\nOrder ID: ${order.id}\nAmount: ₹${order.totalPrice}`,
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    }, 3000);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Appbar.Header style={{ backgroundColor: colors.surface }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Payment" titleStyle={{ color: colors.text }} />
      </Appbar.Header>

      <View style={styles.content}>
        <Card style={[styles.orderCard, { backgroundColor: colors.surface }]}>
          <View style={styles.orderDetails}>
            <Text style={[styles.orderTitle, { color: colors.text }]}>Order Summary</Text>
            <Text style={[styles.restaurantName, { color: colors.text }]}>
              {order.restaurant?.image} {order.restaurant?.name}
            </Text>
            <Text style={[styles.totalAmount, { color: colors.primary }]}>
              Total: ₹{order.totalPrice}
            </Text>
          </View>
        </Card>

        <Card style={[styles.paymentCard, { backgroundColor: colors.surface }]}>
          <View style={styles.paymentForm}>
            <Text style={[styles.paymentTitle, { color: colors.text }]}>Payment Details</Text>
            
            <TextInput
              label="Card Number"
              value={cardNumber}
              onChangeText={setCardNumber}
              keyboardType="numeric"
              maxLength={19}
              mode="outlined"
              style={styles.input}
            />

            <View style={styles.row}>
              <TextInput
                label="MM/YY"
                value={expiryDate}
                onChangeText={setExpiryDate}
                keyboardType="numeric"
                maxLength={5}
                mode="outlined"
                style={[styles.input, styles.halfInput]}
              />
              
              <TextInput
                label="CVV"
                value={cvv}
                onChangeText={setCvv}
                keyboardType="numeric"
                maxLength={3}
                secureTextEntry
                mode="outlined"
                style={[styles.input, styles.halfInput]}
              />
            </View>

            <TextInput
              label="Cardholder Name"
              value={cardHolder}
              onChangeText={setCardHolder}
              mode="outlined"
              style={styles.input}
            />

            <Button
              mode="contained"
              onPress={handlePayment}
              loading={isProcessing}
              disabled={isProcessing}
              style={[styles.payButton, { backgroundColor: colors.primary }]}
              contentStyle={styles.payButtonContent}
            >
              {isProcessing ? 'Processing...' : `Pay ₹${order.totalPrice}`}
            </Button>
          </View>
        </Card>
      </View>
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
  },
  orderCard: {
    borderRadius: 12,
    marginBottom: 16,
  },
  orderDetails: {
    padding: 16,
  },
  orderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  restaurantName: {
    fontSize: 16,
    marginBottom: 8,
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  paymentCard: {
    borderRadius: 12,
  },
  paymentForm: {
    padding: 16,
  },
  paymentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    flex: 0.48,
  },
  payButton: {
    marginTop: 20,
  },
  payButtonContent: {
    paddingVertical: 8,
  },
});

export default PaymentScreen;