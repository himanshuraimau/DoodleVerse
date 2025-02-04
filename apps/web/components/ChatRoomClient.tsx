"use client";

import { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";

interface Message {
  id?: number;
  message: string;
  userId?: string;
  timestamp?: string;
}

interface WebSocketMessage {
  type: string;
  message?: string;
  roomId: string | number;
}

export function ChatRoomClient({
  messages,
  id,
}: {
  messages: Message[];
  id: string;
}) {
  const [chats, setChats] = useState<Message[]>(messages);
  const [currentMessage, setCurrentMessage] = useState("");
  const { socket, loading } = useSocket();

  useEffect(() => {
    if (!socket || loading) return;

    const handleMessage = (event: MessageEvent) => {
      try {
        const parsedData = JSON.parse(event.data) as WebSocketMessage;
        if (parsedData.type === "chat" && parsedData.message) {
          setChats((prev) => [...prev, { message: parsedData.message || "" }]);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    socket.send(
      JSON.stringify({
        type: "join_room",
        roomId: id,
      })
    );

    socket.addEventListener("message", handleMessage);

    return () => {
      socket.removeEventListener("message", handleMessage);
    };
  }, [socket, loading, id]);

  return (
    <div>
      <div>
        {chats.map((m, index) => (
          <div key={index}>{m.message}</div>
        ))}
      </div>
      <input
        type="text"
        value={currentMessage}
        className="p-2 border border-gray-300 rounded"
        onChange={(e) => setCurrentMessage(e.target.value)}
      />
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded"
        onClick={() => {
          if (currentMessage.trim()) {
            socket?.send(
              JSON.stringify({
                type: "chat",
                roomId: id,
                message: currentMessage,
              })
            );
            setCurrentMessage("");
          } else {
            alert("Please enter a message");
          }
        }}
      >
        Send message
      </button>
    </div>
  );
}