"use client";

import {
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { useAuthStore } from "@/stores/auth-store";

export interface VoiceTranscriptEvent {
  text: string;
  isFinal: boolean;
  sequence: number;
}

export interface UseVoiceRecorderOptions {
  onTranscriptUpdate?: (event: VoiceTranscriptEvent) => void;
  onError?: (error: string) => void;
  onRecordingStateChange?: (isRecording: boolean) => void;
}

export function useVoiceRecorder(options?: UseVoiceRecorderOptions) {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const websocketRef = useRef<WebSocket | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const lastSequenceRef = useRef<number>(0);
  const committedTextRef = useRef<string>("");
  const interimTextRef = useRef<string>("");

  const [isRecording, setIsRecording] = useState(false);
  const [committedText, setCommittedText] = useState("");
  const [interimText, setInterimText] = useState("");
  const [transcript, setTranscript] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const optionsRef = useRef(options);
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  function getSupportedMimeType(): string {
    if (typeof window === "undefined" || typeof MediaRecorder === "undefined") {
      return "";
    }
    const prioritizedTypes = [
      "audio/webm;codecs=opus",
      "audio/webm",
      "audio/mp4",
      "audio/aac",
    ];
    for (const type of prioritizedTypes) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }
    return "";
  }

  const cleanupAudioTracks = useCallback(() => {
    if (streamRef.current) {
      try {
        streamRef.current.getTracks().forEach((track) => {
          track.stop();
        });
      } catch (err) {
        console.warn("Error stopping audio tracks:", err);
      }
      streamRef.current = null;
    }
  }, []);

  const stopRecording = useCallback(() => {
    cleanupAudioTracks();

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      try {
        mediaRecorderRef.current.stop();
      } catch (err) {
        console.warn("Error stopping media recorder:", err);
      }
    }
    mediaRecorderRef.current = null;

    if (websocketRef.current) {
      try {
        if (
          websocketRef.current.readyState === WebSocket.OPEN ||
          websocketRef.current.readyState === WebSocket.CONNECTING
        ) {
          websocketRef.current.close(1000, "Recording stopped by user");
        }
      } catch (err) {
        console.warn("Error closing voice websocket:", err);
      }
      websocketRef.current = null;
    }

    // Flush any lingering interim text into committed text
    if (interimTextRef.current.trim()) {
      const finalCommitted = committedTextRef.current
        ? `${committedTextRef.current} ${interimTextRef.current.trim()}`
        : interimTextRef.current.trim();
      committedTextRef.current = finalCommitted;
      interimTextRef.current = "";
      setCommittedText(finalCommitted);
      setInterimText("");
      setTranscript(finalCommitted);
    }

    setIsRecording(false);
    optionsRef.current?.onRecordingStateChange?.(false);
  }, [cleanupAudioTracks]);

  const startRecording = useCallback(async () => {
    try {
      setErrorMessage(null);
      // Clean up any lingering session
      stopRecording();

      // Retrieve canonical access token from Zustand auth store
      const token = useAuthStore.getState().accessToken;
      if (!token) {
        const authErr = "Voice recording requires an authenticated session. Please log in.";
        setErrorMessage(authErr);
        optionsRef.current?.onError?.(authErr);
        return;
      }

      // Reset sequence counter and buffers for new session
      lastSequenceRef.current = 0;
      committedTextRef.current = "";
      interimTextRef.current = "";
      setCommittedText("");
      setInterimText("");
      setTranscript("");

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      streamRef.current = stream;

      const mimeType = getSupportedMimeType();
      const mediaRecorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const actualMimeType = mediaRecorder.mimeType || mimeType || "audio/webm";

      // Build authenticated WebSocket URL with query allowlist compliance
      const wsBase = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000";
      const params = new URLSearchParams();
      params.set("token", token);
      params.set("mimeType", actualMimeType);
      params.set("model", "nova-3");
      params.set("language", "multi");

      const wsUrl = `${wsBase}/ws/voice?${params.toString()}`;
      const ws = new WebSocket(wsUrl);
      websocketRef.current = ws;

      ws.binaryType = "arraybuffer";

      ws.onopen = () => {
        try {
          // Cadence: 250ms chunks (~4 chunks/sec matching server maxsize=50 queue)
          mediaRecorder.start(250);
          setIsRecording(true);
          optionsRef.current?.onRecordingStateChange?.(true);
        } catch (e) {
          console.error("Failed to start media recorder:", e);
          stopRecording();
        }
      };

      mediaRecorder.ondataavailable = async (event) => {
        if (
          event.data &&
          event.data.size > 0 &&
          ws.readyState === WebSocket.OPEN
        ) {
          try {
            const arrayBuffer = await event.data.arrayBuffer();
            ws.send(arrayBuffer);
          } catch (e) {
            console.warn("Error sending voice audio chunk:", e);
          }
        }
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.type === "transcript" && typeof data.text === "string") {
            const seq = typeof data.sequence === "number" ? data.sequence : 0;
            // Drop stale or out-of-order packets
            if (seq !== 0 && seq <= lastSequenceRef.current) {
              return;
            }
            if (seq > 0) {
              lastSequenceRef.current = seq;
            }

            const incomingText = data.text.trim();
            const isFinal = Boolean(data.is_final);

            if (isFinal) {
              const updatedCommitted = committedTextRef.current
                ? `${committedTextRef.current} ${incomingText}`
                : incomingText;
              committedTextRef.current = updatedCommitted;
              interimTextRef.current = "";
              setCommittedText(updatedCommitted);
              setInterimText("");
              setTranscript(updatedCommitted);
            } else {
              interimTextRef.current = incomingText;
              setInterimText(incomingText);
              const combined = committedTextRef.current
                ? `${committedTextRef.current} ${incomingText}`
                : incomingText;
              setTranscript(combined);
            }

            optionsRef.current?.onTranscriptUpdate?.({
              text: incomingText,
              isFinal,
              sequence: seq,
            });
          } else if (data.type === "error") {
            console.error("Voice server error:", data.code, data.message);
            setErrorMessage(data.message || "Speech recognition error");
            optionsRef.current?.onError?.(data.message || "Speech recognition error");
            if (data.code === "BUFFER_OVERFLOW" || data.code === "UPSTREAM_ERROR") {
              stopRecording();
            }
          }
        } catch (err) {
          console.error("Voice websocket message parse error:", err);
        }
      };

      ws.onerror = (event) => {
        console.error("Voice websocket transport error:", event);
        stopRecording();
      };

      ws.onclose = (event) => {
        cleanupAudioTracks();
        setIsRecording(false);
        optionsRef.current?.onRecordingStateChange?.(false);
        if (event.code === 1008) {
          const reason = event.reason || "Authentication or policy violation";
          setErrorMessage(reason);
          optionsRef.current?.onError?.(reason);
        }
      };
    } catch (error: any) {
      console.error("Voice recording initialization error:", error);
      cleanupAudioTracks();
      setIsRecording(false);
      const errStr = error?.message || "Failed to access microphone";
      setErrorMessage(errStr);
      optionsRef.current?.onError?.(errStr);
    }
  }, [cleanupAudioTracks, stopRecording]);

  const resetTranscript = useCallback(() => {
    committedTextRef.current = "";
    interimTextRef.current = "";
    lastSequenceRef.current = 0;
    setCommittedText("");
    setInterimText("");
    setTranscript("");
  }, []);

  useEffect(() => {
    return () => {
      cleanupAudioTracks();
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        try {
          mediaRecorderRef.current.stop();
        } catch {}
      }
      if (websocketRef.current) {
        try {
          websocketRef.current.close();
        } catch {}
      }
    };
  }, [cleanupAudioTracks]);

  return {
    isRecording,
    transcript,
    committedText,
    interimText,
    errorMessage,
    startRecording,
    stopRecording,
    resetTranscript,
  };
}