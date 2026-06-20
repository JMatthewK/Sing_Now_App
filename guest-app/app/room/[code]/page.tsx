import RoomClient from "./room-client";

export default async function RoomPage({ params }: { params: { code: string } }) {
  const { code } = await params; // ← THIS is the fix

  return <RoomClient code={code} />;
}
