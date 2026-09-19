import { useState, useMemo, useRef } from "react";
import ReactMarkdown, { type Components }
  from "react-markdown";

import remarkGfm
  from "remark-gfm";

import {
  Prism as SyntaxHighlighter,
} from "react-syntax-highlighter";

import {
  oneDark,
} from "react-syntax-highlighter/dist/esm/styles/prism";

import {
  ChatMessage,
} from "../types/chat.types";

import {
  useChatStore,
} from "../stores/chat-store";

import { Bot, Sparkles, Copy, Check, Code2, Play, FileText, Pencil, Share2, ThumbsUp, ThumbsDown, Globe, ChevronDown } from "lucide-react";
import { ChatImageCard } from "./chat-image-card";
import { parseSources, stripCitations, type WebSourceItem, type DocumentSourceItem } from "../utils/source-parser";
import { SourcesDropdown } from "./sources-dropdown";
import { RecommendedSuggestions } from "./recommended-suggestions";

interface MessageListProps {
  messages: ChatMessage[];
  onRunPreview?: (code: string, language: string) => void;
  onEditMessage?: (messageId: string | number, newContent: string) => void;
  onSuggestionClick?: (text: string) => void;
}

function CodeBlock({
  language,
  code,
  onRunPreview,
}: {
  language: string;
  code: string;
  onRunPreview?: (code: string, language: string) => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-4 overflow-hidden rounded-xl border border-slate-700/80 bg-[#282c34] shadow-md">
      <div className="flex items-center justify-between border-b border-slate-700/60 bg-slate-900/90 px-4 py-2 text-xs font-mono text-slate-300">
        <div className="flex items-center gap-2 font-semibold tracking-wide text-slate-200 uppercase">
          <Code2 size={14} className="text-emerald-400" />
          <span>{language || "code"}</span>
        </div>
        <div className="flex items-center gap-2">
          {onRunPreview && (
            <button
              onClick={() => onRunPreview(code, language)}
              className="flex items-center gap-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 px-2.5 py-1 text-xs font-semibold text-white transition-all shadow-xs active:scale-95 cursor-pointer"
            >
              <Play size={12} className="fill-current" />
              <span>Live Preview</span>
            </button>
          )}

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-md bg-slate-800 hover:bg-slate-700 px-2.5 py-1 text-xs font-medium text-slate-200 transition-all border border-slate-700 hover:border-slate-600 active:scale-95 cursor-pointer"
          >
            {copied ? (
              <>
                <Check size={13} className="text-emerald-400" />
                <span className="text-emerald-400 font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Copy size={13} className="text-slate-400" />
                <span>Copy Code</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="p-1 overflow-x-auto">
        <SyntaxHighlighter
          style={oneDark}
          language={language}
          PreTag="div"
          customStyle={{
            margin: 0,
            padding: "1rem",
            background: "transparent",
            fontSize: "0.875rem",
            lineHeight: "1.6",
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

interface AssistantActionsProps {
  content: string;
  webSources?: WebSourceItem[];
  documentSources?: DocumentSourceItem[];
  isSourcesOpen?: boolean;
  onToggleSources?: () => void;
}

function AssistantActions({
  content,
  webSources = [],
  documentSources = [],
  isSourcesOpen = false,
  onToggleSources,
}: AssistantActionsProps) {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [shared, setShared] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "AI Response",
          text: content,
        });
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      } else {
        await navigator.clipboard.writeText(content);
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      }
    } catch {
      // cancelled or unsupported
    }
  };

  const totalSources = webSources.length + documentSources.length;

  return (
    <div className="mt-2 flex flex-wrap items-center gap-1 text-slate-400">
      <button
        type="button"
        onClick={handleCopy}
        title={copied ? "Copied!" : "Copy response"}
        aria-label="Copy response"
        className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
      >
        {copied ? (
          <Check size={14} className="text-emerald-600" />
        ) : (
          <Copy size={14} />
        )}
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setLiked((prev) => !prev);
          if (!liked) setDisliked(false);
        }}
        title="Good response"
        aria-label="Good response"
        className={`flex h-7 w-7 items-center justify-center rounded-md hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer ${
          liked ? "text-emerald-600" : ""
        }`}
      >
        <ThumbsUp size={14} />
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setDisliked((prev) => !prev);
          if (!disliked) setLiked(false);
        }}
        title="Bad response"
        aria-label="Bad response"
        className={`flex h-7 w-7 items-center justify-center rounded-md hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer ${
          disliked ? "text-rose-600" : ""
        }`}
      >
        <ThumbsDown size={14} />
      </button>

      <button
        type="button"
        onClick={handleShare}
        title={shared ? "Shared!" : "Share response"}
        aria-label="Share response"
        className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
      >
        {shared ? (
          <Check size={14} className="text-emerald-600" />
        ) : (
          <Share2 size={14} />
        )}
      </button>

      {/* SOURCES BUTTON NEXT TO SHARE */}
      {totalSources > 0 && onToggleSources && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleSources();
          }}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition-all cursor-pointer ml-1.5 ${
            isSourcesOpen
              ? "bg-emerald-50 border-emerald-300 text-emerald-700 shadow-2xs"
              : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-900"
          }`}
          title={isSourcesOpen ? "Hide sources" : "View sources"}
          aria-expanded={isSourcesOpen}
        >
          <Globe size={13} className="text-emerald-600 shrink-0" />
          <span className="font-semibold text-slate-800">Sources</span>
          <span className="rounded-full bg-emerald-100/90 border border-emerald-200/80 px-1.5 py-0.2 text-[10px] font-bold text-emerald-800">
            {totalSources}
          </span>
          <ChevronDown
            size={12}
            className={`transition-transform duration-200 text-slate-500 ${
              isSourcesOpen ? "rotate-180 text-emerald-600" : ""
            }`}
          />
        </button>
      )}
    </div>
  );
}

interface AssistantMessageItemProps {
  message: ChatMessage;
  isStreaming: boolean;
  isLastMessage: boolean;
  onRunPreview?: (code: string, language: string) => void;
  onSuggestionClick?: (text: string) => void;
}

function AssistantMessageItem({
  message,
  isStreaming,
  isLastMessage,
  onRunPreview,
  onSuggestionClick,
}: AssistantMessageItemProps) {
  const [isSourcesOpen, setIsSourcesOpen] = useState(false);
  const { cleanContent, webSources, documentSources, sourceIndexSet, suggestions } = useMemo(
    () => parseSources(message.content),
    [message.content]
  );

  const displayContent = useMemo(
    () => stripCitations(cleanContent, sourceIndexSet),
    [cleanContent, sourceIndexSet]
  );

  const markdownComponents: Components = useMemo(
    () => ({
      p({ children }) {
        return <div className="mb-3 leading-relaxed last:mb-0">{children}</div>;
      },
      code({ className, children }) {
        const match = /language-(\w+)/.exec(className || "");
        const codeString = String(children).replace(/\n$/, "");

        return match ? (
          <CodeBlock language={match[1]} code={codeString} onRunPreview={onRunPreview} />
        ) : (
          <code className="rounded bg-zinc-200 px-1.5 py-1 text-sm text-zinc-900 dark:bg-zinc-900 dark:text-white">
            {children}
          </code>
        );
      },
      img({ src, alt }) {
        if (!src) return null;
        return <ChatImageCard src={String(src)} alt={typeof alt === "string" ? alt : "Generated Image"} />;
      },
      a({ href, children }) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-600 hover:underline font-medium"
          >
            {children}
          </a>
        );
      },
    }),
    [onRunPreview]
  );

  return (
    <div className="flex flex-col items-start w-full max-w-3xl">
      <div className="w-full text-[15px] leading-7 overflow-x-auto text-slate-800 bg-transparent py-1">
        {/* LOVABLE AI RESPONSE EXTENSIONS */}
        {message.role === "assistant" && message.content.includes("```") && (
          <div className="mb-3 flex flex-col gap-2.5">
            {/* THOUGHT DURATION BADGE */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono font-medium">
              <Sparkles size={12} className="text-emerald-600" />
              <span>Thought for 2s</span>
            </div>

            {/* ACTION SUMMARY CARD */}
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/80 p-3 shadow-2xs">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-semibold text-slate-800">
                  Generated Code Component
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const codeMatch = message.content.match(/```(?:\w+)?\n([\s\S]*?)```/);
                    if (codeMatch && onRunPreview) {
                      onRunPreview(codeMatch[1], "html");
                    }
                  }}
                  className="rounded-lg bg-white px-3 py-1 text-xs font-semibold text-emerald-700 border border-slate-200 shadow-2xs hover:bg-emerald-50 transition-all cursor-pointer"
                >
                  Preview
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CLEAN CONTENT MARKDOWN */}
        <div className={isStreaming && isLastMessage ? "streaming-cursor" : ""}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={markdownComponents}
          >
            {displayContent}
          </ReactMarkdown>
        </div>

        {/* SUGGESTION CHIPS (Fallback: only if code present and dynamic suggestions absent) */}
        {message.role === "assistant" && message.content.includes("```") && suggestions.length === 0 && (
          <div className="mt-4 flex flex-wrap gap-2 pt-2 border-t border-slate-100">
            {["Add input validation", "Support custom ranges", "Create history log", "Enable shareable results"].map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => {
                  if (onSuggestionClick) {
                    onSuggestionClick(chip);
                  } else {
                    const inputEl = document.querySelector('textarea, input[type="text"]') as HTMLTextAreaElement | HTMLInputElement;
                    if (inputEl) {
                      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value")?.set;
                      if (nativeInputValueSetter) {
                        nativeInputValueSetter.call(inputEl, chip);
                      } else {
                        inputEl.value = chip;
                      }
                      inputEl.dispatchEvent(new Event("input", { bubbles: true }));
                      inputEl.focus();
                    }
                  }
                }}
                className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-700 border border-slate-200/80 hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-800 transition-all cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 1. ASSISTANT ACTION BAR: DIRECTLY UNDER RESPONSE TEXT WITH SOURCES NEXT TO SHARE */}
      {!isStreaming && (
        <AssistantActions
          content={cleanContent}
          webSources={webSources}
          documentSources={documentSources}
          isSourcesOpen={isSourcesOpen}
          onToggleSources={() => setIsSourcesOpen((prev) => !prev)}
        />
      )}

      {/* 2. EXPANDED SOURCES LIST (Shown when user clicks Sources button next to Share) */}
      {(webSources.length > 0 || documentSources.length > 0) && (
        <SourcesDropdown
          sources={webSources}
          documentSources={documentSources}
          isOpen={isSourcesOpen}
          hideHeader={true}
        />
      )}

      {/* 3. RECOMMENDED FOLLOW-UP SUGGESTIONS (PERPLEXITY STYLE) */}
      {!isStreaming && isLastMessage && suggestions.length > 0 && (
        <RecommendedSuggestions
          suggestions={suggestions}
          onSelect={(prompt) => {
            if (onSuggestionClick) {
              onSuggestionClick(prompt);
            }
          }}
          disabled={isStreaming}
        />
      )}
    </div>
  );
}

export function MessageList({
  messages,
  onRunPreview,
  onEditMessage,
  onSuggestionClick,
}: MessageListProps) {
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [editContent, setEditContent] = useState("");
  const [copiedId, setCopiedId] = useState<string | number | null>(null);
  const [sharedId, setSharedId] = useState<string | number | null>(null);

  const isStreaming =
    useChatStore(
      (state) =>
        state.isStreaming
    );

  const startEditing = (message: ChatMessage) => {
    setEditingId(message.id);
    setEditContent(message.content);
  };

  const handleCopy = (id: string | number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleShare = async (id: string | number, text: string) => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "AI Prompt",
          text: text,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }
    navigator.clipboard.writeText(text);
    setSharedId(id);
    setTimeout(() => setSharedId(null), 2000);
  };

  const showThinking = isStreaming && (
    messages.length === 0 ||
    messages[messages.length - 1]?.role === "user" ||
    !messages[messages.length - 1]?.content
  );

  return (
    <div className="space-y-6">

      {messages.map((message) => (

        <div
          key={message.id}
          className={`
            flex
            ${message.role === "user"
              ? "justify-end"
              : "justify-start"
            }
          `}
        >
          {message.role === "user" ? (
            editingId === message.id ? (
              /* INLINE EDIT MODE (CHATGPT STYLE) */
              <div className="w-full max-w-2xl rounded-2xl border border-emerald-300 bg-white p-3.5 shadow-md transition-all">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      if (editContent.trim()) {
                        onEditMessage?.(message.id, editContent.trim());
                        setEditingId(null);
                      }
                    } else if (e.key === "Escape") {
                      setEditingId(null);
                    }
                  }}
                  rows={Math.max(2, editContent.split("\n").length)}
                  className="w-full resize-none border-none bg-transparent p-1 text-sm text-slate-800 focus:outline-none"
                  autoFocus
                />
                <div className="mt-2.5 flex items-center justify-end gap-2 border-t border-slate-100 pt-2">
                  <button
                    onClick={() => setEditingId(null)}
                    className="rounded-full px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (editContent.trim()) {
                        onEditMessage?.(message.id, editContent.trim());
                        setEditingId(null);
                      }
                    }}
                    disabled={!editContent.trim()}
                    className="flex items-center gap-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1 text-xs font-semibold shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    <span>Save &amp; Submit</span>
                  </button>
                </div>
              </div>
            ) : (
              /* USER MESSAGE BUBBLE + ACTIONS */
              <div className="group flex flex-col items-end max-w-3xl">
                <div className="rounded-2xl px-5 py-4 text-sm leading-7 overflow-x-auto bg-emerald-600 text-white shadow-sm font-medium">
                  {/* ATTACHMENTS (CHATGPT / GEMINI STYLE) */}
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mb-2.5 flex flex-wrap gap-2">
                      {message.attachments.map((att, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 rounded-xl bg-emerald-700/80 border border-emerald-400/40 px-3 py-1.5 text-xs text-white shadow-xs backdrop-blur-xs font-normal"
                        >
                          <FileText className="h-4 w-4 text-emerald-200 shrink-0" />
                          <span className="truncate max-w-[260px] font-medium">{att.filename}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="whitespace-pre-wrap">{message.content}</div>
                </div>

                {/* USER ACTION BAR: COPY, EDIT, SHARE */}
                <div className="mt-1 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 px-1">
                  <button
                    onClick={() => handleCopy(message.id, message.content)}
                    title={copiedId === message.id ? "Copied!" : "Copy prompt"}
                    aria-label="Copy prompt"
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
                  >
                    {copiedId === message.id ? (
                      <Check size={13} className="text-emerald-600" />
                    ) : (
                      <Copy size={13} />
                    )}
                  </button>

                  <button
                    onClick={() => startEditing(message)}
                    title="Edit prompt"
                    aria-label="Edit prompt"
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
                  >
                    <Pencil size={13} />
                  </button>

                  <button
                    onClick={() => handleShare(message.id, message.content)}
                    title={sharedId === message.id ? "Shared!" : "Share prompt"}
                    aria-label="Share prompt"
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
                  >
                    {sharedId === message.id ? (
                      <Check size={13} className="text-emerald-600" />
                    ) : (
                      <Share2 size={13} />
                    )}
                  </button>
                </div>
              </div>
            )
          ) : (
            /* ASSISTANT MESSAGE (CHATGPT-STYLE PLANE / FLAT) */
            <AssistantMessageItem
              message={message}
              isStreaming={isStreaming}
              isLastMessage={message.id === messages[messages.length - 1]?.id}
              onRunPreview={onRunPreview}
              onSuggestionClick={onSuggestionClick}
            />
          )}
        </div>
      ))}


      {showThinking && (
        <div className="flex justify-start">
          <div className="flex items-center gap-3.5 rounded-2xl border border-emerald-200 bg-white/95 px-5 py-3.5 shadow-sm backdrop-blur-md">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm shadow-emerald-600/30">
              <Bot size={18} className="animate-pulse" />
            </div>
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <Sparkles size={13} className="text-emerald-600 animate-spin" />
                <span>Generating response...</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                <span>Patwatoli AI is  active</span>
                <span className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-500 [animation-delay:-0.3s]"></span>
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-500 [animation-delay:-0.15s]"></span>
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-500"></span>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
