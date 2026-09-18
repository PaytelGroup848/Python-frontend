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
 * Pure, deterministic function to parse Web Sources and Document Citations
 * strictly from the backend formats without mutating state or transport.
 */
export function parseSources(content: string): ParsedMessageResult {
  if (!content || typeof content !== "string") {
    return {
      cleanContent: content || "",
      webSources: [],
      documentSources: [],
      sourceIndexSet: new Set<number>(),
    };
  }

  let clean = content;
  const webSources: WebSourceItem[] = [];
  const documentSources: DocumentSourceItem[] = [];

  // Match Document Citations block:
  // e.g. **📌 Documents:** \n `📄 filename.pdf (Page 2)`  `📄 doc2.pdf`
  const docHeaderRegex = /(?:\r?\n){1,2}\*{0,2}📌\s*Documents:?\*{0,2}\s*([\s\S]*)$/i;
  const docMatch = clean.match(docHeaderRegex);
  if (docMatch) {
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

  // Match Web Sources block:
  // e.g. **🌐 Sources:** \n [1] [Title](https://...) \n [2] [Title 2](https://...)
  // or inline: 🌐 Sources: [1] Title ...
  const webHeaderRegex = /(?:\r?\n){1,2}\*{0,2}🌐\s*Sources:?\*{0,2}\s*([\s\S]*)$/i;
  const webMatch = clean.match(webHeaderRegex);
  if (webMatch) {
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

  // Preserve backend numeric order
  webSources.sort((a, b) => a.index - b.index);

  const sourceIndexSet = new Set(webSources.map((s) => s.index));

  return {
    cleanContent: clean,
    webSources,
    documentSources,
    sourceIndexSet,
  };
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
