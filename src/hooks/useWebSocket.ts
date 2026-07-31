// hooks/useWebSocket.ts
import { useEffect, useRef } from 'react';
import io,{ Socket } from 'socket.io-client';
import { WEBSOCKET_URL } from '../utils/constants';
import { useAuth } from './useAuth';

export const useWebSocket = (onMessage?: (data: any) => void) => {
  const socketRef = useRef<Socket | null>(null);
  const { user } = useAuth();

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
      if (onMessage) {
        onMessage(data);
      }
    });

    socketRef.current.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [user, onMessage]);

  const sendMessage = (event: string, data: any) => {
    socketRef.current?.emit(event, data);
  };

  return { sendMessage };
};