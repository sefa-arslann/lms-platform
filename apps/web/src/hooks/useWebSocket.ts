import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: string;
}

export const useWebSocket = (url: string) => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const connect = () => {
      try {
        const socket = io(url, {
          transports: ['websocket', 'polling'],
          autoConnect: true,
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionAttempts: 5,
        });

        socketRef.current = socket;

        socket.on('connect', () => {
          setIsConnected(true);
          setError(null);
          
          // Join admin room
          socket.emit('join-admin', { adminId: 'admin-dashboard' });
        });

        socket.on('connected', (data) => {
        });

        socket.on('joined-admin', (data) => {
        });

        socket.on('dashboard-update', (data) => {
          setLastMessage({
            type: 'dashboard-update',
            data,
            timestamp: new Date().toISOString(),
          });
        });

        socket.on('user-activity', (data) => {
          setLastMessage({
            type: 'user-activity',
            data,
            timestamp: new Date().toISOString(),
          });
        });

        socket.on('course-view', (data) => {
          setLastMessage({
            type: 'course-view',
            data,
            timestamp: new Date().toISOString(),
          });
        });

        socket.on('video-analytics', (data) => {
          setLastMessage({
            type: 'video-analytics',
            data,
            timestamp: new Date().toISOString(),
          });
        });

        socket.on('disconnect', () => {
          setIsConnected(false);
        });

        socket.on('connect_error', (error) => {
          setError(`Connection error: ${error.message}`);
        });

        socket.on('error', (error) => {
          setError(`Socket error: ${error}`);
        });

      } catch (err) {
        setError('Failed to create Socket.io connection');
      }
    };

    connect();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [url]);

  const sendMessage = (message: any) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('message', message);
    }
  };

  const reconnect = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current.connect();
    }
  };

  return {
    isConnected,
    lastMessage,
    error,
    sendMessage,
    reconnect,
    socket: socketRef.current,
  };
};
