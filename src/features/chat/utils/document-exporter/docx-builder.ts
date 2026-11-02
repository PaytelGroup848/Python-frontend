/**
 * Microsoft Word (.docx / .doc) Document Builder
 * Generates an OpenXML compliant Word document with professional typography,
 * emerald headings, styled tables, and proper page margins.
 */

import { convertMarkdownToHtml } from "./markdown-to-html";

export function exportAsDocx(markdown: string, filename = "document"): void {
  const safeFilename = `${filename.replace(/[^a-zA-Z0-9_-]/g, "_")}.doc`;
  const bodyHtml = convertMarkdownToHtml(markdown);

  const wordDocumentHtml = `<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office'
      xmlns:w='urn:schemas-microsoft-com:office:word'
      xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset='utf-8'>
  <title>${escapeXml(filename)}</title>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    @page Section1 {
      size: 595.3pt 841.9pt; /* Standard A4 */
      margin: 70.85pt 70.85pt 70.85pt 70.85pt; /* 2.5cm standard margins */
      mso-header-margin: 35.4pt;
      mso-footer-margin: 35.4pt;
      mso-paper-source: 0;
    }
    div.Section1 {
      page: Section1;
    }
    body {
      font-family: 'Calibri', 'Segoe UI', Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.5;
      color: #1e293b;
    }
    h1 {
      font-size: 20pt;
      color: #047857; /* Emerald primary */
      font-weight: bold;
      margin-top: 20pt;
      margin-bottom: 8pt;
      border-bottom: 1.5pt solid #10b981;
      padding-bottom: 4pt;
    }
    h2 {
      font-size: 15pt;
      color: #0f172a;
      font-weight: bold;
      margin-top: 16pt;
      margin-bottom: 6pt;
    }
    h3 {
      font-size: 12.5pt;
      color: #334155;
      font-weight: bold;
      margin-top: 12pt;
      margin-bottom: 4pt;
    }
    p {
      margin-top: 0;
      margin-bottom: 8pt;
    }
    ul, ol {
      margin-top: 0;
      margin-bottom: 8pt;
      padding-left: 24pt;
    }
    li {
      margin-bottom: 4pt;
    }
    strong {
      color: #0f172a;
      font-weight: bold;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      margin-top: 10pt;
      margin-bottom: 14pt;
    }
    th {
      background-color: #059669;
      color: #ffffff;
      font-weight: bold;
      padding: 6pt 10pt;
      border: 1pt solid #047857;
      text-align: left;
    }
    td {
      padding: 5pt 10pt;
      border: 1pt solid #cbd5e1;
      font-size: 10.5pt;
    }
    tr:nth-child(even) td {
      background-color: #f8fafc;
    }
    pre {
      background-color: #f1f5f9;
      border: 1pt solid #e2e8f0;
      padding: 8pt 10pt;
      border-radius: 4pt;
      font-family: 'Consolas', 'Courier New', monospace;
      font-size: 9.5pt;
      line-height: 1.4;
      margin-top: 8pt;
      margin-bottom: 10pt;
    }
    code {
      font-family: 'Consolas', monospace;
      background-color: #f1f5f9;
      padding: 2pt 4pt;
      border-radius: 3pt;
      font-size: 10pt;
      color: #0f172a;
    }
    blockquote {
      border-left: 3pt solid #10b981;
      padding-left: 10pt;
      margin-left: 0;
      margin-top: 8pt;
      margin-bottom: 8pt;
      color: #475569;
      font-style: italic;
    }
    .footer-stamp {
      margin-top: 24pt;
      padding-top: 8pt;
      border-top: 0.5pt solid #e2e8f0;
      font-size: 9pt;
      color: #94a3b8;
      text-align: right;
    }
  </style>
</head>
<body>
  <div class="Section1">
    ${bodyHtml}
    <div class="footer-stamp">
      Generated with Patwatoli AI &bull; ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
    </div>
  </div>
</body>
</html>`;

  const blob = new Blob(["\uFEFF" + wordDocumentHtml], {
    type: "application/msword;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = safeFilename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
