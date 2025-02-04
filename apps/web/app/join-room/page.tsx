"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function JoinRoom() {
  const [roomId, setRoomId] = useState("");
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="w-full max-w-md p-6 space-y-6">
        <h1 className="text-3xl font-bold text-center">Join a Room</h1>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Enter Room ID"
            className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <button
            className="w-full p-3 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
            onClick={() => {
              if (roomId.trim()) {
                router.push(`/room/${roomId}`);
              }
            }}
          >
            Join Room
          </button>
        </div>
      </div>
    </div>
  );
}
