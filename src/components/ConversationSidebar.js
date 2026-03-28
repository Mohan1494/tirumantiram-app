import React, { useState } from "react";
import "./ConversationSidebar.css";

/**
 * Format date to short format (e.g., "Today", "Yesterday", "Jan 15")
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/**
 * ConversationSidebar Component
 * Displays list of conversations with management options
 */
function ConversationSidebar({
    conversations,
    currentSessionId,
    onSelectConversation,
    onNewConversation,
    onDeleteConversation,
    isOpen,
    onClose,
}) {
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const handleDelete = (sessionId) => {
        if (deleteConfirm === sessionId) {
            onDeleteConversation(sessionId);
            setDeleteConfirm(null);
        } else {
            setDeleteConfirm(sessionId);
            // Reset confirmation after 3 seconds
            setTimeout(() => setDeleteConfirm(null), 3000);
        }
    };

    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && (
                <div className="sidebar-overlay" onClick={onClose} />
            )}

            {/* Sidebar */}
            <div className={`conversation-sidebar ${isOpen ? "sidebar-open" : "sidebar-closed"}`}>
                {/* Header */}
                <div className="sidebar-header">
                    <h2 style={{ margin: 0, fontSize: "1.2rem", color: "#f8fafc" }}>
                        Conversations
                    </h2>
                    <button className="close-sidebar-btn" onClick={onClose}>
                        ✕
                    </button>
                </div>

                {/* New Conversation Button */}
                <button className="new-conversation-btn" onClick={onNewConversation}>
                    <span style={{ fontSize: "1.2rem", marginRight: "8px" }}>+</span>
                    New Conversation
                </button>

                {/* Conversation List */}
                <div className="conversation-list">
                    {conversations.length === 0 ? (
                        <p className="empty-state">No conversations yet</p>
                    ) : (
                        conversations.map((conv) => (
                            <div
                                key={conv.session_id}
                                className={`conversation-item ${conv.session_id === currentSessionId ? "active" : ""
                                    }`}
                                onClick={() => {
                                    onSelectConversation(conv.session_id);
                                    if (window.innerWidth <= 768) {
                                        onClose();
                                    }
                                }}
                            >
                                <div className="conversation-info">
                                    <div className="conversation-title">
                                        {conv.title || "Untitled Conversation"}
                                    </div>
                                    <div className="conversation-meta">
                                        <span>{formatDate(conv.updated_at)}</span>
                                        <span style={{ margin: "0 6px" }}>•</span>
                                        <span>{conv.message_count || 0} messages</span>
                                    </div>
                                </div>
                                <button
                                    className="delete-conversation-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(conv.session_id);
                                    }}
                                    title={
                                        deleteConfirm === conv.session_id
                                            ? "Click again to confirm"
                                            : "Delete conversation"
                                    }
                                >
                                    {deleteConfirm === conv.session_id ? "✓" : "🗑️"}
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
}

export default ConversationSidebar;
