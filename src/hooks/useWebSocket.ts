// hooks/useWebSocket.ts
import { useEffect, useRef, useCallback, useState } from 'react';
import { WEBSOCKET_URL } from '../utils/constants';
import { useAuth } from './useAuth';
import { DEMO_MODE } from '../services/mockData';

interface WebSocketMessage {
  type: string;
  data: any;
}

export const useWebSocket = (onMessage?: (data: any) => void) => {
  const wsRef = useRef<WebSocket | null>(null);
  const onMessageRef = useRef(onMessage);
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    if (!user) return;

    // Skip WebSocket connection in demo mode
    if (DEMO_MODE) {
      setIsConnected(true);
      return;
    }

    const wsUrl = WEBSOCKET_URL.replace('wss://', 'ws://').replace('https://', 'ws://').replace('http://', 'ws://');
    const fullUrl = `${wsUrl}/ws?user_id=${user.id}`;
    
    console.log('Connecting to WebSocket:', fullUrl);
    
    wsRef.current = new WebSocket(fullUrl);

    wsRef.current.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
    };

    wsRef.current.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        if (onMessageRef.current) {
          onMessageRef.current(message);
        }
      } catch (err) {
        console.error('Failed to parse WebSocket message:', err);
      }
    };

    wsRef.current.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    };

    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      wsRef.current?.close();
      wsRef.current = null;
    };
  }, [user]);

  const sendMessage = useCallback((event: string, data: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: event, data }));
    }
  }, []);

  return { sendMessage, isConnected };
};