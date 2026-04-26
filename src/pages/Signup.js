import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { isAuthenticated, setUser, setToken } from "../utils/authUtils";

const BASE_URL = "https://mohan1494-tirumantiram-backend.hf.space";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/ask");
    }
  }, [navigate]);

  const handleCredentialResponse = useCallback(async (response) => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: response.credential }),
      });
      
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || data.message || "Google Login failed.");
        setLoading(false);
        return;
      }
      
      setToken(data.access_token);
      setUser(data.user || { email: "User" });
      navigate("/ask");
    } catch (err) {
      setError("Network error during Google Login.");
      console.error(err);
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    // Initialize Google Sign-In
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: "250158981261-ael7se4dihijb7r11nhd9g1rqogfd3iv.apps.googleusercontent.com",
        callback: handleCredentialResponse
      });
      window.google.accounts.id.renderButton(
        document.getElementById("googleSignInDiv"),
        { theme: "outline", size: "large", text: "continue_with", shape: "rectangular", width: 380 }
      );
      window.google.accounts.id.prompt(); // prompt for auto-select
    }
  }, [handleCredentialResponse]);



  async function handleSignup(e) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        mode: "cors",
        credentials: "include",
      });

      if (res.status === 404) {
        setError("Signup endpoint not found. Please contact admin.");
        setLoading(false);
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Signup failed. Please try again.");
        setLoading(false);
        return;
      }

      // Signup successful - redirect to login page to get JWT token
      navigate("/login", { state: { email } });
    } catch (err) {
      setError("Network error. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        padding: "40px 20px",
        margin: "60px auto",
        height: "auto",
        width: "100%",
        maxWidth: "420px",
        backgroundColor: "var(--header-bg)",
        borderRadius: "12px",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
        color: "var(--text-color)",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
      }}
    >
      <h1 style={{ fontSize: "2.2rem", marginBottom: "10px", fontWeight: "700", textAlign: "center" }}>
        Sign Up
      </h1>
      <p style={{ fontSize: "1rem", textAlign: "center", marginBottom: "30px", color: "var(--text-color)" }}>
        Join us to explore Thirumandiram
      </p>

      {error && (
        <div
          style={{
            padding: "12px 16px",
            marginBottom: "20px",
            backgroundColor: "rgba(255,0,0,0.1)",
            color: "#c62828",
            borderRadius: "8px",
            fontSize: "0.95rem",
            border: "1px solid #c62828",
          }}
        >
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div>
          <label
            style={{
              display: "block",
              marginBottom: "6px",
              fontWeight: "600",
              color: "var(--text-color)",
              fontSize: "0.95rem",
            }}
          >
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px 14px",
              border: "2px solid var(--input-border)",
              borderRadius: "8px",
              fontSize: "1rem",
              fontFamily: "inherit",
              boxSizing: "border-box",
              backgroundColor: "var(--input-bg)",
              color: "var(--text-color)",
              transition: "border-color 0.3s",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "var(--accent-color)";
              e.target.style.outline = "none";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "var(--input-border)";
            }}
          />
        </div>

        <div>
          <label
            style={{
              display: "block",
              marginBottom: "6px",
              fontWeight: "600",
              color: "var(--text-color)",
              fontSize: "0.95rem",
            }}
          >
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px 14px",
              border: "2px solid var(--input-border)",
              borderRadius: "8px",
              fontSize: "1rem",
              fontFamily: "inherit",
              boxSizing: "border-box",
              backgroundColor: "var(--input-bg)",
              color: "var(--text-color)",
              transition: "border-color 0.3s",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "var(--accent-color)";
              e.target.style.outline = "none";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "var(--input-border)";
            }}
          />

          <p style={{ fontSize: "0.85rem", color: "var(--text-light)", marginTop: "4px" }}>
            At least 6 characters
          </p>
        </div>

        <div>
          <label
            style={{
              display: "block",
              marginBottom: "6px",
              fontWeight: "600",
              color: "var(--text-color)",
              fontSize: "0.95rem",
            }}
          >
            Confirm Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px 14px",
              border: "2px solid var(--input-border)",
              borderRadius: "8px",
              fontSize: "1rem",
              fontFamily: "inherit",
              boxSizing: "border-box",
              backgroundColor: "var(--input-bg)",
              color: "var(--text-color)",
              transition: "border-color 0.3s",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "var(--accent-color)";
              e.target.style.outline = "none";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "var(--input-border)";
            }}
          />

        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "12px 20px",
            marginTop: "10px",
            backgroundColor: loading ? "var(--input-border)" : "var(--accent-color)",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "1rem",
            fontWeight: "600",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "background-color 0.3s",
          }}
          onMouseEnter={(e) => {
            if (!loading) e.target.style.backgroundColor = "var(--accent-dark)";
          }}
          onMouseLeave={(e) => {
            if (!loading) e.target.style.backgroundColor = "var(--accent-color)";
          }}
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>
      </form>

      <p style={{ textAlign: "center", marginTop: "20px", fontSize: "0.95rem", color: "var(--text-color)" }}>
        Already have an account?{" "}
        <Link
          to="/login"
          style={{
            color: "var(--accent-color)",
            textDecoration: "none",
            fontWeight: "600",
            transition: "color 0.3s",
          }}
          onMouseEnter={(e) => {
            e.target.style.color = "var(--accent-dark)";
          }}
          onMouseLeave={(e) => {
            e.target.style.color = "var(--accent-color)";
          }}
        >
          Login here
        </Link>
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "10px" }}>
        <div id="googleSignInDiv" style={{ display: 'flex', justifyContent: 'center' }}></div>
      </div>
    </div>
  );
}

export default Signup;
