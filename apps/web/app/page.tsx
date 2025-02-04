"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";



export default function Home() {
  const [roomId, setRoomId] = useState("");
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-y-12">

      <input type="text" placeholder="Enter the roomId" onChange={(e) => {
        setRoomId(e.target.value)
      }} />
      <button onClick={() => {
        router.push(`/room/${roomId}`)
      }}>Join Room</button>
    </div>
  );
}
