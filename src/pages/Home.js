import React from "react";
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

    // Overlay with translucent white to keep text readable
    backgroundColor: "rgba(255, 255, 255, 0.6)", 
    backgroundBlendMode: "overlay",

    borderRadius: "15px",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
    color: "#5A3E36",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    textAlign: "center",
  }}
>
  <h1 style={{ fontSize: "2.8rem", marginBottom: "20px", fontWeight: "700" }}>
    திருமந்திரம் AI
  </h1>
  <p style={{ fontSize: "1.3rem", lineHeight: "1.6" }}>
    Explore the wisdom of Thirumandiram in Tamil & English.
  </p>
  
</div>

  );
}

export default Home;
