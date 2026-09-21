"use client";

import { Loader2, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import { DocumentJobStatus } from "../types/translation";

interface TranslationProgressProps {
  status: DocumentJobStatus;
}

export function TranslationProgress({ status }: TranslationProgressProps) {
  function getStageDescription() {
    switch (status.status) {
      case "queued":
        return "Queued for processing...";
      case "parsing":
        return "Analyzing document layout & extracting tables...";
      case "translating":
        if (status.blocks_total > 0) {
          return `Translating blocks (${status.blocks_completed} of ${status.blocks_total})...`;
        }
        return "Translating structured content...";
      case "exporting":
        return "Rebuilding translated PDF & Word documents...";
      case "completed":
        return "Translation ready for preview & download!";
      case "failed":
        return status.error_message || "Translation processing failed.";
      default:
        return "Processing...";
    }
  }

  const isFailed = status.status === "failed";
  const isCompleted = status.status === "completed";

  return (
    <div className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2.5">
          {isCompleted ? (
            <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 size={16} />
            </div>
          ) : isFailed ? (
            <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
              <AlertCircle size={16} />
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <Loader2 size={15} className="animate-spin text-emerald-600" />
            </div>
          )}
          <span className="text-xs font-semibold text-slate-800 truncate">
            {getStageDescription()}
          </span>
        </div>

        <span className="text-xs font-bold text-slate-700 shrink-0">
          {status.progress_percent}%
        </span>
      </div>

      {/* Progress Track */}
      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-500 rounded-full ${
            isFailed
              ? "bg-red-500"
              : isCompleted
              ? "bg-emerald-500"
              : "bg-gradient-to-r from-emerald-500 to-teal-500"
          }`}
          style={{ width: `${Math.max(status.progress_percent, 5)}%` }}
        />
      </div>

      {/* Metered token usage if available */}
      {status.total_tokens_used > 0 && (
        <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <Sparkles size={11} className="text-emerald-600" />
            <span>AI Token Metering: {status.total_tokens_used.toLocaleString()} tokens</span>
          </span>
          {status.blocks_total > 0 && (
            <span className="font-medium text-slate-600">{status.blocks_completed}/{status.blocks_total} blocks</span>
          )}
        </div>
      )}
    </div>
  );
}

