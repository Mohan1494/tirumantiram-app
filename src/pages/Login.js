import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
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
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed. Please try again.");
        setLoading(false);
        return;
      }

      // Store token and user info
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect to home or dashboard
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
        margin: "40px auto",
        backgroundImage: "url('/background.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        height: "auto",
        width: "100%",
        maxWidth: "450px",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        backgroundBlendMode: "overlay",
        borderRadius: "15px",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
        color: "#5A3E36",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <h1 style={{ fontSize: "2.2rem", marginBottom: "10px", fontWeight: "700", textAlign: "center" }}>
        Login
      </h1>
      <p style={{ fontSize: "1rem", textAlign: "center", marginBottom: "30px", color: "#7A5C54" }}>
        Welcome back to Thirumandiram AI
      </p>

      {error && (
        <div
          style={{
            padding: "12px 16px",
            marginBottom: "20px",
            backgroundColor: "#ffebee",
            color: "#c62828",
            borderRadius: "8px",
            fontSize: "0.95rem",
            border: "1px solid #ef5350",
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
              color: "#5A3E36",
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
              border: "2px solid #D9A299",
              borderRadius: "8px",
              fontSize: "1rem",
              fontFamily: "inherit",
              boxSizing: "border-box",
              backgroundColor: "#FAF7F3",
              color: "#5A3E36",
              transition: "border-color 0.3s",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#B8857B";
              e.target.style.outline = "none";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#D9A299";
            }}
          />
        </div>

        <div>
          <label
            style={{
              display: "block",
              marginBottom: "6px",
              fontWeight: "600",
              color: "#5A3E36",
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
              border: "2px solid #D9A299",
              borderRadius: "8px",
              fontSize: "1rem",
              fontFamily: "inherit",
              boxSizing: "border-box",
              backgroundColor: "#FAF7F3",
              color: "#5A3E36",
              transition: "border-color 0.3s",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#B8857B";
              e.target.style.outline = "none";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#D9A299";
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "12px 20px",
            marginTop: "10px",
            backgroundColor: loading ? "#D9A299" : "#B8857B",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "1rem",
            fontWeight: "600",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "background-color 0.3s",
          }}
          onHover={(e) => {
            if (!loading) e.target.style.backgroundColor = "#A67168";
          }}
          onMouseEnter={(e) => {
            if (!loading) e.target.style.backgroundColor = "#A67168";
          }}
          onMouseLeave={(e) => {
            if (!loading) e.target.style.backgroundColor = "#B8857B";
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p style={{ textAlign: "center", marginTop: "20px", fontSize: "0.95rem", color: "#7A5C54" }}>
        Don't have an account?{" "}
        <Link
          to="/signup"
          style={{
            color: "#B8857B",
            textDecoration: "none",
            fontWeight: "600",
            transition: "color 0.3s",
          }}
          onMouseEnter={(e) => {
            e.target.style.color = "#8B6459";
          }}
          onMouseLeave={(e) => {
            e.target.style.color = "#B8857B";
          }}
        >
          Sign up here
        </Link>
      </p>
    </div>
  );
}

export default Login;
