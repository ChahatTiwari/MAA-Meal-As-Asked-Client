// screens/ChatScreen.tsx
import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, FlatList, KeyboardAvoidingView, Platform, Animated, Alert } from 'react-native';
import { TextInput, Button, Appbar, FAB } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { logout } from '../store/slices/authSlice';
import { addUserMessage, addMessage, sendMessage, clearError } from '../store/slices/chatSlice';
import { useWebSocket } from '../hooks/useWebSocket';
import ChatBubble from '../components/ChatBubble';
import LoadingSpinner from '../components/LoadingSpinner';
import { Message } from '../types';
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from '../types';
import type { StackNavigationProp } from '@react-navigation/stack';
type NavigationProp = StackNavigationProp<RootStackParamList, 'Chat'>;

const ChatScreen: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { messages, isLoading, error } = useAppSelector((state) => state.chat);
  const { colors } = useAppSelector((state) => state.theme);
  const navigation = useNavigation<NavigationProp>();

  // WebSocket for real-time updates
  const { sendMessage: sendWSMessage } = useWebSocket((data) => {
    if (data.type === 'orderUpdate') {
      const statusMessage: Message = {
        id: Date.now().toString(),
        text: data.message,
        sender: 'ai',
        timestamp: new Date().toISOString(),
        type: 'order-status',
        data: data.order,
      };
      dispatch(addMessage(statusMessage));
    }
  });

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  // Show error alert when error occurs
  useEffect(() => {
    if (error) {
      Alert.alert(
        'Error',
        error,
        [
          {
            text: 'OK',
            onPress: () => dispatch(clearError()),
          },
        ]
      );
    }
  }, [error, dispatch]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const messageText = inputText.trim();
    setInputText('');

    try {
      // Add user message to chat first
      dispatch(addUserMessage(messageText));

      // Send message to WebSocket if available
      if (sendWSMessage) {
        sendWSMessage('userMessage', { text: messageText });
      }

      // Send message to OpenAI API through Redux
      dispatch(sendMessage(messageText));
      
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message. Please try again.');
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const animatedStyle = {
      opacity: fadeAnim,
      transform: [
        {
          translateY: fadeAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [20, 0],
          }),
        },
      ],
    };

    return (
      <Animated.View style={animatedStyle}>
        <ChatBubble message={item} />
      </Animated.View>
    );
  };

  const scrollToBottom = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  // Auto-scroll when new messages are added
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(scrollToBottom, 100);
    }
  }, [messages.length]);

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleKeyPress = (event: any) => {
    if (event.nativeEvent.key === 'Enter' && !event.nativeEvent.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Appbar.Header style={{ backgroundColor: colors.surface, elevation: 4 }}>
        <Appbar.Content 
          title="🍽️ MAA" 
          subtitle={`Welcome, ${user?.name}`}
          titleStyle={{ color: colors.text, fontWeight: 'bold' }}
          subtitleStyle={{ color: colors.textSecondary }}
        />
        <Appbar.Action 
          icon="account-circle" 
          onPress={() => navigation.navigate("Profile")}
          iconColor={colors.text}
        />
        <Appbar.Action 
          icon="logout" 
          onPress={handleLogout}
          iconColor={colors.text}
        />
      </Appbar.Header>

      <KeyboardAvoidingView 
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          style={styles.messagesList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.messagesContent}
          removeClippedSubviews={false}
          initialNumToRender={20}
          maxToRenderPerBatch={10}
          windowSize={10}
        />

        {isLoading && (
          <Animated.View style={[styles.loadingContainer, { opacity: fadeAnim }]}>
            <LoadingSpinner text="thinking..." />
          </Animated.View>
        )}

        <View style={[styles.inputContainer, { 
          backgroundColor: colors.surface,
          borderTopColor: colors.textSecondary + '20'
        }]}>
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder="Describe what you want to eat..."
            mode="outlined"
            style={styles.textInput}
            multiline
            maxLength={500}
            disabled={isLoading}
            right={
              <TextInput.Icon
                icon={isLoading ? "clock-outline" : "send"}
                onPress={handleSendMessage}
                disabled={!inputText.trim() || isLoading}
                color={!inputText.trim() || isLoading ? colors.textSecondary : colors.primary}
              />
            }
            onSubmitEditing={handleSendMessage}
            onKeyPress={handleKeyPress}
            outlineColor={colors.textSecondary + '40'}
            activeOutlineColor={colors.primary}
            textColor={colors.text}
            placeholderTextColor={colors.textSecondary}
          />
          
          {/* Alternative send button for better UX */}
          {inputText.trim() && !isLoading && (
            <Button
              mode="contained"
              onPress={handleSendMessage}
              style={[styles.sendButton, { backgroundColor: colors.primary }]}
              contentStyle={styles.sendButtonContent}
              labelStyle={{ color: 'white', fontSize: 14 }}
            >
              Send
            </Button>
          )}
        </View>

        {messages.length > 3 && (
          <FAB
            icon="arrow-down"
            style={[styles.fab, { backgroundColor: colors.primary }]}
            onPress={scrollToBottom}
            small
          />
        )}
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingVertical: 8,
    paddingBottom: 20,
    flexGrow: 1,
  },
  loadingContainer: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    padding: 16,
    borderTopWidth: 1,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  textInput: {
    flex: 1,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    borderRadius: 20,
    marginBottom: 4,
  },
  sendButtonContent: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 80,
  },
});

export default ChatScreen;