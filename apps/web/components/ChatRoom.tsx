import axios from "axios";
import React, { useEffect, useState } from "react";
import { Message } from "../types";

async function getChats(roomId: string): Promise<Message[]> {
  try {
    const response = await axios.get(`http://localhost:3001/chats/${roomId}`);
    return response.data.messages;
  } catch (error) {
    console.error("Error fetching chats:", error);
    return [];
  }
}

const ChatRoom = ({ id }: { id: string }) => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const fetchChats = async () => {
      const chats = await getChats(id);
      setMessages(chats);
    };
    fetchChats();
  }, [id]);

  return (
    <div>
      <h2>Chat Room</h2>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>{msg.message}</div>
        ))}
      </div>
    </div>
  );
};

export default ChatRoom;