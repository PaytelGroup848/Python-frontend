export interface WebSourceItem {
  index: number;
  title: string;
  url: string;
  domain: string;
}

export interface DocumentSourceItem {
  filename: string;
  page?: string;
}

export interface ParsedMessageResult {
  cleanContent: string;
  webSources: WebSourceItem[];
  documentSources: DocumentSourceItem[];
  sourceIndexSet: Set<number>;
  suggestions: string[];
}

/**
 * Validates protocol to strictly allow http:// and https://
 * Rejects javascript:, data:, file:, vbscript:, and relative/malformed strings.
 */
export function isValidWebUrl(url: string): boolean {
  if (!url || typeof url !== "string") return false;
  const trimmed = url.trim();
  if (
    trimmed.startsWith("javascript:") ||
    trimmed.startsWith("data:") ||
    trimmed.startsWith("file:") ||
    trimmed.startsWith("vbscript:")
  ) {
    return false;
  }
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Extracts a clean hostname without 'www.' prefix.
 */
export function extractCleanDomain(url: string): string {
  if (!url) return "";
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./i, "");
  } catch {
    return "";
  }
}

/**
 * Helper to check if a character index is inside any markdown code fence (```...```)
 */
function isInsideCodeFence(content: string, targetIndex: number): boolean {
  const codeBlocks: { start: number; end: number }[] = [];
  content.replace(/```[\s\S]*?```/g, (match, offset) => {
    codeBlocks.push({ start: offset, end: offset + match.length });
    return match;
  });
  return codeBlocks.some((b) => targetIndex >= b.start && targetIndex < b.end);
}

/**
 * Helper to generate comparison key for exact normalized deduplication.
 * Lowercases, collapses whitespace, and trims trailing punctuation.
 */
function normalizeSuggestionKey(text: string): string {
  return text
    .toLowerCase()
    .replace(/[\s\?\.!,-]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Extracts and removes a trailing Suggestions block strictly from the end of the text,
 * outside of any code fences. Follows the symmetric canonical contract:
 * - Structural prefixes stripped with delimiter guards
 * - Surrounding quotes and whitespace collapsed
 * - Normalized deduplication with original display casing
 * - MAX_SUGGESTIONS = 4
 * - Fail-safe: Parser error returns original content intact
 */
function tryExtractTrailingSuggestions(content: string): { remaining: string; suggestions: string[] } {
  if (!content || typeof content !== "string") {
    return { remaining: content || "", suggestions: [] };
  }

  try {
    const suggestionRegex = /(?:\r?\n){1,2}(?:(?:#{1,4}\s*)?\*{0,2}💡\s*(?:Follow-up\s+)?Suggestions:?\*{0,2}|(?:#{1,4}\s*|\*{1,2})(?:Follow-up\s+)?Suggestions:?\*{0,2}|(?:Follow-up\s+)?Suggestions:)\s*(?:\r?\n)([\s\S]*)$/i;
    const match = content.match(suggestionRegex);

    if (!match || match.index === undefined || isInsideCodeFence(content, match.index)) {
      return { remaining: content, suggestions: [] };
    }

    const rawBlock = match[1] || "";
    const rawLines = rawBlock.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    if (rawLines.length === 0) {
      return { remaining: content.slice(0, match.index).trimEnd(), suggestions: [] };
    }

    const remaining = content.slice(0, match.index).trimEnd();
    const seen = new Set<string>();
    const list: string[] = [];

    // Structural prefix regex with delimiter guard: requires :, ., or - after the keyword
    const structuralPrefixRegex = /^[-*•]\s*(?:(?:\*{0,2}|_{0,2})(?:suggestion|follow-?up|follow\s+up|q|question|prompt)\s*\d*(?:\*{0,2}|_{0,2})\s*[:.-]\s*)+/i;
    const repeatedNumericRegex = /^(?:[-*•]\s*)?(?:\d+[\.\)]\s*)+/;

    for (const rawLine of rawLines) {
      // Filter out standalone empty bullet marks like "-" or "*"
      if (/^[-*•]$/.test(rawLine)) continue;

      let line = rawLine.trim();
      if (!line) continue;

      // Step 1: Strip structural model prefixes (delimiter-guarded)
      line = line.replace(structuralPrefixRegex, "").trim();

      // Step 2: Strip repeated numeric bullets (e.g. "1. 1. Question")
      line = line.replace(repeatedNumericRegex, "").trim();

      // Step 3: Strip leading bullet symbols if any remain
      line = line.replace(/^[-*•]\s*/, "").trim();

      // Step 4: Strip surrounding markdown quotes, asterisks, backticks
      line = line.replace(/^[\s*"'_`]+|[\s*"'_`]+$/g, "").trim();

      // Step 5: Collapse internal whitespace
      line = line.replace(/\s+/g, " ").trim();

      // Step 6: Validate length and emptiness
      if (!line || line.length > 120) continue;

      // Step 7: Normalized exact deduplication
      const key = normalizeSuggestionKey(line);
      if (!key || seen.has(key)) continue;

      seen.add(key);
      list.push(line);

      // Step 8: Cap at MAX_SUGGESTIONS = 4
      if (list.length >= 4) break;
    }

    return { remaining, suggestions: list };
  } catch {
    // Invariant #9: Parser failure must never corrupt or truncate the assistant's primary response
    return { remaining: content, suggestions: [] };
  }
}

/**
 * Pure, deterministic function to parse Web Sources, Document Citations, and Follow-up Suggestions
 * strictly from the backend formats without mutating state or transport.
 */
export function parseSources(content: string): ParsedMessageResult {
  if (!content || typeof content !== "string") {
    return {
      cleanContent: content || "",
      webSources: [],
      documentSources: [],
      sourceIndexSet: new Set<number>(),
      suggestions: [],
    };
  }

  let clean = content;
  const webSources: WebSourceItem[] = [];
  const documentSources: DocumentSourceItem[] = [];
  let suggestions: string[] = [];

  // 1. Try extract Suggestions from the very end first (if appended after sources)
  const sugRes1 = tryExtractTrailingSuggestions(clean);
  if (sugRes1.suggestions.length > 0) {
    clean = sugRes1.remaining;
    suggestions = sugRes1.suggestions;
  }

  // 2. Match Document Citations block:
  // e.g. **📌 Documents:** \n `📄 filename.pdf (Page 2)`  `📄 doc2.pdf`
  const docHeaderRegex = /(?:\r?\n){1,2}\*{0,2}📌\s*Documents:?\*{0,2}\s*([\s\S]*)$/i;
  const docMatch = clean.match(docHeaderRegex);
  if (docMatch && docMatch.index !== undefined && !isInsideCodeFence(clean, docMatch.index)) {
    const docBlock = docMatch[1] || "";
    clean = clean.slice(0, docMatch.index).trimEnd();

    // Extract individual pills: `📄 file.pdf (Page 3)`
    const pillRegex = /`📄\s*([^`()]+?)(?:\s*\((?:Page\s*)?(\d+)\))?\s*`/gi;
    let pillMatch: RegExpExecArray | null;
    while ((pillMatch = pillRegex.exec(docBlock)) !== null) {
      const filename = pillMatch[1].trim();
      const page = pillMatch[2] ? pillMatch[2].trim() : undefined;
      if (filename) {
        documentSources.push({ filename, page });
      }
    }
  }

  // 3. Match Web Sources block:
  // e.g. **🌐 Sources:** \n [1] [Title](https://...) \n [2] [Title 2](https://...)
  // or inline: 🌐 Sources: [1] Title ...
  const webHeaderRegex = /(?:\r?\n){1,2}\*{0,2}🌐\s*Sources:?\*{0,2}\s*([\s\S]*)$/i;
  const webMatch = clean.match(webHeaderRegex);
  if (webMatch && webMatch.index !== undefined && !isInsideCodeFence(clean, webMatch.index)) {
    const webBlock = webMatch[1] || "";
    clean = clean.slice(0, webMatch.index).trimEnd();

    // 1. Backend standard format: [1] [Title](url) or [1] Title (url)
    const markdownLinkRegex = /\[(\d+)\]\s*(?:\[(.*?)\]\((https?:\/\/[^\s\)]+)\)|(.*?)\s*[-—:]\s*(https?:\/\/[^\s\)]+)|(https?:\/\/[^\s\)]+))/gi;
    let match: RegExpExecArray | null;
    const parsedIndices = new Set<number>();

    while ((match = markdownLinkRegex.exec(webBlock)) !== null) {
      const idx = parseInt(match[1], 10);
      let title = "";
      let url = "";

      if (match[2] && match[3]) {
        // [1] [Title](url)
        title = match[2].trim();
        url = match[3].trim();
      } else if (match[4] && match[5]) {
        // [1] Title - url
        title = match[4].trim();
        url = match[5].trim();
      } else if (match[6]) {
        // [1] url
        url = match[6].trim();
        title = extractCleanDomain(url);
      }

      if (isValidWebUrl(url) && !parsedIndices.has(idx)) {
        parsedIndices.add(idx);
        webSources.push({
          index: idx,
          title: title || extractCleanDomain(url) || `Source ${idx}`,
          url,
          domain: extractCleanDomain(url),
        });
      }
    }

    // 2. Fallback for text-only citation format: [1] Title [2] Title ... (where URLs are omitted)
    if (webSources.length === 0 && webBlock.trim()) {
      const textCitationRegex = /\[(\d+)\]\s*([^\[\n\r]+)/g;
      let textMatch: RegExpExecArray | null;
      while ((textMatch = textCitationRegex.exec(webBlock)) !== null) {
        const idx = parseInt(textMatch[1], 10);
        const rawTitle = textMatch[2].trim();
        if (rawTitle && !parsedIndices.has(idx)) {
          parsedIndices.add(idx);
          webSources.push({
            index: idx,
            title: rawTitle,
            url: "",
            domain: "",
          });
        }
      }
    }
  }

  // 4. If Suggestions was generated BEFORE Sources / Documents, it will now be at the end
  if (suggestions.length === 0) {
    const sugRes2 = tryExtractTrailingSuggestions(clean);
    if (sugRes2.suggestions.length > 0) {
      clean = sugRes2.remaining;
      suggestions = sugRes2.suggestions;
    }
  }

  // Preserve backend numeric order
  webSources.sort((a, b) => a.index - b.index);

  const sourceIndexSet = new Set(webSources.map((s) => s.index));

  return {
    cleanContent: clean,
    webSources,
    documentSources,
    sourceIndexSet,
    suggestions,
  };
}

/**
 * Strips citation badges/numbers (e.g. [1], [4]) matching parsed web sources from the text,
 * ensuring high readability and clean prose without broken punctuation or spaces,
 * while safely bypassing code fences and inline code blocks.
 */
export function stripCitations(content: string, sourceIndexSet: Set<number>): string {
  if (!content || !sourceIndexSet || sourceIndexSet.size === 0) return content;

  // Split content by code fences (```...```) and inline code spans (`...`)
  const parts = content.split(/(```[\s\S]*?```|`[^`\r\n]+`)/g);
  return parts
    .map((part, index) => {
      // Odd indices are code fences or inline code spans - do NOT touch
      if (index % 2 === 1) return part;

      let cleaned = part;
      // Handle citations preceding punctuation, e.g. "India [1] .", "India [1][2].", "India [1] [2] ."
      cleaned = cleaned.replace(/((?:\s*\[\d+\](?!\())*)\s*\[(\d+)\](?!\()\s*([.,;?!])/g, (match, before, p1, punct) => {
        const n = parseInt(p1, 10);
        if (sourceIndexSet.has(n)) {
          const cleanBefore = before.replace(/\s*\[(\d+)\]/g, (m: string, b1: string) => {
            return sourceIndexSet.has(parseInt(b1, 10)) ? "" : m;
          });
          return cleanBefore + punct;
        }
        return match;
      });

      // Strip any remaining standalone citations like "(NGO founder) [4]" or "[1] [2]"
      cleaned = cleaned.replace(/\s*\[(\d+)\](?!\()/g, (match, p1) => {
        const n = parseInt(p1, 10);
        return sourceIndexSet.has(n) ? "" : match;
      });

      return cleaned;
    })
    .join("");
}

/**
 * Injects internal citation anchor links strictly for numbers matching valid parsed web sources,
 * while safely bypassing code fences and inline code blocks.
 */
export function injectCitationLinks(content: string, sourceIndexSet: Set<number>): string {
  if (!content || !sourceIndexSet || sourceIndexSet.size === 0) return content;

  // Split content by code fences (```...```) and inline code spans (`...`)
  const parts = content.split(/(```[\s\S]*?```|`[^`\r\n]+`)/g);
  return parts
    .map((part, index) => {
      // Odd indices are code fences or inline code spans - do NOT touch
      if (index % 2 === 1) return part;
      // Replace [1] only when NOT followed by '(' and index is in sourceIndexSet
      return part.replace(/\[(\d+)\](?!\()/g, (match, p1) => {
        const n = parseInt(p1, 10);
        return sourceIndexSet.has(n) ? `[${n}](#source-${n})` : match;
      });
    })
    .join("");
}

