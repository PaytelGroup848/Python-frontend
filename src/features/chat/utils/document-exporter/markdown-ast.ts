/**
 * Markdown AST Parser
 * Uses the battle-tested `marked` lexer to produce clean AST tokens for Word & PDF builders.
 */

import { marked, type Token, type TokensList } from "marked";

/**
 * Strips internal model reasoning tags and footer suggestions from raw LLM output.
 */
export function cleanMarkdownContent(markdown: string): string {
  if (!markdown) return "";

  // 1. Strip internal reasoning blocks
  let clean = markdown.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();

  // 2. Strip follow-up suggestion blocks commonly appended by models
  clean = clean.replace(/\*\*(?:Suggestions|Suggested Questions):\*\*[\s\S]*$/i, "").trim();

  return clean;
}

/**
 * Converts markdown string into structured typed AST tokens using `marked`.
 */
export function parseMarkdownToAst(markdown: string): TokensList {
  const cleaned = cleanMarkdownContent(markdown);
  return marked.lexer(cleaned, { gfm: true });
}

/**
 * Extracts plain text from an AST token, stripping markdown delimiters.
 */
export function extractPlainTextFromToken(token: Token): string {
  if ("text" in token && typeof token.text === "string") {
    return token.text
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/\*([^*]+)\*/g, "$1")
      .replace(/`([^`]+)`/g, "$1")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
  }
  if ("raw" in token) {
    return token.raw;
  }
  return "";
}
