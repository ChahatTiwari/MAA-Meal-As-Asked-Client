// screens/CookOrdersScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Card, Text, Button, Appbar, Chip, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector } from '../hooks/redux';
import { RootStackParamList, CookOrder, CookOrderStatus } from '../types';
import { cookApi } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import type { StackNavigationProp } from '@react-navigation/stack';

type NavigationProp = StackNavigationProp<RootStackParamList, 'CookOrders'>;

const STATUS_COLORS: Record<string, string> = {
  pending: '#FFA000',
  accepted: '#2196F3',
  preparing: '#FF9800',
  ready: '#4CAF50',
  delivered: '#4CAF50',
  cancelled: '#F44336',
};

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  accepted: 'Accepted',
  preparing: 'Preparing',
  ready: 'Ready for Pickup',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

const STATUS_FLOW = ['pending', 'accepted', 'preparing', 'ready', 'delivered'];

const CookOrdersScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { colors } = useAppSelector((state) => state.theme);
  
  const [orders, setOrders] = useState<CookOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    loadOrders();
  }, [filter]);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const status = filter !== 'all' ? filter : undefined;
      const response = await cookApi.getOrders(status);
      if (response.data.success && response.data.orders) {
        setOrders(response.data.orders as CookOrder[]);
      }
    } catch (error: any) {
      Alert.alert('Error', 'Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  const getNextStatus = (currentStatus: CookOrderStatus): CookOrderStatus | null => {
    const index = STATUS_FLOW.indexOf(currentStatus);
    if (index === -1 || index === STATUS_FLOW.length - 1) return null;
    return STATUS_FLOW[index + 1] as CookOrderStatus;
  };

  const handleStatusUpdate = async (order: CookOrder) => {
    const nextStatus = getNextStatus(order.status);
    if (!nextStatus) return;

    try {
      await cookApi.updateOrderStatus(order.id, nextStatus);
      setOrders(orders.map(o => o.id === order.id ? { ...o, status: nextStatus } : o));
    } catch (error) {
      Alert.alert('Error', 'Failed to update order status');
    }
  };

  const renderOrder = ({ item }: { item: CookOrder }) => {
    const nextStatus = getNextStatus(item.status);
    const statusColor = STATUS_COLORS[item.status] || colors.textSecondary;
    const statusLabel = STATUS_LABELS[item.status] || item.status;

    return (
      <Card style={[styles.orderCard, { backgroundColor: colors.surface }]}>
        <View style={styles.orderContent}>
          <View style={styles.orderHeader}>
            <Text style={[styles.orderId, { color: colors.textSecondary }]}>Order #{item.id.slice(-8)}</Text>
            <View style={[{ backgroundColor: statusColor }, styles.statusChip]}>
              <Text style={styles.statusChipText}>{statusLabel}</Text>
            </View>
          </View>

          <View style={styles.orderDetails}>
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Meal ID:</Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>{item.mealId}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Quantity:</Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>{item.quantity}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Total:</Text>
              <Text style={[styles.detailValue, { color: colors.primary, fontWeight: 'bold' }]}>₹{item.totalPrice}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Type:</Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>{item.deliveryType}</Text>
            </View>
            {item.notes && (
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Notes:</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>{item.notes}</Text>
              </View>
            )}
            {item.scheduledFor && (
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Scheduled:</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>
                  {new Date(item.scheduledFor).toLocaleString()}
                </Text>
              </View>
            )}
          </View>

          {nextStatus && (
            <Button
              mode="contained"
              onPress={() => handleStatusUpdate(item)}
              style={[styles.actionButton, { backgroundColor: statusColor }]}
              icon="arrow-right"
            >
              Mark as {STATUS_LABELS[nextStatus]}
            </Button>
          )}

          {!nextStatus && item.status !== 'cancelled' && (
            <Button
              mode="outlined"
              onPress={() => handleStatusUpdate(item)}
              style={styles.cancelButton}
            >
              Cancel Order
            </Button>
          )}
        </View>
      </Card>
    );
  };

  const renderFilterChip = ({ item }: { item: string }) => (
    <Chip
      key={item}
      onPress={() => setFilter(item)}
      selected={filter === item}
      style={styles.filterChip}
    >
      {item.charAt(0).toUpperCase() + item.slice(1)}
    </Chip>
  );

  const filters = ['all', 'pending', 'accepted', 'preparing', 'ready', 'delivered', 'cancelled'];

  if (isLoading) {
    return <LoadingSpinner text="Loading orders..." />;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Appbar.Header style={{ backgroundColor: colors.surface }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="My Orders" titleStyle={{ color: colors.text }} />
      </Appbar.Header>

      <View style={styles.filterContainer}>
        <FlatList
          data={filters}
          keyExtractor={(item) => item}
          renderItem={renderFilterChip}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContent}
        />
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={renderOrder}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              {filter !== 'all' ? `No ${filter} orders` : 'No orders yet'}
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
              {filter !== 'all' ? 'Try a different filter' : 'Orders will appear here when customers place them'}
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  filterContent: {
    gap: 8,
    paddingVertical: 4,
  },
  filterChip: {
    // Chip styles handled by component
  },
  listContent: {
    padding: 16,
    paddingBottom: 20,
  },
  orderCard: {
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  orderContent: {
    padding: 16,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
  },
  statusChip: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  statusChipText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  orderDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  detailLabel: {
    fontSize: 14,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  actionButton: {
    width: '100%',
    marginTop: 8,
  },
  cancelButton: {
    width: '100%',
    marginTop: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default CookOrdersScreen;