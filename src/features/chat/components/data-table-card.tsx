"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  FileSpreadsheet,
  FileText,
  Copy,
  Check,
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

  const handleDownloadExcel = () => {
    const { headers, rows } = getTableData();
    exportTableToExcel(headers, rows, "patwatoli_data_sheet");
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
          {/* Download Excel (.xls) */}
          <button
            type="button"
            onClick={handleDownloadExcel}
            title="Download formatted Excel spreadsheet"
            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1 text-xs font-semibold shadow-2xs transition-all active:scale-95 cursor-pointer"
          >
            <FileSpreadsheet size={13} className="shrink-0" />
            <span>Excel (.xls)</span>
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
      <div className="w-full overflow-x-auto max-h-96 overflow-y-auto">
        {children ? (
          <div ref={tableRef as unknown as React.RefObject<HTMLDivElement>} className="[&_table]:w-full [&_table]:border-collapse [&_th]:bg-slate-100/90 dark:[&_th]:bg-slate-800/80 [&_th]:text-slate-800 dark:[&_th]:text-slate-200 [&_th]:font-semibold [&_th]:text-xs [&_th]:uppercase [&_th]:tracking-wider [&_th]:px-4 [&_th]:py-2.5 [&_th]:text-left [&_th]:border-b [&_th]:border-slate-200 dark:[&_th]:border-slate-700 [&_td]:px-4 [&_td]:py-2 [&_td]:text-xs [&_td]:text-slate-700 dark:[&_td]:text-slate-300 [&_td]:border-b [&_td]:border-slate-100 dark:[&_td]:border-slate-800 [&_tbody_tr:hover]:bg-emerald-50/40 dark:[&_tbody_tr:hover]:bg-emerald-950/20 [&_tbody_tr:nth-child(even)]:bg-slate-50/50 dark:[&_tbody_tr:nth-child(even)]:bg-slate-800/30">
            {children}
          </div>
        ) : (
          <table ref={tableRef} className="w-full border-collapse text-xs">
            {initialHeaders && initialHeaders.length > 0 && (
              <thead>
                <tr className="bg-slate-100/90 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700">
                  {initialHeaders.map((h, i) => (
                    <th
                      key={i}
                      className="px-4 py-2.5 text-left font-semibold uppercase tracking-wider text-slate-800 dark:text-slate-200"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {initialRows &&
                initialRows.map((row, rIdx) => (
                  <tr
                    key={rIdx}
                    className="border-b border-slate-100 dark:border-slate-800 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20 transition-colors odd:bg-white dark:odd:bg-slate-900 even:bg-slate-50/50 dark:even:bg-slate-800/30"
                  >
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="px-4 py-2 text-slate-700 dark:text-slate-300 font-mono">
                        {String(cell)}
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
