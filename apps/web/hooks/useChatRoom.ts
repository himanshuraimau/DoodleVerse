import { useState, useEffect } from "react";
import axios from "axios";
import { Message } from "../types";
import { useSocketStore } from "../stores/useSocketStore";

interface UseChatRoomProps {
  roomId: number;
}

export const useChatRoom = ({ roomId }: UseChatRoomProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const socket = useSocketStore(state => state.socket);
  const messages = useSocketStore(state => state.messages);
  const isConnecting = useSocketStore(state => state.isConnecting);
  const connect = useSocketStore(state => state.connect);
  const disconnect = useSocketStore(state => state.disconnect);
  const [userId, setUserId] = useState<string>('unknown');
  const addMessage = useSocketStore(state => state.addMessage);
  const setCurrentUserId = useSocketStore(state => state.setCurrentUserId);
  const clearMessages = useSocketStore(state => state.clearMessages);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId') || 'unknown';
    setUserId(storedUserId);
    setCurrentUserId(storedUserId);  // Set current user ID in store
  }, []);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found");
        return;
      }
      const response = await axios.get(`http://localhost:3001/room/${roomId}/chats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      response.data.messages.forEach((message: Message) => {
        addMessage(message);
      });
    } catch (err: any) {
      setError(err.message || "Failed to fetch messages");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    return () => {
      clearMessages(); // Clear messages when leaving room or unmounting
    };
  }, [roomId]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      connect(token);
    }
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  useEffect(() => {
    if (socket) {
      socket.send(JSON.stringify({
        type: "join_room",
        roomId: roomId.toString()
      }));
    }
  }, [socket, roomId]);

  const sendMessage = (message: string) => {
    if (!socket || !message.trim()) return;

    const messageData = {
      type: "chat",
      roomId: roomId.toString(),
      message: message.trim(),
      userId: userId
    };

    socket.send(JSON.stringify(messageData));
  };

  const exitRoom = () => {
    if (!socket) return;

    const messageData = {
      type: "leave_room",
      roomId: roomId.toString(),
      userId: userId
    };

    socket.send(JSON.stringify(messageData));
  };

  return { messages, sendMessage, exitRoom, isLoading, error, isConnecting };
};