import React, { useState } from "react";
import { Link } from "react-router-dom";

function SongsList({ songsData }) {
  const [selectedPayiram, setSelectedPayiram] = useState(null);

  return (
    <div style={{ padding: "30px", maxWidth: "1000px", margin: "0 auto", color: "#5A3E36" }}>
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>Thirumandiram Songs List</h2>

      {!selectedPayiram && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))", gap: "25px" }}>
          {Object.keys(songsData).map((payiram) => (
            <button
              key={payiram}
              onClick={() => setSelectedPayiram(payiram)}
              style={{
                padding: "20px",
                fontSize: "1.1rem",
                fontWeight: "600",
                backgroundColor: "#F0E4D3",
                border: "2px solid #D9A299",
                borderRadius: "12px",
                cursor: "pointer",
                color: "#5A3E36",
              }}
            >
              {payiram}
            </button>
          ))}
        </div>
      )}

      {selectedPayiram && (
        <div style={{ marginTop: "30px" }}>
          <button
            onClick={() => setSelectedPayiram(null)}
            style={{ marginBottom: "20px", background: "none", border: "none", cursor: "pointer", color: "#D9A299" }}
          >
            ← Back to Payirams
          </button>

          <h3 style={{ borderBottom: "2px solid #D9A299", paddingBottom: "10px", marginBottom: "20px" }}>
            {selectedPayiram}
          </h3>

          {songsData[selectedPayiram].map((song) => (
            <div
              key={song.song_number}
              style={{ padding: "10px 0", borderBottom: "1px solid #E8D8C3" }}
            >
              <Link
                to={`/songs/${encodeURIComponent(selectedPayiram)}/${song.song_number}`}
                style={{ textDecoration: "none", color: "#2a6f9e", fontWeight: "600" }}
              >
                {song.song_number}. {song.padal.slice(0, 80)}{song.padal.length > 80 ? "..." : ""}
              </Link>
            </div>
          ))}
        </div>
      )}
      
    </div>
    
  );
}

export default SongsList;
