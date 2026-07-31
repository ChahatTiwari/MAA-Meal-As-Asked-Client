// components/ChatBubble.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Message } from '../types';
import { useAppSelector } from '../hooks/redux';
import IngredientTable from './IngredientTable';
import OrderStatus from './OrderStatus';

interface ChatBubbleProps {
  message: Message;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const { colors } = useAppSelector((state) => state.theme);
  const isUser = message.sender === 'user';

  const renderContent = () => {
    switch (message.type) {
      case 'ingredient-table':
        return <IngredientTable ingredients={message.data} />;
      case 'order-status':
        return <OrderStatus order={message.data} />;
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
});

export default ChatBubble;