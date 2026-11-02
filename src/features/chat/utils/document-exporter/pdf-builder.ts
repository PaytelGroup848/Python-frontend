/**
 * Vector PDF Exporter Engine
 * Generates an isolated A4 printable canvas with high-resolution typography,
 * emerald headings, styled tables, and triggers the native vector PDF print engine.
 */

import { convertMarkdownToHtml } from "./markdown-to-html";

export function exportAsPdf(markdown: string, title = "Document"): void {
  const bodyHtml = convertMarkdownToHtml(markdown);
  const formattedDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const printDocumentHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(title)}</title>
  <style>
    @page {
      size: A4;
      margin: 20mm 15mm 20mm 15mm;
    }
    @media print {
      body {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
    }
    * {
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      font-size: 10.5pt;
      line-height: 1.6;
      color: #1e293b;
      margin: 0;
      padding: 20px;
    }
    .header-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #059669;
      padding-bottom: 8px;
      margin-bottom: 24px;
    }
    .brand-title {
      font-size: 14pt;
      font-weight: 800;
      color: #059669;
      letter-spacing: -0.5px;
    }
    .date-badge {
      font-size: 9pt;
      color: #64748b;
    }
    h1 {
      font-size: 20pt;
      color: #0f172a;
      font-weight: 800;
      margin-top: 16px;
      margin-bottom: 10px;
      letter-spacing: -0.5px;
    }
    h2 {
      font-size: 14pt;
      color: #059669;
      font-weight: 700;
      margin-top: 20px;
      margin-bottom: 8px;
      border-left: 3px solid #059669;
      padding-left: 8px;
    }
    h3 {
      font-size: 12pt;
      color: #334155;
      font-weight: 700;
      margin-top: 14px;
      margin-bottom: 6px;
    }
    p {
      margin-top: 0;
      margin-bottom: 10px;
      text-align: justify;
    }
    ul, ol {
      margin-top: 0;
      margin-bottom: 12px;
      padding-left: 24px;
    }
    li {
      margin-bottom: 4px;
    }
    strong {
      color: #0f172a;
      font-weight: 700;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 12px;
      margin-bottom: 16px;
      font-size: 9.5pt;
    }
    th {
      background-color: #059669 !important;
      color: #ffffff !important;
      font-weight: 700;
      padding: 8px 10px;
      border: 1px solid #047857;
      text-align: left;
    }
    td {
      padding: 6px 10px;
      border: 1px solid #cbd5e1;
    }
    tr:nth-child(even) td {
      background-color: #f8fafc !important;
    }
    pre {
      background-color: #f1f5f9 !important;
      border: 1px solid #cbd5e1;
      padding: 10px 12px;
      border-radius: 6px;
      font-family: 'Consolas', 'Courier New', monospace;
      font-size: 9pt;
      line-height: 1.4;
      overflow-x: auto;
      margin-top: 10px;
      margin-bottom: 14px;
      white-space: pre-wrap;
    }
    code {
      font-family: 'Consolas', monospace;
      background-color: #f1f5f9;
      padding: 2px 4px;
      border-radius: 3px;
      font-size: 9.5pt;
      color: #0f172a;
    }
    blockquote {
      border-left: 3px solid #059669;
      padding-left: 12px;
      margin-left: 0;
      margin-top: 10px;
      margin-bottom: 10px;
      color: #475569;
      font-style: italic;
      background-color: #f8fafc;
      padding-top: 4px;
      padding-bottom: 4px;
    }
    .footer-stamp {
      margin-top: 32px;
      padding-top: 12px;
      border-top: 1px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      font-size: 8.5pt;
      color: #94a3b8;
    }
  </style>
</head>
<body>
  <div class="header-bar">
    <div class="brand-title">Patwatoli AI</div>
    <div class="date-badge">${formattedDate}</div>
  </div>

  <div class="content-body">
    ${bodyHtml}
  </div>

  <div class="footer-stamp">
    <span>Enterprise Intelligence Platform</span>
    <span>Generated via Patwatoli AI &bull; Confidential &bull; Page 1</span>
  </div>
</body>
</html>`;

  // Create isolated hidden iframe for printing
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) {
    document.body.removeChild(iframe);
    return;
  }

  doc.open();
  doc.write(printDocumentHtml);
  doc.close();

  iframe.onload = () => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } catch (e) {
      console.error("PDF Print failed:", e);
    } finally {
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 1000);
    }
  };
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
