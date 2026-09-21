"use client";

import { useState } from "react";
import { Download, FileText, Copy, Check, RotateCcw } from "lucide-react";
import { downloadTranslatedFile } from "../services/translation-service";
import { DocumentJobStatus } from "../types/translation";

interface TranslationToolbarProps {
  job: DocumentJobStatus;
  onReset: () => void;
}

export function TranslationToolbar({ job, onReset }: TranslationToolbarProps) {
  const [downloadingType, setDownloadingType] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleDownload(fileType: "pdf" | "docx") {
    try {
      setDownloadingType(fileType);
      const origBase = job.filename.replace(/\.[^/.]+$/, "");
      const ext = fileType;
      const downloadName = `${origBase}_${job.target_language}.${ext}`;
      await downloadTranslatedFile(fileType, job.job_id, downloadName);
    } catch (err) {
      console.error("Download failed:", err);
      alert("Failed to download translated document. Please try again.");
    } finally {
      setDownloadingType(null);
    }
  }

  function handleCopyAllText() {
    if (!job.translated_blocks) return;

    const fullText = job.translated_blocks
      .map((b) => {
        if (b.type === "table" && b.rows) {
          return b.rows.map((r) => r.join("\t")).join("\n");
        }
        return b.text || "";
      })
      .filter(Boolean)
      .join("\n\n");

    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const isCompleted = job.status === "completed";

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
      <button
        type="button"
        onClick={onReset}
        className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
      >
        <RotateCcw size={14} />
        <span>Translate Another Document</span>
      </button>

      {isCompleted && (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyAllText}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
            <span>{copied ? "Copied!" : "Copy Text"}</span>
          </button>

          {job.available_downloads.includes("docx") && (
            <button
              type="button"
              disabled={downloadingType !== null}
              onClick={() => handleDownload("docx")}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-colors disabled:opacity-50"
            >
              <FileText size={14} />
              <span>{downloadingType === "docx" ? "Downloading..." : "Download Word (.docx)"}</span>
            </button>
          )}

          {job.available_downloads.includes("pdf") && (
            <button
              type="button"
              disabled={downloadingType !== null}
              onClick={() => handleDownload("pdf")}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors disabled:opacity-50"
            >
              <Download size={14} />
              <span>{downloadingType === "pdf" ? "Downloading..." : "Download PDF"}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
