"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useRoomStore } from '../../stores/useRoomStore'

export default function JoinRoom() {
  const [roomName, setRoomName] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { currentRoom, setCurrentRoom } = useRoomStore()

  const handleJoinRoom = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:3001/room/${roomName}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data.room);
      
      if (response.data.room) {
        setCurrentRoom(response.data.room);
        router.push(`/room/${response.data.room.id}`);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to join room");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="w-full max-w-md p-6 space-y-6">
        <h1 className="text-3xl font-bold text-center">Join a Room</h1>
        {error && <div className="text-red-500 text-center">{error}</div>}
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Enter Room Name"
            className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />
          <button
            className="w-full p-3 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
            onClick={handleJoinRoom}
          >
            Join Room
          </button>
          <button
            className="w-full p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
            onClick={() => router.push('/')}
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
