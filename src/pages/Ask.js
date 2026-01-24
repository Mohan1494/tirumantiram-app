import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
function Ask() {
  const [messages, setMessages] = useState([]);
  const [query, setQuery] = useState("");
  const chatEndRef = useRef(null);

  
   const BASE_URL = "https://guru-25-tm.hf.space";
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    if (!query.trim()) return;

    const userQuery = query;
    setMessages((msgs) => [...msgs, { sender: "user", text: userQuery }]);
    setQuery("");

    try {
      const res = await fetch(
        `${BASE_URL}/chat_search?q=${encodeURIComponent(userQuery)}`
      );
      const data = await res.json();

      // 🔴 OUT OF SCOPE CASE
      if (data.out_of_scope) {
        setMessages((msgs) => [
          ...msgs,
          {
            sender: "bot",
            text: ` ${data.message}`,
            isHtml: false,
          },
        ]);
        return;
      }

      // 🟢 IN-SCOPE CASE
      const botMessages = [];

      // Summary message
      botMessages.push({
        sender: "bot",
        text: `💡 Summary:\n${data.summary}`,
        isHtml: false,
      });

      // Verses
      data.results.forEach((r, i) => {
        botMessages.push({
          sender: "bot",
          isHtml: true,
          text: (
            <div key={i} style={{ marginBottom: "12px" }}>
              <strong>{i + 1}. Song #{r.song_number}</strong>
              <br />
              <span>
                பாடல்: {r.padal.slice(0, 80)}
                {r.padal.length > 80 ? "..." : ""}
              </span>
              <br />
              <span>
                விளக்கம்: {r.vilakam.slice(0, 80)}
                {r.vilakam.length > 80 ? "..." : ""}
              </span>
              <br />
              <span>
                Meaning (English): {r.vilakam_en.slice(0, 80)}
                {r.vilakam_en.length > 80 ? "..." : ""}
              </span>
              <br />
              <Link
                to={`/songs/${encodeURIComponent(r.payiram)}/${r.song_number}`}
                style={{ color: "#2a6f9e", fontWeight: "600" }}
              >
                Go to Song
              </Link>
            </div>
          ),
        });
      });

      setMessages((msgs) => [...msgs, ...botMessages]);
    } catch (error) {
      console.error(error);
      setMessages((msgs) => [
        ...msgs,
        {
          sender: "bot",
          text: "⚠️ Sorry, something went wrong.",
          isHtml: false,
        },
      ]);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "40px auto",
        height: "80vh",
        display: "flex",
        flexDirection: "column",
        border: "1px solid #ccc",
        borderRadius: "15px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
        overflow: "hidden",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <div
        style={{
          flexGrow: 1,
          padding: "20px",
          overflowY: "auto",
          backgroundColor: "rgba(250, 247, 243, 0.6)",
        }}
      >
        {messages.length === 0 && (
          <p style={{ color: "#555", textAlign: "center", marginTop: "2rem" }}>
            Ask a question in Tamil or English...
          </p>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              maxWidth: "80%",
              marginBottom: "15px",
              padding: "12px 18px",
              borderRadius: "20px",
              whiteSpace: "pre-line",
              backgroundColor:
                msg.sender === "user" ? "#D9A299" : "#F0E4D3",
              color: "#5A3E36",
              alignSelf:
                msg.sender === "user" ? "flex-end" : "flex-start",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              fontSize: "1rem",
            }}
          >
            {msg.text}
          </div>
        ))}

        <div ref={chatEndRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        style={{
          display: "flex",
          padding: "15px 20px",
          backgroundColor: "#FFF",
          borderTop: "1px solid #ccc",
        }}
      >
        <textarea
          rows={1}
          value={query}
          placeholder="Type your question here..."
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            flexGrow: 1,
            resize: "none",
            padding: "10px 15px",
            borderRadius: "20px",
            border: "1px solid #ccc",
            fontSize: "1rem",
          }}
        />
        <button
          type="submit"
          style={{
            marginLeft: "15px",
            backgroundColor: "#D9A299",
            border: "none",
            borderRadius: "20px",
            padding: "10px 20px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </form>
      <Footer />
    </div>
   
  );
}

export default Ask;
