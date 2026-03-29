import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./ChatMessage.css";

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

function formatDisplayText(text = "") {
    return text
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line && line !== ":")
        .join("\n");
}

function ExpandableText({ text, maxLength = 150 }) {
    const [isExpanded, setIsExpanded] = useState(false);
    
    if (!text) return null;
    if (text.length <= maxLength) {
        return <>{text}</>;
    }

    return (
        <>
            {isExpanded ? text : `${text.substring(0, maxLength)}...`}
            <button 
                className="read-more-inline-btn"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                {isExpanded ? " Read Less" : " Read More"}
            </button>
        </>
    );
}


/**
 * Renders a single verse card from raw verse data + songsData for fallback enrichment.
 * This runs at render time, so songsData is always available.
 */
function VerseCard({ verseData, index, songsData = {} }) {
    const r = verseData;
    if (!r) return null;

    const songText = r.padal || "";
    const payiramName = r.payiram || r.payiramName || "Unknown Payiram";
    const songNum = r.song_number || r.song_no || "";

    // Try to find enriched data from songsData
    const getFallbackSong = () => {
        if (!songNum || !songsData) return null;
        const normalizedPayiram = payiramName.replace(/\+/g, " ");
        const candidateKeys = [payiramName, normalizedPayiram, decodeURIComponent(payiramName)];
        for (const key of candidateKeys) {
            if (!key || !songsData[key]) continue;
            const source = songsData[key];
            if (Array.isArray(source)) {
                const match = source.find(
                    (s) => String(s.song_number) === String(songNum) || String(s.song_no) === String(songNum)
                );
                if (match) return { song: match, payiramKey: key };
            }
        }
        for (const payiramKey of Object.keys(songsData)) {
            const group = songsData[payiramKey];
            if (!Array.isArray(group)) continue;
            const match = group.find(
                (s) => String(s.song_number) === String(songNum) || String(s.song_no) === String(songNum)
            );
            if (match) return { song: match, payiramKey };
        }
        return null;
    };

    let tamilVilakkam = formatDisplayText(r.vilakkam || r.vilakam || "");
    let englishVilakkam = formatDisplayText(r.vilakkam_en || r.vilakam_en || "");
    let resolvedPayiram = payiramName;

    const fallbackResult = getFallbackSong();
    if (fallbackResult) {
        const { song: fallbackSong, payiramKey } = fallbackResult;
        resolvedPayiram = payiramKey || resolvedPayiram;
        if (!tamilVilakkam) {
            tamilVilakkam = formatDisplayText(fallbackSong.vilakkam || fallbackSong.vilakam || "");
        }
        if (!englishVilakkam) {
            englishVilakkam = formatDisplayText(fallbackSong.vilakkam_en || fallbackSong.vilakam_en || "");
        }
    }

    return (
        <div className="verse-card-container">
            <div className="verse-card-header">
                <Link to={`/songs/${encodeURIComponent(resolvedPayiram)}/${songNum}`}>
                    {index + 1}. Song #{songNum}
                </Link>
            </div>
            
            <div className="verse-divider"></div>
            
            <div className="verse-section">
                <div className="verse-label">
                    <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                    பாடல்:
                </div>
                <div className="verse-text">{songText}</div>
            </div>

            <div className="verse-section">
                <div className="verse-label">
                    <svg viewBox="0 0 24 24"><path d="M21 15l-3-3v2H4v-2L1 15l3 3v-2h14v2l3-3z"/></svg>
                    விளக்கம் (Tamil):
                </div>
                <div className="verse-text">
                    <ExpandableText text={tamilVilakkam || "விளக்கம் கிடைக்கவில்லை"} />
                </div>
            </div>

            {englishVilakkam && (
                <div className="verse-section">
                    <div className="verse-label">
                        <svg viewBox="0 0 24 24"><path d="M12 21.05C6.91 21.05 2.8 16.94 2.8 11.85 2.8 6.76 6.91 2.65 12 2.65c5.09 0 9.2 4.11 9.2 9.2 0 5.09-4.11 9.2-9.2 9.2zM11 6v6l4.25 2.52.75-1.23-3.5-2.07V6h-1.5z"/></svg>
                        Meaning (English):
                    </div>
                    <div className="verse-text">
                        <ExpandableText text={englishVilakkam} />
                    </div>
                </div>
            )}
            
            <Link to={`/songs/${encodeURIComponent(resolvedPayiram)}/${songNum}`} className="verse-link-btn">
                Read Full Song
            </Link>
        </div>
    );
}

/**
 * ChatMessage Component
 * Pass songsData prop so verse cards can enrich themselves at render time.
 */
function ChatMessage({ message, showTimestamp = true, songsData = {} }) {
    const isUser = message.role === "user" || message.sender === "user";
    const timestamp = message.timestamp;
    
    // Add small delay staggering to user messages could go here if managed by parent
    
    if (message.verseData) {
        return (
            <div className="chat-message-row assistant">
                <div className="chat-bubble">
                    <VerseCard
                        verseData={message.verseData}
                        index={message.verseIndex ?? 0}
                        songsData={songsData}
                    />
                    {showTimestamp && timestamp && (
                        <div className="chat-timestamp">
                            {formatRelativeTime(timestamp)}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    const content = message.text || message.content;
    return (
        <div className={`chat-message-row ${isUser ? "user" : "assistant"}`}>
            <div className="chat-bubble">
                {message.isHtml ? (
                    <div dangerouslySetInnerHTML={{ __html: content }} />
                ) : (
                    <div>{content}</div>
                )}
                {showTimestamp && timestamp && (
                    <div className="chat-timestamp">
                        {formatRelativeTime(timestamp)}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ChatMessage;