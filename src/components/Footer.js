import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="site-footer">
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
          className="footer-link"
        >
          திருமூலர் அருளிய திருமந்திரம்
        </a>{" "}
        | Google Translator
      </p>
    </footer>
  );
}

export default Footer;