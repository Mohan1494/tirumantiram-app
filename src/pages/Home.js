import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div
      style={{
        padding: "40px 20px",
        margin: "40px auto",
        backgroundImage: "url('/background.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        height: "700px",
        width: "700px",

        backgroundColor: "rgba(255, 255, 255, 0.6)",
        backgroundBlendMode: "overlay",

        borderRadius: "15px",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
        color: "#5A3E36",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        textAlign: "center",

        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <h1 style={{ fontSize: "2.8rem", marginBottom: "20px", fontWeight: "700" }}>
        திருமந்திரம் AI
      </h1>

      <p style={{ fontSize: "1.3rem", lineHeight: "1.6", marginBottom: "40px" }}>
        Explore the wisdom of Thirumandiram in Tamil & English.
      </p>

      {/* Get Started Button */}
      <Link to="/login" style={{ textDecoration: "none" }}>
        <button
          style={{
            backgroundColor: "#D9A299",
            border: "none",
            borderRadius: "30px",
            padding: "14px 36px",
            fontSize: "1.1rem",
            fontWeight: "600",
            color: "#5A3E36",
            cursor: "pointer",
            boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
          }}
        >
          Get Started →
        </button>
      </Link>
    </div>
  );
}

export default Home;
