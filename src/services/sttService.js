/**
 * sttService.js
 * Handles audio recording and transcription via Groq Whisper API
 */

const GROQ_API_URL = "https://api.groq.com/openai/v1/audio/transcriptions";
let mediaRecorder = null;
let audioChunks = [];

/**
 * Start recording audio from the microphone
 * @returns {Promise<boolean>} Success status
 */
export async function startRecording() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                audioChunks.push(event.data);
            }
        };

        mediaRecorder.start();
        return true;
    } catch (error) {
        console.error("Error starting recording:", error);
        return false;
    }
}

/**
 * Stop recording audio
 * @returns {Promise<Blob|null>} The recorded audio blob
 */
export async function stopRecording() {
    return new Promise((resolve) => {
        if (!mediaRecorder || mediaRecorder.state === "inactive") {
            resolve(null);
            return;
        }

        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            // Stop all tracks to release the microphone
            mediaRecorder.stream.getTracks().forEach(track => track.stop());
            mediaRecorder = null;
            resolve(audioBlob);
        };

        mediaRecorder.stop();
    });
}

/**
 * Transcribe audio blob using Groq Whisper-large-v3
 * @param {Blob} audioBlob - The audio recording blob
 * @param {string} apiKey - Optional API key (if provided by user)
 * @returns {Promise<string|null>} Transcribed text or null on failure
 */
export async function transcribeAudio(audioBlob, apiKey = null) {
    if (!audioBlob) return null;

    // Use environment variable if apiKey not provided
    const key = apiKey || process.env.REACT_APP_GROQ_API_KEY;


    if (!key) {
        console.error("Groq API Key missing. Please provide it in REACT_APP_GROQ_API_KEY environment variable.");
        return "ERROR: API Key Missing";
    }

    const formData = new FormData();
    formData.append("file", audioBlob, "recording.webm");
    formData.append("model", "whisper-large-v3");
    formData.append("response_format", "json");
    // Support English and Tamil. Groq Whisper handles auto-detection or we can specify.
    // Leaving it to auto-detect often works best for mixed/unknown content.

    try {
        const response = await fetch(GROQ_API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${key}`,
            },
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Groq API error:", errorData);
            throw new Error(`Groq API error: ${response.status}`);
        }

        const data = await response.json();
        return data.text || "";
    } catch (error) {
        console.error("Transcription failed:", error);
        return null;
    }
}
