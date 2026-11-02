/**
 * Markdown & Plain Text Exporter
 * Exports sanitized, clean Markdown (.md) or Plain Text (.txt) files.
 */

import { cleanMarkdownContent } from "./markdown-ast";
import { saveFile } from "./file-saver";

export function exportAsMarkdown(markdown: string, filename = "document"): void {
  const safeFilename = `${filename.replace(/[^a-zA-Z0-9_-]/g, "_")}.md`;
  const clean = cleanMarkdownContent(markdown);
  saveFile(clean, safeFilename, "text/markdown;charset=utf-8;");
}

export function exportAsPlainText(markdown: string, filename = "document"): void {
  const safeFilename = `${filename.replace(/[^a-zA-Z0-9_-]/g, "_")}.txt`;
  const clean = cleanMarkdownContent(markdown);

  // Convert markdown to clean, readable plain text
  const plain = clean
    .replace(/```[\s\S]*?```/g, (match) => {
      return match.replace(/```\w*\n?/, "").replace(/```$/, "");
    })
    .replace(/^#+\s+/gm, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^\s*[-*+]\s+/gm, "• ")
    .trim();

  saveFile(plain, safeFilename, "text/plain;charset=utf-8;");
}
