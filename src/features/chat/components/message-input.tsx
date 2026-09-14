"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ArrowUp,
  AudioLines,
  Brain,
  Check,
  FileText,
  Globe,
  Image as ImageIcon,
  Mic,
  Plus,
  RectangleHorizontal,
  RectangleVertical,
  Square,
  X,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

import {
  uploadDocument,
} from "@/features/documents/services/document-service";

import {
  useDocumentStore,
  UploadedDocument,
} from "@/features/documents/stores/document-store";

import {
  useVoiceRecorder,
} from "@/features/voice/hooks/useVoiceRecorder";

interface MessageInputProps {
  onSend: (
    message: string,
    documents?: UploadedDocument[],
    aspectRatio?: string,
    webSearch?: boolean,
    think?: boolean
  ) => void;
  onStop?: () => void;
  isStreaming?: boolean;
  disabled?: boolean;
}

export function MessageInput({
  onSend,
  onStop,
  isStreaming = false,
  disabled = false,
}: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [aspectRatio, setAspectRatio] = useState<"1:1" | "16:9" | "9:16">("1:1");
  const [webSearch, setWebSearch] = useState(false);
  const [think, setThink] = useState(false);

  const documentInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [uploading, setUploading] = useState(false);

  const {
    isRecording,
    transcript,
    startRecording,
    stopRecording,
  } = useVoiceRecorder();

  // Append voice transcript smoothly
  useEffect(() => {
    if (!transcript) return;

    const timeout = setTimeout(() => {
      setMessage((prev) => {
        if (!prev) return transcript;
        if (prev.includes(transcript)) return prev;
        return `${prev} ${transcript}`;
      });
    }, 0);

    return () => clearTimeout(timeout);
  }, [transcript]);

  // Auto-resize textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [message]);

  const addDocument = useDocumentStore((state) => state.addDocument);
  const documents = useDocumentStore((state) => state.documents);
  const removeDocument = useDocumentStore((state) => state.removeDocument);
  const clearDocuments = useDocumentStore((state) => state.clearDocuments);

  async function handleUpload(file: File) {
    try {
      setUploading(true);
      const response = await uploadDocument(file);
      addDocument({
        filename: response.filename,
        status: "uploaded",
      });
    } catch (error) {
      console.error(error);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  function handleSend() {
    if (disabled || (!message.trim() && documents.length === 0)) {
      return;
    }

    const textToSend = message.trim();
    const docsToSend = [...documents];

    onSend(textToSend, docsToSend, aspectRatio, webSearch, think);

    setMessage("");
    clearDocuments();
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  }

  const handleMicToggle = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleAudioWaveformClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const hasInput = message.trim().length > 0 || documents.length > 0;
  const isMultiline = message.includes("\n") || message.length > 90;

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col">
      {/* TOP CENTERED DISCLAIMER: Patwatoli AI */}
      <p className="text-center text-xs text-zinc-400 font-normal select-none mb-2.5 tracking-tight">
        Patwatoli AI can make mistakes. Check important info.
      </p>

      {/* ATTACHED DOCUMENTS & ACTIVE FEATURE BADGES */}
      {(documents.length > 0 || webSearch || aspectRatio !== "1:1" || think) && (
        <div className="flex flex-wrap items-center gap-2 mb-2 px-1">
          {documents.map((doc) => (
            <div
              key={doc.filename}
              className="flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-700 bg-white/95 dark:bg-zinc-800 px-3 py-1 text-xs text-zinc-700 dark:text-zinc-200 shadow-2xs"
            >
              <span>
                {doc.filename.match(/\.(png|jpe?g|webp|gif|bmp)$/i) ? "🖼️ " : "📄 "}
                {doc.filename}
              </span>
              <button
                type="button"
                onClick={() => removeDocument(doc.filename)}
                className="text-zinc-400 hover:text-red-500 transition-colors cursor-pointer"
                title="Remove attachment"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}

          {webSearch && (
            <div className="flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50/90 px-3 py-1 text-xs text-blue-700 font-medium shadow-2xs">
              <Globe className="h-3.5 w-3.5" />
              <span>Web Search</span>
              <button
                type="button"
                onClick={() => setWebSearch(false)}
                className="hover:text-blue-900 cursor-pointer ml-0.5"
                title="Turn off Web Search"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}

          {aspectRatio !== "1:1" && (
            <div className="flex items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-100/90 px-3 py-1 text-xs text-zinc-700 font-medium shadow-2xs">
              <RectangleHorizontal className="h-3.5 w-3.5" />
              <span>{aspectRatio}</span>
              <button
                type="button"
                onClick={() => setAspectRatio("1:1")}
                className="hover:text-zinc-900 cursor-pointer ml-0.5"
                title="Reset to 1:1"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}

          {think && (
            <div className="flex items-center gap-1.5 rounded-full border border-purple-200 bg-purple-50/90 px-3 py-1 text-xs text-purple-700 font-medium shadow-2xs">
              <Brain className="h-3.5 w-3.5" />
              <span>Think</span>
              <button
                type="button"
                onClick={() => setThink(false)}
                className="hover:text-purple-900 cursor-pointer ml-0.5"
                title="Disable Reasoning"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* HIDDEN FILE INPUTS */}
      <input
        ref={documentInputRef}
        type="file"
        accept=".pdf,.docx,.txt,.csv,.xlsx,.pptx"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
          e.target.value = "";
        }}
      />
      <input
        ref={photoInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif,image/bmp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
          e.target.value = "";
        }}
      />

      {/* MAIN CAPSULE CONTAINER */}
      {!isMultiline ? (
        // ---------- SINGLE LINE CAPSULE (EXACT MATCH TO SCREENSHOT) ----------
        <div
          className="
            relative flex items-center w-full rounded-2xl sm:rounded-full
            border border-zinc-200/90
            bg-white px-2.5 sm:px-3 py-1.5 sm:py-2 gap-1.5 sm:gap-2
            shadow-[0_2px_10px_rgba(0,0,0,0.04)]
            hover:border-zinc-300
            focus-within:border-zinc-400
            focus-within:shadow-[0_4px_16px_rgba(0,0,0,0.08)]
            transition-all duration-150 min-h-12 sm:min-h-13
          "
        >
          {/* LEFT: PLUS (+) BUTTON WITH DROPDOWN */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                disabled={uploading || disabled}
                aria-label="Add attachments or features"
                className="
                  flex h-8 w-8 items-center justify-center rounded-full
                  text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100
                  hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors
                  cursor-pointer shrink-0 disabled:opacity-50
                "
              >
                <Plus className="h-5 w-5 stroke-[1.8]" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              side="top"
              sideOffset={12}
              className="w-56 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md shadow-xl border border-zinc-200/80 dark:border-zinc-800 rounded-2xl p-1.5 z-50 animate-in fade-in-50 zoom-in-95"
            >
              <DropdownMenuItem
                onClick={() => documentInputRef.current?.click()}
                className="flex items-center gap-2.5 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl cursor-pointer"
              >
                <FileText className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                <span>Upload document</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => photoInputRef.current?.click()}
                className="flex items-center gap-2.5 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl cursor-pointer"
              >
                <ImageIcon className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                <span>Add photos & vision</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="my-1 bg-zinc-100 dark:bg-zinc-800" />

              <DropdownMenuItem
                onClick={() => setWebSearch((prev) => !prev)}
                className="flex items-center justify-between px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Globe className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                  <span>Deep Web Search</span>
                </div>
                {webSearch && <Check className="h-4 w-4 text-blue-600 font-bold" />}
              </DropdownMenuItem>

              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="flex items-center gap-2.5 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl cursor-pointer">
                  <RectangleHorizontal className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                  <span>Aspect ratio ({aspectRatio})</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="w-40 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md shadow-xl border border-zinc-200/80 dark:border-zinc-800 rounded-xl p-1 z-50">
                  <DropdownMenuItem
                    onClick={() => setAspectRatio("1:1")}
                    className={cn(
                      "flex items-center justify-between text-xs px-2.5 py-1.5 rounded-lg cursor-pointer",
                      aspectRatio === "1:1" ? "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 font-semibold" : "hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <Square className="h-3.5 w-3.5" />
                      1:1 Square
                    </span>
                    {aspectRatio === "1:1" && <Check className="h-3.5 w-3.5 text-blue-600" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setAspectRatio("16:9")}
                    className={cn(
                      "flex items-center justify-between text-xs px-2.5 py-1.5 rounded-lg cursor-pointer",
                      aspectRatio === "16:9" ? "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 font-semibold" : "hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <RectangleHorizontal className="h-3.5 w-3.5" />
                      16:9 Wide
                    </span>
                    {aspectRatio === "16:9" && <Check className="h-3.5 w-3.5 text-blue-600" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setAspectRatio("9:16")}
                    className={cn(
                      "flex items-center justify-between text-xs px-2.5 py-1.5 rounded-lg cursor-pointer",
                      aspectRatio === "9:16" ? "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 font-semibold" : "hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <RectangleVertical className="h-3.5 w-3.5" />
                      9:16 Story
                    </span>
                    {aspectRatio === "9:16" && <Check className="h-3.5 w-3.5 text-blue-600" />}
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* CENTER: TEXTAREA WITH "Ask anything" PLACEHOLDER */}
          <textarea
            ref={textareaRef}
            rows={1}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything"
            className="
              min-w-0 flex-1 bg-transparent border-none outline-none focus:outline-none focus:ring-0
              text-[14px] sm:text-[15px] text-zinc-800 placeholder:text-zinc-400
              resize-none overflow-hidden py-1 sm:py-1.5 px-1.5 sm:px-2 leading-relaxed max-h-40
            "
          />

          {/* RIGHT CONTROLS: Think, Mic, and Blue Waveform / Send Button */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {/* THINK BUTTON */}
            <button
              type="button"
              onClick={() => setThink((prev) => !prev)}
              aria-label="Toggle Reasoning"
              className={cn(
                "flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded-full text-xs sm:text-[13px] transition-colors cursor-pointer select-none shrink-0",
                think
                  ? "bg-zinc-100 text-zinc-900 font-medium"
                  : "text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100/60 font-normal"
              )}
            >
              <Brain className="h-4 w-4 stroke-[1.8]" />
              <span className="hidden sm:inline">Think</span>
            </button>

            {/* MIC BUTTON */}
            <button
              type="button"
              onClick={handleMicToggle}
              aria-label="Voice dictation"
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer",
                isRecording && "text-red-600 bg-red-50 animate-pulse"
              )}
            >
              <Mic className="h-4.5 w-4.5 stroke-[1.8]" />
            </button>

            {/* VIBRANT BLUE WAVEFORM OR SEND / STOP BUTTON */}
            {isStreaming ? (
              <button
                type="button"
                onClick={onStop}
                aria-label="Stop generating"
                className="
                  flex h-9 w-9 items-center justify-center rounded-full
                  bg-zinc-900 hover:bg-zinc-800 text-white
                  shadow-xs transition-transform active:scale-95 cursor-pointer
                "
              >
                <Square className="h-3.5 w-3.5 fill-current" />
              </button>
            ) : hasInput ? (
              <button
                type="button"
                onClick={handleSend}
                disabled={disabled}
                aria-label="Send message"
                className="
                  flex h-9 w-9 items-center justify-center rounded-full
                  bg-zinc-900 hover:bg-zinc-800 text-white
                  shadow-xs transition-all hover:scale-105 active:scale-95
                  disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer
                "
              >
                <ArrowUp className="h-4.5 w-4.5 stroke-[2.2]" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleAudioWaveformClick}
                aria-label="Voice conversation"
                title="Start voice mode"
                className="
                  flex h-9 w-9 items-center justify-center rounded-full
                  bg-[#1d64ec] hover:bg-[#1554cb] text-white
                  shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer
                "
              >
                <AudioLines className="h-4.5 w-4.5 stroke-2" />
              </button>
            )}
          </div>
        </div>
      ) : (
        // ---------- MULTILINE ADAPTIVE CAPSULE (EXPANDED) ----------
        <div
          className="
            relative flex flex-col w-full rounded-[26px]
            border border-zinc-200/90
            bg-white p-3 gap-2
            shadow-[0_2px_10px_rgba(0,0,0,0.04)]
            hover:border-zinc-300
            focus-within:border-zinc-400
            focus-within:shadow-[0_4px_16px_rgba(0,0,0,0.08)]
            transition-all duration-150
          "
        >
          {/* TOP: EXPANDING TEXTAREA */}
          <textarea
            ref={textareaRef}
            rows={2}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything"
            className="
              w-full bg-transparent border-none outline-none focus:outline-none focus:ring-0
              text-[15px] text-zinc-800 placeholder:text-zinc-400
              resize-none overflow-hidden px-2 leading-relaxed max-h-48
            "
          />

          {/* BOTTOM CONTROLS ROW */}
          <div className="flex items-center justify-between pt-1">
            {/* BOTTOM-LEFT: PLUS (+) BUTTON */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  disabled={uploading || disabled}
                  aria-label="Add attachments or features"
                  className="
                    flex h-8 w-8 items-center justify-center rounded-full
                    text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100
                    hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors
                    cursor-pointer shrink-0 disabled:opacity-50
                  "
                >
                  <Plus className="h-5 w-5 stroke-[1.8]" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                side="top"
                sideOffset={12}
                className="w-56 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md shadow-xl border border-zinc-200/80 dark:border-zinc-800 rounded-2xl p-1.5 z-50 animate-in fade-in-50 zoom-in-95"
              >
                <DropdownMenuItem
                  onClick={() => documentInputRef.current?.click()}
                  className="flex items-center gap-2.5 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl cursor-pointer"
                >
                  <FileText className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                  <span>Upload document</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => photoInputRef.current?.click()}
                  className="flex items-center gap-2.5 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl cursor-pointer"
                >
                  <ImageIcon className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                  <span>Add photos & vision</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="my-1 bg-zinc-100 dark:bg-zinc-800" />

                <DropdownMenuItem
                  onClick={() => setWebSearch((prev) => !prev)}
                  className="flex items-center justify-between px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Globe className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                    <span>Deep Web Search</span>
                  </div>
                  {webSearch && <Check className="h-4 w-4 text-blue-600 font-bold" />}
                </DropdownMenuItem>

                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="flex items-center gap-2.5 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl cursor-pointer">
                    <RectangleHorizontal className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                    <span>Aspect ratio ({aspectRatio})</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="w-40 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md shadow-xl border border-zinc-200/80 dark:border-zinc-800 rounded-xl p-1 z-50">
                    <DropdownMenuItem
                      onClick={() => setAspectRatio("1:1")}
                      className={cn(
                        "flex items-center justify-between text-xs px-2.5 py-1.5 rounded-lg cursor-pointer",
                        aspectRatio === "1:1" ? "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 font-semibold" : "hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                      )}
                    >
                      <span className="flex items-center gap-2">
                        <Square className="h-3.5 w-3.5" />
                        1:1 Square
                      </span>
                      {aspectRatio === "1:1" && <Check className="h-3.5 w-3.5 text-blue-600" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setAspectRatio("16:9")}
                      className={cn(
                        "flex items-center justify-between text-xs px-2.5 py-1.5 rounded-lg cursor-pointer",
                        aspectRatio === "16:9" ? "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 font-semibold" : "hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                      )}
                    >
                      <span className="flex items-center gap-2">
                        <RectangleHorizontal className="h-3.5 w-3.5" />
                        16:9 Wide
                      </span>
                      {aspectRatio === "16:9" && <Check className="h-3.5 w-3.5 text-blue-600" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setAspectRatio("9:16")}
                      className={cn(
                        "flex items-center justify-between text-xs px-2.5 py-1.5 rounded-lg cursor-pointer",
                        aspectRatio === "9:16" ? "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 font-semibold" : "hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                      )}
                    >
                      <span className="flex items-center gap-2">
                        <RectangleVertical className="h-3.5 w-3.5" />
                        9:16 Story
                      </span>
                      {aspectRatio === "9:16" && <Check className="h-3.5 w-3.5 text-blue-600" />}
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* BOTTOM-RIGHT: CONTROLS */}
            <div className="flex items-center gap-1.5">
              {/* THINK BUTTON */}
              <button
                type="button"
                onClick={() => setThink((prev) => !prev)}
                aria-label="Toggle Reasoning"
                className={cn(
                  "flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded-full text-xs sm:text-[13px] transition-colors cursor-pointer select-none",
                  think
                    ? "bg-zinc-100 text-zinc-900 font-medium"
                    : "text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100/60 font-normal"
                )}
              >
                <Brain className="h-4 w-4 stroke-[1.8]" />
                <span className="hidden sm:inline">Think</span>
              </button>

              {/* MIC BUTTON */}
              <button
                type="button"
                onClick={handleMicToggle}
                aria-label="Voice dictation"
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer",
                  isRecording && "text-red-600 bg-red-50 animate-pulse"
                )}
              >
                <Mic className="h-4.5 w-4.5 stroke-[1.8]" />
              </button>

              {/* VIBRANT BLUE WAVEFORM OR SEND / STOP BUTTON */}
              {isStreaming ? (
                <button
                  type="button"
                  onClick={onStop}
                  aria-label="Stop generating"
                  className="
                    flex h-9 w-9 items-center justify-center rounded-full
                    bg-zinc-900 hover:bg-zinc-800 text-white
                    shadow-xs transition-transform active:scale-95 cursor-pointer
                  "
                >
                  <Square className="h-3.5 w-3.5 fill-current" />
                </button>
              ) : isRecording ? (
                <button
                  type="button"
                  onClick={handleAudioWaveformClick}
                  aria-label="Stop recording"
                  title="Stop recording"
                  className="
                    flex h-9 w-9 items-center justify-center rounded-full
                    bg-red-600 hover:bg-red-700 text-white
                    shadow-xs transition-all animate-pulse hover:scale-105 active:scale-95 cursor-pointer
                  "
                >
                  <Square className="h-3.5 w-3.5 fill-current" />
                </button>
              ) : hasInput ? (
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={disabled}
                  aria-label="Send message"
                  className="
                    flex h-9 w-9 items-center justify-center rounded-full
                    bg-zinc-900 hover:bg-zinc-800 text-white
                    shadow-xs transition-all hover:scale-105 active:scale-95
                    disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer
                  "
                >
                  <ArrowUp className="h-4.5 w-4.5 stroke-[2.2]" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleAudioWaveformClick}
                  aria-label="Voice conversation"
                  title="Start voice mode"
                  className="
                    flex h-9 w-9 items-center justify-center rounded-full
                    bg-[#1d64ec] hover:bg-[#1554cb] text-white
                    shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer
                  "
                >
                  <AudioLines className="h-4.5 w-4.5 stroke-2" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}