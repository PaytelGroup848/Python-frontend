/**
 * Markdown & Plain Text Exporter
 * Exports sanitized, clean Markdown (.md) or Plain Text (.txt) files.
 */

export function exportAsMarkdown(markdown: string, filename = "document"): void {
  const safeFilename = `${filename.replace(/[^a-zA-Z0-9_-]/g, "_")}.md`;
  // Clean thinking tags and suggestions if needed
  const clean = markdown.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();

  const blob = new Blob([clean], { type: "text/markdown;charset=utf-8;" });
  triggerDownload(blob, safeFilename);
}

export function exportAsPlainText(markdown: string, filename = "document"): void {
  const safeFilename = `${filename.replace(/[^a-zA-Z0-9_-]/g, "_")}.txt`;

  // Convert markdown to readable plain text
  let plain = markdown
    .replace(/<think>[\s\S]*?<\/think>/gi, "")
    .replace(/```[\s\S]*?```/g, (match) => {
      // Strip ```lang and ```
      return match.replace(/```\w*\n?/, "").replace(/```$/, "");
    })
    .replace(/^#+\s+/gm, "") // Strip headers #, ##
    .replace(/\*\*(.*?)\*\*/g, "$1") // Strip bold
    .replace(/\*(.*?)\*/g, "$1") // Strip italic
    .replace(/`([^`]+)`/g, "$1") // Strip inline code
    .replace(/^\s*[-*+]\s+/gm, "• ") // Format bullets
    .trim();

  const blob = new Blob([plain], { type: "text/plain;charset=utf-8;" });
  triggerDownload(blob, safeFilename);
}

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
