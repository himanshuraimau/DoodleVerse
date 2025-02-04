"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Chat from "../../../components/Chat";


export default function RoomClient({ slug }: { slug: string }) {
  const [room, setRoom] = useState<any>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:3001/room/${slug}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setRoom(response.data.room);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch room");
      }
    };

    fetchRoom();
  }, [slug]);

  if (error) return <div>Error: {error}</div>;
  if (!room) return <div>Loading...</div>;

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 p-4">
      <h1 className="text-3xl font-bold text-white mb-8">{room.name}</h1>
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl">
        <div className="flex-1">
         
        </div>
       <Chat roomId= {room.id} />
      </div>
    </div>
  );
}
