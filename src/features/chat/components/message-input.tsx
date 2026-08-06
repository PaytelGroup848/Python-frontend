"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ArrowUp,
  Upload,
  X,
} from "lucide-react";

import {
  uploadDocument,
} from "@/features/documents/services/document-service";

import {
  useDocumentStore,
} from "@/features/documents/stores/document-store";
import {
  VoiceButton,
} from "@/features/voice/components/voice-button";

import {
  useVoiceRecorder,
} from "@/features/voice/hooks/useVoiceRecorder";

import {
  useAssistants,
} from "@/features/playground/hooks/use-assistants";

import {
  useConversationStore,
} from "../stores/conversation-store";

interface MessageInputProps {
  onSend:(
    message: string
  ) => void;

  disabled?: boolean;
}

export function MessageInput({
  onSend,
  disabled = false,
}: MessageInputProps) {

  const [message, setMessage] =
    useState("");

  const inputRef =
    useRef<HTMLInputElement>(null);

  const [uploading, setUploading] =
    useState(false);

  const {
    isRecording,
    transcript,
    startRecording,
    stopRecording,
  } = useVoiceRecorder();

  const activeAssistantId =
      useConversationStore(
          state =>
              state.activeAssistantId
      );

  const {
      data: assistants = [],
  } = useAssistants();

  const assistant =
      assistants.find(

          item =>
              item.id ===
              activeAssistantId

      );


  const config =
      assistant?.config;

  const isGeneralAssistant =
    assistant?.code === "general";

  useEffect(() => {

  if (!transcript) {
    return;
  }

  const timeout = setTimeout(() => {

    setMessage((prev) => {

      if (!prev) {
        return transcript;
      }

      if (
        prev.includes(transcript)
      ) {
        return prev;
      }

      return `${prev} ${transcript}`;
    });

  }, 0);

  return () =>
    clearTimeout(timeout);

}, [transcript]);

  const addDocument =
    useDocumentStore(
      (state) =>
        state.addDocument
    );

  const documents =
    useDocumentStore(
      (state) =>
        state.documents
    );

  const removeDocument =
    useDocumentStore(
      (state) =>
        state.removeDocument
    );

  async function handleUpload(
    file: File
  ) {

    try {

      setUploading(true);

      const response =
        await uploadDocument(
          file
        );

      addDocument({
        filename:
          response.filename,
        status:
          "uploaded",
      });

      alert(
        "Document uploaded successfully"
      );

    } catch (error) {

      console.error(error);

      alert(
        "Upload failed"
      );

    } finally {

      setUploading(false);
    }
  }

  function handleSend() {

    if (
      disabled ||
      !message.trim()
    ) {
      return;
    }

    onSend(message);

    setMessage("");
  }

  return (

  <div className="flex flex-col gap-3 w-2xl">

    {/* DOCUMENTS */}

    {documents.length > 0 && (

      <div className="flex flex-wrap gap-2">

        {documents.map((doc) => (

          <div
            key={doc.filename}

            className="
              flex
              items-center
              gap-2
              rounded-full
              border
              border-white/70
              bg-white/90
              px-3
              py-2
              text-sm
              text-zinc-800
              shadow-sm
              backdrop-blur-md
            "
          >
            <span>
             📄 {doc.filename}
            </span>

            <button
              onClick={() =>
                removeDocument(
                  doc.filename
                )
              }

              className="
                text-zinc-400
                transition-colors
                hover:text-red-400
              "
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    )}

    {/* INPUT */}

    <div
      className="
        w-full max-w-2xl rounded-3xl border border-slate-200/90
        bg-white/95 p-3 shadow-[0_15px_45px_-12px_rgba(5,150,105,0.18)]
        backdrop-blur-xl transition hover:border-emerald-300
      "
    >
      <textarea
        value={message}
        onChange={(e) => {

            setMessage(e.target.value);

        }}

        onKeyDown={(event) => {

          if (
            event.key === "Enter" &&
            !event.shiftKey
          ) {

            event.preventDefault();

            handleSend();
          }

        }}


        onInput={(e) => {

          e.currentTarget.style.height = "auto";

          e.currentTarget.style.height =
            `${e.currentTarget.scrollHeight}px`;
        }}
        placeholder="Ask your AI assistant…"
        rows={1}
        className="
          w-full resize-none border-none bg-transparent px-3 py-2
          text-[15px] text-slate-800 placeholder:text-slate-400
          focus:outline-none
        "
      />

      <div
        className="flex items-center justify-between px-2 pt-1"
      >

        {(isGeneralAssistant || config?.document_chat_enabled) && (

        <button
          type="button"

          onClick={() =>
            inputRef.current?.click()
          }

          disabled={
            uploading ||
            disabled
          }

          aria-label="Upload document"

          className="
            flex h-8 w-8 items-center justify-center rounded-full
            text-slate-500 transition hover:bg-emerald-50 hover:text-emerald-700
            disabled:opacity-50
          "
        >

          <Upload className="h-4.5 w-4.5" />

        </button>

      )}

        {(isGeneralAssistant || config?.document_chat_enabled) && (

        <input
          ref={inputRef}

          type="file"

          accept="
            .pdf,
            .docx,
            .txt,
            .csv,
            .xlsx,
            .pptx,
            .png,
            .jpg,
            .jpeg
          "

          className="hidden"

          onChange={(e) => {

            const file =
              e.target.files?.[0];

            if (file) {

              handleUpload(file);

            }

          }}

        />

      )}

        <div className="flex items-center gap-1">

          {(isGeneralAssistant || config?.voice_enabled) && (

          <div
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-full
              text-slate-500
              transition
              hover:bg-emerald-50
              hover:text-emerald-700
            "
          >

          <VoiceButton
            isRecording={isRecording}
            startRecording={startRecording}
            stopRecording={stopRecording}
          />

        </div>

      )}

          <button
            onClick={handleSend}
            disabled={
              disabled ||
              !message.trim()
            }
            aria-label="Send message"
            className="
              ml-1 flex h-9 w-9 items-center justify-center rounded-full
              bg-emerald-600 hover:bg-emerald-700 text-white
              shadow-md shadow-emerald-600/30 transition enabled:hover:scale-105
              disabled:cursor-not-allowed disabled:opacity-40
            "
          >
            <ArrowUp className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>
    </div>

  </div>
  );
}