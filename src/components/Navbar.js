import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav
      style={{
        height: "70px",              // Increased fixed height
        padding: "0 30px",           // Horizontal padding only
        background: "rgba(255, 255, 255, 0.25)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        borderRadius: "10px",
        position: "sticky",
        top: "30px",                 // Push down 30px from top
        margin: "0 20px",            // Left and right margin only
        zIndex: 1000,
        display: "flex",
        alignItems: "center",        // Vertically center links
        justifyContent: "center",
        gap: "40px",
      }}
    >
      <Link to="/" style={{ color: "#5A3E36", fontWeight: "600", textDecoration: "none" }}>
        Home
      </Link>
      <Link to="/ask" style={{ color: "#5A3E36", fontWeight: "600", textDecoration: "none" }}>
        Ask Your Question
      </Link>
      <Link to="/songs" style={{ color: "#5A3E36", fontWeight: "600", textDecoration: "none" }}>
        Songs List
      </Link>
      <Link to="/about" style={{ color: "#5A3E36", fontWeight: "600", textDecoration: "none" }}>
        About Us
      </Link>
      <Link to="/song-search" style={{ color: "#5A3E36", fontWeight: "600", textDecoration: "none" }}>
        Song Search Page
      </Link>
      {/* <Link to="/login" style={{ color: "#5A3E36", fontWeight: "600", textDecoration: "none" }}>
        Login
      </Link>
      <Link to="/signup" style={{ color: "#5A3E36", fontWeight: "600", textDecoration: "none" }}>
        Sign Up
      </Link> */}
    </nav>
  );
}

export default Navbar;
