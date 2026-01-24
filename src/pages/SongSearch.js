import React, { useEffect, useState, useRef } from "react";
import googleTransliterate from "google-input-tool";
import Footer from "../components/Footer";

const uyirList = ["அ", "ஆ", "இ", "ஈ", "உ", "ஊ", "எ", "ஏ", "ஐ", "ஒ", "ஓ", "ஔ"];
const meiList = ["க்", "ங்", "ச்", "ஞ்", "ட்", "ண்", "த்", "ந்", "ப்", "ம்", "ய்", "ர்", "ல்", "வ்", "ழ்", "ள்", "ற்", "ன்"];

const uyirmeiMap = {
  "க்": ["க", "கா", "கி", "கீ", "கு", "கூ", "கெ", "கே", "கை", "கொ", "கோ", "கௌ"],
  "ங்": ["ங", "ஙா", "ஙி", "ஙீ", "ஙு", "ஙூ", "ஙெ", "ஙே", "ஙை", "ஙொ", "ஙோ", "ஙௌ"],
  "ச்": ["ச", "சா", "சி", "சீ", "சு", "சூ", "செ", "சே", "சை", "சொ", "சோ", "சௌ"],
  "ஞ்": ["ஞ", "ஞா", "ஞி", "ஞீ", "ஞு", "ஞூ", "ஞெ", "ஞே", "ஞை", "ஞொ", "ஞோ", "ஞௌ"],
  "ட்": ["ட", "டா", "டி", "டீ", "டு", "டூ", "டெ", "டே", "டை", "டொ", "டோ", "டௌ"],
  "ண்": ["ண", "ணா", "ணி", "ணீ", "ணு", "ணூ", "ணெ", "ணே", "ணை", "ணொ", "ணோ", "ணௌ"],
  "த்": ["த", "தா", "தி", "தீ", "து", "தூ", "தெ", "தே", "தை", "தொ", "தோ", "தௌ"],
  "ந்": ["ந", "நா", "நி", "நீ", "நு", "நூ", "நெ", "நே", "நை", "நொ", "நோ", "நௌ"],
  "ப்": ["ப", "பா", "பி", "பீ", "பு", "பூ", "பெ", "பே", "பை", "பொ", "போ", "பௌ"],
  "ம்": ["ம", "மா", "மி", "மீ", "மு", "மூ", "மெ", "மே", "மை", "மொ", "மோ", "மௌ"],
  "ய்": ["ய", "யா", "யி", "யீ", "யு", "யூ", "யெ", "யே", "யை", "யொ", "யோ", "யௌ"],
  "வ்": ["வ", "வா", "வி", "வீ", "வு", "வூ", "வெ", "வே", "வை", "வொ", "வோ", "வௌ"],
  "ர்": ["ர", "ரா", "ரி", "ரீ", "ரு", "ரூ", "ரெ", "ரே", "ரை", "ரொ", "ரோ", "ரௌ"],
  "ல்": ["ல", "லா", "லி", "லீ", "லு", "லூ", "லெ", "லே", "லை", "லொ", "லோ", "லௌ"],
  "ழ்": ["ழ", "ழா", "ழி", "ழீ", "ழு", "ழூ", "ழெ", "ழே", "ழை", "ழொ", "ழோ", "ழௌ"],
  "ள்": ["ள", "ளா", "ளி", "ளீ", "ளு", "ளூ", "ளெ", "ளே", "ளை", "ளொ", "ளோ", "ளௌ"],
  "ற்": ["ற", "றா", "றி", "றீ", "று", "றூ", "றெ", "றே", "றை", "றொ", "றோ", "றௌ"],
  "ன்": ["ன", "னா", "னி", "னீ", "னு", "னூ", "னெ", "னே", "னை", "னொ", "னோ", "னௌ"]
};

const keyStyle = {
  padding: "6px 10px",
  fontSize: "18px",
  cursor: "pointer",
  borderRadius: "6px",
  border: "1px solid #D9A299",
  backgroundColor: "rgba(217, 162, 153, 0.15)",
  margin: "3px",
  color: "#5A3E36",
  fontWeight: "600",
  userSelect: "none",
};

function SongSearch() {
  const [songs, setSongs] = useState([]);
  const [query, setQuery] = useState("");
  const [searchText, setSearchText] = useState("");
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [lastMei, setLastMei] = useState(null);
  const [expandedSongs, setExpandedSongs] = useState(new Set());
  const [activeLanguages, setActiveLanguages] = useState({});
  const inputRef = useRef(null);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
  fetch("/merged_with_fourth_new_line.json")
    .then(res => res.json())
    .then(data => {
      if (Array.isArray(data)) {
        setSongs(data);
      } else if (typeof data === "object") {
        // flatten all arrays inside the object into a single array
        const allSongs = Object.values(data).flat();
        setSongs(allSongs);
      } else {
        setSongs([]);
      }
    });
}, []);


  const handleSearch = () => {
    setSearchText(query.trim());
    setShowKeyboard(false);
    setExpandedSongs(new Set());
    setActiveLanguages({});
  };

  const fetchSuggestions = (text) => {
    if (!text.trim()) {
      setSuggestions([]);
      return;
    }

    const xhr = new XMLHttpRequest();
    googleTransliterate(xhr, text, "ta-t-i0-und", 5)
      .then((res) => {
        if (res.length > 0) {
          setSuggestions(res[0]);
        } else {
          setSuggestions([]);
        }
      })
      .catch(() => {
        setSuggestions([]);
      });
  };

  const toggleSong = (id) => {
    setExpandedSongs((prev) => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  const highlightText = (text = "", query = "") => {
  if (!query) return text;
  const parts = text.split(new RegExp(`(${query})`, "gi"));
  return parts.map((part, index) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <span
        key={index}
        style={{
          backgroundColor: "#FFD54F", // softer yellow highlight
          fontWeight: "700",
          color: "#5A3E36",
        }}
      >
        {part}
      </span>
    ) : (
      part
    )
  );
};


  const filteredByPadal = [];
  const filteredByVilakkam = [];

  songs.forEach((song, index) => {
    const padal = song.padal || "";
    const vilakkam = song.vilakam || "";
    const q = searchText.toLowerCase();
    if (q && padal.toLowerCase().includes(q)) {
      filteredByPadal.push({ song, index });
    } else if (q && vilakkam.toLowerCase().includes(q)) {
      filteredByVilakkam.push({ song, index });
    }
  });

  return (
    <div
      style={{
        padding: "2rem",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "rgba(250, 247, 243, 0.85)",
      }}
    >
      <header
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "20px",
          marginBottom: "1.5rem",
          borderBottom: "2px solid #D9A299",
          color: "#5A3E36",
        }}
      >
        <img
          src="/logo.png"
          alt="College Logo"
          style={{
            height: "90px",
            maxWidth: "100%",
            objectFit: "contain",
            marginBottom: "10px",
            filter: "drop-shadow(1px 1px 2px rgba(90,62,54,0.3))",
          }}
        />
        <h1 style={{ fontSize: "2.5rem", fontWeight: "700" }}>திருமந்திரம் தேடல்</h1>
      </header>

      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto 1rem auto",
          display: "flex",
          gap: "10px",
        }}
      >
        <input
          ref={inputRef}
          type="text"
          value={query}
          onClick={() => setShowKeyboard(true)}
          onChange={(e) => {
            const newText = e.target.value;
            setQuery(newText);
            fetchSuggestions(newText);
          }}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="சொல்லை உள்ளிடவும்"
          style={{
            flex: 1,
            padding: "12px",
            fontSize: "16px",
            borderRadius: "12px",
            border: "2px solid #D9A299",
            outline: "none",
            color: "#5A3E36",
            backgroundColor: "rgba(255,255,255,0.9)",
            boxShadow: "0 2px 6px rgba(90, 62, 54, 0.1)",
            transition: "border-color 0.3s ease",
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: "12px 20px",
            fontSize: "16px",
            backgroundColor: "#D9A299",
            border: "none",
            borderRadius: "12px",
            color: "#5A3E36",
            fontWeight: "600",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(217, 162, 153, 0.6)",
            transition: "background-color 0.3s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#C28B73")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#D9A299")}
        >
          தேடு
        </button>
      </div>

      {suggestions.length > 0 && (
        <div
          style={{
            maxWidth: "600px",
            margin: "0 auto 1rem auto",
            backgroundColor: "#fff",
            border: "1px solid #D9A299",
            borderRadius: "12px",
            boxShadow: "0 4px 14px rgba(217, 162, 153, 0.25)",
            zIndex: 10,
          }}
        >
          {suggestions.map((s, i) => (
            <div
              key={i}
              onClick={() => {
                setQuery(s);
                setSuggestions([]);
                inputRef.current?.focus();
              }}
              style={{
                padding: "10px 15px",
                cursor: "pointer",
                borderBottom: i !== suggestions.length - 1 ? "1px solid #f0d9cc" : "none",
                color: "#5A3E36",
                fontWeight: "600",
                userSelect: "none",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F4E8E2")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "white")}
            >
              {s}
            </div>
          ))}
        </div>
      )}

      {showKeyboard && (
        <div
          style={{
            backgroundColor: "rgba(217, 162, 153, 0.15)",
            border: "2px solid #D9A299",
            borderRadius: "15px",
            padding: "12px",
            marginBottom: "1.5rem",
            maxWidth: "600px",
            marginLeft: "auto",
            marginRight: "auto",
            userSelect: "none",
            boxShadow: "0 4px 15px rgba(217, 162, 153, 0.3)",
          }}
        >
          <strong style={{ color: "#5A3E36", fontWeight: "700" }}>மெய் எழுத்துகள்</strong>
          <div style={{ display: "flex", flexWrap: "wrap", marginBottom: "10px" }}>
            {meiList.map((mei, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setQuery((prev) => prev + mei);
                  setLastMei(mei);
                }}
                style={keyStyle}
              >
                {mei}
              </button>
            ))}
          </div>
          <strong style={{ color: "#5A3E36", fontWeight: "700" }}>உயிர் எழுத்துகள்</strong>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {uyirList.map((uyir, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (lastMei && uyirmeiMap[lastMei]) {
                    const idx = uyirList.indexOf(uyir);
                    const combo = uyirmeiMap[lastMei][idx];
                    setQuery((prev) => prev.slice(0, -lastMei.length) + combo);
                    setLastMei(null);
                  } else {
                    setQuery((prev) => prev + uyir);
                  }
                }}
                style={keyStyle}
              >
                {uyir}
              </button>
            ))}
          </div>
        </div>
      )}

      {searchText !== "" && (
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <h3 style={{ color: "#5A3E36", marginBottom: "0.5rem" }}>பாடலில் உள்ளவை</h3>
          {filteredByPadal.length === 0 && (
            <p style={{ color: "#8B6A58" }}>பொருத்தமான பாடல் எதுவும் கிடைக்கவில்லை</p>
          )}
          {filteredByPadal.map(({ song, index }) => (
            <div key={index} style={{ marginBottom: "1rem" }}>
              <div
                onClick={() => toggleSong(index)}
                style={{
                  display: "inline-block",
                  margin: "5px 10px",
                  padding: "10px 20px",
                  border: "2px solid #5A3E36",
                  borderRadius: "50px",
                  background: "rgba(90, 62, 54, 0.1)",
                  cursor: "pointer",
                  fontWeight: "600",
                  color: "#5A3E36",
                  userSelect: "none",
                }}
              >
                பாடல் {song.song_number}
              </div>

              {expandedSongs.has(index) && (
                <div
                  style={{
                    margin: "10px 20px",
                    background: "rgba(250, 247, 243, 0.9)",
                    borderRadius: "10px",
                    padding: "15px",
                    boxShadow: "0 4px 14px rgba(90, 62, 54, 0.15)",
                    color: "#5A3E36",
                  }}
                >
                  <p style={{ whiteSpace: "pre-line" }}>{highlightText(song.padal, searchText)}</p>

                  <div style={{ marginTop: "10px" }}>
                    <button
                      onClick={() => setActiveLanguages((prev) => ({ ...prev, [index]: "ta" }))}
                      style={{
                        marginRight: "10px",
                        padding: "6px 12px",
                        borderRadius: "8px",
                        border: "1.5px solid #D9A299",
                        background: activeLanguages[index] === "ta" ? "#D9A299" : "transparent",
                        color: "#5A3E36",
                        cursor: "pointer",
                        fontWeight: "600",
                      }}
                    >
                      தமிழ் விளக்கம்
                    </button>
                    <button
                      onClick={() => setActiveLanguages((prev) => ({ ...prev, [index]: "en" }))}
                      style={{
                        padding: "6px 12px",
                        borderRadius: "8px",
                        border: "1.5px solid #D9A299",
                        background: activeLanguages[index] === "en" ? "#D9A299" : "transparent",
                        color: "#5A3E36",
                        cursor: "pointer",
                        fontWeight: "600",
                      }}
                    >
                      English Meaning
                    </button>
                  </div>

                  {activeLanguages[index] === "ta" && (
                    <p
                      style={{
                        backgroundColor: "rgba(255, 248, 225, 0.85)",
                        padding: "10px",
                        whiteSpace: "pre-line",
                        borderRadius: "8px",
                        marginTop: "10px",
                        color: "#5A3E36",
                      }}
                    >
                      <strong>விளக்கம்:</strong>
                      <br />
                      {highlightText(song.vilakam, searchText)}
                    </p>
                  )}

                  {activeLanguages[index] === "en" && (
                    <p
                      style={{
                        backgroundColor: "rgba(225, 245, 254, 0.85)",
                        padding: "10px",
                        whiteSpace: "pre-line",
                        borderRadius: "8px",
                        marginTop: "10px",
                        color: "#5A3E36",
                      }}
                    >
                      <strong>Meaning:</strong>
                      <br />
                      {highlightText(song.vilakam_en, searchText)}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}

          <h3 style={{ color: "#5A3E36", marginTop: "2rem", marginBottom: "0.5rem" }}>விளக்கத்தில் உள்ளவை</h3>
          {filteredByVilakkam.length === 0 && (
            <p style={{ color: "#8B6A58" }}>பொருத்தமான விளக்கம் எதுவும் கிடைக்கவில்லை</p>
          )}
          {filteredByVilakkam.map(({ song, index }) => (
            <div key={index} style={{ marginBottom: "1rem" }}>
              <div
                onClick={() => toggleSong(index + 1000)}
                style={{
                  display: "inline-block",
                  margin: "5px 10px",
                  padding: "10px 20px",
                  border: "2px solid #D87F33",
                  borderRadius: "50px",
                  background: "rgba(216, 127, 51, 0.15)",
                  cursor: "pointer",
                  fontWeight: "600",
                  color: "#D87F33",
                  userSelect: "none",
                }}
              >
                பாடல் {song.song_number}
              </div>

              {expandedSongs.has(index + 1000) && (
                <div
                  style={{
                    margin: "10px 20px",
                    background: "rgba(250, 247, 243, 0.9)",
                    borderRadius: "10px",
                    padding: "15px",
                    boxShadow: "0 4px 14px rgba(216, 127, 51, 0.15)",
                    color: "#5A3E36",
                  }}
                >
                  <p style={{ whiteSpace: "pre-line" }}>{highlightText(song.padal, searchText)}</p>

                  <div style={{ marginTop: "10px" }}>
                    <button
                      onClick={() => setActiveLanguages((prev) => ({ ...prev, [index + 1000]: "ta" }))}
                      style={{
                        marginRight: "10px",
                        padding: "6px 12px",
                        borderRadius: "8px",
                        border: "1.5px solid #D87F33",
                        background: activeLanguages[index + 1000] === "ta" ? "#D87F33" : "transparent",
                        color: "#5A3E36",
                        cursor: "pointer",
                        fontWeight: "600",
                      }}
                    >
                      தமிழ் விளக்கம்
                    </button>
                    <button
                      onClick={() => setActiveLanguages((prev) => ({ ...prev, [index + 1000]: "en" }))}
                      style={{
                        padding: "6px 12px",
                        borderRadius: "8px",
                        border: "1.5px solid #D87F33",
                        background: activeLanguages[index + 1000] === "en" ? "#D87F33" : "transparent",
                        color: "#5A3E36",
                        cursor: "pointer",
                        fontWeight: "600",
                      }}
                    >
                      English Meaning
                    </button>
                  </div>

                  {activeLanguages[index + 1000] === "ta" && (
                    <p
                      style={{
                        backgroundColor: "rgba(255, 248, 225, 0.85)",
                        padding: "10px",
                        whiteSpace: "pre-line",
                        borderRadius: "8px",
                        marginTop: "10px",
                        color: "#5A3E36",
                      }}
                    >
                      <strong>விளக்கம்:</strong>
                      <br />
                      {highlightText(song.vilakam, searchText)}
                    </p>
                  )}

                  {activeLanguages[index + 1000] === "en" && (
                    <p
                      style={{
                        backgroundColor: "rgba(225, 245, 254, 0.85)",
                        padding: "10px",
                        whiteSpace: "pre-line",
                        borderRadius: "8px",
                        marginTop: "10px",
                        color: "#5A3E36",
                      }}
                    >
                      <strong>Meaning:</strong>
                      <br />
                      {highlightText(song.vilakam_en, searchText)}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <Footer />
    </div>
  );
}

export default SongSearch;
