"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function CreateRoom() {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleCreateRoom = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3001/room",
        { name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      router.push(`/room/${response.data.roomId}`);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create room");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="w-full max-w-md p-6 space-y-6">
        <h1 className="text-3xl font-bold text-center">Create a Room</h1>
        {error && <div className="text-red-500 text-center">{error}</div>}
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
        </div>
      </div>
    </div>
  );
}
