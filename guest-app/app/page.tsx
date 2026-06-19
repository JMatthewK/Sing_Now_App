"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [code, setCode] = useState("");
  const router = useRouter();

  const handleJoin = async () => {
    // Validate room code with backend API from the environment variable
    const api = process.env.NEXT_PUBLIC_API_URL;

    const res = await fetch(`${api}/room/code`);
    const data = await res.json();
    console.log(data.code);

    // If the code inputed by the user is the same as the code from the backend, navigate to the room page
    if (data.room_code === code.toUpperCase()) {
      router.push(`/room/${code}`);
    } else {
      alert("Invalid room code");
    }
  };

  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <h1>Join Room</h1>

      <input
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter room code"
        style={{ padding: 10, fontSize: 20, textTransform: "uppercase" }}
      />

      <button
        onClick={handleJoin}
        style={{ marginLeft: 10, padding: "10px 20px", fontSize: 20 }}
      >
        Join
      </button>
    </div>
  );
}
