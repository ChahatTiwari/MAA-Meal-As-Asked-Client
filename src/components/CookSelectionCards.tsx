import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar, Button, Card, Chip, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { Cook, RootStackParamList } from '../types';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { selectDemoCook } from '../store/slices/chatSlice';

type NavigationProp = StackNavigationProp<RootStackParamList, 'Chat'>;

const CookSelectionCards: React.FC<{ cooks: Cook[] }> = ({ cooks }) => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NavigationProp>();
  const { colors } = useAppSelector(state => state.theme);

  const selectCook = async (cook: Cook) => {
    const result = await dispatch(selectDemoCook(cook)).unwrap();
    navigation.navigate('Payment', { order: result.order });
  };

  return (
    <View style={styles.container}>
      {cooks.map(cook => (
        <Card key={cook.id} style={[styles.card, { backgroundColor: colors.surface }]}>
          <View style={styles.content}>
            <View style={styles.header}>
              <Avatar.Text size={46} label={cook.displayName.charAt(0)} />
              <View style={styles.info}>
                <Text variant="titleMedium" style={{ color: colors.text, fontWeight: '700' }}>{cook.displayName}</Text>
                <Text style={{ color: colors.textSecondary }}>⭐ {cook.rating.toFixed(1)} · {cook.totalOrders} orders</Text>
              </View>
              <Chip compact>Available</Chip>
            </View>
            <Text numberOfLines={2} style={[styles.bio, { color: colors.textSecondary }]}>{cook.bio}</Text>
            <Text style={[styles.location, { color: colors.text }]}>📍 {cook.location.address}</Text>
            <View style={styles.footer}>
              <View>
                <Text style={{ color: colors.textSecondary }}>Dal Chawal</Text>
                <Text style={[styles.price, { color: colors.primary }]}>₹{cook.mealPrice}</Text>
              </View>
              <Button mode="contained" icon="chef-hat" onPress={() => selectCook(cook)}>Select MAA</Button>
            </View>
          </View>
        </Card>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: 290 },
  card: { marginTop: 10, borderRadius: 14 },
  content: { padding: 14 },
  header: { flexDirection: 'row', alignItems: 'center' },
  info: { flex: 1, marginHorizontal: 10 },
  bio: { marginTop: 10, lineHeight: 18 },
  location: { marginTop: 8, fontSize: 13 },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 },
  price: { fontSize: 20, fontWeight: '800' },
});

export default CookSelectionCards;