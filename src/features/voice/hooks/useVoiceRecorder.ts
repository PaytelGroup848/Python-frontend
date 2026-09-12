"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

export function useVoiceRecorder() {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const websocketRef = useRef<WebSocket | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");

  function cleanupAudioTracks() {
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
  }

  function stopRecording() {
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
          websocketRef.current.close();
        }
      } catch (err) {
        console.warn("Error closing voice websocket:", err);
      }
      websocketRef.current = null;
    }

    setIsRecording(false);
  }

  async function startRecording() {
    try {
      // If a previous recording session is running, clean it up first
      stopRecording();

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      streamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "";

      const mediaRecorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;

      const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000"}/ws/voice`;
      const ws = new WebSocket(wsUrl);
      websocketRef.current = ws;

      ws.onopen = () => {
        console.log("Voice websocket connected, starting media recorder");
        try {
          mediaRecorder.start(100);
          setIsRecording(true);
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
            console.warn("Error sending audio chunk:", e);
          }
        }
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "transcript" && data.text) {
            setTranscript(data.text);
          }
        } catch (error) {
          console.error("Message parse error", error);
        }
      };

      ws.onerror = (error) => {
        console.error("Voice websocket error", error);
        stopRecording();
      };

      ws.onclose = () => {
        console.log("Voice websocket closed");
        cleanupAudioTracks();
        setIsRecording(false);
      };
    } catch (error) {
      console.error("Voice recording error", error);
      cleanupAudioTracks();
      setIsRecording(false);
    }
  }

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
  }, []);

  return {
    isRecording,
    transcript,
    startRecording,
    stopRecording,
  };
}