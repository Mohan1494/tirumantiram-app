import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isAuthenticated } from "../utils/authUtils";
import {
  sendMessage,
  getConversations,
  getConversationHistory,
  deleteConversation,
} from "../services/conversationService";
import ConversationSidebar from "../components/ConversationSidebar";
import ChatMessage from "../components/ChatMessage";
import "./Ask.css";

function Ask() {
  const [messages, setMessages] = useState([]);
  const [query, setQuery] = useState("");
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [conversationTitle, setConversationTitle] = useState("New Conversation");
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const chatEndRef = useRef(null);
  const navigate = useNavigate();

  // Helper to render a verse item
  const renderVerse = (r, i) => (
    <div key={i} style={{ marginBottom: "12px" }}>
      <Link
        to={`/songs/${encodeURIComponent(r.payiram || r.payiramName)}/${r.song_number}`}
        style={{ color: "#2a6f9e", fontWeight: "bold", textDecoration: "underline" }}
      >
        <strong>{i + 1}. Song #{r.song_number}</strong>
      </Link>
      <br />
      <span>
        பாடல்: {(r.padal || "").slice(0, 80)}
        {r.padal && r.padal.length > 80 ? "..." : ""}
      </span>
      <br />
      <span>
        விளக்கம்: {(r.vilakam || "").slice(0, 80)}
        {r.vilakam && r.vilakam.length > 80 ? "..." : ""}
      </span>
      <br />
      <span>
        Meaning (English): {(r.vilakam_en || "").slice(0, 80)}
        {r.vilakam_en && r.vilakam_en.length > 80 ? "..." : ""}
      </span>
      <br />
      <Link
        to={`/songs/${encodeURIComponent(r.payiram || r.payiramName)}/${r.song_number}`}
        style={{ color: "#2a6f9e", fontWeight: "600" }}
      >
        Go to Song
      </Link>
    </div>
  );

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }

    // Load conversations on mount
    loadConversations();

    // Load last active session from localStorage
    const lastSessionId = localStorage.getItem("lastSessionId");
    if (lastSessionId) {
      loadConversation(lastSessionId);
    }
  }, [navigate]);

  // Auto-scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load all conversations
  async function loadConversations() {
    try {
      const convs = await getConversations();
      // Sort by most recent first
      convs.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
      setConversations(convs);
    } catch (error) {
      if (error.message === "UNAUTHORIZED") {
        navigate("/login");
      } else {
        console.error("Failed to load conversations:", error);
      }
    }
  }

  // Load specific conversation
  async function loadConversation(sessionId) {
    try {
      const conversation = await getConversationHistory(sessionId);
      console.log("Loaded conversation history:", conversation);
      setCurrentSessionId(sessionId);
      setConversationTitle(conversation.title || "Conversation");

      // Convert backend message format to UI format, expanding metadata results
      const formattedMessages = [];
      conversation.messages.forEach((msg) => {
        console.log("Processing message:", msg);
        // Main message
        formattedMessages.push({
          sender: msg.role,
          role: msg.role,
          text: msg.content,
          content: msg.content,
          timestamp: msg.timestamp,
          isHtml: false,
        });

        // Add verses from metadata if they exist
        let metadata = msg.metadata;
        if (typeof metadata === "string") {
          try {
            metadata = JSON.parse(metadata);
          } catch (e) {
            console.warn("Failed to parse metadata string:", e);
          }
        }

        if (metadata) {
          // Check for common keys where verses might be stored
          const verses = metadata.results || metadata.search_results || metadata.verses || [];
          if (Array.isArray(verses) && verses.length > 0) {
            console.log(`Found ${verses.length} verses in metadata`);
            verses.forEach((r, i) => {
              formattedMessages.push({
                sender: msg.role,
                role: msg.role,
                isHtml: true,
                text: renderVerse(r, i),
                content: `Verse ${i + 1}: Song #${r.song_number}`,
                timestamp: msg.timestamp,
              });
            });
          }
        }
      });

      setMessages(formattedMessages);
      localStorage.setItem("lastSessionId", sessionId);
    } catch (error) {
      if (error.message === "UNAUTHORIZED") {
        navigate("/login");
      } else {
        console.error("Failed to load conversation:", error);
      }
    }
  }

  // Start new conversation
  function handleNewConversation() {
    setCurrentSessionId(null);
    setMessages([]);
    setConversationTitle("New Conversation");
    localStorage.removeItem("lastSessionId");
    setQuery("");
  }

  // Delete conversation
  async function handleDeleteConversation(sessionId) {
    try {
      await deleteConversation(sessionId);

      // If deleting current conversation, reset
      if (sessionId === currentSessionId) {
        handleNewConversation();
      }

      // Reload conversation list
      await loadConversations();
    } catch (error) {
      if (error.message === "UNAUTHORIZED") {
        navigate("/login");
      } else {
        console.error("Failed to delete conversation:", error);
      }
    }
  }

  // Send message
  async function handleSend() {
    if (!query.trim() || isLoading) return;

    const userQuery = query.trim();
    const userMessage = {
      sender: "user",
      role: "user",
      text: userQuery,
      content: userQuery,
      timestamp: new Date().toISOString(),
      isHtml: false,
    };

    setMessages((msgs) => [...msgs, userMessage]);
    setQuery("");
    setIsLoading(true);

    try {
      const data = await sendMessage(userQuery, currentSessionId);

      // Update session ID if this is a new conversation
      if (!currentSessionId && data.session_id) {
        setCurrentSessionId(data.session_id);
        setConversationTitle(data.conversation_title || "Conversation");
        localStorage.setItem("lastSessionId", data.session_id);
        // Reload conversations to show new one
        await loadConversations();
      }

      // Handle out of scope response
      if (data.out_of_scope) {
        const assistantMessage = {
          sender: "assistant",
          role: "assistant",
          text: data.response || "This question is outside the scope of Thirumandiram.",
          content: data.response || "This question is outside the scope of Thirumandiram.",
          timestamp: new Date().toISOString(),
          isHtml: false,
        };
        setMessages((msgs) => [...msgs, assistantMessage]);
        setIsLoading(false);
        return;
      }

      // Handle in-scope response
      const botMessages = [];

      // Add AI response as text
      if (data.response) {
        botMessages.push({
          sender: "assistant",
          role: "assistant",
          text: data.response,
          content: data.response,
          timestamp: new Date().toISOString(),
          isHtml: false,
        });
      }

      // Add verses if available
      if (data.results && data.results.length > 0) {
        data.results.forEach((r, i) => {
          botMessages.push({
            sender: "assistant",
            role: "assistant",
            isHtml: true,
            text: renderVerse(r, i),
            content: `Verse ${i + 1}: Song #${r.song_number}`,
            timestamp: new Date().toISOString(),
          });
        });
      }

      setMessages((msgs) => [...msgs, ...botMessages]);
    } catch (error) {
      if (error.message === "UNAUTHORIZED") {
        setMessages((msgs) => [
          ...msgs,
          {
            sender: "assistant",
            role: "assistant",
            text: "⚠️ Your session has expired. Please login again.",
            content: "⚠️ Your session has expired. Please login again.",
            timestamp: new Date().toISOString(),
            isHtml: false,
          },
        ]);
        navigate("/login");
      } else {
        console.error(error);
        setMessages((msgs) => [
          ...msgs,
          {
            sender: "assistant",
            role: "assistant",
            text: "⚠️ Sorry, something went wrong. Please try again.",
            content: "⚠️ Sorry, something went wrong. Please try again.",
            timestamp: new Date().toISOString(),
            isHtml: false,
          },
        ]);
      }
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="ask-container">
      {/* Conversation Sidebar */}
      <ConversationSidebar
        conversations={conversations}
        currentSessionId={currentSessionId}
        onSelectConversation={loadConversation}
        onNewConversation={handleNewConversation}
        onDeleteConversation={handleDeleteConversation}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Chat Area */}
      <div className="chat-area">
        {/* Chat Header */}
        <div className="chat-header">
          <button
            className="menu-btn"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            ☰
          </button>
          <h2>{conversationTitle}</h2>
          <div style={{ width: "40px" }} /> {/* Spacer for centering */}
        </div>

        {/* Messages Area */}
        <div className="messages-area">
          {messages.length === 0 && (
            <div className="empty-chat-state">
              <p>Ask a question about Thirumandiram...</p>
              <p style={{ fontSize: "0.9rem", color: "#8B7355", marginTop: "10px" }}>
                You can ask in Tamil or English
              </p>
            </div>
          )}

          {messages.map((msg, idx) => (
            <ChatMessage key={idx} message={msg} showTimestamp={true} />
          ))}

          {isLoading && (
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <form className="input-area" onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}>
          <textarea
            rows={1}
            value={query}
            placeholder="Type your question here..."
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading || !query.trim()}>
            {isLoading ? "..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Ask;
