import React, { useState, useEffect } from 'react';
import YouTube from "react-youtube";

function App() {
  const [currentVideo, setCurrentVideo] = useState(null);
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [history, setHistory] = useState([]);
  const [roomCode, setRoomCode] = useState("");
  const api = process.env.REACT_APP_API_URL || 'http://localhost:8000';
  console.log("API URL:", api);

  const upNext = queue.slice(currentIndex + 1);
  const recentlyPlayed = queue.slice(0, currentIndex);

  const [playerKey, setPlayerKey] = useState(0);


  const fetchRoomCode = async () => {
    try {
      const res = await fetch(`${api}/room/code`);
      const data = await res.json();
      setRoomCode(data.room_code);
    } catch (err) {
      console.error("Error fetching room code:", err);
    }
  };

  const fetchNextVideo = async () => {
    const res = await fetch(`${api}/queue/current`);
    const data = await res.json();

    if (data && data.video_id) {
      setCurrentVideo(data.video_id);
    }
  };


  const fetchQueue = async() => {
    try {
      const res = await fetch(`${api}/queue/list`);
      const data = await res.json();

      setQueue(data.queue);
      setCurrentIndex(data.current_index);
    } catch (err) {
      console.error("Error fetching queue:", err);
    } 
  };

  useEffect(() => {
    fetchRoomCode();
    fetchNextVideo();
    fetchQueue();
  }, []);

  const onEnd = () => {
    goNext();
  };

  const goNext = async() => {
    const res = await fetch(`${api}/queue/next`);
    const data = await res.json();

    if (data && data.video_id) {
      setCurrentVideo(data.video_id);
      setPlayerKey(prev => prev + 1);
    }
    fetchQueue();
  }

  const goPrevious = async() => { 
    const res = await fetch(`${api}/queue/previous`);
    const data = await res.json();

    if (data && data.video_id) {
      setCurrentVideo(data.video_id);
      setPlayerKey(prev => prev + 1);
    } 
    fetchQueue();
  };

  return (
      <div style={{ background: "#111", color: "#fff", minHeight: "100vh", textAlign: "center" }}>
        <h1>Sing Now - Host Player</h1>
        <h2>Join At: {roomCode}</h2>
        <p>Guests join at: singnow.app</p>

        <div style={{ marginBottom: "20px" }}>
          <button 
          onClick={goPrevious}
          disabled={currentIndex === 0}
          style={{ marginRight: "10px" }}>  
            ⏮ Previous
          </button>
          <button 
          onClick={goNext} 
          disabled={currentIndex >= queue.length - 1}>
            ⏭ Next
          </button>
        </div>

        {currentVideo && (
          <YouTube
            key={playerKey}
            videoId={currentVideo}
            onEnd={onEnd}
            opts={{
              height: "540",
              width: "960",
              playerVars: { autoplay: 1 },
            }}
          />
        )}

        <h2>Up Next</h2>
          <ul>
            {upNext.map((item, idx) => (
              <li key={idx}>{item.title}</li>
            ))}
          </ul>

          <h2>Recently Played</h2>
          <ul>
            {recentlyPlayed.map((item, idx) => (
              <li key={idx}>{item.title}</li>
            ))}
          </ul>
      </div>
    );
}

export default App;
