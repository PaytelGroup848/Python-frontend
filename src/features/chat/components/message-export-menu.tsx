"use client";

import React, { useState } from "react";
import {
  Download,
  FileText,
  File,
  FileCode,
  Check,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  exportAsPdf,
  exportAsDocx,
  exportAsMarkdown,
  exportAsPlainText,
} from "../utils/document-exporter";

interface MessageExportMenuProps {
  content: string;
  title?: string;
}

export function MessageExportMenu({
  content,
  title = "Patwatoli_Document",
}: MessageExportMenuProps) {
  const [downloading, setDownloading] = useState(false);
  const [downloadedType, setDownloadedType] = useState<string | null>(null);

  const handleExport = async (type: "pdf" | "docx" | "md" | "txt") => {
    if (!content || downloading) return;
    setDownloading(true);

    try {
      if (type === "pdf") {
        exportAsPdf(content, title);
      } else if (type === "docx") {
        await exportAsDocx(content, title);
      } else if (type === "md") {
        exportAsMarkdown(content, title);
      } else if (type === "txt") {
        exportAsPlainText(content, title);
      }

      setDownloadedType(type);
      setTimeout(() => setDownloadedType(null), 2000);
    } catch (err) {
      console.error("Document Export error:", err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          title="Export response as PDF, Word (.docx), Markdown, or Text"
          aria-label="Export response"
          className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 text-slate-400 transition-colors cursor-pointer"
        >
          {downloading ? (
            <Loader2 size={13} className="animate-spin text-emerald-600" />
          ) : downloadedType ? (
            <Check size={13} className="text-emerald-600" />
          ) : (
            <Download size={13} />
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        side="top"
        sideOffset={6}
        className="w-52 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-xl border border-slate-200 dark:border-slate-800 rounded-xl p-1 z-50 animate-in fade-in-50 zoom-in-95"
      >
        <div className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Export Document
        </div>

        {/* 1. PDF Document */}
        <DropdownMenuItem
          onClick={() => handleExport("pdf")}
          className="flex items-center gap-2.5 px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
        >
          <FileText size={14} className="text-rose-500 shrink-0" />
          <div className="flex flex-col">
            <span className="font-medium text-slate-800 dark:text-slate-200">PDF Document</span>
            <span className="text-[10px] text-slate-400">Direct vector download (.pdf)</span>
          </div>
        </DropdownMenuItem>

        {/* 2. Word Document (.docx) */}
        <DropdownMenuItem
          onClick={() => handleExport("docx")}
          className="flex items-center gap-2.5 px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
        >
          <File size={14} className="text-blue-600 shrink-0" />
          <div className="flex flex-col">
            <span className="font-medium text-slate-800 dark:text-slate-200">Word Document</span>
            <span className="text-[10px] text-slate-400">Genuine OpenXML (.docx)</span>
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-1 bg-slate-100 dark:bg-slate-800" />

        {/* 3. Markdown (.md) */}
        <DropdownMenuItem
          onClick={() => handleExport("md")}
          className="flex items-center gap-2.5 px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
        >
          <FileCode size={14} className="text-emerald-600 shrink-0" />
          <span className="font-medium text-slate-800 dark:text-slate-200">Markdown (.md)</span>
        </DropdownMenuItem>

        {/* 4. Plain Text (.txt) */}
        <DropdownMenuItem
          onClick={() => handleExport("txt")}
          className="flex items-center gap-2.5 px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
        >
          <FileText size={14} className="text-slate-500 shrink-0" />
          <span className="font-medium text-slate-800 dark:text-slate-200">Plain Text (.txt)</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
