"use client";
import Chat from "../../../components/Chat/Chat";
import { useRoomStore } from '../../../stores/useRoomStore';
import { useChatRoom } from '../../../hooks/useChatRoom';

export default function Page({ params }: { params: { slug: string } }) {
  const { currentRoom } = useRoomStore();
  const roomId = currentRoom ? Number(currentRoom.id) : null;
  const { sendMessage, exitRoom, isLoading, error, isConnecting } = useChatRoom({ roomId: Number(roomId) });

  if (!currentRoom) return <div>Loading...</div>;

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 p-4">
      <h1 className="text-3xl font-bold text-white mb-8">{currentRoom.slug}</h1>
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl">
        <div className="flex-1">
        </div>
        {isConnecting ? (
          <p className="text-white">Connecting to chat...</p>
        ) : (
          <Chat
            roomId={Number(currentRoom.id)}
            sendMessage={sendMessage}
            exitRoom={exitRoom}
            isLoading={isLoading}
            error={error}
          />
        )}
      </div>
    </div>
  );
}