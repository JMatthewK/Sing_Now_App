"use client";

import { useState } from "react";

export default function SearchSongs({ api, onAdd }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const search = async () => {
    const cleaned = query.toLowerCase().includes("karaoke")
        ? query
        : `${query} karaoke`;

    const res = await fetch(`${api}/search?q=${encodeURIComponent(cleaned)}`);
    const data = await res.json();
    setResults(Array.isArray(data.results) ? data.results : []);
  };

  return (
    <div style={{ marginTop: 40 }}>
      <h2>Search Songs</h2>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search YouTube karaoke"
        style={{ padding: 10, fontSize: 18, width: "70%" }}
      />

      <button
        onClick={search}
        style={{ marginLeft: 10, padding: "10px 20px", fontSize: 18 }}
      >
        Search
      </button>

      <div style={{ marginTop: 20 }}>
        {results.map((r) => (
          <div
            key={r.video_id}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 10,
              gap: 10,
            }}
          >
            <img src={r.thumbnail} width={80} height={60} />

            <span style={{ flex: 1 }}>{r.title}</span>

            <button
              onClick={() => onAdd(r)}
              style={{
                padding: "6px 12px",
                background: "#4caf50",
                color: "white",
                borderRadius: 6,
                border: "none",
              }}
            >
              Add
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
