"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { CreateRoomResponse, CreateRoomRequest } from "../../types";
import { useRoomStore } from "../../stores/useRoomStore";

export default function CreateRoom() {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const { currentRoom, setCurrentRoom } = useRoomStore();

  const handleCreateRoom = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3001/room",
        { name } as CreateRoomRequest,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCurrentRoom(response.data.room);
      console.log(response.data.room);
      setSuccess(true);
      setError("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create room");
    }
  };

  const handleJoinRoom = () => {
    if (currentRoom?.id) {
      router.push(`/room/${currentRoom.id}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="w-full max-w-md p-6 space-y-6">
        <h1 className="text-3xl font-bold text-center">Create a Room</h1>
        {error && <div className="text-red-500 text-center">{error}</div>}
        {success && (
          <div className="space-y-4">
            <div className="text-green-500 text-center">
              Room created successfully!
            </div>
            <button
              className="w-full p-3 bg-green-500 rounded-lg hover:bg-green-600 transition-colors"
              onClick={handleJoinRoom}
            >
              Join Room
            </button>
          </div>
        )}
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Room Name"
            className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button
            className="w-full p-3 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
            onClick={handleCreateRoom}
          >
            Create Room
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
