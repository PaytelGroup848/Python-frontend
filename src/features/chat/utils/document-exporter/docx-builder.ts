/**
 * Microsoft Word (.docx) Document Builder
 * Generates genuine OpenXML (.docx) binary packages with professional typography,
 * branded headers, styled tables, and zero security warnings in Microsoft Word.
 */

import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  ShadingType,
  AlignmentType,
  Footer,
  PageNumber,
} from "docx";
import type { Tokens } from "marked";
import { parseMarkdownToAst, extractPlainTextFromToken } from "./markdown-ast";
import { saveFile } from "./file-saver";

const BRAND_EMERALD = "059669";
const BRAND_DARK = "0F172A";
const TEXT_MUTED = "64748B";
const BG_ZEBRA = "F8FAFC";
const BORDER_LIGHT = "E2E8F0";

export async function exportAsDocx(
  markdown: string,
  filename = "document"
): Promise<void> {
  const safeFilename = `${filename.replace(/[^a-zA-Z0-9_-]/g, "_")}.docx`;
  const tokens = parseMarkdownToAst(markdown);
  const docElements: (Paragraph | Table)[] = [];

  for (const token of tokens) {
    if (token.type === "heading") {
      const headingLevel =
        token.depth === 1
          ? HeadingLevel.HEADING_1
          : token.depth === 2
          ? HeadingLevel.HEADING_2
          : HeadingLevel.HEADING_3;

      docElements.push(
        new Paragraph({
          text: token.text,
          heading: headingLevel,
          spacing: { before: token.depth === 1 ? 360 : 240, after: 120 },
        })
      );
    } else if (token.type === "paragraph") {
      docElements.push(
        new Paragraph({
          children: parseInlineRuns(token.text),
          spacing: { before: 80, after: 140, line: 320 },
        })
      );
    } else if (token.type === "list") {
      const listToken = token as Tokens.List;
      listToken.items.forEach((item: Tokens.ListItem) => {
        docElements.push(
          new Paragraph({
            children: parseInlineRuns(item.text),
            bullet: listToken.ordered ? undefined : { level: 0 },
            spacing: { before: 40, after: 60 },
          })
        );
      });
    } else if (token.type === "code") {
      docElements.push(
        new Paragraph({
          children: [
            new TextRun({
              text: token.text,
              font: "Consolas",
              size: 19,
              color: BRAND_DARK,
            }),
          ],
          shading: { type: ShadingType.CLEAR, fill: "F1F5F9" },
          border: {
            left: { style: BorderStyle.SINGLE, size: 4, color: BORDER_LIGHT },
            right: { style: BorderStyle.SINGLE, size: 4, color: BORDER_LIGHT },
            top: { style: BorderStyle.SINGLE, size: 4, color: BORDER_LIGHT },
            bottom: { style: BorderStyle.SINGLE, size: 4, color: BORDER_LIGHT },
          },
          spacing: { before: 160, after: 160 },
        })
      );
    } else if (token.type === "blockquote") {
      docElements.push(
        new Paragraph({
          children: [
            new TextRun({
              text: extractPlainTextFromToken(token),
              italics: true,
              color: TEXT_MUTED,
            }),
          ],
          border: {
            left: { style: BorderStyle.SINGLE, size: 16, color: BRAND_EMERALD },
          },
          indent: { left: 360 },
          spacing: { before: 140, after: 140 },
        })
      );
    } else if (token.type === "table") {
      const tableToken = token as Tokens.Table;
      const rows: TableRow[] = [];

      // Header row
      const headerCells = tableToken.header.map(
        (cell: Tokens.TableCell) =>
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: cell.text,
                    bold: true,
                    color: "FFFFFF",
                  }),
                ],
                alignment: AlignmentType.LEFT,
              }),
            ],
            shading: { type: ShadingType.CLEAR, fill: BRAND_EMERALD },
            margins: { top: 120, bottom: 120, left: 160, right: 160 },
          })
      );
      rows.push(new TableRow({ children: headerCells }));

      // Data rows
      tableToken.rows.forEach((row: Tokens.TableCell[], rowIdx: number) => {
        const isZebra = rowIdx % 2 === 1;
        const dataCells = row.map(
          (cell: Tokens.TableCell) =>
            new TableCell({
              children: [
                new Paragraph({
                  children: parseInlineRuns(cell.text),
                  alignment: AlignmentType.LEFT,
                }),
              ],
              shading: isZebra
                ? { type: ShadingType.CLEAR, fill: BG_ZEBRA }
                : undefined,
              margins: { top: 100, bottom: 100, left: 160, right: 160 },
            })
        );
        rows.push(new TableRow({ children: dataCells }));
      });

      docElements.push(
        new Table({
          rows,
          width: { size: 100, type: WidthType.PERCENTAGE },
        })
      );
    }
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }, // 1 inch
          },
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: "Patwatoli AI • Page ",
                    size: 18,
                    color: TEXT_MUTED,
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    size: 18,
                    color: TEXT_MUTED,
                  }),
                ],
              }),
            ],
          }),
        },
        children: docElements,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveFile(
    blob,
    safeFilename,
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  );
}

/**
 * Parses markdown inline styles (bold, italic, code) into typed TextRun instances.
 */
function parseInlineRuns(text: string): TextRun[] {
  const runs: TextRun[] = [];
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|[^*`]+)/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    const part = match[0];
    if (part.startsWith("**") && part.endsWith("**")) {
      runs.push(new TextRun({ text: part.slice(2, -2), bold: true }));
    } else if (part.startsWith("*") && part.endsWith("*")) {
      runs.push(new TextRun({ text: part.slice(1, -1), italics: true }));
    } else if (part.startsWith("`") && part.endsWith("`")) {
      runs.push(
        new TextRun({
          text: part.slice(1, -1),
          font: "Consolas",
          shading: { type: ShadingType.CLEAR, fill: "F1F5F9" },
        })
      );
    } else {
      runs.push(new TextRun({ text: part }));
    }
  }

  return runs.length > 0 ? runs : [new TextRun({ text })];
}
