import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

export default function SongDetail({ songsData }) {
  const { payiramName, songNumber } = useParams();
  const navigate = useNavigate();

  const song = songsData[payiramName]?.find((s) => s.song_number === parseInt(songNumber));

  if (!song) return <p style={{ textAlign: "center", marginTop: "50px" }}>Song not found</p>;

  return (
    <div style={{ padding: "30px", maxWidth: "1000px", margin: "0 auto", color: "#5A3E36" }}>
      <button
        onClick={() => navigate(-1)}
        style={{ marginBottom: "20px", background: "none", border: "none", cursor: "pointer", color: "#D9A299" }}
      >
        ← Back
      </button>

      <h2>Song #{song.song_number}</h2>

      <p>
        <strong>பாடல்:</strong><br />
        {(song.padal || "").split("\n").map((line, idx) => (
          <span key={idx}>{line}<br /></span>
        ))}
      </p>

      <p style={{ marginTop: "15px" }}>
        <strong>விளக்கம் (Tamil):</strong><br />
        {(song.vilakam || "").split("\n").map((line, idx) => (
          <span key={idx}>{line}<br /></span>
        ))}
      </p>
      <p style={{ marginTop: "15px" }}>
        <strong>Explanation (English):</strong><br />
        {(song.vilakam_en || "").split("\n").map((line, idx) => (
          <span key={idx}>{line}<br /></span>
        ))}
      </p>
      <Footer />
    </div>
    
  );
}
