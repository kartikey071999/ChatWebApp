import { useEffect, useRef, useCallback, useState } from 'react';
import { getWsUrl } from '@/config/api';
import type { WSMessage, Message } from '@/types';

interface UseWebSocketOptions {
  channelId: string;
  userId: string;
  onMessage: (message: Message) => void;
  onUserJoined: (userId: string, onlineUsers: string[]) => void;
  onUserLeft: (userId: string, onlineUsers: string[]) => void;
}

export const useWebSocket = ({
  channelId,
  userId,
  onMessage,
  onUserJoined,
  onUserLeft,
}: UseWebSocketOptions) => {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const reconnectAttemptsRef = useRef(0);
  const [isConnected, setIsConnected] = useState(false);
  const mountedRef = useRef(true);
  
  // Store callbacks in refs to prevent recreating connect function
  const callbacksRef = useRef({ onMessage, onUserJoined, onUserLeft });
  
  useEffect(() => {
    callbacksRef.current = { onMessage, onUserJoined, onUserLeft };
  }, [onMessage, onUserJoined, onUserLeft]);

  const connect = useCallback(() => {
    // Prevent connection if already open or unmounted
    if (!mountedRef.current || wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    const wsUrl = getWsUrl(`/channels/${channelId}/${userId}`);
    console.log('Connecting to WebSocket:', wsUrl);
    
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      reconnectAttemptsRef.current = 0;
    };

    ws.onmessage = (event) => {
      try {
        const data: WSMessage = JSON.parse(event.data);
        console.log('WS message received:', data);

        switch (data.type) {
          case 'message':
            if (data.id && data.sender_id && data.content && data.created_at) {
              callbacksRef.current.onMessage({
                id: data.id,
                sender_id: data.sender_id,
                channel_id: channelId,
                content: data.content,
                created_at: data.created_at,
                status: 'sent',
              });
            }
            break;
          case 'user_joined':
            if (data.user_id && data.online_users) {
              callbacksRef.current.onUserJoined(data.user_id, data.online_users);
            }
            break;
          case 'user_left':
            if (data.user_id && data.online_users) {
              callbacksRef.current.onUserLeft(data.user_id, data.online_users);
            }
            break;
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = (event) => {
      console.log('WebSocket closed:', event.code, event.reason);
      setIsConnected(false);
      wsRef.current = null;
      
      // Only auto-reconnect if still mounted and not a clean close
      if (mountedRef.current && event.code !== 1000) {
        const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000);
        console.log(`Reconnecting in ${delay}ms... (attempt ${reconnectAttemptsRef.current + 1})`);
        
        reconnectTimeoutRef.current = setTimeout(() => {
          reconnectAttemptsRef.current += 1;
          connect();
        }, delay);
      }
    };
  }, [channelId, userId]);

  const disconnect = useCallback(() => {
    console.log('Disconnecting WebSocket');
    mountedRef.current = false;
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (wsRef.current) {
      wsRef.current.close(1000, 'Client disconnecting');
      wsRef.current = null;
    }
    setIsConnected(false);
  }, []);

  const sendMessage = useCallback((content: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ content }));
      console.log('Message sent via WebSocket:', content);
    } else {
      console.error('WebSocket not connected');
      throw new Error('Not connected');
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    connect();
    
    return () => {
      disconnect();
    };
  }, [channelId, userId]); // Only reconnect when channel/user changes

  return { isConnected, sendMessage, reconnect: connect };
};
