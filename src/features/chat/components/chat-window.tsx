
"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { v4 as uuid }
  from "uuid";

import { Sparkles, Image as ImageIcon, PenLine, Globe, Code2 } from "lucide-react";

import { MessageList } from "./message-list";
import { MessageInput } from "./message-input";
import { CodePreviewPanel } from "./code-preview-panel";
import { SourcesRail } from "./sources-rail";
import { useChatStore } from "../stores/chat-store";
import { useSpeechStore } from "../stores/speech-store";
import { socketClient, type SocketPayload } from "@/services/websocket/socket-client";
import { useAuthStore } from "@/stores/auth-store";
import { useConversationStore } from "../stores/conversation-store";
import {
  createConversation,
  getConversations,
  updateConversationTitle,
} from "../services/conversation-service";

import { useAssistants } from "@/features/playground/hooks/use-assistants";
import { UpgradePlanModal } from "@/features/billing/components/upgrade-plan-modal";
import { AuthModal } from "@/components/auth/auth-modal";

export function ChatWindow() {

  const [previewData, setPreviewData] = useState<{
    code: string;
    language: string;
  } | null>(null);
  const [isClosedByUser, setIsClosedByUser] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalReason, setAuthModalReason] = useState<"credits_limit" | "session_expired" | "auth_required">("credits_limit");
  const [guestCreditsRemaining, setGuestCreditsRemaining] = useState<number | null>(null);

  const { data: assistants = [] } = useAssistants();

  const user = useAuthStore((state) => state.user);
  const isGuest = user?.role === "guest";

  const messages =
    useChatStore(
      (state) => state.messages
    );


  const addMessage =
    useChatStore(
      (state) => state.addMessage
    );

  const updateLastMessage =
    useChatStore(
      (state) =>
        state.updateLastMessage
    );

  const updateLastMessageSources =
    useChatStore(
      (state) =>
        state.updateLastMessageSources
    );

  const isSourcesRailOpen = useChatStore((state) => state.isSourcesRailOpen);
  const railSources = useChatStore((state) => state.railSources);
  const highlightedSourceIndex = useChatStore((state) => state.highlightedSourceIndex);
  const closeSourcesRail = useChatStore((state) => state.closeSourcesRail);

  const setStreaming =
  useChatStore(
    (state) =>
      state.setStreaming
  );

  const isStreaming =
  useChatStore(
    (state) =>
      state.isStreaming
  );

  const accessToken =
  useAuthStore(
    (state) =>
      state.accessToken
  );

  const activeConversationId =
  useConversationStore(
    (state) =>
      state.activeConversationId
  );

  const activeAssistantId =
    useConversationStore(
      (state) =>
        state.activeAssistantId
    );

  const activeAssistant = assistants.find((a) => a.id === activeAssistantId);
  const isCodeAssistant = activeAssistant
    ? (activeAssistant.code === "code" || activeAssistant.code?.includes("code") || activeAssistant.name?.toLowerCase().includes("code"))
    : true;

  const clearMessages = useChatStore((state) => state.clearMessages);

  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isNearBottomRef = useRef(true);
  const prevMessagesLengthRef = useRef(messages.length);
  const prevConversationIdRef = useRef<number | string | null>(activeConversationId);
  const isManuallyStoppedRef = useRef(false);
  const streamingConversationIdRef = useRef<number | string | null>(null);
  const activeRequestIdRef = useRef<string | null>(null);
  const thinkStartTimeRef = useRef<number | null>(null);
  const thinkDurationRef = useRef<number | null>(null);
  const pendingChunkRef = useRef("");
  const pendingDurationRef = useRef<number | undefined>(undefined);
  const rafFlushRef = useRef<number | null>(null);
  const [prefillState, setPrefillState] = useState<{ text: string; webSearch?: boolean }>({ text: "" });

  const flushPendingChunks = useCallback(() => {
    if (rafFlushRef.current !== null) {
      cancelAnimationFrame(rafFlushRef.current);
      rafFlushRef.current = null;
    }
    const buffered = pendingChunkRef.current;
    const duration = pendingDurationRef.current;
    if (!buffered && duration === undefined) return;
    pendingChunkRef.current = "";
    pendingDurationRef.current = undefined;

    const currentMessages = useChatStore.getState().messages;
    const lastMsg = currentMessages[currentMessages.length - 1];
    if (lastMsg && lastMsg.role === "assistant") {
      updateLastMessage(buffered, duration !== undefined ? { reasoningDuration: duration } : undefined);
    } else {
      addMessage({
        id: uuid(),
        role: "assistant",
        content: buffered,
        reasoningDuration: duration,
      });
    }
  }, [addMessage, updateLastMessage]);

  const handleScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const distanceToBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    isNearBottomRef.current = distanceToBottom <= 160;
  }, []);

  useEffect(() => {
    clearMessages();
    useSpeechStore.getState().stop();
  }, [activeAssistantId, clearMessages]);

  useEffect(() => {
    if (activeAssistant && !isCodeAssistant) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPreviewData(null);
      setIsClosedByUser(false);
    }
  }, [activeAssistantId, activeAssistant, isCodeAssistant]);

  useEffect(() => {
    // Authoritative check: cancel active generation if user navigates away from the streaming conversation
    // 1) Switched from one conversation to another (e.g. idA -> idB)
    // 2) Switched from active conversation to null / New Chat (e.g. idA -> null)
    const isColdStart = prevConversationIdRef.current === null && activeConversationId !== null;
    const hasNavigatedAway =
      streamingConversationIdRef.current !== null &&
      !isColdStart &&
      (
        (activeConversationId !== null && String(streamingConversationIdRef.current) !== String(activeConversationId)) ||
        (activeConversationId === null && prevConversationIdRef.current !== null)
      );

    if (isStreaming && hasNavigatedAway) {
      isManuallyStoppedRef.current = true;
      setStreaming(false);
      const targetToStop = streamingConversationIdRef.current;
      streamingConversationIdRef.current = null;
      activeRequestIdRef.current = null;
      try {
        socketClient.send({
          type: "stop",
          conversation_id: targetToStop,
        });
      } catch (e) {
        console.warn("Failed to send stop signal on conversation change:", e);
      }
    }

    prevConversationIdRef.current = activeConversationId;

    if (!activeConversationId) {
      clearMessages();
    }
  }, [activeConversationId, clearMessages, isStreaming, setStreaming]);

  const handleSocketMessage = useCallback((data: SocketPayload) => {
    // Immediate shield: If user manually stopped the generation, drop all incoming packets!
    if (isManuallyStoppedRef.current) {
      return;
    }

    const currentActiveConvId = useConversationStore.getState().activeConversationId;

    // 1. Guard: Validate conversation identity if provided
    if (data.conversation_id && currentActiveConvId && String(data.conversation_id) !== String(currentActiveConvId)) {
      return;
    }

    // 2. Lock request_id on queued or start packet
    if (data.type === "queued" && data.request_id) {
      activeRequestIdRef.current = data.request_id;
      return;
    }

    if (data.type === "start") {
      if (data.request_id) {
        activeRequestIdRef.current = data.request_id;
      }
      setStreaming(true);
      thinkStartTimeRef.current = null;
      thinkDurationRef.current = null;
      const currentMessages = useChatStore.getState().messages;
      const lastMsg = currentMessages[currentMessages.length - 1];
      if (!lastMsg || lastMsg.role !== "assistant") {
        addMessage({
          id: uuid(),
          role: "assistant",
          content: "",
        });
      }
      return;
    }

    // 3. Stale packet defense: If request_id exists and doesn't match current active generation, discard
    if (data.request_id && activeRequestIdRef.current && data.request_id !== activeRequestIdRef.current) {
      return;
    }

    // 4. Handle Structured Web Sources & Images
    if (data.type === "sources") {
      if (data.request_id && !activeRequestIdRef.current) {
        activeRequestIdRef.current = data.request_id;
      }
      updateLastMessageSources(data.sources || [], data.images || []);
      return;
    }

    // 4.1 Handle Content Chunks
    if (data.type === "chunk") {
      // Lock request ID if start packet was missed/bypassed
      if (data.request_id && !activeRequestIdRef.current) {
        activeRequestIdRef.current = data.request_id;
      }
      // Valid chunks belonging to active generation sustain isStreaming
      if (!useChatStore.getState().isStreaming) {
        setStreaming(true);
      }
      const text = data.content || data.response || "";
      if (!text) return;
      const currentMessages = useChatStore.getState().messages;
      const lastMsg = currentMessages[currentMessages.length - 1];

      // Track live reasoning / think timing
      pendingChunkRef.current += text;
      const fullText = (lastMsg?.content || "") + pendingChunkRef.current;
      const lowerFull = fullText.toLowerCase();

      if (thinkStartTimeRef.current === null && (lowerFull.includes("<think>") || lowerFull.includes("<thought>"))) {
        thinkStartTimeRef.current = Date.now();
      }

      if (
        thinkStartTimeRef.current !== null &&
        thinkDurationRef.current === null &&
        (lowerFull.includes("</think>") || lowerFull.includes("</thought>"))
      ) {
        const duration = Number(((Date.now() - thinkStartTimeRef.current) / 1000).toFixed(1));
        thinkDurationRef.current = duration;
        pendingDurationRef.current = duration;
      }

      if (rafFlushRef.current === null) {
        rafFlushRef.current = requestAnimationFrame(flushPendingChunks);
      }
      return;
    }

    // 5. Handle Complete Message (Fallback)
    if (data.type === "message") {
      flushPendingChunks();
      const text = data.content || data.response || "";
      const currentMessages = useChatStore.getState().messages;
      const lastMsg = currentMessages[currentMessages.length - 1];

      if (lastMsg && lastMsg.role === "assistant") {
        if (!lastMsg.content && text) {
          updateLastMessage(text);
        }
      } else if (text) {
        addMessage({
          id: uuid(),
          role: "assistant",
          content: text,
        });
      }

      setStreaming(false);
      streamingConversationIdRef.current = null;
      activeRequestIdRef.current = null;
      return;
    }

    // 6. Handle Stopped
    if (data.type === "stopped") {
      flushPendingChunks();
      setStreaming(false);
      streamingConversationIdRef.current = null;
      activeRequestIdRef.current = null;
      return;
    }

    // 6.1 Handle Credits Update (for Guest users)
    if (data.type === "credits_update") {
      const raw = data as unknown as { credits_remaining?: number; remaining?: number };
      const count = typeof raw.credits_remaining === "number" ? raw.credits_remaining : raw.remaining;
      if (typeof count === "number") {
        setGuestCreditsRemaining(count);
      }
      return;
    }

    // 7. Handle Error
    if (data.type === "error") {
      setStreaming(false);
      streamingConversationIdRef.current = null;
      activeRequestIdRef.current = null;
      const errorCode = (data as { code?: string }).code;
      const errorMsg = (data as { message?: string }).message || "Generation error occurred.";

      // Guest Credit Limit Reached -> Open AuthModal with "Your Free Credits Limit is Reached"
      if (errorCode === "CREDITS_LIMIT_REACHED" || errorMsg.toLowerCase().includes("free credits limit")) {
        setGuestCreditsRemaining(0);
        setAuthModalReason("credits_limit");
        setIsAuthModalOpen(true);
        return;
      }

      // Guest Session Expired -> Prompt user to re-initialize or log in
      if (errorCode === "GUEST_SESSION_EXPIRED" || errorMsg.toLowerCase().includes("session expired")) {
        setAuthModalReason("session_expired");
        setIsAuthModalOpen(true);
        return;
      }

      const isPlanLimit =
        errorMsg.toLowerCase().includes("plan limit") ||
        errorMsg.toLowerCase().includes("plan_limit_exceeded") ||
        errorMsg.toLowerCase().includes("usage limit");

      if (isPlanLimit) {
        setIsUpgradeModalOpen(true);
      }

      const displayContent = isPlanLimit
        ? `⚠️ **Plan Usage Limit Reached**: You have exhausted the monthly token limit for your active tier. Upgrade to Pro to continue enjoying frontier models.`
        : `⚠️ ${errorMsg}`;

      const currentMessages = useChatStore.getState().messages;
      const lastMsg = currentMessages[currentMessages.length - 1];
      if (lastMsg && lastMsg.role === "assistant" && !lastMsg.content) {
        updateLastMessage(displayContent);
      } else {
        addMessage({
          id: uuid(),
          role: "assistant",
          content: displayContent,
        });
      }
      return;
    }

    // 8. Handle Done
    if (data.type === "done") {
      flushPendingChunks();
      setStreaming(false);
      streamingConversationIdRef.current = null;
      activeRequestIdRef.current = null;
      const text = data.content || data.response || "";
      const currentMessages = useChatStore.getState().messages;
      const lastMsg = currentMessages[currentMessages.length - 1];
      if (lastMsg && lastMsg.role === "assistant" && !lastMsg.content && text) {
        updateLastMessage(text);
      }
      return;
    }
  }, [addMessage, flushPendingChunks, setStreaming, updateLastMessage, updateLastMessageSources]);

  const handleStop = () => {
    useSpeechStore.getState().stop();
    isManuallyStoppedRef.current = true;
    setStreaming(false);
    const conversationId = streamingConversationIdRef.current || useConversationStore.getState().activeConversationId;
    streamingConversationIdRef.current = null;
    activeRequestIdRef.current = null;
    try {
      socketClient.send({
        type: "stop",
        conversation_id: conversationId,
      });
    } catch (err) {
      console.warn("Failed to send stop signal over websocket:", err);
    }
  };

  useEffect(() => {
    if (!accessToken) {
      return;
    }

    const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000"}/ws/chat?token=${accessToken}`;
    socketClient.connect(wsUrl, handleSocketMessage);

    return () => {
      socketClient.disconnect();
    };
  }, [accessToken, handleSocketMessage]);

  useEffect(() => {
    if (!isCodeAssistant) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (previewData) setPreviewData(null);
      return;
    }

    // Auto-detect generated code block for Lovable Live Canvas auto-open
    const lastAssistantMessageWithCode = [...messages]
      .reverse()
      .find((m) => m.role === "assistant" && m.content.includes("```"));

    if (lastAssistantMessageWithCode && !previewData && !isClosedByUser) {
      const codeMatch = lastAssistantMessageWithCode.content.match(/```(?:\w+)?\n([\s\S]*?)```/);
      if (codeMatch) {
        setPreviewData({ code: codeMatch[1], language: "html" });
      }
    }
  }, [messages, previewData, isClosedByUser, isCodeAssistant]);


  useEffect(() => {
    const isConvChange = activeConversationId !== prevConversationIdRef.current;
    prevConversationIdRef.current = activeConversationId;

    const isNewMessage = messages.length > prevMessagesLengthRef.current;
    prevMessagesLengthRef.current = messages.length;

    // If conversation changed or a new message was added, always scroll to bottom
    if (isConvChange || isNewMessage) {
      isNearBottomRef.current = true;
      requestAnimationFrame(() => {
        bottomRef.current?.scrollIntoView({
          behavior: isStreaming ? "auto" : "smooth",
        });
      });
      return;
    }

    // During streaming token chunks: ONLY auto-scroll if user is already near bottom!
    // If user intentionally scrolled up to read history, DO NOT forcibly pull them down.
    if (isStreaming) {
      if (isNearBottomRef.current) {
        bottomRef.current?.scrollIntoView({
          behavior: "auto",
        });
      }
    } else {
      // When streaming finishes, smooth scroll only if user was near bottom
      if (isNearBottomRef.current) {
        bottomRef.current?.scrollIntoView({
          behavior: "smooth",
        });
      }
    }
  }, [messages, isStreaming, activeConversationId]);

  // Split-screen Live Canvas mount auto-scroll: Keep chat pinned to bottom when preview mounts
  useEffect(() => {
    if (previewData) {
      requestAnimationFrame(() => {
        bottomRef.current?.scrollIntoView({ behavior: "auto" });
      });
    }
  }, [previewData]);

  async function handleSend(
    content: string,
    attachedDocs?: Array<{ filename: string; status?: string }>,
    aspectRatio?: string,
    webSearch?: boolean,
    think?: boolean
  ) {
    const finalContent = content.trim() || (attachedDocs && attachedDocs.length > 0 ? "Please review and summarize the attached document." : "");

    if (
      !finalContent ||
      isStreaming
    ) {
      return;
    }

    if (isGuest && guestCreditsRemaining === 0) {
      setAuthModalReason("credits_limit");
      setIsAuthModalOpen(true);
      return;
    }

    isManuallyStoppedRef.current = false;

    let conversationId = useConversationStore.getState().activeConversationId;

    // Auto create conversation on demand if currently in lazy draft mode (activeConversationId === null)
    if (!conversationId) {
      try {
        let initialTitle = finalContent.replace(/^['"`\s]+|['"`\s]+$/g, "").replace(/\n+/g, " ").trim();
        if (initialTitle.length > 36) {
          const slice = initialTitle.slice(0, 36);
          const lastSpace = slice.lastIndexOf(" ");
          initialTitle = (lastSpace > 16 ? slice.slice(0, lastSpace) : slice) + "...";
        }
        initialTitle = initialTitle ? initialTitle.charAt(0).toUpperCase() + initialTitle.slice(1) : "New Conversation";

        const newConversation = await createConversation(activeAssistantId, initialTitle);
        conversationId = newConversation.id;
        useConversationStore.getState().setActiveConversation(conversationId);

        try {
          const updatedConversations = await getConversations(activeAssistantId);
          useConversationStore.getState().setConversations(updatedConversations);
        } catch {
          const currentList = useConversationStore.getState().conversations;
          useConversationStore.getState().setConversations([newConversation, ...currentList]);
        }
      } catch (err) {
        console.error("Failed to auto-create conversation", err);
      }
    }

    if (!conversationId) {
      console.warn("Could not obtain active conversation ID");
      return;
    }

    const shouldGenerateTitle = messages.length === 0;

    // Atomic race-free ordering: Lock streaming conversation ID ref BEFORE triggering streaming state
    streamingConversationIdRef.current = conversationId;
    activeRequestIdRef.current = null;
    setStreaming(true);

    addMessage({
      id: uuid(),
      role: "user",
      content: finalContent,
      attachments: attachedDocs && attachedDocs.length > 0
        ? attachedDocs.map((d) => ({ filename: d.filename, status: d.status }))
        : undefined,
      aspectRatio,
      webSearch,
      think,
    });

    if (shouldGenerateTitle && conversationId) {
      let generatedTitle = finalContent.replace(/^['"`\s]+|['"`\s]+$/g, "").replace(/\n+/g, " ").trim();
      if (generatedTitle.length > 36) {
        const slice = generatedTitle.slice(0, 36);
        const lastSpace = slice.lastIndexOf(" ");
        generatedTitle = (lastSpace > 16 ? slice.slice(0, lastSpace) : slice) + "...";
      }
      generatedTitle = generatedTitle ? generatedTitle.charAt(0).toUpperCase() + generatedTitle.slice(1) : "New Conversation";

      useConversationStore.getState().updateTitle(conversationId, generatedTitle);
      updateConversationTitle(conversationId, generatedTitle).catch(console.error);
    }

    if (!accessToken) {
      console.warn("Missing accessToken for chat");
      return;
    }

    // Ensure socket connection is active
    const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000"}/ws/chat?token=${accessToken}`;
    socketClient.connect(wsUrl, handleSocketMessage);

    // Send payload
    socketClient.send({
      conversation_id: conversationId,
      assistant_id: activeAssistantId,
      message: finalContent,
      documents: attachedDocs && attachedDocs.length > 0
        ? attachedDocs.map((d) => d.filename)
        : undefined,
      aspect_ratio: aspectRatio || "1024x1024",
      web_search: !!webSearch,
      think: !!think,
    });
  }

  const handleEditMessage = (messageId: string | number, newContent: string) => {
    if (isStreaming) return;
    const messageIndex = messages.findIndex((m) => m.id === messageId);
    if (messageIndex === -1) return;

    const targetMessage = messages[messageIndex];
    const preservedMessages = messages.slice(0, messageIndex);
    useChatStore.getState().setMessages(preservedMessages);

    handleSend(
      newContent,
      targetMessage.attachments,
      targetMessage.aspectRatio,
      targetMessage.webSearch,
      targetMessage.think
    );
  };

  const displayedMessages = messages;
  const isEmpty = messages.length === 0;

  function getGreeting() {
  const istHour = Number(
    new Date().toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      hour12: false,
    })
  );

  if (istHour < 12) return "Good morning";
  if (istHour < 17) return "Good afternoon";
  return "Good evening";
}

  const displayName = getGreeting();

  const quickSuggestions = [
    {
      icon: ImageIcon,
      label: "Create an image or sticker",
      prompt: "Create a detailed image of ",
      webSearch: false,
    },
    {
      icon: PenLine,
      label: "Write or edit",
      prompt: "Help me write ",
      webSearch: false,
    },
    {
      icon: Globe,
      label: "Search the web",
      prompt: "Search the web for ",
      webSearch: true,
    },
    {
      icon: Code2,
      label: "Code or debug",
      prompt: "Write a complete web app for ",
      webSearch: false,
    },
  ];

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Patwatoli AI Emerald Green Wave Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden bg-white dark:bg-slate-900 pointer-events-none transition-colors duration-200">
        <div className="absolute -top-32 left-1/2 h-130 w-275 -translate-x-1/2 rounded-full bg-emerald-200/40 dark:bg-emerald-500/10 blur-[120px]" />
        <div className="absolute top-1/4 -left-40 h-105 w-180 rounded-full bg-teal-200/30 dark:bg-teal-500/8 blur-[130px]" />
        <div className="absolute -bottom-40 -left-20 h-130 w-205 rounded-full bg-emerald-300/30 dark:bg-emerald-500/8 blur-[120px]" />
        <div className="absolute -bottom-55 -right-25 h-140 w-215 rounded-full bg-teal-100/50 dark:bg-teal-500/8 blur-[120px]" />
      </div>

      {isEmpty ? (
        // ---------- Landing / hero state (ChatGPT Style) ----------
        <div className="relative z-10 flex min-h-full w-full flex-col items-center justify-center gap-6 px-4 sm:px-6 py-8 my-auto overflow-y-auto">
          <div className="flex items-center gap-2 rounded-full bg-emerald-50 dark:bg-emerald-950/60 px-4 py-1.5 border border-emerald-200 dark:border-emerald-800/80 text-xs font-semibold text-emerald-700 dark:text-emerald-300 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            <span>Patwatoli AI Workspace</span>
          </div>

          <h1 className="max-w-2xl text-center text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
             {displayName}, <span className="text-emerald-600">What&apos;s the vision?</span>
          </h1>

          <div className="w-full max-w-2xl px-1 sm:px-0">
            {isGuest && guestCreditsRemaining === 0 && (
              <div className="flex items-center justify-between gap-3 rounded-xl border border-emerald-500/25 dark:border-emerald-500/30 bg-emerald-500/10 dark:bg-emerald-950/40 px-4 py-2.5 text-xs text-slate-800 dark:text-slate-200 mb-3 shadow-xs backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <Sparkles size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0 animate-pulse" />
                  <span><strong className="font-semibold text-slate-900 dark:text-white">Free credits limit reached:</strong> Sign in or create an account to keep chatting.</span>
                </div>
                <button
                  onClick={() => {
                    setAuthModalReason("credits_limit");
                    setIsAuthModalOpen(true);
                  }}
                  className="shrink-0 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-all shadow-xs active:scale-95 cursor-pointer"
                >
                  Sign In / Register
                </button>
              </div>
            )}
            <MessageInput
              onSend={handleSend}
              onStop={handleStop}
              isStreaming={isStreaming}
              disabled={isStreaming}
              prefillValue={prefillState.text}
              prefillWebSearch={prefillState.webSearch}
              onClearPrefill={() => setPrefillState({ text: "" })}
            />
          </div>

          {/* Quick Suggestions Matching Screenshot */}
          <div className="flex flex-col items-start w-full max-w-2xl px-2 gap-1 sm:gap-1.5 pt-1">
            {quickSuggestions.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPrefillState({ text: item.prompt, webSearch: item.webSearch })}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] sm:text-[14px] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100/80 dark:hover:bg-zinc-800/80 transition-all cursor-pointer select-none"
                >
                  <Icon className="h-4 w-4 text-zinc-400 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        // ---------- Active conversation state ----------
        previewData ? (
          <div className="relative z-10 flex h-full w-full overflow-hidden">
            {/* LEFT COLUMN: CHAT WINDOW */}
            <div className="flex flex-col flex-1 h-full overflow-hidden w-full lg:w-1/2 border-r border-slate-200/80 dark:border-slate-800">
              {/* Message History Scroller */}
              <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex-1 min-h-0 overflow-y-auto px-3 sm:px-4 pt-4 sm:pt-6 pb-2 w-full"
              >
                <div className="max-w-3xl mx-auto w-full">
                  <MessageList
                    messages={displayedMessages}
                    onEditMessage={handleEditMessage}
                    onSuggestionClick={(text) => {
                      if (!isStreaming) {
                        handleSend(text);
                      }
                    }}
                    onRunPreview={(code, lang) => {
                      setIsClosedByUser(false);
                      setPreviewData({ code, language: lang });
                    }}
                  />
                  <div ref={bottomRef} className="h-2" />
                </div>
              </div>

              {/* Fixed Bottom Input Dock */}
              <div className="shrink-0 w-full px-2 sm:px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:pb-4 pt-2 bg-linear-to-t from-white via-white/95 to-transparent dark:from-slate-900 dark:via-slate-900/95 border-t border-slate-100/60 dark:border-slate-800/60">
                <div className="max-w-3xl mx-auto w-full">
                  <MessageInput
                    onSend={handleSend}
                    onStop={handleStop}
                    isStreaming={isStreaming}
                    disabled={isStreaming}
                    prefillValue={prefillState.text}
                    prefillWebSearch={prefillState.webSearch}
                    onClearPrefill={() => setPrefillState({ text: "" })}
                  />
                  <p className="text-center text-[11px] text-slate-400 mt-2 select-none">
                    Patwatoli AI can make mistakes. Verify important info.
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: LIVE APP PREVIEW PANEL */}
            <div className="hidden lg:block w-1/2 h-full overflow-hidden">
              <CodePreviewPanel
                code={previewData.code}
                language={previewData.language}
                onClose={() => {
                  setPreviewData(null);
                  setIsClosedByUser(true);
                }}
              />
            </div>
          </div>
        ) : (
          <div className="relative z-10 flex flex-1 h-full w-full overflow-hidden">
            <div className="flex flex-col flex-1 h-full min-w-0 overflow-hidden">
              {/* Message History Scroller */}
              <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex-1 min-h-0 overflow-y-auto px-3 sm:px-6 pt-4 sm:pt-6 pb-2 w-full"
              >
                <div className="max-w-4xl mx-auto w-full">
                  <MessageList
                    messages={displayedMessages}
                    onEditMessage={handleEditMessage}
                    onSuggestionClick={(text) => {
                      if (!isStreaming) {
                        handleSend(text);
                      }
                    }}
                    onRunPreview={(code, lang) => {
                      setIsClosedByUser(false);
                      setPreviewData({ code, language: lang });
                    }}
                  />
                  <div ref={bottomRef} className="h-2" />
                </div>
              </div>

              {/* Fixed Bottom Input Dock */}
              <div className="shrink-0 w-full px-2 sm:px-6 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:pb-4 pt-2 bg-linear-to-t from-white via-white/95 to-transparent dark:from-slate-950 dark:via-slate-950/95 border-t border-slate-100/60 dark:border-slate-800/60">
                <div className="max-w-4xl mx-auto w-full">
                  {isGuest && guestCreditsRemaining === 0 && (
                    <div className="flex items-center justify-between gap-3 rounded-xl border border-emerald-500/25 dark:border-emerald-500/30 bg-emerald-500/10 dark:bg-emerald-950/40 px-4 py-2 text-xs text-slate-800 dark:text-slate-200 mb-2 shadow-xs backdrop-blur-md">
                      <div className="flex items-center gap-2">
                        <Sparkles size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0 animate-pulse" />
                        <span><strong className="font-semibold text-slate-900 dark:text-white">Free credits limit reached:</strong> Sign in or create an account to keep chatting.</span>
                      </div>
                      <button
                        onClick={() => {
                          setAuthModalReason("credits_limit");
                          setIsAuthModalOpen(true);
                        }}
                        className="shrink-0 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-all shadow-xs active:scale-95 cursor-pointer"
                      >
                        Sign In / Register
                      </button>
                    </div>
                  )}
                  <MessageInput
                    onSend={handleSend}
                    onStop={handleStop}
                    isStreaming={isStreaming}
                    disabled={isStreaming}
                    prefillValue={prefillState.text}
                    prefillWebSearch={prefillState.webSearch}
                    onClearPrefill={() => setPrefillState({ text: "" })}
                  />
                  <p className="text-center text-[11px] text-slate-400 mt-2 select-none">
                    Patwatoli AI can make mistakes. Verify important info.
                  </p>
                </div>
              </div>
            </div>

            <SourcesRail
              isOpen={isSourcesRailOpen}
              sources={railSources}
              highlightedIndex={highlightedSourceIndex}
              onClose={closeSourcesRail}
            />
          </div>
        )
      )}
      <UpgradePlanModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
      />
      <AuthModal
        isOpen={isAuthModalOpen}
        canClose={true}
        reason={authModalReason}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}