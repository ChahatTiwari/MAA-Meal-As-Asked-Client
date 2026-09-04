// components/CookListCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Button, Avatar } from 'react-native-paper';
import { useAppSelector } from '../hooks/redux';

interface CookListCardProps {
  cook: any;
  onSelect: (cook: any) => void;
}

const CookListCard: React.FC<CookListCardProps> = ({ cook, onSelect }) => {
  const { colors } = useAppSelector((state) => state.theme);
  
  const handlePress = () => {
    onSelect(cook);
  };

  return (
    <TouchableOpacity 
      onPress={handlePress}
      style={styles.card}
      activeOpacity={0.85}
    >
      <Card style={styles.cardInner} elevation={2}>
        <View style={styles.cardContent}>
          <View style={styles.cookHeader}>
            <Avatar.Text
              size={48}
              label={cook.displayName?.charAt(0) || 'M'}
              style={{ backgroundColor: colors.primary }}
            />
            <View style={styles.cookInfo}>
              <Text style={styles.cookName}>{cook.displayName}</Text>
              <View style={styles.ratingRow}>
                <Text style={styles.ratingStars}>
                  {'★'.repeat(Math.floor(cook.rating))}{cook.rating % 1 >= 0.5 ? '½' : ''}
                </Text>
                <Text style={styles.ratingText}>
                  {cook.rating} • {cook.totalOrders} orders
                </Text>
              </View>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.detailsRow}>
            <View style={styles.detailItem}>
              <Text style={styles.detailIcon}>📍</Text>
              <Text style={styles.detailText}>{cook.location?.address || 'Nearby'}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailIcon}>💰</Text>
              <Text style={styles.priceText}>₹{cook.mealPrice}</Text>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.bioRow}>
            <Text style={styles.bioText}>{cook.bio}</Text>
          </View>
          
          <Button
            mode="contained"
            onPress={handlePress}
            style={styles.selectButton}
            contentStyle={styles.selectButtonContent}
            icon="account-check"
            labelStyle={{ fontWeight: '600', fontSize: 14 }}
          >
            Select This MAA
          </Button>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 4,
    marginVertical: 6,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  cardInner: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  cardContent: {
    padding: 14,
  },
  cookHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cookInfo: {
    flex: 1,
    marginLeft: 12,
  },
  cookName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingStars: {
    fontSize: 14,
    color: '#FFD700',
    marginRight: 2,
  },
  ratingText: {
    fontSize: 12,
    color: '#7F8C8D',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 10,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailIcon: {
    fontSize: 16,
  },
  detailText: {
    fontSize: 13,
    color: '#5D6D7E',
  },
  priceText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FF6B35',
  },
  bioRow: {
    marginBottom: 12,
  },
  bioText: {
    fontSize: 13,
    color: '#5D6D7E',
    lineHeight: 18,
    fontStyle: 'italic',
  },
  selectButton: {
    borderRadius: 10,
    backgroundColor: '#FF6B35',
    width: '100%',
  },
  selectButtonContent: {
    paddingVertical: 10,
  },
});

export default CookListCard;