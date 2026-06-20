"use client";

import { useEffect, useState } from "react";

export default function RoomClient({ code }: { code: string }) {
  const api = process.env.NEXT_PUBLIC_API_URL;

  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const fetchQueue = async () => {
    const res = await fetch(`${api}/queue/list`);
    const data = await res.json();
    setQueue(data.queue);
    setCurrentIndex(data.current_index);
  };

  const nextSong = async () => {
    await fetch(`${api}/queue/next`);
    fetchQueue();
  };

  const prevSong = async () => {
    await fetch(`${api}/queue/previous`);
    fetchQueue();
  };

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 2000);
    return () => clearInterval(interval);
  }, []);

  const current = queue[currentIndex];
  const upNext = queue.slice(currentIndex + 1);
  const recentlyPlayed = queue.slice(0, currentIndex);

  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <h1>Room: {code}</h1>

      <h2>Now Playing</h2>
      <p>{current ? current.title : "Nothing playing"}</p>

        <button 
          onClick={prevSong}
          disabled={currentIndex === 0}
          style={{ marginRight: "10px" }}>  
            ⏮ Previous
        </button>

        <button 
          onClick={nextSong} 
          disabled={currentIndex >= queue.length - 1}>
            ⏭ Next
        </button>

      <h2 style={{ marginTop: 40 }}>Up Next</h2>
      {upNext.length === 0 && <p>No songs queued</p>}
      {upNext.map((song, i) => (
        <p key={i}>{song.title}</p>
      ))}

      <h2 style={{ marginTop: 40 }}>Recently Played</h2>
      {recentlyPlayed.length === 0 && <p>None yet</p>}
      {recentlyPlayed.map((song, i) => (
        <p key={i}>{song.title}</p>
      ))}
    </div>
  );
}
