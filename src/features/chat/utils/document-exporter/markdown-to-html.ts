/**
 * Markdown to HTML Converter for Document Export
 * Lightweight, zero-dependency, robust AST transformer for Word & PDF export.
 */

export function convertMarkdownToHtml(markdown: string): string {
  if (!markdown) return "";

  // 1. Remove reasoning / think blocks (<think>...</think>)
  let clean = markdown.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();

  // 2. Remove suggestion blocks at the end
  clean = clean.replace(/\*\*💡 Suggestions:\*\*[\s\S]*$/i, "").trim();

  const lines = clean.split(/\r?\n/);
  const output: string[] = [];

  let inList = false;
  let listType: "ul" | "ol" | null = null;
  let inCodeBlock = false;
  let codeBuffer: string[] = [];
  let inTable = false;
  let tableBuffer: string[] = [];

  const flushTable = () => {
    if (tableBuffer.length === 0) return;
    let html = "<table>\n";
    let isHeader = true;

    tableBuffer.forEach((line) => {
      const trimmed = line.trim();
      if (/^\|?[\s-:]+\|[\s-:|]+$/.test(trimmed)) {
        // Divider row, skip
        return;
      }
      const cells = trimmed
        .replace(/^\|/, "")
        .replace(/\|$/, "")
        .split("|")
        .map((c) => c.trim());

      html += "  <tr>\n";
      cells.forEach((cell) => {
        const tag = isHeader ? "th" : "td";
        html += `    <${tag}>${formatInlineStyles(cell)}</${tag}>\n`;
      });
      html += "  </tr>\n";
      isHeader = false;
    });

    html += "</table>\n";
    output.push(html);
    tableBuffer = [];
    inTable = false;
  };

  const flushList = () => {
    if (inList && listType) {
      output.push(`</${listType}>`);
      inList = false;
      listType = null;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Code blocks
    if (trimmed.startsWith("```")) {
      if (inCodeBlock) {
        output.push(`<pre><code>${escapeHtml(codeBuffer.join("\n"))}</code></pre>`);
        codeBuffer = [];
        inCodeBlock = false;
      } else {
        flushList();
        flushTable();
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      continue;
    }

    // Tables
    if (trimmed.startsWith("|") || (trimmed.includes("|") && trimmed.endsWith("|"))) {
      flushList();
      inTable = true;
      tableBuffer.push(trimmed);
      continue;
    } else if (inTable) {
      flushTable();
    }

    // Blank line
    if (!trimmed) {
      flushList();
      continue;
    }

    // Headings
    if (trimmed.startsWith("# ")) {
      flushList();
      output.push(`<h1>${formatInlineStyles(trimmed.slice(2))}</h1>`);
      continue;
    }
    if (trimmed.startsWith("## ")) {
      flushList();
      output.push(`<h2>${formatInlineStyles(trimmed.slice(3))}</h2>`);
      continue;
    }
    if (trimmed.startsWith("### ")) {
      flushList();
      output.push(`<h3>${formatInlineStyles(trimmed.slice(4))}</h3>`);
      continue;
    }

    // Bullet list
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      if (!inList || listType !== "ul") {
        flushList();
        inList = true;
        listType = "ul";
        output.push("<ul>");
      }
      output.push(`  <li>${formatInlineStyles(trimmed.slice(2))}</li>`);
      continue;
    }

    // Numbered list
    const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
    if (numMatch) {
      if (!inList || listType !== "ol") {
        flushList();
        inList = true;
        listType = "ol";
        output.push("<ol>");
      }
      output.push(`  <li>${formatInlineStyles(numMatch[2])}</li>`);
      continue;
    }

    // Blockquote
    if (trimmed.startsWith("> ")) {
      flushList();
      output.push(`<blockquote>${formatInlineStyles(trimmed.slice(2))}</blockquote>`);
      continue;
    }

    // Regular paragraph
    flushList();
    output.push(`<p>${formatInlineStyles(trimmed)}</p>`);
  }

  flushList();
  flushTable();

  return output.join("\n");
}

function formatInlineStyles(text: string): string {
  let s = escapeHtml(text);
  // Bold: **text** or __text__
  s = s.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/__(.*?)__/g, "<strong>$1</strong>");
  // Italic: *text* or _text_
  s = s.replace(/\*(.*?)\*/g, "<em>$1</em>");
  s = s.replace(/_(.*?)_/g, "<em>$1</em>");
  // Inline code: `code`
  s = s.replace(/`(.*?)`/g, "<code>$1</code>");
  return s;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
