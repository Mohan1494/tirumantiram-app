import React from "react";

/**
 * Format timestamp to relative time (e.g., "Just now", "2 hours ago")
 */
function formatRelativeTime(timestamp) {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffMs = now - messageTime;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return messageTime.toLocaleDateString();
}

/**
 * ChatMessage Component
 * Displays individual chat messages with proper styling
 */
function ChatMessage({ message, showTimestamp = true }) {
    const isUser = message.role === "user" || message.sender === "user";
    const content = message.text || message.content;
    const timestamp = message.timestamp;

    return (
        <div
            className={`chat-message ${isUser ? "user-message" : "assistant-message"}`}
            style={{
                maxWidth: "80%",
                marginBottom: "15px",
                padding: "12px 18px",
                borderRadius: "20px",
                whiteSpace: "pre-line",
                backgroundColor: isUser ? "#D9A299" : "#F0E4D3",
                color: "#5A3E36",
                alignSelf: isUser ? "flex-end" : "flex-start",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                fontSize: "1rem",
                position: "relative",
            }}
        >
            {/* Message content */}
            {message.isHtml ? (
                <div>{content}</div>
            ) : (
                <div style={{ wordWrap: "break-word" }}>{content}</div>
            )}

            {/* Timestamp */}
            {showTimestamp && timestamp && (
                <div
                    style={{
                        fontSize: "0.75rem",
                        color: "#8B7355",
                        marginTop: "6px",
                        textAlign: isUser ? "right" : "left",
                        opacity: 0.7,
                    }}
                >
                    {formatRelativeTime(timestamp)}
                </div>
            )}
        </div>
    );
}

export default ChatMessage;
