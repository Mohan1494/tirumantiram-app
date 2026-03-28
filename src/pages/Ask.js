import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../utils/authUtils";
import {
  sendMessage,
  getConversations,
  getConversationHistory,
  deleteConversation,
} from "../services/conversationService";
import ConversationSidebar from "../components/ConversationSidebar";
import ChatMessage from "../components/ChatMessage";
import {
  startRecording,
  stopRecording,
  transcribeAudio,
} from "../services/sttService";
import "./Ask.css";

function Ask() {
  const [messages, setMessages] = useState([]);
  const [query, setQuery] = useState("");
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [conversationTitle, setConversationTitle] = useState("New Conversation");
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
  const [isRecording, setIsRecording] = useState(false);
  const [songsData, setSongsData] = useState({});
  const chatEndRef = useRef(null);
  const navigate = useNavigate();

  // Load songs data once on mount
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await fetch("/merged_with_fourth_new_line.json");
        if (!response.ok) throw new Error("Fetch failed");
        const data = await response.json();
        setSongsData(data);
      } catch {
        try {
          const fallback = await fetch("/songs.json");
          if (!fallback.ok) throw new Error("Fallback fetch failed");
          const fallbackData = await fallback.json();
          setSongsData(fallbackData);
        } catch (err) {
          console.warn("Could not load songs data for Ask fallback:", err);
        }
      }
    };
    fetchSongs();
  }, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }

    window.scrollTo(0, 0);
    loadConversations();

    const lastSessionId = localStorage.getItem("lastSessionId");
    if (lastSessionId) {
      loadConversation(lastSessionId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  // Auto-scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load all conversations
  async function loadConversations() {
    try {
      const convs = await getConversations();
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

  // Load specific conversation — store raw verseData, never pre-render JSX
  async function loadConversation(sessionId) {
    try {
      const conversation = await getConversationHistory(sessionId);
      setCurrentSessionId(sessionId);
      setConversationTitle(conversation.title || "Conversation");

      const formattedMessages = [];

      conversation.messages.forEach((msg) => {
        // Main text message
        formattedMessages.push({
          sender: msg.role,
          role: msg.role,
          text: msg.content,
          content: msg.content,
          timestamp: msg.timestamp,
          isHtml: false,
        });

        // Parse metadata for verse results
        let metadata = msg.metadata;
        if (typeof metadata === "string") {
          try {
            metadata = JSON.parse(metadata);
          } catch (e) {
            console.warn("Failed to parse metadata string:", e);
          }
        }

        if (metadata) {
          const verses = metadata.search_results || metadata.results || metadata.verses || [];
          if (Array.isArray(verses) && verses.length > 0) {
            verses.forEach((r, i) => {
              // Store raw verseData — VerseCard in ChatMessage renders it at display time
              // so songsData is always available for Tamil/English enrichment
              formattedMessages.push({
                sender: msg.role,
                role: msg.role,
                isHtml: false,
                verseData: r,         // ← raw data, not rendered JSX
                verseIndex: i,        // ← used by VerseCard for numbering
                content: `Verse ${i + 1}: Song #${r.song_number || r.song_no || ""}`,
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
    setQuery("");
  }

  // Delete conversation
  async function handleDeleteConversation(sessionId) {
    try {
      await deleteConversation(sessionId);
      if (sessionId === currentSessionId) {
        handleNewConversation();
      }
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

      // Update session ID for new conversations
      if (!currentSessionId && data.session_id) {
        setCurrentSessionId(data.session_id);
        setConversationTitle(data.conversation_title || "Conversation");
        localStorage.setItem("lastSessionId", data.session_id);
        await loadConversations();
      }

      // Handle out of scope response
      if (data.out_of_scope) {
        setMessages((msgs) => [
          ...msgs,
          {
            sender: "assistant",
            role: "assistant",
            text: data.response || "This question is outside the scope of Thirumandiram.",
            content: data.response || "This question is outside the scope of Thirumandiram.",
            timestamp: new Date().toISOString(),
            isHtml: false,
          },
        ]);
        setIsLoading(false);
        return;
      }

      // Handle in-scope response
      const botMessages = [];

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

      // Store raw verseData — rendered by VerseCard at display time
      if (data.results && data.results.length > 0) {
        data.results.forEach((r, i) => {
          botMessages.push({
            sender: "assistant",
            role: "assistant",
            isHtml: false,
            verseData: r,       // ← raw data only
            verseIndex: i,
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

  // Handle Microphone click
  async function handleMicClick() {
    if (isRecording) {
      setIsRecording(false);
      setIsLoading(true);
      const audioBlob = await stopRecording();
      if (audioBlob) {
        const text = await transcribeAudio(audioBlob);
        if (text) {
          if (text.startsWith("ERROR:")) {
            alert(text);
          } else {
            setQuery(text);
          }
        }
      }
      setIsLoading(false);
    } else {
      const success = await startRecording();
      if (success) {
        setIsRecording(true);
      } else {
        alert("Could not access microphone.");
      }
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
      <ConversationSidebar
        conversations={conversations}
        currentSessionId={currentSessionId}
        onSelectConversation={loadConversation}
        onNewConversation={handleNewConversation}
        onDeleteConversation={handleDeleteConversation}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="chat-area">
        <div className="chat-header">
          <button
            className="menu-btn"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            ☰
          </button>
          <h2>{conversationTitle}</h2>
          <div style={{ width: "40px" }} />
        </div>

        <div className="messages-area">
          {messages.length === 0 && (
            <div className="empty-chat-state">
              <p>Ask a question about Thirumandiram...</p>
              <p style={{ fontSize: "0.95rem", color: "#94a3b8", marginTop: "12px" }}>
                You can ask in Tamil or English
              </p>
            </div>
          )}

          {messages.map((msg, idx) => (
            <ChatMessage
              key={idx}
              message={msg}
              showTimestamp={false}
              songsData={songsData}
            />
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

        <div className="input-container">
          <form className="input-area" onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
            <button
              type="button"
              className={`mic-btn ${isRecording ? "recording" : ""}`}
              onClick={handleMicClick}
              disabled={isLoading}
              title={isRecording ? "Stop Recording" : "Start Voice Input"}
            >
              {isRecording ? (
                <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                  <path d="M6 6h12v12H6z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                  <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                </svg>
              )}
            </button>
            <textarea
              rows={1}
              value={query}
              placeholder={isRecording ? "Listening..." : "Type your question here..."}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading || isRecording}
            />
            <button
              type="submit"
              className="send-btn"
              disabled={isLoading || isRecording || !query.trim()}
              aria-label="Send message"
            >
              {isLoading ? (
                "..."
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
                </svg>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Ask;