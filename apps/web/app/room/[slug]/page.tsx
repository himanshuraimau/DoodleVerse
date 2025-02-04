import axios from "axios";
import { RoomClient } from "../../../components/RoomClient";

async function getRoom(slug: string) {
  try {
    const response = await axios.get(`http://localhost:3001/room/${slug}`);
    return response.data.room;
  } catch (error) {
    console.error("Error fetching room:", error);
    return null;
  }
}

export default async function Page({ params }: {  params: Promise<{ slug: string }> }) {
  const  slug  = (await params).slug
  const room = await getRoom(slug);

  if (!room) {
    return <div>Room not found</div>;
  }

  return <RoomClient initialRoom={room} />;
}