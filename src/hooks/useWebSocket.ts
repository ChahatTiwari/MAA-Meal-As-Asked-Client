// hooks/useWebSocket.ts
import { useEffect, useRef, useCallback } from 'react';
import io from 'socket.io-client';
import type { Socket } from 'socket.io-client';
import { WEBSOCKET_URL } from '../utils/constants';
import { useAuth } from './useAuth';

export const useWebSocket = (onMessage?: (data: any) => void) => {
  const socketRef = useRef<Socket | null>(null);
  const onMessageRef = useRef(onMessage);
  const { user } = useAuth();

  // Keep the latest onMessage callback without forcing reconnection
  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    if (!user) return;

    // Initialize WebSocket connection
    socketRef.current = io(WEBSOCKET_URL, {
      auth: {
        token: user.token,
      },
    });

    socketRef.current.on('connect', () => {
      console.log('WebSocket connected');
    });

    socketRef.current.on('orderUpdate', (data: any) => {
      if (onMessageRef.current) {
        onMessageRef.current(data);
      }
    });

    socketRef.current.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [user]);

  const sendMessage = useCallback((event: string, data: any) => {
    socketRef.current?.emit(event, data);
  }, []);

  return { sendMessage };
};