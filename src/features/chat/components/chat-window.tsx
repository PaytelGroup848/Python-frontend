
"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import { v4 as uuid }
  from "uuid";

import { Sparkles } from "lucide-react";

import { MessageList } from "./message-list";
import { MessageInput } from "./message-input";
import { CodePreviewPanel } from "./code-preview-panel";
import { useChatStore } from "../stores/chat-store";
import { socketClient } from "@/services/websocket/socket-client";
import { useAuthStore } from "@/stores/auth-store";
import { useConversationStore } from "../stores/conversation-store";
import {
  createConversation,
  getConversations,
  updateConversationTitle,
} from "../services/conversation-service";

import { useAssistants } from "@/features/playground/hooks/use-assistants";
import { UpgradePlanModal } from "@/features/billing/components/upgrade-plan-modal";

export function ChatWindow() {

  const [previewData, setPreviewData] = useState<{
    code: string;
    language: string;
  } | null>(null);
  const [isClosedByUser, setIsClosedByUser] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  const { data: assistants = [] } = useAssistants();

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
  const isManuallyStoppedRef = useRef(false);

  useEffect(() => {
    clearMessages();
  }, [activeAssistantId, clearMessages]);

  useEffect(() => {
    if (activeAssistant && !isCodeAssistant) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPreviewData(null);
      setIsClosedByUser(false);
    }
  }, [activeAssistantId, activeAssistant, isCodeAssistant]);

  useEffect(() => {
    // When switching conversations, immediately cancel any active stream from the previous chat
    if (useChatStore.getState().isStreaming) {
      isManuallyStoppedRef.current = true;
      setStreaming(false);
      try {
        socketClient.send({
          type: "stop",
        });
      } catch (e) {
        console.warn("Failed to send stop signal on conversation change:", e);
      }
    }

    if (!activeConversationId) {
      clearMessages();
    }
  }, [activeConversationId, clearMessages, setStreaming]);

  const handleSocketMessage = (data: { type: string; content?: string; response?: string; conversation_id?: number | string }) => {
    // Immediate shield: If user manually stopped the generation, drop all incoming packets!
    if (isManuallyStoppedRef.current) {
      return;
    }

    const currentActiveConvId = useConversationStore.getState().activeConversationId;

    // Guard: If chunk belongs to a different conversation, drop it to prevent cross-chat leakage!
    if (data.conversation_id && currentActiveConvId && String(data.conversation_id) !== String(currentActiveConvId)) {
      return;
    }

    if (data.type === "start") {
      setStreaming(true);
      addMessage({
        id: uuid(),
        role: "assistant",
        content: "",
      });
      return;
    }

    if (data.type === "chunk") {
      if (!useChatStore.getState().isStreaming) return;
      const text = data.content || data.response || "";
      if (!text) return;
      const currentMessages = useChatStore.getState().messages;
      const lastMsg = currentMessages[currentMessages.length - 1];

      if (lastMsg && lastMsg.role === "assistant") {
        updateLastMessage(text);
      } else {
        addMessage({
          id: uuid(),
          role: "assistant",
          content: text,
        });
      }
      return;
    }

    if (data.type === "message") {
      if (!useChatStore.getState().isStreaming) return;
      const text = data.content || data.response || "";
      const currentMessages = useChatStore.getState().messages;
      const lastMsg = currentMessages[currentMessages.length - 1];

      // Prevent appending duplicate content if chunks have already been received
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
      return;
    }

    if (data.type === "stopped") {
      setStreaming(false);
      return;
    }

    if (data.type === "error") {
      setStreaming(false);
      const errorMsg = (data as { message?: string }).message || "Generation error occurred.";
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

    if (data.type === "done") {
      setStreaming(false);
      const text = data.content || data.response || "";
      const currentMessages = useChatStore.getState().messages;
      const lastMsg = currentMessages[currentMessages.length - 1];
      if (lastMsg && lastMsg.role === "assistant" && !lastMsg.content && text) {
        updateLastMessage(text);
      }
      return;
    }
  };

  const handleStop = () => {
    isManuallyStoppedRef.current = true;
    setStreaming(false);
    const conversationId = useConversationStore.getState().activeConversationId;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, addMessage, setStreaming, updateLastMessage]);

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
    if (isStreaming) {
      // Instant auto-scroll during live token streaming to eliminate frame collision & screen jitter
      bottomRef.current?.scrollIntoView({
        behavior: "auto",
      });
    } else {
      // Smooth scroll for completed responses and initial user messages
      bottomRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [messages, isStreaming]);

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

    isManuallyStoppedRef.current = false;

    let conversationId = useConversationStore.getState().activeConversationId;

    // Auto create conversation if not exists
    if (!conversationId) {
      try {
        const newConversation = await createConversation(activeAssistantId);
        conversationId = newConversation.id;
        useConversationStore.getState().setActiveConversation(conversationId);

        const updatedConversations = await getConversations(activeAssistantId);
        useConversationStore.getState().setConversations(updatedConversations);
      } catch (err) {
        console.error("Failed to auto-create conversation", err);
      }
    }

    if (!conversationId) {
      console.warn("Could not obtain active conversation ID");
      return;
    }

    const shouldGenerateTitle = messages.length === 0;

    setStreaming(true);

    addMessage({
      id: uuid(),
      role: "user",
      content: finalContent,
      attachments: attachedDocs && attachedDocs.length > 0
        ? attachedDocs.map((d) => ({ filename: d.filename, status: d.status }))
        : undefined,
    });

    if (shouldGenerateTitle && conversationId) {
      const generatedTitle = finalContent.slice(0, 40).trim();
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

    handleSend(newContent, targetMessage.attachments);
  };

  const displayedMessages = messages;
  const isEmpty = messages.length === 0 && !activeConversationId;

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

  return (
    <div className="relative flex h-full w-full flex-col overflow-y-auto bg-white text-slate-900">
      {/* Patwatoli AI Emerald Green Wave Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden bg-white">
        <div className="absolute -top-32 left-1/2 h-[520px] w-[1100px] -translate-x-1/2 rounded-full bg-emerald-200/40 blur-[120px]" />
        <div className="absolute top-1/4 -left-40 h-[420px] w-[720px] rounded-full bg-teal-200/30 blur-[130px]" />
        <div className="absolute bottom-[-160px] left-[-80px] h-[520px] w-[820px] rounded-full bg-emerald-300/30 blur-[120px]" />
        <div className="absolute bottom-[-220px] right-[-100px] h-[560px] w-[860px] rounded-full bg-teal-100/50 blur-[120px]" />
      </div>

      {isEmpty ? (
        // ---------- Landing / hero state ----------
        <div className="relative z-10 flex h-full flex-col items-center justify-center gap-7 px-4 sm:px-6">
          <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 border border-emerald-200 text-xs font-semibold text-emerald-700 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            <span>Patwatoli AI Workspace</span>
          </div>

          <h1 className="max-w-2xl text-center text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
             {displayName}, <span className="text-emerald-600">What&apos;s the vision?</span>
          </h1>

          <div className="w-full max-w-2xl px-1 sm:px-0">
            <MessageInput
              onSend={handleSend}
              onStop={handleStop}
              isStreaming={isStreaming}
              disabled={isStreaming}
            />
          </div>
        </div>
      ) : (
        // ---------- Active conversation state ----------
        previewData ? (
          <div className="relative z-10 flex h-full w-full overflow-hidden">
            {/* LEFT COLUMN: CHAT WINDOW */}
            <div className="flex flex-col flex-1 h-full overflow-y-auto w-full lg:w-1/2 border-r border-slate-200/80">
              <div className="flex-1 px-3 sm:px-4 pt-4 sm:pt-6 pb-4 max-w-3xl mx-auto w-full">
                <MessageList
                  messages={displayedMessages}
                  onEditMessage={handleEditMessage}
                  onRunPreview={(code, lang) => {
                    setIsClosedByUser(false);
                    setPreviewData({ code, language: lang });
                  }}
                />
                <div ref={bottomRef} />
              </div>

              <div className="flex justify-center px-2 sm:px-4 pb-3 sm:pb-6 max-w-3xl mx-auto w-full">
                <MessageInput
                  onSend={handleSend}
                  onStop={handleStop}
                  isStreaming={isStreaming}
                  disabled={isStreaming}
                />
              </div>
            </div>

            {/* RIGHT COLUMN: LIVE APP PREVIEW PANEL */}
            <div className="hidden lg:block w-1/2 h-full">
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
          <>
            <div className="relative z-10 flex-1 px-3 sm:px-6 pt-4 sm:pt-6 pb-4 max-w-4xl mx-auto w-full">
              <MessageList
                messages={displayedMessages}
                onEditMessage={handleEditMessage}
                onRunPreview={(code, lang) => {
                  setIsClosedByUser(false);
                  setPreviewData({ code, language: lang });
                }}
              />
              <div ref={bottomRef} />
            </div>

            <div className="relative z-10 flex justify-center px-2 sm:px-6 pb-3 sm:pb-6 max-w-4xl mx-auto w-full">
              <MessageInput
                onSend={handleSend}
                onStop={handleStop}
                isStreaming={isStreaming}
                disabled={isStreaming}
              />
            </div>
          </>
        )
      )}
      <UpgradePlanModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
      />
    </div>
  );
}