"use client";

import { useRef, useState, DragEvent, ChangeEvent } from "react";
import { Upload, FileText, X, AlertCircle } from "lucide-react";

interface TranslationUploadProps {
  selectedFile: File | null;
  onFileSelect: (file: File | null) => void;
  disabled?: boolean;
}

const MAX_SIZE_MB = 25;
const MAX_BYTES = MAX_SIZE_MB * 1024 * 1024;
const ALLOWED_EXTS = [".pdf", ".docx", ".doc", ".txt"];

export function TranslationUpload({
  selectedFile,
  onFileSelect,
  disabled = false,
}: TranslationUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function validateAndSelect(file: File) {
    setErrorMessage(null);

    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    if (!ALLOWED_EXTS.includes(ext)) {
      setErrorMessage(`Invalid file format. Allowed: ${ALLOWED_EXTS.join(", ")}`);
      return;
    }

    if (file.size > MAX_BYTES) {
      setErrorMessage(`File is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Maximum allowed is ${MAX_SIZE_MB}MB.`);
      return;
    }

    onFileSelect(file);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSelect(e.dataTransfer.files[0]);
    }
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      validateAndSelect(e.target.files[0]);
    }
  }

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,.doc,.txt"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />

      {!selectedFile ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => !disabled && fileInputRef.current?.click()}
          className={`
            border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer select-none
            ${isDragging
              ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 scale-[0.99]"
              : "border-slate-200 dark:border-zinc-700 bg-slate-50/60 dark:bg-zinc-800/40 hover:border-slate-300 dark:hover:border-zinc-600 hover:bg-slate-100/50"}
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          `}
        >
          <div className="mx-auto w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-3">
            <Upload size={22} />
          </div>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            Click to upload or drag & drop document
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            PDF, Word (.docx), or Text files (up to 25MB)
          </p>
        </div>
      ) : (
        <div className="flex items-center justify-between p-3.5 bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <FileText size={20} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                {selectedFile.name}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
          {!disabled && (
            <button
              type="button"
              onClick={() => onFileSelect(null)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
              title="Remove file"
            >
              <X size={16} />
            </button>
          )}
        </div>
      )}

      {errorMessage && (
        <div className="mt-2 flex items-center gap-2 text-xs text-red-600 dark:text-red-400 font-medium">
          <AlertCircle size={14} className="shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
