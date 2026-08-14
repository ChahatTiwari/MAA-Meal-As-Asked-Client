// components/ChatBubble.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Message, RootStackParamList } from '../types';
import { useAppSelector } from '../hooks/redux';
import IngredientTable from './IngredientTable';
import OrderStatus from './OrderStatus';
import type { StackNavigationProp } from '@react-navigation/stack';

type NavigationProp = StackNavigationProp<RootStackParamList, 'Chat'>;

interface ChatBubbleProps {
  message: Message;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const { colors } = useAppSelector((state) => state.theme);
  const navigation = useNavigation<NavigationProp>();
  const isUser = message.sender === 'user';

  const renderContent = () => {
    switch (message.type) {
      case 'ingredient-table':
        return <IngredientTable ingredients={message.data} />;
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
    maxWidth: '80%',
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