"use client";

import React, { useState } from "react";
import {
  FileText,
  FileSpreadsheet,
  File,
  Download,
  Check,
  Loader2,
} from "lucide-react";
import {
  exportAsPdf,
  exportAsDocx,
  extractDocumentTitle,
  type ExportIntent,
} from "../utils/document-exporter";
import {
  exportTableToExcel,
  exportTableToCsv,
  parseCsvToTableData,
} from "../utils/table-exporter";

interface ChatExportCardProps {
  intent: ExportIntent;
  content: string;
}

export function ChatExportCard({ intent, content }: ChatExportCardProps) {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  if (!intent || !content) return null;

  const docTitle = extractDocumentTitle(content, "Patwatoli_Export");

  const handleDownload = async () => {
    if (downloading) return;
    setDownloading(true);

    try {
      if (intent === "pdf") {
        exportAsPdf(content, docTitle);
      } else if (intent === "docx") {
        await exportAsDocx(content, docTitle);
      } else if (intent === "excel" || intent === "csv") {
        // Extract table data if available in markdown
        const tableData = extractTableDataFromMarkdown(content);
        if (intent === "excel") {
          await exportTableToExcel(tableData.headers, tableData.rows, docTitle);
        } else {
          exportTableToCsv(tableData.headers, tableData.rows, docTitle);
        }
      }

      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 2500);
    } catch (err) {
      console.error("Export download error:", err);
    } finally {
      setDownloading(false);
    }
  };

  const config = getCardConfig(intent, docTitle);

  return (
    <div className="my-3 w-full max-w-xl rounded-xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/90 shadow-xs p-3 transition-all hover:border-slate-300 dark:hover:border-slate-700">
      <div className="flex items-center justify-between gap-3">
        {/* Left: Icon & File Metadata */}
        <div className="flex items-center gap-3 min-w-0">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${config.badgeBg}`}>
            {config.icon}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs sm:text-[13px] font-semibold text-slate-900 dark:text-white truncate">
              {config.filename}
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              {config.subtitle}
            </span>
          </div>
        </div>

        {/* Right: Direct Action Button */}
        <button
          type="button"
          onClick={handleDownload}
          disabled={downloading}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white shadow-2xs transition-all active:scale-95 cursor-pointer shrink-0 disabled:opacity-60 ${config.buttonBg}`}
        >
          {downloading ? (
            <Loader2 size={13} className="animate-spin shrink-0" />
          ) : downloaded ? (
            <Check size={13} className="shrink-0" />
          ) : (
            <Download size={13} className="shrink-0" />
          )}
          <span>{downloaded ? "Downloaded!" : config.buttonLabel}</span>
        </button>
      </div>
    </div>
  );
}

function getCardConfig(intent: NonNullable<ExportIntent>, title: string) {
  switch (intent) {
    case "pdf":
      return {
        icon: <FileText className="h-5 w-5 text-rose-500" />,
        badgeBg: "bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60",
        filename: `${title}.pdf`,
        subtitle: "Formatted Vector PDF • High Quality",
        buttonBg: "bg-rose-600 hover:bg-rose-500",
        buttonLabel: "Download PDF",
      };
    case "excel":
      return {
        icon: <FileSpreadsheet className="h-5 w-5 text-emerald-500" />,
        badgeBg: "bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60",
        filename: `${title}.xlsx`,
        subtitle: "Microsoft Excel OpenXML Workbook",
        buttonBg: "bg-emerald-600 hover:bg-emerald-500",
        buttonLabel: "Download Excel (.xlsx)",
      };
    case "docx":
      return {
        icon: <File className="h-5 w-5 text-blue-500" />,
        badgeBg: "bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60",
        filename: `${title}.docx`,
        subtitle: "Microsoft Word OpenXML Document",
        buttonBg: "bg-blue-600 hover:bg-blue-500",
        buttonLabel: "Download Word (.docx)",
      };
    case "csv":
      return {
        icon: <FileSpreadsheet className="h-5 w-5 text-slate-500" />,
        badgeBg: "bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700",
        filename: `${title}.csv`,
        subtitle: "RFC-4180 Comma Separated Values",
        buttonBg: "bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600",
        buttonLabel: "Download CSV",
      };
  }
}

/**
 * Extracts table data from markdown content (either GFM pipe table or CSV code block)
 */
function extractTableDataFromMarkdown(content: string): { headers: string[]; rows: string[][] } {
  // 1. Check for CSV code block
  const csvBlockMatch = content.match(/```(?:csv)?\n([\s\S]*?)```/i);
  if (csvBlockMatch && csvBlockMatch[1]) {
    return parseCsvToTableData(csvBlockMatch[1]);
  }

  // 2. Check for Markdown Pipe Table
  const lines = content.split(/\r?\n/);
  const tableLines = lines.filter((l) => l.trim().startsWith("|") && l.trim().endsWith("|"));

  if (tableLines.length >= 2) {
    const headerLine = tableLines[0];
    const dataLines = tableLines.slice(1).filter((l) => !/^\|?[\s-:]+\|[\s-:|]+$/.test(l.trim()));

    const parseLine = (l: string) =>
      l
        .replace(/^\|/, "")
        .replace(/\|$/, "")
        .split("|")
        .map((c) => c.trim().replace(/[*_`]/g, ""));

    return {
      headers: parseLine(headerLine),
      rows: dataLines.map(parseLine),
    };
  }

  return { headers: ["Column 1"], rows: [[content.slice(0, 100)]] };
}
