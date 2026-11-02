/**
 * Table & Spreadsheet Export Utility
 * Provides 100% client-side, zero-dependency exports for Excel, CSV, and Clipboard.
 * Fully compatible with Microsoft Excel, Google Sheets, Apple Numbers, and LibreOffice.
 */

/**
 * Escapes characters for XML Spreadsheet format
 */
function escapeXml(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

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
 * Exports tabular data as a styled Microsoft Excel Spreadsheet (.xls / XML Spreadsheet 2003).
 * Recognized natively by Microsoft Excel with formatted headers, auto-types, and zero security warnings.
 */
export function exportTableToExcel(
  headers: string[],
  rows: (string | number)[][],
  filename = "data_export"
): void {
  const safeFilename = `${filename.replace(/[^a-zA-Z0-9_-]/g, "_")}.xls`;

  // Build Excel XML
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <Styles>
  <Style ss:ID="Default" ss:Name="Normal">
   <Alignment ss:Vertical="Center"/>
   <Borders/>
   <Font ss:FontName="Segoe UI" x:Family="Swiss" ss:Size="10" ss:Color="#1E293B"/>
   <Interior/>
   <NumberFormat/>
   <Protection/>
  </Style>
  <Style ss:ID="Header">
   <Font ss:FontName="Segoe UI" x:Family="Swiss" ss:Size="10" ss:Color="#FFFFFF" ss:Bold="1"/>
   <Interior ss:Color="#059669" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#047857"/>
   </Borders>
  </Style>
  <Style ss:ID="Zebra">
   <Interior ss:Color="#F8FAFC" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="NumberCell">
   <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
  </Style>
  <Style ss:ID="NumberCellZebra">
   <Interior ss:Color="#F8FAFC" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
  </Style>
 </Styles>
 <Worksheet ss:Name="Sheet1">
  <Table ss:DefaultRowHeight="20">
`;

  // Headers Row
  if (headers.length > 0) {
    xml += '   <Row ss:Height="24" ss:StyleID="Header">\n';
    headers.forEach((h) => {
      xml += `    <Cell><Data ss:Type="String">${escapeXml(h)}</Data></Cell>\n`;
    });
    xml += "   </Row>\n";
  }

  // Data Rows
  rows.forEach((row, rowIdx) => {
    const isZebra = rowIdx % 2 === 1;
    xml += `   <Row ss:Height="20"${isZebra ? ' ss:StyleID="Zebra"' : ""}>\n`;

    row.forEach((cell) => {
      const cellVal = cell !== null && cell !== undefined ? cell : "";
      const num = isNumeric(cellVal);

      if (num && typeof cellVal === "string" && cellVal.trim().length > 0) {
        const cleanNum = cellVal.trim().replace(/,/g, "");
        const styleId = isZebra ? ' ss:StyleID="NumberCellZebra"' : ' ss:StyleID="NumberCell"';
        xml += `    <Cell${styleId}><Data ss:Type="Number">${cleanNum}</Data></Cell>\n`;
      } else if (typeof cellVal === "number") {
        const styleId = isZebra ? ' ss:StyleID="NumberCellZebra"' : ' ss:StyleID="NumberCell"';
        xml += `    <Cell${styleId}><Data ss:Type="Number">${cellVal}</Data></Cell>\n`;
      } else {
        xml += `    <Cell><Data ss:Type="String">${escapeXml(cellVal)}</Data></Cell>\n`;
      }
    });

    xml += "   </Row>\n";
  });

  xml += `  </Table>
 </Worksheet>
</Workbook>`;

  const blob = new Blob([xml], {
    type: "application/vnd.ms-excel;charset=utf-8;",
  });
  triggerDownload(blob, safeFilename);
}

/**
 * Exports tabular data as a clean RFC-4180 CSV file with UTF-8 BOM
 * (UTF-8 BOM ensures non-English characters like Hindi display properly in Excel).
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

  const lines: string[] = [];
  if (headers.length > 0) {
    lines.push(headers.map(escapeCsvCell).join(","));
  }

  rows.forEach((row) => {
    lines.push(row.map(escapeCsvCell).join(","));
  });

  const csvContent = "\uFEFF" + lines.join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  triggerDownload(blob, safeFilename);
}

/**
 * Copies table data to clipboard as Tab-Separated Values (TSV).
 * When pasted into Excel or Google Sheets (Ctrl+V), cells distribute into columns perfectly.
 */
export async function copyTableToClipboard(
  headers: string[],
  rows: (string | number)[][]
): Promise<boolean> {
  try {
    const lines: string[] = [];
    if (headers.length > 0) {
      lines.push(headers.join("\t"));
    }
    rows.forEach((row) => {
      lines.push(row.map((cell) => String(cell || "")).join("\t"));
    });

    await navigator.clipboard.writeText(lines.join("\n"));
    return true;
  } catch (err) {
    console.error("Failed to copy table to clipboard:", err);
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
