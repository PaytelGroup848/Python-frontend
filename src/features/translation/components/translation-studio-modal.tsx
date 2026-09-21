"use client";

import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { X, Languages, ArrowRight, Sparkles, AlertCircle } from "lucide-react";
import { SupportedLanguage, DocumentJobStatus } from "../types/translation";
import {
  fetchSupportedLanguages,
  uploadDocumentForTranslation,
  fetchTranslationJobStatus,
} from "../services/translation-service";
import { LanguageSelector } from "./language-selector";
import { TranslationUpload } from "./translation-upload";
import { TranslationProgress } from "./translation-progress";
import { TranslationPreview } from "./translation-preview";
import { TranslationToolbar } from "./translation-toolbar";

interface TranslationStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TranslationStudioModal({
  isOpen,
  onClose,
}: TranslationStudioModalProps) {
  const [languages, setLanguages] = useState<SupportedLanguage[]>([]);
  const [sourceLang, setSourceLang] = useState<string>("auto");
  const [targetLang, setTargetLang] = useState<string>("hi");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentJob, setCurrentJob] = useState<DocumentJobStatus | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const pollTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen && languages.length === 0) {
      fetchSupportedLanguages()
        .then((langs) => setLanguages(langs))
        .catch((err) => console.error("Failed to load languages:", err));
    }
  }, [isOpen, languages.length]);

  useEffect(() => {
    return () => {
      if (pollTimerRef.current) {
        clearInterval(pollTimerRef.current);
      }
    };
  }, []);

  function startPolling(jobId: string) {
    if (pollTimerRef.current) clearInterval(pollTimerRef.current);

    pollTimerRef.current = setInterval(async () => {
      try {
        const job = await fetchTranslationJobStatus(jobId);
        setCurrentJob(job);

        if (job.status === "completed" || job.status === "failed") {
          if (pollTimerRef.current) clearInterval(pollTimerRef.current);
          setIsSubmitting(false);
        }
      } catch (err: any) {
        console.warn("Polling error:", err);
      }
    }, 1500);
  }

  async function handleStartTranslation() {
    if (!selectedFile) return;

    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      setCurrentJob({
        job_id: "",
        filename: selectedFile.name,
        status: "queued",
        progress_percent: 5,
        source_language: sourceLang,
        target_language: targetLang,
        blocks_total: 0,
        blocks_completed: 0,
        prompt_tokens_used: 0,
        completion_tokens_used: 0,
        total_tokens_used: 0,
        available_downloads: [],
      });

      const jobCreated = await uploadDocumentForTranslation(
        selectedFile,
        targetLang,
        sourceLang
      );

      startPolling(jobCreated.job_id);
    } catch (err: any) {
      setIsSubmitting(false);
      const detail = err?.response?.data?.detail || "Failed to start document translation. Please try again.";
      setErrorMessage(detail);
      setCurrentJob(null);
    }
  }

  function handleReset() {
    if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    setSelectedFile(null);
    setCurrentJob(null);
    setIsSubmitting(false);
    setErrorMessage(null);
  }

  if (!isOpen || !mounted) return null;

  const isProcessing = Boolean(isSubmitting || (currentJob && !["completed", "failed"].includes(currentJob.status)));
  const isFinished = Boolean(currentJob && currentJob.status === "completed");

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in-50">
      <div className="relative w-full max-w-4xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
              <Languages size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Document Translation Studio
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 rounded-full">
                  AI Fidelity Engine
                </span>
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Translate PDF, Word, & Text with table, list & layout preservation
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-5">
          
          {/* Language Selection Row */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <LanguageSelector
              label="Source Language"
              languages={languages}
              selectedCode={sourceLang}
              onSelect={setSourceLang}
              allowAutoDetect={true}
            />

            <div className="hidden sm:flex items-center justify-center pt-5 text-slate-400">
              <ArrowRight size={18} />
            </div>

            <LanguageSelector
              label="Target Language"
              languages={languages}
              selectedCode={targetLang}
              onSelect={setTargetLang}
              allowAutoDetect={false}
            />
          </div>

          {/* Upload Dropzone (hidden when completed or reviewing preview) */}
          {!isFinished && (
            <TranslationUpload
              selectedFile={selectedFile}
              onFileSelect={setSelectedFile}
              disabled={isProcessing}
            />
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-2xl text-xs text-red-700 dark:text-red-400 font-medium">
              <AlertCircle size={15} className="shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Action Trigger Button */}
          {!currentJob && selectedFile && (
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleStartTranslation}
                disabled={isProcessing}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-2xl shadow-md shadow-emerald-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <Sparkles size={16} />
                <span>Translate Document</span>
              </button>
            </div>
          )}

          {/* Progress Indicator */}
          {currentJob && (
            <TranslationProgress status={currentJob} />
          )}

          {/* Side-by-Side Live Preview */}
          {isFinished && currentJob && (
            <TranslationPreview
              originalBlocks={currentJob.original_blocks}
              translatedBlocks={currentJob.translated_blocks}
              sourceLanguage={currentJob.source_language}
              targetLanguage={currentJob.target_language}
            />
          )}

          {/* Export & Toolbar */}
          {currentJob && (
            <TranslationToolbar job={currentJob} onReset={handleReset} />
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
