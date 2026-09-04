// screens/PaymentScreen.tsx
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  Card,
  Text,
  TextInput,
  Button,
  Appbar,
  RadioButton,
  Divider,
} from 'react-native-paper';
import {
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {
  useAppDispatch,
  useAppSelector,
} from '../hooks/redux';
import {
  Order,
  RootStackParamList,
} from '../types';
import { processDemoPayment } from '../store/slices/chatSlice';
import type { StackNavigationProp } from '@react-navigation/stack';

type NavigationProp = StackNavigationProp<RootStackParamList, 'Payment'>;

type PaymentMethod = 'upi' | 'card';
type UpiApp = 'gpay' | 'phonepe' | 'paytm';

const PaymentScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const dispatch = useAppDispatch();
  const { colors } = useAppSelector((state) => state.theme);

  const order = (route.params as any)?.order as Order;

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [selectedUpiApp, setSelectedUpiApp] = useState<UpiApp | null>(null);
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const upiApps = [
    { id: 'gpay' as UpiApp, name: 'Google Pay', icon: 'G', color: '#4285F4' },
    { id: 'phonepe' as UpiApp, name: 'PhonePe', icon: 'P', color: '#5F259F' },
    { id: 'paytm' as UpiApp, name: 'Paytm', icon: '₮', color: '#00BAF2' },
  ];

  const handleUpiPayment = async (app: UpiApp) => {
    setIsProcessing(true);
    setSelectedUpiApp(app);

    // Simulate UPI payment processing
    setTimeout(async () => {
      try {
        await dispatch(processDemoPayment()).unwrap();
        setIsProcessing(false);
        // Navigate back to chat - the order-confirmed message will show
        navigation.goBack();
      } catch (error: any) {
        setIsProcessing(false);
        Alert.alert('Payment Failed', error.message || 'Payment processing failed');
      }
    }, 2000);
  };

  const handleCardPayment = async () => {
    if (!cardNumber || !expiryDate || !cvv || !cardHolder) {
      Alert.alert('Error', 'Please fill in all payment details');
      return;
    }

    setIsProcessing(true);

    // Simulate card payment processing
    setTimeout(async () => {
      try {
        await dispatch(processDemoPayment()).unwrap();
        setIsProcessing(false);
        // Navigate back to chat - the order-confirmed message will show
        navigation.goBack();
      } catch (error: any) {
        setIsProcessing(false);
        Alert.alert('Payment Failed', error.message || 'Payment processing failed');
      }
    }, 2000);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Appbar.Header style={{ backgroundColor: colors.surface }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Payment" titleStyle={{ color: colors.text }} />
      </Appbar.Header>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Order Summary */}
        <Card style={[styles.orderCard, { backgroundColor: colors.surface }]}>
          <View style={styles.orderDetails}>
            <Text style={[styles.orderTitle, { color: colors.text }]}>
              Order Summary
            </Text>
            <Text style={[styles.restaurantName, { color: colors.text }]}>
              {order?.restaurant?.image} {order?.restaurant?.name}
            </Text>
            <Text style={[styles.totalAmount, { color: colors.primary }]}>
              Total: ₹{order?.totalPrice}
            </Text>
          </View>
        </Card>

        {/* Payment Method Selection */}
        <Card style={[styles.paymentCard, { backgroundColor: colors.surface }]}>
          <View style={styles.paymentForm}>
            <Text style={[styles.paymentTitle, { color: colors.text }]}>
              Select Payment Method
            </Text>

            {/* UPI Option */}
            <TouchableOpacity
              style={[
                styles.methodOption,
                paymentMethod === 'upi' && styles.methodOptionSelected,
              ]}
              onPress={() => setPaymentMethod('upi')}
              activeOpacity={0.7}
            >
              <RadioButton
                value="upi"
                status={paymentMethod === 'upi' ? 'checked' : 'unchecked'}
                onPress={() => setPaymentMethod('upi')}
                color={colors.primary}
              />
              <Text style={[styles.methodText, { color: colors.text }]}>
                UPI Payment
              </Text>
            </TouchableOpacity>

            {/* Card Option */}
            <TouchableOpacity
              style={[
                styles.methodOption,
                paymentMethod === 'card' && styles.methodOptionSelected,
              ]}
              onPress={() => setPaymentMethod('card')}
              activeOpacity={0.7}
            >
              <RadioButton
                value="card"
                status={paymentMethod === 'card' ? 'checked' : 'unchecked'}
                onPress={() => setPaymentMethod('card')}
                color={colors.primary}
              />
              <Text style={[styles.methodText, { color: colors.text }]}>
                Credit/Debit Card
              </Text>
            </TouchableOpacity>

            <Divider style={styles.divider} />

            {/* UPI Payment Options */}
            {paymentMethod === 'upi' && (
              <View style={styles.upiSection}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Pay using UPI App
                </Text>

                {upiApps.map((app) => (
                  <TouchableOpacity
                    key={app.id}
                    style={[
                      styles.upiAppButton,
                      selectedUpiApp === app.id && styles.upiAppButtonSelected,
                    ]}
                    onPress={() => handleUpiPayment(app.id)}
                    disabled={isProcessing}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[
                        styles.upiAppIcon,
                        { backgroundColor: app.color },
                      ]}
                    >
                      <Text style={styles.upiAppIconText}>{app.icon}</Text>
                    </View>
                    <Text style={[styles.upiAppName, { color: colors.text }]}>
                      {app.name}
                    </Text>
                    {isProcessing && selectedUpiApp === app.id && (
                      <Text style={styles.processingText}>Processing...</Text>
                    )}
                  </TouchableOpacity>
                ))}

                <Text style={[styles.orText, { color: colors.textSecondary }]}>
                  or
                </Text>

                <TextInput
                  label="Enter UPI ID (e.g., name@upi)"
                  value={upiId}
                  onChangeText={setUpiId}
                  mode="outlined"
                  style={styles.input}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                <Button
                  mode="contained"
                  onPress={() => {
                    if (!upiId.includes('@')) {
                      Alert.alert('Invalid UPI ID', 'Please enter a valid UPI ID');
                      return;
                    }
                    handleUpiPayment('gpay');
                  }}
                  loading={isProcessing}
                  disabled={isProcessing || !upiId}
                  style={[styles.payButton, { backgroundColor: colors.primary }]}
                  contentStyle={styles.payButtonContent}
                >
                  Pay ₹{order?.totalPrice}
                </Button>
              </View>
            )}

            {/* Card Payment Options */}
            {paymentMethod === 'card' && (
              <View style={styles.cardSection}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Enter Card Details
                </Text>

                <TextInput
                  label="Card Number"
                  value={cardNumber}
                  onChangeText={setCardNumber}
                  keyboardType="numeric"
                  maxLength={19}
                  mode="outlined"
                  style={styles.input}
                  left={<TextInput.Icon icon="credit-card" />}
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
                    maxLength={4}
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
                  autoCapitalize="words"
                />

                <Button
                  mode="contained"
                  onPress={handleCardPayment}
                  loading={isProcessing}
                  disabled={isProcessing}
                  style={[styles.payButton, { backgroundColor: colors.primary }]}
                  contentStyle={styles.payButtonContent}
                  icon="lock"
                >
                  {isProcessing ? 'Processing...' : `Pay ₹${order?.totalPrice}`}
                </Button>

                <Text style={[styles.secureText, { color: colors.textSecondary }]}>
                  🔒 Your payment is secure and encrypted
                </Text>
              </View>
            )}
          </View>
        </Card>
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
  },
  orderCard: {
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
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
    fontSize: 22,
    fontWeight: 'bold',
  },
  paymentCard: {
    borderRadius: 12,
    elevation: 2,
  },
  paymentForm: {
    padding: 16,
  },
  paymentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  methodOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  methodOptionSelected: {
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
  },
  methodText: {
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '500',
  },
  divider: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  upiSection: {
    marginTop: 8,
  },
  upiAppButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 12,
  },
  upiAppButtonSelected: {
    borderColor: '#FF6B35',
    backgroundColor: 'rgba(255, 107, 53, 0.05)',
  },
  upiAppIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  upiAppIconText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  upiAppName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  processingText: {
    color: '#FF6B35',
    fontSize: 14,
    fontWeight: '500',
  },
  orText: {
    textAlign: 'center',
    marginVertical: 16,
    fontSize: 14,
  },
  input: {
    marginBottom: 12,
  },
  payButton: {
    marginTop: 16,
    borderRadius: 10,
  },
  payButtonContent: {
    paddingVertical: 10,
  },
  cardSection: {
    marginTop: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    flex: 0.48,
  },
  secureText: {
    textAlign: 'center',
    marginTop: 16,
    fontSize: 12,
  },
});

export default PaymentScreen;