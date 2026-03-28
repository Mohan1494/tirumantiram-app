import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { setToken, setUser } from "../utils/authUtils";

function Login() {
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const BASE_URL = "https://mohan1494-tirumantiram-backend.hf.space";

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        mode: "cors",
        credentials: "include",
      });

      if (res.status === 404) {
        setError("Login endpoint not found. Please contact admin.");
        setLoading(false);
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed. Please try again.");
        setLoading(false);
        return;
      }

      // Store JWT token and user info using auth utilities
      setToken(data.access_token || data.token);
      // always store at least an object with email so navbar can show username
      const storedUser = data.user || { email };
      // if backend didn't supply a name/username, derive from email
      if (!storedUser.name && storedUser.email) {
        storedUser.name = storedUser.email.split("@")[0];
      }
      setUser(storedUser);

      // Redirect to ask page after successful login
      navigate("/ask");
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
        Login
      </h1>
      <p style={{ fontSize: "1rem", textAlign: "center", marginBottom: "30px", color: "var(--text-color)" }}>
        Welcome back to Thirumandiram AI
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

      <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
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
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p style={{ textAlign: "center", marginTop: "20px", fontSize: "0.95rem", color: "var(--text-light)" }}>
        Don't have an account?{" "}
        <Link
          to="/signup"
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
          Sign up here
        </Link>
      </p>
    </div>
  );
}

export default Login;
