/**
 * Vector PDF Exporter Engine
 * Generates true binary PDF documents with high-resolution typography,
 * branded headers, styled tables, page numbers, and direct background downloads.
 */

import { jsPDF } from "jspdf";
import { applyPlugin } from "jspdf-autotable";
import type { Tokens } from "marked";
import { parseMarkdownToAst, extractPlainTextFromToken } from "./markdown-ast";
import { saveFile } from "./file-saver";

// Register autoTable plugin to jsPDF prototype
if (typeof applyPlugin === "function") {
  try {
    applyPlugin(jsPDF);
  } catch {
    // Already registered or handled
  }
}

const BRAND_EMERALD = [5, 150, 105] as const;
const BRAND_DARK = [15, 23, 42] as const;
const TEXT_MUTED = [100, 116, 139] as const;

export function exportAsPdf(markdown: string, title = "Document"): void {
  const safeFilename = `${title.replace(/[^a-zA-Z0-9_-]/g, "_")}.pdf`;
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const marginX = 18;
  const contentWidth = pageWidth - marginX * 2;
  let cursorY = 26;

  const checkPageBreak = (neededHeight: number) => {
    if (cursorY + neededHeight > pageHeight - 22) {
      doc.addPage();
      cursorY = 24;
    }
  };

  // Header Banner
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(...BRAND_EMERALD);
  doc.text("Patwatoli AI", marginX, 16);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...TEXT_MUTED);
  const dateStr = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  doc.text(dateStr, pageWidth - marginX, 16, { align: "right" });

  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.line(marginX, 19, pageWidth - marginX, 19);

  const tokens = parseMarkdownToAst(markdown);

  for (const token of tokens) {
    if (token.type === "heading") {
      const fontSize = token.depth === 1 ? 16 : token.depth === 2 ? 12.5 : 10.5;
      const spacingBefore = token.depth === 1 ? 8 : 6;
      checkPageBreak(fontSize + spacingBefore + 4);

      cursorY += spacingBefore;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(fontSize);

      if (token.depth === 1) {
        doc.setTextColor(...BRAND_DARK);
      } else if (token.depth === 2) {
        doc.setTextColor(...BRAND_EMERALD);
      } else {
        doc.setTextColor(51, 65, 85);
      }

      doc.text(token.text, marginX, cursorY);
      cursorY += fontSize * 0.45 + 3;
    } else if (token.type === "paragraph") {
      const cleanText = extractPlainTextFromToken(token);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(...BRAND_DARK);

      const lines = doc.splitTextToSize(cleanText, contentWidth);
      checkPageBreak(lines.length * 4.6 + 4);

      doc.text(lines, marginX, cursorY);
      cursorY += lines.length * 4.6 + 3;
    } else if (token.type === "list") {
      const listToken = token as Tokens.List;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(...BRAND_DARK);

      listToken.items.forEach((item: Tokens.ListItem, idx: number) => {
        const itemText = extractPlainTextFromToken(item);
        const prefix = listToken.ordered ? `${idx + 1}. ` : "• ";
        const lines = doc.splitTextToSize(itemText, contentWidth - 8);
        checkPageBreak(lines.length * 4.6 + 2);

        doc.setFont("helvetica", "bold");
        doc.setTextColor(...BRAND_EMERALD);
        doc.text(prefix, marginX + 2, cursorY);

        doc.setFont("helvetica", "normal");
        doc.setTextColor(...BRAND_DARK);
        doc.text(lines, marginX + 8, cursorY);
        cursorY += lines.length * 4.6 + 2;
      });
      cursorY += 2;
    } else if (token.type === "code") {
      doc.setFont("courier", "normal");
      doc.setFontSize(8.5);
      const lines = doc.splitTextToSize(token.text, contentWidth - 8);
      const boxHeight = lines.length * 4.2 + 6;

      checkPageBreak(boxHeight + 4);
      doc.setFillColor(241, 245, 249);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(marginX, cursorY, contentWidth, boxHeight, 1.5, 1.5, "FD");

      doc.setTextColor(...BRAND_DARK);
      doc.text(lines, marginX + 4, cursorY + 5);
      cursorY += boxHeight + 4;
    } else if (token.type === "table") {
      const tableToken = token as Tokens.Table;
      const head = [tableToken.header.map((h: Tokens.TableCell) => h.text)];
      const body = tableToken.rows.map((r: Tokens.TableCell[]) =>
        r.map((c: Tokens.TableCell) => c.text)
      );

      checkPageBreak(25);

      if (typeof (doc as any).autoTable === "function") {
        (doc as any).autoTable({
          head,
          body,
          startY: cursorY + 2,
          margin: { left: marginX, right: marginX },
          theme: "striped",
          headStyles: {
            fillColor: [5, 150, 105],
            textColor: [255, 255, 255],
            fontStyle: "bold",
            fontSize: 9,
            cellPadding: 2.5,
          },
          bodyStyles: {
            textColor: [30, 41, 59],
            fontSize: 8.5,
            cellPadding: 2.2,
          },
          alternateRowStyles: {
            fillColor: [248, 250, 252],
          },
          tableLineColor: [226, 232, 240],
          tableLineWidth: 0.2,
        });

        const finalY = (doc as any).lastAutoTable?.finalY;
        if (finalY) {
          cursorY = finalY + 6;
        }
      }
    }
  }

  // Add Page Numbers & Footer on each page
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...TEXT_MUTED);

    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.2);
    doc.line(marginX, pageHeight - 14, pageWidth - marginX, pageHeight - 14);

    doc.text("Patwatoli AI • Enterprise Intelligence", marginX, pageHeight - 9);
    doc.text(`Page ${p} of ${totalPages}`, pageWidth - marginX, pageHeight - 9, {
      align: "right",
    });
  }

  // Trigger direct binary download via native Blob saveFile
  const blob = doc.output("blob");
  saveFile(blob, safeFilename, "application/pdf");
}
