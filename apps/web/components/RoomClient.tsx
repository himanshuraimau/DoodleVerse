"use client";
import { useState } from "react";
import { ChatRoomClient } from "./ChatRoomClient";
import { Room } from "../types";

export function RoomClient({ initialRoom }: { initialRoom: Room }) {
  const [room] = useState<Room>(initialRoom);

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Room: {room.slug}</h1>
      <ChatRoomClient id={room.id.toString()} messages={[]} />
    </div>
  );
}
