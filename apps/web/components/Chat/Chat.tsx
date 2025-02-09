"use client";
import { useState, useEffect, useRef } from "react";
import { Message } from "../../types";
import { useSocketStore } from "../../stores/useSocketStore";

interface ChatProps {
  roomId: number;
  sendMessage: (message: string) => void;
  exitRoom: () => void;
  isLoading: boolean;
  error: string | null;
}

export default function Chat({ sendMessage, exitRoom, isLoading, error }: ChatProps) {
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messages = useSocketStore(state => state.messages);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (error || isLoading) {
    return (
      <div className="flex flex-col h-[400px] w-full max-w-md bg-gray-900 rounded-lg items-center justify-center">
        <p className="text-white">{error || "Loading chat..."}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[400px] w-full max-w-md bg-gray-900 rounded-lg shadow-lg">
      <div className="flex justify-between items-center p-4 border-b border-gray-800">
        <h2 className="text-white font-semibold">Chat Room</h2>
        <button
          onClick={exitRoom}
          className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Exit
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((message) => {
          const messageKey = `msg-${message.id}`;
          return (
            <div
              key={messageKey}
              className={`flex flex-col rounded-lg p-3 w-fit max-w-[75%] 
                ${message.isCurrentUser ? 'bg-blue-700 text-white ml-auto' : 'bg-gray-800 text-gray-300 mr-auto'}`}
            >
              <div className="flex justify-between items-center">
                <p className="break-words">{message.message}</p>
                <span className="text-xs text-gray-500 ml-2">
                 
                  {new Intl.DateTimeFormat('en-IN', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    timeZone: 'Asia/Kolkata',
                    hour12: true
                  }).format(new Date(message.createdAt))}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-gray-800">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyUp={(e) => e.key === "Enter" && handleSendMessage(newMessage)}
            placeholder="Type a message..."
            className="flex-1 p-3 bg-gray-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => handleSendMessage(newMessage)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );

  function handleSendMessage(message: string) {
    sendMessage(message);
    setNewMessage("");
  }
}
