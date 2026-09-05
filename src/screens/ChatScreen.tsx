// screens/ChatScreen.tsx

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
} from 'react';

import {
  View,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Alert,
} from 'react-native';

import {
  TextInput,
  Button,
  Appbar,
  FAB,
} from 'react-native-paper';

import {
  useAppDispatch,
  useAppSelector,
} from '../hooks/redux';

import {
  logout,
} from '../store/slices/authSlice';

import {
  addUserMessage,
  addMessage,
  sendMessage,
  clearError,
  startDemoOrder,
} from '../store/slices/chatSlice';

import {
  useWebSocket,
} from '../hooks/useWebSocket';

import ChatBubble from '../components/ChatBubble';

import LoadingSpinner from '../components/LoadingSpinner';

import { Message } from '../types';

import {
  useNavigation,
} from '@react-navigation/native';

import { RootStackParamList } from '../types';

import type {
  StackNavigationProp,
} from '@react-navigation/stack';


// ======================================================
// NAVIGATION TYPE
// ======================================================

type NavigationProp =
  StackNavigationProp<
    RootStackParamList,
    'Chat'
  >;


// ======================================================
// COMPONENT
// ======================================================

const ChatScreen: React.FC = () => {

  // ----------------------------------------------------
  // LOCAL STATE
  // ----------------------------------------------------

  const [
    inputText,
    setInputText,
  ] = useState('');

  const [
    isAtBottom,
    setIsAtBottom,
  ] = useState(true);


  // ----------------------------------------------------
  // REFS
  // ----------------------------------------------------

  const flatListRef =
    useRef<FlatList<Message>>(null);

  const fadeAnim =
    useRef(
      new Animated.Value(0)
    ).current;


  // ----------------------------------------------------
  // REDUX
  // ----------------------------------------------------

  const dispatch =
    useAppDispatch();

  const {
    user,
  } = useAppSelector(
    (state) => state.auth
  );

  const {
    messages,
    isLoading,
    error,
    demoFlowStep,
  } = useAppSelector(
    (state) => state.chat
  );

  const {
    colors,
  } = useAppSelector(
    (state) => state.theme
  );


  // ----------------------------------------------------
  // NAVIGATION
  // ----------------------------------------------------

  const navigation =
    useNavigation<NavigationProp>();


  // ====================================================
  // FADE-IN ANIMATION
  // ====================================================

  useEffect(() => {

    Animated.timing(
      fadeAnim,
      {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }
    ).start();

  }, [fadeAnim]);


  // ====================================================
  // WEBSOCKET
  // ====================================================

  const {
    sendMessage: sendWSMessage,
  } = useWebSocket({
    onOrderUpdate: (data) => {
      const statusMessage: Message = {

          id:
            `${Date.now()}-ws`,

          text:
            data.message,

          sender:
            'ai',

          timestamp:
            new Date().toISOString(),

          type:
            'order-status',

          data:
            data.order,
        };
        
        dispatch(
          addMessage(
            statusMessage
          )
        );
    },
  });


  // ====================================================
  // ERROR ALERT
  // ====================================================

  useEffect(() => {

    if (!error) {
      return;
    }

    Alert.alert(
      'Error',
      error,
      [
        {
          text: 'OK',
          onPress: () => {
            dispatch(
              clearError()
            );
          },
        },
      ]
    );

  }, [
    error,
    dispatch,
  ]);


  // ====================================================
  // SCROLL TO BOTTOM
  // ====================================================

  const scrollToBottom =
    useCallback(
      (
        animated = true
      ) => {

        requestAnimationFrame(
          () => {

            flatListRef.current?.scrollToEnd(
              {
                animated,
              }
            );

          }
        );

      },
      []
    );


  // ====================================================
  // AUTO SCROLL WHEN NEW MESSAGE ARRIVES
  // ====================================================

  useEffect(() => {

    if (
      messages.length === 0
    ) {
      return;
    }

    const timer =
      setTimeout(
        () => {
          scrollToBottom(true);
        },
        150
      );

    return () => {
      clearTimeout(timer);
    };

  }, [
    messages.length,
    scrollToBottom,
  ]);


  // ====================================================
  // CHECK IF SCROLLED TO BOTTOM
  // ====================================================

  const handleScroll =
    (event: any) => {

      const {
        contentOffset,
        contentSize,
        layoutMeasurement,
      } = event.nativeEvent;

      const paddingToBottom = 50;

      const isBottom =
        contentOffset.y +
        layoutMeasurement.height >=
        contentSize.height -
        paddingToBottom;

      setIsAtBottom(isBottom);
    };


  // ====================================================
  // SEND MESSAGE
  // ====================================================

  const handleSendMessage =
    async () => {

      const messageText =
        inputText.trim();

      // Don't send empty message
      if (!messageText) {
        return;
      }

      // Don't send while loading
      if (isLoading) {
        return;
      }

      // Clear input immediately
      setInputText('');

      // Mark as at bottom
      setIsAtBottom(true);


      try {

        // ------------------------------------------------
        // DEMO TRIGGER
        // ------------------------------------------------

        const lowerMessage =
          messageText.toLowerCase();

        const isDemoTrigger =
          lowerMessage.includes(
            'dal chawal'
          ) ||
          lowerMessage.includes(
            'dal rice'
          ) ||
          lowerMessage.includes(
            'dal and rice'
          ) ||
          lowerMessage.includes(
            'demo order'
          );


        if (
          isDemoTrigger &&
          demoFlowStep === 'idle'
        ) {

          dispatch(
            startDemoOrder(
              messageText
            )
          );

          return;
        }


        // ------------------------------------------------
        // NORMAL MESSAGE
        // ------------------------------------------------

        dispatch(
          addUserMessage(
            messageText
          )
        );


        // ------------------------------------------------
        // WEBSOCKET
        // ------------------------------------------------

        if (
          sendWSMessage
        ) {

          sendWSMessage(
            'userMessage',
            {
              text:
                messageText,
            }
          );

        }


        // ------------------------------------------------
        // BACKEND
        // ------------------------------------------------

        dispatch(
          sendMessage(
            {
              message:
                messageText,
            }
          )
        );

      } catch (err) {

        console.error(
          'Error sending message:',
          err
        );

        Alert.alert(
          'Error',
          'Failed to send message. Please try again.'
        );

      }

    };


  // ====================================================
  // RENDER MESSAGE
  // ====================================================

  const renderMessage =
    ({
      item,
    }: {
      item: Message;
    }) => {

      return (
        <View
          style={
            styles.messageWrapper
          }
        >

          <ChatBubble
            message={item}
          />

        </View>
      );
    };


  // ====================================================
  // KEYBOARD ENTER
  // ====================================================

  const handleKeyPress =
    (event: any) => {

      if (
        Platform.OS === 'web' &&
        event?.nativeEvent?.key ===
          'Enter' &&
        !event?.nativeEvent?.shiftKey
      ) {

        event.preventDefault();

        handleSendMessage();
      }

    };


  // ====================================================
  // LOGOUT
  // ====================================================

  const handleLogout =
    () => {

      dispatch(
        logout()
      );

    };


  // ====================================================
  // RETURN
  // ====================================================

  return (

    <View
      style={[
        styles.container,
        {
          backgroundColor:
            colors.background,
        },
      ]}
    >

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <Appbar.Header
        style={[
          styles.header,
          {
            backgroundColor:
              colors.surface,
          },
        ]}
      >

        <Appbar.Content
          title="🍽️ MAA"

          subtitle={
            user?.name
              ? `Welcome, ${user.name}`
              : 'Welcome'
          }

          titleStyle={[
            styles.headerTitle,
            {
              color:
                colors.text,
            },
          ]}

          subtitleStyle={[
            styles.headerSubtitle,
            {
              color:
                colors.textSecondary,
            },
          ]}
        />


        <Appbar.Action
          icon="account-circle"

          iconColor={
            colors.text
          }

          onPress={() =>
            navigation.navigate(
              'Profile'
            )
          }
        />


        <Appbar.Action
          icon="logout"

          iconColor={
            colors.text
          }

          onPress={
            handleLogout
          }
        />

      </Appbar.Header>


      {/* ================================================= */}
      {/* MAIN BODY */}
      {/* ================================================= */}

      <KeyboardAvoidingView
  style={styles.keyboardContainer}
  behavior={Platform.OS === 'ios' ? 'padding' : undefined}
  keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
>

        {/* =============================================== */}
        {/* CHAT AREA */}
        {/* =============================================== */}

        <View
          style={
            styles.chatArea
          }
        >

          <FlatList
            ref={
              flatListRef
            }

            data={
              messages
            }

            keyExtractor={(
              item
            ) =>
              item.id
            }

            renderItem={
              renderMessage
            }

            style={
              styles.messagesList
            }

            contentContainerStyle={
              styles.messagesContent
            }

            showsVerticalScrollIndicator={
              true
            }

            keyboardShouldPersistTaps={
              'always'
            }

            keyboardDismissMode={
              'on-drag'
            }

            removeClippedSubviews={
              false
            }

            initialNumToRender={
              10
            }

            maxToRenderPerBatch={
              10
            }

            windowSize={
              10
            }

            onScroll={
              handleScroll
            }

            scrollEventThrottle={
              16
            }

            onContentSizeChange={() => {

              if (
                isAtBottom
              ) {

                scrollToBottom(
                  true
                );

              }

            }}

            ListFooterComponent={

              <View
                style={
                  styles.listFooter
                }
              />

            }

          />


          {/* ============================================= */}
          {/* LOADING */}
          {/* ============================================= */}

          {isLoading && (

            <View
              pointerEvents="none"

              style={
                styles.loadingOverlay
              }
            >

              <View
                style={[
                  styles.loadingBox,
                  {
                    backgroundColor:
                      colors.surface,
                  },
                ]}
              >

                <LoadingSpinner
                  text={
                    demoFlowStep ===
                    'searching_cooks'
                      ? 'Finding MAA nearby…'
                      : 'Thinking...'
                  }
                />

              </View>

            </View>

          )}

        </View>


        {/* ================================================= */}
        {/* MESSAGE INPUT */}
        {/* ================================================= */}

        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor:
                colors.surface,

              borderTopColor:
                colors.textSecondary +
                '20',
            },
          ]}
        >

          <TextInput
            value={
              inputText
            }

            onChangeText={
              setInputText
            }

            placeholder={
              'Describe what you want to eat...'
            }

            mode="outlined"

            style={[
              styles.textInput,
              {
                backgroundColor:
                  colors.surface,
              },
            ]}

            multiline

            maxLength={
              500
            }

            disabled={
              isLoading
            }

            outlineColor={
              colors.textSecondary +
              '40'
            }

            activeOutlineColor={
              colors.primary
            }

            textColor={
              colors.text
            }

            placeholderTextColor={
              colors.textSecondary
            }

            onSubmitEditing={
              Platform.OS === 'web'
                ? undefined
                : handleSendMessage
            }

            onKeyPress={
              handleKeyPress
            }

            right={

              <TextInput.Icon
                icon={
                  isLoading
                    ? 'clock-outline'
                    : 'send'
                }

                onPress={
                  handleSendMessage
                }

                disabled={
                  !inputText.trim() ||
                  isLoading
                }

                color={
                  !inputText.trim() ||
                  isLoading
                    ? colors.textSecondary
                    : colors.primary
                }
              />

            }

          />

        </View>


        {/* ================================================= */}
        {/* SCROLL TO BOTTOM FAB */}
        {/* ================================================= */}

        {messages.length > 3 &&
          !isAtBottom && (

            <FAB
              icon="arrow-down"

              style={[
                styles.fab,
                {
                  backgroundColor:
                    colors.primary,
                },
              ]}

              color="#FFFFFF"

              onPress={() => {

                setIsAtBottom(
                  true
                );

                scrollToBottom(
                  true
                );

              }}

              small
            />

          )}

      </KeyboardAvoidingView>

    </View>

  );
};


// ======================================================
// STYLES
// ======================================================

const styles =
  StyleSheet.create({

    // --------------------------------------------------
    // ROOT
    // --------------------------------------------------

    container: {
      flex: 1,

      width: '100%',
    },


    // --------------------------------------------------
    // KEYBOARD CONTAINER
    // --------------------------------------------------

    keyboardContainer: {
      flex: 1,

      width: '100%',

      minHeight: 0,
    },


    // --------------------------------------------------
    // HEADER
    // --------------------------------------------------

    header: {
      elevation: 4,

      shadowColor: '#000',

      shadowOffset: {
        width: 0,
        height: 2,
      },

      shadowOpacity: 0.15,

      shadowRadius: 3,

      zIndex: 10,
    },

    headerTitle: {
      fontWeight: '700',

      fontSize: 20,
    },

    headerSubtitle: {
      fontSize: 13,
    },


    // --------------------------------------------------
    // CHAT AREA
    // --------------------------------------------------

    chatArea: {
      flex: 1,

      width: '100%',

      minHeight: 0,
    },


    // --------------------------------------------------
    // FLATLIST
    // --------------------------------------------------

    messagesList: {
      flex: 1,

      width: '100%',
    },

    messagesContent: {
      flexGrow: 1,

      width: '100%',

      paddingTop: 10,

      paddingBottom: 90,

      paddingHorizontal: 8,
    },

    messageWrapper: {
      width: '100%',
    },

    listFooter: {
      height: 10,
    },


    // --------------------------------------------------
    // LOADING
    // --------------------------------------------------

    loadingOverlay: {
      position: 'absolute',

      left: 0,

      right: 0,

      bottom: 0,

      justifyContent:
        'flex-end',

      alignItems:
        'center',

      paddingBottom: 8,
    },

    loadingBox: {
      minWidth: 180,

      maxWidth: 300,

      borderRadius: 14,

      paddingHorizontal: 16,

      paddingVertical: 10,

      elevation: 4,

      shadowColor: '#000',

      shadowOffset: {
        width: 0,
        height: 2,
      },

      shadowOpacity: 0.12,

      shadowRadius: 5,
    },


    // --------------------------------------------------
    // INPUT
    // --------------------------------------------------

    inputContainer: {
      width: '100%',

      flexDirection: 'row',

      alignItems: 'flex-end',

      paddingHorizontal: 12,

      paddingTop: 10,

      paddingBottom: 10,

      gap: 8,

      borderTopWidth: 1,

      elevation: 8,

      shadowColor: '#000',

      shadowOffset: {
        width: 0,
        height: -2,
      },

      shadowOpacity: 0.1,

      shadowRadius: 4,

      zIndex: 20,
    },

    textInput: {
      flex: 1,

      minWidth: 0,

      maxHeight: 100,

      fontSize: 16,
    },

    sendButton: {
      borderRadius: 20,

      marginBottom: 4,
    },

    sendButtonContent: {
      minHeight: 42,

      paddingHorizontal: 12,
    },

    sendButtonLabel: {
      color: '#FFFFFF',

      fontSize: 14,

      fontWeight: '600',
    },


    // --------------------------------------------------
    // FAB
    // --------------------------------------------------

    fab: {
      position: 'absolute',

      right: 16,

      bottom: 88,

      zIndex: 30,
    },

  });


export default ChatScreen;