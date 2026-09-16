"use client";

import {
  useRef,
  useState,
  useEffect,
} from "react";

import {
  Upload,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import {
  uploadDocument,
  getJobStatus,
} from "../services/document-service";

type IngestionState = "idle" | "uploading" | "processing" | "completed" | "failed";

export function UploadButton() {
  const inputRef = useRef<HTMLInputElement>(null);
  const pollTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [loading, setLoading] = useState(false);
  const [ingestionState, setIngestionState] = useState<IngestionState>("idle");
  const [uploadedFile, setUploadedFile] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    return () => {
      if (pollTimerRef.current) {
        clearInterval(pollTimerRef.current);
      }
    };
  }, []);

  async function pollStatus(jobId: number, filename: string) {
    let attempts = 0;
    const maxAttempts = 30; // Max 60 seconds (2s interval)

    pollTimerRef.current = setInterval(async () => {
      attempts++;
      try {
        const job = await getJobStatus(jobId);
        if (job.status === "completed") {
          if (pollTimerRef.current) clearInterval(pollTimerRef.current);
          setIngestionState("completed");
          setStatusMessage(`Ready: ${filename} (${job.chunks_stored || 1} chunks indexed)`);
        } else if (job.status === "failed") {
          if (pollTimerRef.current) clearInterval(pollTimerRef.current);
          setIngestionState("failed");
          setStatusMessage(`Ingestion failed: ${job.error_message || "Processing error"}`);
        } else {
          setIngestionState("processing");
          setStatusMessage(`Processing ${filename}...`);
        }
      } catch (err) {
        console.warn("Error polling job status:", err);
      }

      if (attempts >= maxAttempts) {
        if (pollTimerRef.current) clearInterval(pollTimerRef.current);
        if (ingestionState === "processing") {
          setStatusMessage(`Processing in background: ${filename}`);
        }
      }
    }, 2000);
  }

  async function handleUpload(file: File) {
    const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB limit

    if (file.size > MAX_FILE_SIZE) {
      alert("File size exceeds 20MB limit. Please select a smaller file.");
      return;
    }

    if (pollTimerRef.current) {
      clearInterval(pollTimerRef.current);
      pollTimerRef.current = null;
    }

    try {
      setLoading(true);
      setIngestionState("uploading");
      setStatusMessage(`Uploading ${file.name}...`);
      setUploadedFile(file.name);

      const response = await uploadDocument(file);

      setIngestionState("processing");
      setStatusMessage(`Uploaded: ${response.filename}. Ingesting document...`);

      if (response.job_id) {
        pollStatus(response.job_id, response.filename);
      } else {
        setIngestionState("completed");
        setStatusMessage(`Uploaded: ${response.filename}`);
      }
    } catch (error) {
      console.error("Document upload failed", error);
      setIngestionState("failed");
      setStatusMessage("Upload failed. Please try again.");
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* BUTTON */}
      <button
        onClick={() => inputRef.current?.click()}
        disabled={loading}
        className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-zinc-900 px-5 py-4 text-white transition-all hover:bg-zinc-800 disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            <span>Uploading...</span>
          </>
        ) : (
          <>
            <Upload size={18} />
            <span>Upload Document</span>
          </>
        )}
      </button>

      {/* FILE INPUT */}
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx,.txt,.csv,.xlsx,.pptx,.png,.jpg,.jpeg"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            handleUpload(file);
          }
          // Reset value so selecting the same file again triggers onChange reliably
          e.target.value = "";
        }}
      />

      {/* INGESTION STATUS CARD */}
      {ingestionState !== "idle" && statusMessage && (
        <div
          className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm transition-all ${
            ingestionState === "completed"
              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
              : ingestionState === "failed"
              ? "border-rose-500/20 bg-rose-500/10 text-rose-400"
              : "border-blue-500/20 bg-blue-500/10 text-blue-400"
          }`}
        >
          {ingestionState === "processing" || ingestionState === "uploading" ? (
            <Loader2 size={16} className="animate-spin shrink-0" />
          ) : ingestionState === "completed" ? (
            <CheckCircle2 size={16} className="shrink-0" />
          ) : (
            <AlertCircle size={16} className="shrink-0" />
          )}
          <span>{statusMessage}</span>
        </div>
      )}
    </div>
  );
}