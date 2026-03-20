import React from "react";
import { useParams, useNavigate } from "react-router-dom";


export default function SongDetail({ songsData }) {
  const { payiramName, songNumber } = useParams();
  const navigate = useNavigate();

  const normalizedPayiram = payiramName
    ? decodeURIComponent(payiramName).replace(/\+/g, " ")
    : "";
  const payiramKey = songsData[normalizedPayiram] ? normalizedPayiram : payiramName;

  const song = (songsData[payiramKey] || []).find(
    (s) => s.song_number === parseInt(songNumber, 10)
  );

  if (!song) return <p style={{ textAlign: "center", marginTop: "50px" }}>Song not found</p>;

  const formatLines = (text = "") =>
    text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== "" && line !== ":");

  const padalLines = formatLines(song.padal);
  const vilakamLines = formatLines(song.vilakam || song.vilakkam || "");
  const vilakamEnLines = formatLines(song.vilakam_en || song.vilakkam_en || "");

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
        {padalLines.map((line, idx) => (
          <span key={idx}>{line}<br /></span>
        ))}
      </p>

      <p style={{ marginTop: "15px" }}>
        <strong>விளக்கம் (Tamil):</strong><br />
        {vilakamLines.map((line, idx) => (
          <span key={idx}>{line}<br /></span>
        ))}
      </p>
      <p style={{ marginTop: "15px" }}>
        <strong>Explanation (English):</strong><br />
        {vilakamEnLines.map((line, idx) => (
          <span key={idx}>{line}<br /></span>
        ))}
      </p>
    
    </div>
    
  );
}
