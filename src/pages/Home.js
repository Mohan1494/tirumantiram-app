import React from "react";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../utils/authUtils";
import "./Home.css";

function Home() {
  return (
    <div className="home-wrapper">
      <div
        className="home-card"
      >
        <h1 className="home-title">திருமந்திரம் AI</h1>
        <p className="home-subtitle">
          Explore the wisdom of Thirumandiram in Tamil &amp; English.
        </p>
        <Link to={isAuthenticated() ? "/ask" : "/login"} className="home-cta">
          Get Started →
        </Link>
      </div>
    </div>
  );
}

export default Home;