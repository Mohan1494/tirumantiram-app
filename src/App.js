import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Ask from "./pages/Ask";
import SongsList from "./pages/SongsList";
import About from "./pages/About";
import SongDetail from "./pages/SongDetail";
import SongSearch from "./pages/SongSearch";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Footer from "./components/Footer";

function App() {
  const [songsData, setSongsData] = useState({});

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user === "undefined" || user === "null" || user === "") {
      localStorage.removeItem("user");
    }
  }, []);

  useEffect(() => {
    const loadSongs = async () => {
      try {
        const res = await fetch("/merged_with_fourth_new_line.json");
        if (!res.ok) throw new Error("Merged songs fetch failed");
        const data = await res.json();
        setSongsData(data);
      } catch (err) {
        console.warn("Failed to load merged songs data, falling back to songs.json", err);
        try {
          const res = await fetch("/songs.json");
          if (!res.ok) throw new Error("Fallback songs fetch failed");
          const fallbackData = await res.json();
          setSongsData(fallbackData);
        } catch (fallbackErr) {
          console.error("Failed to load songs data:", fallbackErr);
        }
      }
    };
    loadSongs();
  }, []);

  if (Object.keys(songsData).length === 0) {
    return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading songs...</p>;
  }

  return (
    <Router>
      <div
        className="app-container"
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Navbar />

        {/* MAIN CONTENT — block layout so margin:auto centering works on children */}
        <div style={{
          flex: 1,
          marginTop: "64px",   /* matches --nav-height */
          display: "block",    /* NOT flex — allows children to use margin:0 auto */
          width: "100%",
        }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/ask"
              element={
                <ProtectedRoute>
                  <Ask />
                </ProtectedRoute>
              }
            />
            <Route path="/songs" element={<SongsList songsData={songsData} />} />
            <Route path="/about" element={<About />} />
            <Route
              path="/songs/:payiramName/:songNumber"
              element={<SongDetail songsData={songsData} />}
            />
            <Route path="/song-search" element={<SongSearch />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
  );
}

export default App;