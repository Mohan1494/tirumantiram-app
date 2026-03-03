import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated, removeToken, getUser } from '../utils/authUtils';

function Navbar() {
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication status when component mounts
    const checkAuth = () => {
      const loggedIn = isAuthenticated();
      setIsAuth(loggedIn);
      
      if (loggedIn) {
        const userData = getUser();
        if (userData) {
          setUser(userData);
        }
      } else {
        setUser(null);
      }
    };

    checkAuth();

    // Listen for storage changes (logout in other tabs)
    const handleStorageChange = () => {
      checkAuth();
      setShowDropdown(false);
    };

    // Listen for custom auth state change event
    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authStateChange', handleAuthChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authStateChange', handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    removeToken();
    setIsAuth(false);
    setUser(null);
    setShowDropdown(false);
    navigate('/');
  };

  return (
    <nav
      style={{
        height: "70px",
        padding: "0 30px",
        background: "var(--header-bg, rgba(255,255,255,0.95))",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        borderRadius: "0px",
        position: "fixed",
        top: "0",
        left: "0",
        right: "0",
        margin: "0",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "40px",
      }}
    >
      {/* Left Navigation Links */}
      <div style={{ display: "flex", gap: "40px", alignItems: "center" }}>
        <Link to="/" style={{ color: "var(--text-color)", fontWeight: "600", textDecoration: "none" }}>
          Home
        </Link>
        <Link to="/ask" style={{ color: "var(--text-color)", fontWeight: "600", textDecoration: "none" }}>
          Ask Your Question
        </Link>
        <Link to="/songs" style={{ color: "var(--text-color)", fontWeight: "600", textDecoration: "none" }}>
          Songs List
        </Link>
        <Link to="/about" style={{ color: "var(--text-color)", fontWeight: "600", textDecoration: "none" }}>
          About Us
        </Link>
        <Link to="/song-search" style={{ color: "var(--text-color)", fontWeight: "600", textDecoration: "none" }}>
          Song Search Page
        </Link>
      </div>

      {/* Right Auth Section */}
      <div style={{ marginLeft: "auto", display: "flex", gap: "20px", alignItems: "center", position: "relative" }}>
        {isAuth ? (
          // Logged In - Profile Dropdown
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 14px",
                backgroundColor: "var(--accent-color)",
                color: "black",
                border: "none",
                borderRadius: "20px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s",
                fontSize: "0.95rem",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "var(--accent-color)";
                e.target.style.color = "black";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "var(--accent-color)";
                e.target.style.color = "black";
              }}
            >
              <span style={{ fontSize: "1.2rem" }}>👤</span>
              {user?.name || (user?.email ? user.email.split("@")[0] : "Profile")}
              <span style={{ fontSize: "0.8rem", marginLeft: "4px" }}>▼</span>
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  right: 0,
                  marginTop: "8px",
                    backgroundColor: "var(--header-bg)",
                    border: "2px solid var(--input-border)",
                  borderRadius: "8px",
                  boxShadow: "0 8px 16px rgba(0, 0, 0, 0.15)",
                  minWidth: "200px",
                  zIndex: 2000,
                  overflow: "hidden",
                }}
              >
                {/* User Email Display */}
                <div
                  style={{
                    padding: "12px 16px",
                    borderBottom: "1px solid var(--input-border)",
                    backgroundColor: "var(--input-bg)",
                    fontSize: "0.85rem",
                    color: "var(--text-color)",
                  }}
                >
                  <strong>Logged in as</strong>
                  <div style={{ fontSize: "0.9rem", marginTop: "4px", color: "#5A3E36" }}>
                    {user?.email || "User"}
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    backgroundColor: "transparent",
                    color: "#c62828",
                    border: "none",
                    fontSize: "0.95rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "rgba(255,0,0,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "transparent";
                  }}
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          // Not Logged In - Login/Signup Links
          <>
            <Link
              to="/login"
              style={{
                color: "#5A3E36",
                fontWeight: "600",
                textDecoration: "none",
                padding: "8px 16px",
                borderRadius: "6px",
                transition: "background-color 0.3s",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "rgba(184, 133, 123, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "transparent";
              }}
            >
              Login
            </Link>
            <Link
              to="/signup"
              style={{
                color: "#5A3E36",
                fontWeight: "600",
                textDecoration: "none",
                padding: "8px 16px",
                borderRadius: "6px",
                transition: "background-color 0.3s",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "rgba(184, 133, 123, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "transparent";
              }}
            >
              Sign Up
            </Link>
          </>
        )}
      </div>

      {/* Close dropdown when clicking outside */}
      {showDropdown && (
        <div
          onClick={() => setShowDropdown(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999,
          }}
        />
      )}
    </nav>
  );
}

export default Navbar;
