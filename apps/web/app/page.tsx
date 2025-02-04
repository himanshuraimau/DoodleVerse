"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const [roomId, setRoomId] = useState("");
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-y-12">
      <input
        type="text"
        placeholder="Enter the room ID"
        className="p-2 border border-gray-300 rounded"
        onChange={(e) => setRoomId(e.target.value)}
      />
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded"
        onClick={() => {
          if (roomId.trim()) {
            router.push(`/room/${roomId}`);
          } else {
            alert("Please enter a valid room ID");
          }
        }}
      >
        Join Room
      </button>
    </div>
  );
}
