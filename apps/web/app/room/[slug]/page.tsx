"use client";
import Chat from "../../../components/Chat";
import { useRoomStore } from '../../../stores/useRoomStore'

export default function Page({ params }: { params: { slug: string } }) {
  const { currentRoom, setCurrentRoom } = useRoomStore()

  if (!currentRoom) return <div>Loading...</div>;

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 p-4">
      <h1 className="text-3xl font-bold text-white mb-8">{currentRoom.slug}</h1>
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl">
        <div className="flex-1">
         
        </div>
        <Chat roomId={Number(currentRoom.id)} />
      </div>
    </div>
  );
}