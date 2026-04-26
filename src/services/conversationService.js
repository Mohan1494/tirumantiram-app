import { getAuthHeaders, isGuestMode } from "../utils/authUtils";

const BASE_URL = "https://mohan1494-tirumantiram-backend.hf.space";

// Session management for maintaining conversation state
const SESSION_KEY = "tirumantiram_session_id";
const SESSION_TIMESTAMP_KEY = "tirumantiram_session_timestamp";
const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

/**
 * Generate a unique session ID
 */
function generateSessionId() {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get or create session ID (maintains state for 30 minutes)
 */
function getSessionId() {
  const sessionId = localStorage.getItem(SESSION_KEY);
  const timestamp = localStorage.getItem(SESSION_TIMESTAMP_KEY);
  const now = Date.now();

  // Check if session is still valid (within timeout)
  if (sessionId && timestamp && (now - parseInt(timestamp)) < SESSION_TIMEOUT_MS) {
    // Update timestamp to reset the timeout
    localStorage.setItem(SESSION_TIMESTAMP_KEY, now.toString());
    return sessionId;
  }

  // Create new session
  const newSessionId = generateSessionId();
  localStorage.setItem(SESSION_KEY, newSessionId);
  localStorage.setItem(SESSION_TIMESTAMP_KEY, now.toString());
  return newSessionId;
}

/**
 * Clear session (start fresh conversation)
 */
export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(SESSION_TIMESTAMP_KEY);
}

/**
 * Send a chat message with session context
 * @param {string} message - The user's message
 * @param {number} topK - Number of results to return (default: 3)
 * @returns {Promise<object>} Response containing response, results, etc.
 */
export async function sendMessage(message, topK = 3) {
    const sessionId = getSessionId();
    
    const payload = {
        message,
        top_k: topK,
        session_id: sessionId,  // Maintain conversation state
    };

    const response = await fetch(`${BASE_URL}/chat`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders()
        },
        body: JSON.stringify(payload),
    });

    if (response.status === 401 && !isGuestMode()) {
        throw new Error("UNAUTHORIZED");
    }

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
}

/**
 * Get all conversations for the current user
 * @returns {Promise<Array>} List of conversations with metadata
 */
export async function getConversations() {
    const response = await fetch(`${BASE_URL}/conversations`, {
        method: "GET",
        headers: getAuthHeaders(),
    });

    if (response.status === 401) {
        throw new Error("UNAUTHORIZED");
    }

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
}

/**
 * Get full conversation history for a specific session
 * @param {string} sessionId - The session ID
 * @returns {Promise<object>} Conversation with all messages
 */
export async function getConversationHistory(sessionId) {
    const response = await fetch(`${BASE_URL}/conversations/${sessionId}`, {
        method: "GET",
        headers: getAuthHeaders(),
    });

    if (response.status === 401) {
        throw new Error("UNAUTHORIZED");
    }

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
}

/**
 * Delete a conversation
 * @param {string} sessionId - The session ID to delete
 * @returns {Promise<object>} Deletion response
 */
export async function deleteConversation(sessionId) {
    const response = await fetch(`${BASE_URL}/conversations/${sessionId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
    });

    if (response.status === 401) {
        throw new Error("UNAUTHORIZED");
    }

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
}

/**
 * Explicitly create a new conversation
 * @param {string} firstMessage - The initial message
 * @returns {Promise<object>} New conversation response with session_id
 */
export async function createConversation(firstMessage) {
    const response = await fetch(`${BASE_URL}/conversations/new`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ first_message: firstMessage }),
    });

    if (response.status === 401) {
        throw new Error("UNAUTHORIZED");
    }

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
}
