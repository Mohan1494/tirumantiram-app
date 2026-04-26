import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated, isGuestMode } from "../utils/authUtils";
import {
  sendMessage,
  getConversations,
  getConversationHistory,
  deleteConversation,
  clearSession
} from "../services/conversationService";
import ConversationSidebar from "../components/ConversationSidebar";
import ChatMessage from "../components/ChatMessage";
import {
  startRecording,
  stopRecording,
  transcribeAudio,
} from "../services/sttService";
import "./Ask.css";

// ✅ Accept songsData as a prop from App.js
function Ask({ songsData = {} }) {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [conversationTitle, setConversationTitle] = useState("Ask Thirumandiram");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const chatEndRef = useRef(null);

  // Redirect to login if not authenticated and not guest
  useEffect(() => {
    if (!isAuthenticated() && !isGuestMode()) {
      navigate("/login");
      return;
    }

    if (isGuestMode()) {
      setConversationTitle("Guest Session");
    } else {
      loadConversations();
      const lastSessionId = localStorage.getItem("lastSessionId");
      if (lastSessionId) {
        loadConversation(lastSessionId);
      }
    }
    
    window.scrollTo(0, 0);
  }, [navigate]);

  // Auto-scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function loadConversations() {
    try {
      const data = await getConversations();
      setConversations(data);
    } catch (error) {
      console.error("Failed to load conversations:", error);
    }
  }

  async function loadConversation(sessionId) {
    setIsLoading(true);
    try {
      const data = await getConversationHistory(sessionId);
      setCurrentSessionId(data.session_id);
      setConversationTitle(data.title);
      
      // Convert backend message format to frontend format
      const history = data.messages.map(msg => ({
        sender: msg.role === "user" ? "user" : "assistant",
        role: msg.role,
        text: msg.content,
        content: msg.content,
        timestamp: msg.timestamp,
        isHtml: false,
        verseData: msg.metadata?.search_results?.[0] // Optional: link to first result
      }));
      
      setMessages(history);
      if (!isGuestMode()) {
        localStorage.setItem("lastSessionId", sessionId);
      }
      setIsSidebarOpen(false);
    } catch (error) {
      console.error("Failed to load conversation history:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDeleteConversation(sessionId) {
    if (!window.confirm("Are you sure you want to delete this conversation?")) return;
    try {
      await deleteConversation(sessionId);
      if (currentSessionId === sessionId) {
        handleNewConversation();
      }
      loadConversations();
    } catch (error) {
      console.error("Failed to delete conversation:", error);
    }
  }

  // Start new conversation
  function handleNewConversation() {
    setMessages([]);
    setQuery("");
    setCurrentSessionId(null);
    setConversationTitle(isGuestMode() ? "Guest Session" : "Ask Thirumandiram");
    localStorage.removeItem("lastSessionId");
    clearSession();
    setIsSidebarOpen(false);
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
      const data = await sendMessage(userQuery);

      // Update session ID for new conversations
      if (!currentSessionId && data.session_id) {
        setCurrentSessionId(data.session_id);
        setConversationTitle(data.conversation_title || "Conversation");
        if (!isGuestMode()) {
          localStorage.setItem("lastSessionId", data.session_id);
          await loadConversations();
        }
      }

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
        return;
      }

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

      if (data.results && data.results.length > 0) {
        data.results.forEach((r, i) => {
          botMessages.push({
            sender: "assistant",
            role: "assistant",
            isHtml: false,
            verseData: r,
            verseIndex: i,
            content: `Verse ${i + 1}: Song #${r.song_number}`,
            timestamp: new Date().toISOString(),
          });
        });
      }

      setMessages((msgs) => [...msgs, ...botMessages]);
    } catch (error) {
      if (error.message === "UNAUTHORIZED" && !isGuestMode()) {
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
      {!isGuestMode() && (
        <ConversationSidebar
          conversations={conversations}
          currentSessionId={currentSessionId}
          onSelectConversation={loadConversation}
          onNewConversation={handleNewConversation}
          onDeleteConversation={handleDeleteConversation}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="chat-area">
        <div className="chat-header">
          {!isGuestMode() && (
            <button
              className="menu-btn"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              ☰
            </button>
          )}
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