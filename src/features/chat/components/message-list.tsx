import ReactMarkdown
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

import { Bot, Sparkles } from "lucide-react";

interface MessageListProps {
  messages: ChatMessage[];
}

export function MessageList({
  messages,
}: MessageListProps) {

const isStreaming =
  useChatStore(
    (state) =>
      state.isStreaming
  );

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
            ${
              message.role === "user"
                ? "justify-end"
                : "justify-start"
            }
          `}
        >
          <div
            className={`
              max-w-3xl
              rounded-2xl
              px-5
              py-4
              text-sm
              leading-7
              overflow-x-auto
              ${
                message.role ===
                "user"
                  ? `
                    bg-emerald-600
                    text-white
                    shadow-sm
                    font-medium
                  `
                  : `
                    border
                    border-slate-200/90
                    bg-white
                    text-slate-800
                    shadow-sm
                  `
              }
            `}
          >

<ReactMarkdown

  remarkPlugins={[
    remarkGfm
  ]}

  components={{

    code({
      className,
      children,
    }) {

      const match =
        /language-(\w+)/.exec(
          className || ""
        );

      return match ? (

        <SyntaxHighlighter
          style={oneDark}
          language={match[1]}
          PreTag="div"
        >
          {String(children).replace(
            /\n$/,
            ""
          )}
        </SyntaxHighlighter>

      ) : (

        <code
          className="
            rounded
            bg-zinc-200
            px-1.5
            py-1
            text-sm
            text-zinc-900
            dark:bg-zinc-900
            dark:text-white
          "
        >
          {children}
        </code>
      );
    },
  }}
>

  {message.content}

</ReactMarkdown>

{isStreaming &&
  message.id ===
    messages[
      messages.length - 1
    ]?.id && (

  <span
    className="
      ml-1
      inline-block
      h-4
      w-2
      animate-pulse
      bg-emerald-600
      rounded-xs
    "
  />
)}

          </div>
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
                <span>Searching dataset & generating response...</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                <span>RAG vector retrieval active</span>
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