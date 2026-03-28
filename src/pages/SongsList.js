import React, { useState } from "react";
import { Link } from "react-router-dom";

function SongsList({ songsData }) {
  const [selectedPayiram, setSelectedPayiram] = useState(null);

  return (
    <div style={{
      maxWidth: "1000px",
      width: "100%",
      margin: "0 auto",
      padding: "28px 20px 60px",
      color: "var(--text)",
      boxSizing: "border-box",
    }}>
      <h2 style={{
        textAlign: "center",
        marginBottom: "28px",
        fontSize: "clamp(1.4rem, 4vw, 2rem)",
      }}>
        Thirumandiram Songs List
      </h2>

      {!selectedPayiram ? (
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "14px",
          justifyContent: "center",
        }}>
          {Object.keys(songsData).map((payiram) => (
            <button
              key={payiram}
              onClick={() => setSelectedPayiram(payiram)}
              style={{
                width: "180px",
                padding: "16px 10px",
                fontSize: "0.95rem",
                fontWeight: "600",
                backgroundColor: "#ffffff",
                border: "2px solid var(--accent)",
                borderRadius: "12px",
                cursor: "pointer",
                color: "var(--accent)",
                lineHeight: "1.4",
                wordBreak: "break-word",
                minHeight: "56px",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--accent)"; e.currentTarget.style.color = "#ffffff"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#ffffff"; e.currentTarget.style.color = "var(--accent)"; }}
            >
              {payiram}
            </button>
          ))}
        </div>
      ) : (
        <div style={{ marginTop: "16px" }}>
          <button
            onClick={() => setSelectedPayiram(null)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: "var(--accent)", fontSize: "1rem", fontWeight: "600",
              padding: "8px 0", marginBottom: "16px",
              minHeight: "44px", display: "flex", alignItems: "center",
            }}
          >
            ← Back to Payirams
          </button>

          <h3 style={{
            fontSize: "clamp(1.1rem, 3vw, 1.5rem)",
            borderBottom: "2px solid var(--accent)",
            paddingBottom: "10px",
            marginBottom: "16px",
            wordBreak: "break-word",
          }}>
            {selectedPayiram}
          </h3>

          {songsData[selectedPayiram].map((song) => (
            <div key={song.song_number} style={{ padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
              <Link
                to={`/songs/${encodeURIComponent(selectedPayiram)}/${song.song_number}`}
                style={{
                  textDecoration: "none", color: "var(--accent)",
                  fontWeight: "600", fontSize: "clamp(0.88rem, 2vw, 1rem)",
                  lineHeight: "1.5", display: "block",
                }}
              >
                <span style={{ fontWeight: "700", marginRight: "6px", color: "var(--text)" }}>
                  {song.song_number}.
                </span>
                {song.padal.slice(0, 80)}{song.padal.length > 80 ? "…" : ""}
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SongsList;