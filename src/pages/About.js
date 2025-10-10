import React from "react";

function About() {
  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "60px auto",
        padding: "30px 40px",
        backgroundColor: "rgba(250, 247, 243, 0.85)", // translucent warm white
        borderRadius: "20px",
        boxShadow: "0 10px 30px rgba(90, 62, 54, 0.15)",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: "#5A3E36", // warm dark brown
        lineHeight: 1.7,
      }}
    >
      <h2
        style={{
          fontSize: "2.8rem",
          marginBottom: "25px",
          fontWeight: "700",
          textAlign: "center",
          borderBottom: "3px solid #D9A299",
          paddingBottom: "10px",
        }}
      >
        About Tirumandiram.AI
      </h2>

      <p style={{ fontSize: "1.15rem", marginBottom: "20px" }}>
        <strong>Tirumandiram.AI</strong> is a digital platform dedicated to bringing
        the wisdom of the ancient Tamil scripture <em>Tirumandiram</em> to everyone.
        Using modern AI technology, you can ask questions in Tamil or English
        and instantly find relevant verses and explanations.
      </p>

      <p style={{ fontSize: "1.15rem", marginBottom: "20px" }}>
        The <em>Tirumandiram</em>, composed by Siddhar Thirumoolar, is a profound
        collection of spiritual teachings, yogic practices, and philosophical
        insights. This platform aims to make those teachings easily searchable
        and accessible for study and contemplation.
      </p>

      <p style={{ fontSize: "1.15rem", marginBottom: "30px" }}>
        Our mission is to bridge the gap between ancient wisdom and modern
        seekers by combining traditional literature with advanced language
        processing tools.
      </p>

      <h3
        style={{
          fontSize: "1.8rem",
          marginBottom: "15px",
          borderBottom: "2px solid #D9A299",
          paddingBottom: "6px",
          color: "#8B6A58",
        }}
      >
        Features
      </h3>
      <ul
        style={{
          fontSize: "1.15rem",
          paddingLeft: "20px",
          marginBottom: "35px",
          color: "#6D4B3B",
        }}
      >
        <li style={{ marginBottom: "10px" }}>Search verses by asking natural questions.</li>
        <li style={{ marginBottom: "10px" }}>Read meanings in both Tamil and English.</li>
        <li style={{ marginBottom: "10px" }}>Browse songs grouped by Payirams (sections).</li>
      </ul>

      <h3
        style={{
          fontSize: "1.8rem",
          marginBottom: "15px",
          borderBottom: "2px solid #D9A299",
          paddingBottom: "6px",
          color: "#8B6A58",
        }}
      >
        Disclaimer
      </h3>
      <p style={{ fontSize: "1.1rem", color: "#5A3E36" }}>
        This project is for educational and spiritual purposes. The AI results
        are based on available verse data and may not replace traditional
        interpretations.
      </p>
    </div>
  );
}

export default About;
