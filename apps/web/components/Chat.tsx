"use client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";

interface Message {
  id: number;
  message: string;
  userId: string;
}

export default function Chat({ roomId }: { roomId: number }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    try {
      
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:3001/room/${roomId}/chats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(response.data.messages);
      setMessages(response.data.messages);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    }
  };

  useEffect(() => {
    fetchMessages();
    setInterval(fetchMessages, 1000);
    
  }, [roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  

  return (
    <div className="flex flex-col h-[400px] w-full max-w-md bg-gray-800 rounded-lg">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="bg-gray-700 p-3 rounded-lg">
            <p className="text-sm text-gray-300">{message.id}</p>
            <p className="text-white">{message.message}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-gray-700">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter"}
            placeholder="Type a message..."
            className="flex-1 p-2 bg-gray-700 rounded-lg text-white"
          />
          <button
            // onClick={sendMessage}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
