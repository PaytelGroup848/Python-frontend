/**
 * Export Intent Detector
 * Detects whether the user explicitly requested a specific document format
 * (e.g. "PDF", "Excel", "Word", "CSV") to render an intent-aware action card.
 */

export type ExportIntent = "pdf" | "excel" | "docx" | "csv" | null;

export function detectExportIntent(userPrompt?: string): ExportIntent {
  if (!userPrompt || typeof userPrompt !== "string") return null;
  const lower = userPrompt.toLowerCase().trim();

  // 1. PDF Intent (e.g. "pdf do", "make a pdf", "in pdf format")
  if (/\b(pdf|\.pdf)\b/i.test(lower)) {
    return "pdf";
  }

  // 2. Excel Intent (e.g. "excel sheet", "xlsx", "spreadsheet bana do")
  if (/\b(excel|xlsx|\.xlsx|spreadsheet)\b/i.test(lower)) {
    return "excel";
  }

  // 3. Word Intent (e.g. "word doc", "word document", "docx", "doc me bana do")
  if (/\b(word|docx|\.docx|\.doc)\b/i.test(lower)) {
    return "docx";
  }

  // 4. CSV Intent (e.g. "csv file", "in csv")
  if (/\b(csv|\.csv)\b/i.test(lower)) {
    return "csv";
  }

  return null;
}

/**
 * Extracts a concise, clean title for the exported document.
 */
export function extractDocumentTitle(content: string, defaultTitle = "Document"): string {
  if (!content) return defaultTitle;

  // Check for H1 or H2 markdown header
  const headerMatch = content.match(/^#+\s+(.+)$/m);
  if (headerMatch && headerMatch[1]) {
    const cleanHeader = headerMatch[1]
      .replace(/[*_`]/g, "")
      .trim()
      .slice(0, 30);
    return cleanHeader.replace(/[^a-zA-Z0-9_\-\s]/g, "").replace(/\s+/g, "_") || defaultTitle;
  }

  return defaultTitle;
}
