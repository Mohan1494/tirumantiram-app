import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Ask from "./pages/Ask";
import SongsList from "./pages/SongsList";
import About from "./pages/About";
import SongDetail from "./pages/SongDetail";
import SongSearch from "./pages/SongSearch";

function App() {
  const [songsData, setSongsData] = useState({});

  useEffect(() => {
    fetch("/merged_with_fourth_new_line.json")
      .then((res) => res.json())
      .then((data) => setSongsData(data))
      .catch((err) => console.error(err));
  }, []);

  if (Object.keys(songsData).length === 0) {
    return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading songs...</p>;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: `linear-gradient(to bottom, #FAF7F3, #F0E4D3, #DCC5B2, #D9A299)`,
      }}
    >
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ask" element={<Ask />} />
          <Route path="/songs" element={<SongsList songsData={songsData} />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/songs/:payiramName/:songNumber"
            element={<SongDetail songsData={songsData} />}
          />
          <Route path="/song-search" element={<SongSearch/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
