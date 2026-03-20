import React from "react";
import { Link } from "react-router-dom";

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
        // Scan all payirams as fallback
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
        <div style={{ marginBottom: "12px" }}>
            <Link
                to={`/songs/${encodeURIComponent(resolvedPayiram)}/${songNum}`}
                style={{ color: "#2a6f9e", fontWeight: "bold", textDecoration: "underline" }}
            >
                <strong>{index + 1}. Song #{songNum}</strong>
            </Link>
            <br /><br />
            <div style={{ marginBottom: "10px", paddingBottom: "10px", borderBottom: "1px solid #D9A299" }}>
                <strong style={{ color: "#5A3E36" }}>பாடல்:</strong>
                <br />
                <span style={{ color: "#5A3E36", whiteSpace: "pre-wrap" }}>{songText}</span>
            </div>
            <br />
            <div style={{ marginBottom: "10px" }}>
                <strong style={{ color: "#5A3E36" }}>விளக்கம் (Tamil):</strong>
                <br />
                <span style={{ color: "#5A3E36", whiteSpace: "pre-wrap" }}>
                    {tamilVilakkam || "விளக்கம் கிடைக்கவில்லை"}
                </span>
            </div>
            {englishVilakkam && (
                <>
                    <br />
                    <div style={{ marginBottom: "10px" }}>
                        <strong style={{ color: "#5A3E36" }}>Meaning (English):</strong>
                        <br />
                        <span style={{ color: "#5A3E36", whiteSpace: "pre-wrap" }}>{englishVilakkam}</span>
                    </div>
                </>
            )}
            <br />
            <Link
                to={`/songs/${encodeURIComponent(resolvedPayiram)}/${songNum}`}
                style={{ color: "#2a6f9e", fontWeight: "600" }}
            >
                Go to Song
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

    // If this message carries raw verse data, render it via VerseCard
    if (message.verseData) {
        return (
            <div
                className="chat-message assistant-message"
                style={{
                    maxWidth: "80%",
                    marginBottom: "15px",
                    padding: "12px 18px",
                    borderRadius: "20px",
                    backgroundColor: "#F0E4D3",
                    color: "#5A3E36",
                    alignSelf: "flex-start",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                    fontSize: "1rem",
                }}
            >
                <VerseCard
                    verseData={message.verseData}
                    index={message.verseIndex ?? 0}
                    songsData={songsData}
                />
                {showTimestamp && timestamp && (
                    <div style={{ fontSize: "0.75rem", color: "#8B7355", marginTop: "6px", opacity: 0.7 }}>
                        {formatRelativeTime(timestamp)}
                    </div>
                )}
            </div>
        );
    }

    // Regular text message
    const content = message.text || message.content;
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
            }}
        >
            {message.isHtml ? (
                <div>{content}</div>
            ) : (
                <div style={{ wordWrap: "break-word" }}>{content}</div>
            )}
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