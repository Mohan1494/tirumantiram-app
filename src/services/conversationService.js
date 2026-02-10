import { getAuthHeaders } from "../utils/authUtils";

const BASE_URL = "https://mohan1494-tirumantiram-backend.hf.space";

/**
 * Send a chat message to the backend
 * @param {string} message - The user's message
 * @param {string|null} sessionId - Optional session ID for continuing a conversation
 * @param {number} topK - Number of results to return (default: 3)
 * @returns {Promise<object>} Response containing session_id, response, results, etc.
 */
export async function sendMessage(message, sessionId = null, topK = 3) {
    const payload = {
        message,
        top_k: topK,
    };

    if (sessionId) {
        payload.session_id = sessionId;
    }

    const response = await fetch(`${BASE_URL}/chat`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
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
