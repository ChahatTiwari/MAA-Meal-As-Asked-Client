import { io, Socket } from 'socket.io-client';
import { WEBSOCKET_URL } from '../utils/constants';

class WebSocketService {
  private socket: Socket | null = null;
  private listeners: { [key: string]: Function[] } = {};

  connect(token: string) {
    this.socket = io(WEBSOCKET_URL, {
      auth: { token },
    });

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    // Handle order updates
    this.socket.on('orderUpdate', (data) => {
      this.emit('orderUpdate', data);
    });
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }

  on(event: string, callback: Function) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  off(event: string, callback: Function) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }

  emit(event: string, data: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }

  send(event: string, data: any) {
    this.socket?.emit(event, data);
  }
}

export default new WebSocketService();