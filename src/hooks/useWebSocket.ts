// hooks/useWebSocket.ts
// WebSocket hook with proper reconnection and message handling

import { useEffect, useRef, useCallback, useState } from 'react';
import { env } from '../config/env';
import { useAuth } from './useAuth';
import { WebSocketMessage, WebSocketEvents, OrderUpdateData } from '../types';
import { logger } from '../utils/logger';

interface UseWebSocketOptions {
  onMessage?: (data: WebSocketMessage) => void;
  onOrderUpdate?: (data: OrderUpdateData) => void;
  onConnect?: () => void;
  onDisconnect?: (reason: string) => void;
  onError?: (error: Error) => void;
  enabled?: boolean;
}

interface UseWebSocketReturn {
  sendMessage: (event: string, data: any) => void;
  isConnected: boolean;
  reconnect: () => void;
  disconnect: () => void;
}

export const useWebSocket = (options: UseWebSocketOptions = {}): UseWebSocketReturn => {
  const {
    onMessage,
    onOrderUpdate,
    onConnect,
    onDisconnect,
    onError,
    enabled = true,
  } = options;

  const wsRef = useRef<WebSocket | null>(null);
  const onMessageRef = useRef(onMessage);
  const onOrderUpdateRef = useRef(onOrderUpdate);
  const { user, isAuthenticated } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = env.websocket.reconnectAttempts;
  const reconnectDelay = env.websocket.reconnectDelay;

  // Update refs when callbacks change
  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    onOrderUpdateRef.current = onOrderUpdate;
  }, [onOrderUpdate]);

  const connect = useCallback(() => {
    if (!enabled || !isAuthenticated || !user) {
      logger.debug('WebSocket: Not connecting - disabled, not authenticated, or no user', undefined, 'WS');
      return;
    }

    // Skip WebSocket in demo mode
    if (env.features.demoMode) {
      logger.debug('WebSocket: Demo mode - skipping connection', undefined, 'WS');
      setIsConnected(true);
      return;
    }

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      logger.debug('WebSocket: Already connected', undefined, 'WS');
      return;
    }

    const wsUrl = env.websocket.url
      .replace('wss://', 'ws://')
      .replace('https://', 'ws://')
      .replace('http://', 'ws://');
    const fullUrl = `${wsUrl}/ws?user_id=${user.id}`;
    
    logger.info('WebSocket: Connecting', { url: fullUrl }, 'WS');

    try {
      wsRef.current = new WebSocket(fullUrl);

      wsRef.current.onopen = () => {
        logger.info('WebSocket: Connected', undefined, 'WS');
        setIsConnected(true);
        reconnectAttemptsRef.current = 0;
        onConnect?.();
      };

      wsRef.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          
          logger.debug('WebSocket: Message received', { type: message.type }, 'WS');
          
          // Handle specific message types
          if (message.type === 'orderUpdate' && onOrderUpdateRef.current) {
            onOrderUpdateRef.current(message.data);
          }
          
          // Call generic message handler
          if (onMessageRef.current) {
            onMessageRef.current(message);
          }
        } catch (err) {
          logger.error('WebSocket: Failed to parse message', { error: err }, 'WS');
        }
      };

      wsRef.current.onclose = (event) => {
        logger.warn('WebSocket: Disconnected', { 
          code: event.code, 
          reason: event.reason,
          wasClean: event.wasClean 
        }, 'WS');
        
        setIsConnected(false);
        onDisconnect?.(event.reason || 'Connection closed');

        // Attempt reconnection
        if (reconnectAttemptsRef.current < maxReconnectAttempts && enabled && isAuthenticated) {
          reconnectAttemptsRef.current++;
          const delay = reconnectDelay * Math.pow(1.5, reconnectAttemptsRef.current - 1);
          
          logger.info('WebSocket: Reconnecting', { 
            attempt: reconnectAttemptsRef.current, 
            delay 
          }, 'WS');
          
          setTimeout(connect, delay);
        }
      };

      wsRef.current.onerror = (error) => {
        logger.error('WebSocket: Error', { error }, 'WS');
        onError?.(error as Error);
      };
    } catch (error) {
      logger.error('WebSocket: Failed to create connection', { error }, 'WS');
      setIsConnected(false);
    }
  }, [enabled, isAuthenticated, user]);

  const disconnect = useCallback(() => {
    logger.info('WebSocket: Manual disconnect', undefined, 'WS');
    wsRef.current?.close(1000, 'Manual disconnect');
    wsRef.current = null;
    setIsConnected(false);
  }, []);

  const sendMessage = useCallback((event: string, data: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: event, data }));
      logger.debug('WebSocket: Message sent', { event }, 'WS');
    } else {
      logger.warn('WebSocket: Cannot send - not connected', { event }, 'WS');
    }
  }, []);

  const reconnect = useCallback(() => {
    logger.info('WebSocket: Manual reconnect', undefined, 'WS');
    disconnect();
    reconnectAttemptsRef.current = 0;
    connect();
  }, [connect, disconnect]);

  // Connect on mount and when dependencies change
  useEffect(() => {
    connect();
    
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  // Heartbeat
  useEffect(() => {
    if (!isConnected) return;
    
    const interval = setInterval(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: 'ping', data: {} }));
      }
    }, env.websocket.heartbeatInterval);
    
    return () => clearInterval(interval);
  }, [isConnected]);

  return {
    sendMessage,
    isConnected,
    reconnect,
    disconnect,
  };
};

export default useWebSocket;