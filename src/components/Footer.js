import React from "react";

function Footer() {
  return (
    <footer
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        backgroundColor: "#5A3E36",
        color: "#F7E6D0",
        padding: "20px",
        textAlign: "center",
        fontSize: "16px",
        borderTopLeftRadius: "12px",
        borderTopRightRadius: "12px",
        zIndex: 1000,
      }}
    >
      <p>
        Copyright © 2025 | Department of IT, Thiagarajar College of Engineering,
        Madurai - 625 015, Tamil Nadu, India.
      </p>
      <p>
        Source:{" "}
        <a
          href="https://kvnthirumoolar.com/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#D9A299", textDecoration: "underline" }}
        >
          திருமூலர் அருளிய திருமந்திரம்
        </a>{" "}
        | Google Translator
      </p>
    </footer>
  );
}

export default Footer;
