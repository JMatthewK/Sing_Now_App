"use client";

import { useRouter } from "next/navigation";

export default function RoomPage({ params }: { params: { code: string } }) {
  const api = process.env.NEXT_PUBLIC_API_URL;
  const code = params.code;

  const nextSong = async () => {
    await fetch(`${api}/queue/next`, { method: "POST" });
  };

  const prevSong = async () => {
    await fetch(`${api}/queue/previous`, { method: "POST" });
  };

  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <h1>Room: {code}</h1>

      <button
        onClick={prevSong}
        style={{ padding: "10px 20px", fontSize: 20, marginRight: 10 }}
      >
        Previous
      </button>

      <button
        onClick={nextSong}
        style={{ padding: "10px 20px", fontSize: 20 }}
      >
        Next
      </button>
    </div>
  );
}
