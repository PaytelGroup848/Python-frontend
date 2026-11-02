/**
 * Table & Spreadsheet Export Utility
 * Generates genuine OpenXML Excel (.xlsx) workbooks and RFC-4180 CSV files.
 * Fully compatible with Microsoft Excel 365/2021, Google Sheets, and Apple Numbers with ZERO warnings.
 */

import ExcelJS from "exceljs";

/**
 * Checks if a string value is numeric
 */
function isNumeric(val: string | number): boolean {
  if (typeof val === "number") return true;
  if (!val || typeof val !== "string") return false;
  const clean = val.trim().replace(/,/g, "");
  return !isNaN(Number(clean)) && clean.length > 0;
}

/**
 * Exports tabular data as a styled Microsoft Excel OpenXML Spreadsheet (.xlsx).
 */
export async function exportTableToExcel(
  headers: string[],
  rows: (string | number)[][],
  filename = "data_export"
): Promise<void> {
  const safeFilename = `${filename.replace(/[^a-zA-Z0-9_-]/g, "_")}.xlsx`;

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Patwatoli AI";
  workbook.lastModifiedBy = "Patwatoli AI";
  workbook.created = new Date();
  workbook.modified = new Date();

  const worksheet = workbook.addWorksheet("Data", {
    views: [{ showGridLines: true }],
  });

  // 1. Headers Row
  if (headers.length > 0) {
    const headerRow = worksheet.addRow(headers);
    headerRow.height = 24;
    headerRow.font = {
      name: "Segoe UI",
      size: 10,
      bold: true,
      color: { argb: "FFFFFFFF" },
    };
    headerRow.alignment = {
      vertical: "middle",
      horizontal: "left",
    };
    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF059669" }, // Brand Emerald
    };
  }

  // 2. Data Rows
  rows.forEach((row, rowIdx) => {
    const formattedRow = row.map((cell) => {
      if (typeof cell === "number") return cell;
      if (typeof cell === "string" && isNumeric(cell)) {
        return Number(cell.trim().replace(/,/g, ""));
      }
      return cell ?? "";
    });

    const dataRow = worksheet.addRow(formattedRow);
    dataRow.height = 20;

    const isZebra = rowIdx % 2 === 1;
    if (isZebra) {
      dataRow.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFF8FAFC" },
      };
    }

    dataRow.font = {
      name: "Segoe UI",
      size: 10,
      color: { argb: "FF1E293B" },
    };
    dataRow.alignment = {
      vertical: "middle",
    };
  });

  // 3. Auto-fit column widths
  worksheet.columns.forEach((col, idx) => {
    let maxLen = headers[idx] ? String(headers[idx]).length : 10;
    rows.forEach((r) => {
      if (r[idx] !== undefined && r[idx] !== null) {
        maxLen = Math.max(maxLen, String(r[idx]).length);
      }
    });
    col.width = Math.min(Math.max(maxLen + 4, 12), 40);
  });

  // 4. Write binary buffer and trigger download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  triggerDownload(blob, safeFilename);
}

/**
 * Exports tabular data as an RFC-4180 compliant CSV (.csv) file with UTF-8 BOM.
 */
export function exportTableToCsv(
  headers: string[],
  rows: (string | number)[][],
  filename = "data_export"
): void {
  const safeFilename = `${filename.replace(/[^a-zA-Z0-9_-]/g, "_")}.csv`;

  const escapeCsvCell = (val: string | number | null | undefined): string => {
    if (val === null || val === undefined) return "";
    const str = String(val);
    if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const csvLines: string[] = [];

  if (headers.length > 0) {
    csvLines.push(headers.map(escapeCsvCell).join(","));
  }

  rows.forEach((row) => {
    csvLines.push(row.map(escapeCsvCell).join(","));
  });

  const csvContent = "\uFEFF" + csvLines.join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  triggerDownload(blob, safeFilename);
}

/**
 * Copies tabular data to clipboard in TSV (Tab-Separated Values) format.
 */
export async function copyTableToClipboard(
  headers: string[],
  rows: (string | number)[][]
): Promise<boolean> {
  const tsvLines: string[] = [];

  if (headers.length > 0) {
    tsvLines.push(headers.join("\t"));
  }

  rows.forEach((row) => {
    tsvLines.push(row.map((c) => (c !== null && c !== undefined ? String(c) : "")).join("\t"));
  });

  const tsvContent = tsvLines.join("\n");

  try {
    await navigator.clipboard.writeText(tsvContent);
    return true;
  } catch {
    return false;
  }
}

/**
 * Parses raw CSV text string into structured headers and rows.
 */
export function parseCsvToTableData(csvText: string): { headers: string[]; rows: string[][] } {
  if (!csvText || !csvText.trim()) {
    return { headers: [], rows: [] };
  }

  const lines = csvText
    .trim()
    .split(/\r?\n/)
    .filter((l) => l.trim().length > 0);

  if (lines.length === 0) {
    return { headers: [], rows: [] };
  }

  const parseCsvLine = (line: string): string[] => {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === "," && !inQuotes) {
        result.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  };

  const headers = parseCsvLine(lines[0]);
  const rows = lines.slice(1).map(parseCsvLine);

  return { headers, rows };
}

/**
 * Helper to trigger client-side file download via temporary anchor
 */
function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
