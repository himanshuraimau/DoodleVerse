import axios from "axios";
import { useEffect, useState } from "react";

async function getRoom(slug: string) {
  try {
    const response = await axios.get(`http://localhost:3001/room/${slug}`);
    return response.data.room.id;
  } catch (error) {
    console.error("Error fetching room:", error);
    return null;
  }
}

const Page = ({ slug }: { slug: string }) => {
  const [roomId, setRoomId] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoom = async () => {
      const id = await getRoom(slug);
      setRoomId(id);
    };
    fetchRoom();
  }, [slug]);

  if (roomId === null) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Room ID: {roomId}</h1>
    </div>
  );
};

export default Page;