"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  FileSpreadsheet,
  FileText,
  Copy,
  Check,
  Loader2,
  Table as TableIcon,
} from "lucide-react";
import {
  exportTableToExcel,
  exportTableToCsv,
  copyTableToClipboard,
} from "../utils/table-exporter";

interface DataTableCardProps {
  children?: React.ReactNode;
  headers?: string[];
  rows?: (string | number)[][];
  title?: string;
}

export function DataTableCard({
  children,
  headers: initialHeaders,
  rows: initialRows,
  title = "Table Data",
}: DataTableCardProps) {
  const tableRef = useRef<HTMLTableElement>(null);
  const [copied, setCopied] = useState(false);
  const [exportingExcel, setExportingExcel] = useState(false);
  const [stats, setStats] = useState<{ rows: number; cols: number }>({
    rows: initialRows?.length || 0,
    cols: initialHeaders?.length || 0,
  });

  // Helper to extract clean structured data from the rendered table DOM or props
  const getTableData = (): { headers: string[]; rows: string[][] } => {
    if (initialHeaders && initialRows) {
      return {
        headers: initialHeaders,
        rows: initialRows.map((r) => r.map((c) => String(c))),
      };
    }

    if (!tableRef.current) {
      return { headers: [], rows: [] };
    }

    const headers: string[] = [];
    const rows: string[][] = [];

    const thElements = tableRef.current.querySelectorAll("thead th, tr:first-child th");
    thElements.forEach((th) => headers.push(th.textContent?.trim() || ""));

    const trElements = tableRef.current.querySelectorAll("tbody tr");
    if (trElements.length > 0) {
      trElements.forEach((tr) => {
        const tds = tr.querySelectorAll("td");
        if (tds.length > 0) {
          const rowData: string[] = [];
          tds.forEach((td) => rowData.push(td.textContent?.trim() || ""));
          rows.push(rowData);
        }
      });
    } else {
      // Fallback if no tbody
      const allTrs = tableRef.current.querySelectorAll("tr");
      allTrs.forEach((tr, idx) => {
        if (idx === 0 && headers.length > 0) return;
        const tds = tr.querySelectorAll("td");
        if (tds.length > 0) {
          const rowData: string[] = [];
          tds.forEach((td) => rowData.push(td.textContent?.trim() || ""));
          rows.push(rowData);
        }
      });
    }

    return { headers, rows };
  };

  // Measure row and column counts after DOM mounts
  useEffect(() => {
    if (initialHeaders && initialRows) {
      setStats({ rows: initialRows.length, cols: initialHeaders.length });
    } else if (tableRef.current) {
      const { headers, rows } = getTableData();
      setStats({
        rows: rows.length,
        cols: headers.length || (rows[0] ? rows[0].length : 0),
      });
    }
  }, [children, initialHeaders, initialRows]);

  const handleDownloadExcel = async () => {
    if (exportingExcel) return;
    setExportingExcel(true);
    try {
      const { headers, rows } = getTableData();
      await exportTableToExcel(headers, rows, "patwatoli_data_sheet");
    } catch (err) {
      console.error("Excel export error:", err);
    } finally {
      setExportingExcel(false);
    }
  };

  const handleDownloadCsv = () => {
    const { headers, rows } = getTableData();
    exportTableToCsv(headers, rows, "patwatoli_data");
  };

  const handleCopy = async () => {
    const { headers, rows } = getTableData();
    const success = await copyTableToClipboard(headers, rows);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="my-4 w-full overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-all">
      {/* ACTION TOOLBAR */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-950/70 px-3.5 py-2">
        {/* Left: Table details */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <TableIcon size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>
            {stats.rows > 0 ? (
              <>
                <span className="text-slate-900 dark:text-white font-bold">{stats.rows}</span> Rows &bull;{" "}
                <span className="text-slate-900 dark:text-white font-bold">{stats.cols}</span> Cols
              </>
            ) : (
              title
            )}
          </span>
        </div>

        {/* Right: Export buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Download Excel (.xlsx) */}
          <button
            type="button"
            onClick={handleDownloadExcel}
            disabled={exportingExcel}
            title="Download formatted OpenXML Excel spreadsheet (.xlsx)"
            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1 text-xs font-semibold shadow-2xs transition-all active:scale-95 cursor-pointer disabled:opacity-50"
          >
            {exportingExcel ? (
              <Loader2 size={13} className="animate-spin shrink-0" />
            ) : (
              <FileSpreadsheet size={13} className="shrink-0" />
            )}
            <span>Excel (.xlsx)</span>
          </button>

          {/* Download CSV */}
          <button
            type="button"
            onClick={handleDownloadCsv}
            title="Download CSV spreadsheet"
            className="flex items-center gap-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 px-2.5 py-1 text-xs font-medium transition-all active:scale-95 cursor-pointer"
          >
            <FileText size={13} className="text-blue-500 shrink-0" />
            <span>CSV</span>
          </button>

          {/* Copy Table */}
          <button
            type="button"
            onClick={handleCopy}
            title="Copy table to paste directly into Excel or Google Sheets (Ctrl+V)"
            className="flex items-center gap-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 px-2 py-1 text-xs font-medium transition-all active:scale-95 cursor-pointer"
          >
            {copied ? (
              <>
                <Check size={13} className="text-emerald-500 shrink-0" />
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Copy size={13} className="text-slate-400 shrink-0" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* TABLE RENDERER CONTAINER */}
      <div className="overflow-x-auto p-0 max-h-[480px]">
        {children ? (
          <div ref={tableRef as any} className="data-table-wrapper w-full">
            {children}
          </div>
        ) : (
          <table ref={tableRef} className="w-full text-left text-xs border-collapse">
            {initialHeaders && initialHeaders.length > 0 && (
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100/75 dark:bg-slate-800/60">
                  {initialHeaders.map((h, i) => (
                    <th
                      key={i}
                      className="px-3.5 py-2.5 font-semibold text-slate-900 dark:text-slate-100 border-r border-slate-200/60 dark:border-slate-800/60 last:border-r-0"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {initialRows?.map((row, rowIdx) => (
                <tr
                  key={rowIdx}
                  className={`border-b border-slate-100 dark:border-slate-800/40 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20 transition-colors ${
                    rowIdx % 2 === 1 ? "bg-slate-50/50 dark:bg-slate-900/40" : ""
                  }`}
                >
                  {row.map((cell, cellIdx) => (
                    <td
                      key={cellIdx}
                      className="px-3.5 py-2 text-slate-800 dark:text-slate-200 border-r border-slate-100 dark:border-slate-800/40 last:border-r-0"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
