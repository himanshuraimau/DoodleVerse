import RoomClient from "./room-client";

export default async function Page({ params }: { params: { slug: string } }) {
  const slug = (await params).slug;
  return <RoomClient slug={slug} />;
}