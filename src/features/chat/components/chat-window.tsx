
"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import { v4 as uuid }
  from "uuid";

import {
  ArrowUp,
  ChevronDown,
  Mic,
  Plus,
  Sparkles,
} from "lucide-react";

import { MessageList }
  from "./message-list";

import {
  useChatStore,
} from "../stores/chat-store";

import { socketClient }
  from "@/services/websocket/socket-client";

import { useAuthStore }
  from "@/stores/auth-store";  

import {
  useConversationStore,
} from "../stores/conversation-store";

import {
  createConversation,
  getConversations,
  updateConversationTitle,
} from "../services/conversation-service";
import { MessageInput } from "./message-input";

export function ChatWindow() {

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

  const conversations =
  useConversationStore(
    (state) =>
      state.conversations
  );

  const setConversations =
    useConversationStore(
      (state) =>
        state.setConversations
    );

  const activeAssistantId =
    useConversationStore(
      (state) =>
        state.activeAssistantId
    );



  const clearMessages = useChatStore((state) => state.clearMessages);

  const bottomRef = useRef<HTMLDivElement>(null);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    clearMessages();
  }, [activeAssistantId, clearMessages]);

  useEffect(() => {
    if (!activeConversationId) {
      clearMessages();
    }
  }, [activeConversationId, clearMessages]);

  useEffect(() => {
    if (!accessToken) {
      return;
    }

    const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000"}/ws/chat?token=${accessToken}`;
    socketClient.connect(wsUrl, (data) => {
      if (data.type === "start") {
        setStreaming(true);
        addMessage({
          id: uuid(),
          role: "assistant",
          content: "",
        });
        return;
      }

      if (data.type === "chunk" || data.type === "message") {
        const text = data.content || data.response || "";
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

        if (data.type === "message") {
          setStreaming(false);
        }
      }

      if (data.type === "done") {
        setStreaming(false);
      }
    });

    return () => {
      socketClient.disconnect();
    };
  }, [accessToken, addMessage, updateLastMessage, setStreaming]);

  useEffect(() => {

  bottomRef.current?.scrollIntoView({
    behavior: "smooth",
  });

}, [messages]);

  async function handleSend(
    content: string
  ) {

    if (
      !content.trim() ||
      isStreaming
    ) {
      return;
    }

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
      content,
    });

    setDraft("");


    if (shouldGenerateTitle && conversationId) {
      const generatedTitle = content.slice(0, 40).trim();
      updateConversationTitle(conversationId, generatedTitle).catch(console.error);
    }

    if (!accessToken) {
      console.warn("Missing accessToken for chat");
      return;
    }

    // Ensure socket connection is active
    const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000"}/ws/chat?token=${accessToken}`;
    socketClient.connect(wsUrl, (data) => {
      if (data.type === "start") {
        setStreaming(true);
        addMessage({
          id: uuid(),
          role: "assistant",
          content: "",
        });
        return;
      }

      if (data.type === "chunk" || data.type === "message") {
        const text = data.content || data.response || "";
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

        if (data.type === "message") {
          setStreaming(false);
        }
      }

      if (data.type === "done") {
        setStreaming(false);
      }
    });

    // Send payload
    socketClient.send({
      conversation_id: conversationId,
      assistant_id: activeAssistantId,
      message: content,
    });
  }

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) {

    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend(draft);
    }
  }

  const displayedMessages = messages;
  const isEmpty = messages.length === 0 && !activeConversationId;

  const user = useAuthStore(
    (state) => state.user
  );

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
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-slate-50 text-slate-900">
      {/* Patwatoli AI Emerald Green Wave Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden bg-white">
        <div className="absolute -top-32 left-1/2 h-[520px] w-[1100px] -translate-x-1/2 rounded-full bg-emerald-200/40 blur-[120px]" />
        <div className="absolute top-1/4 -left-40 h-[420px] w-[720px] rounded-full bg-teal-200/30 blur-[130px]" />
        <div className="absolute bottom-[-160px] left-[-80px] h-[520px] w-[820px] rounded-full bg-emerald-300/30 blur-[120px]" />
        <div className="absolute bottom-[-220px] right-[-100px] h-[560px] w-[860px] rounded-full bg-teal-100/50 blur-[120px]" />
      </div>

      {isEmpty ? (
        // ---------- Landing / hero state ----------
        <div className="relative z-10 flex h-full flex-col items-center justify-center gap-7 px-6">
          <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 border border-emerald-200 text-xs font-semibold text-emerald-700 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            <span>Patwatoli AI Workspace</span>
          </div>

          <h1 className="max-w-2xl text-center text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
             {displayName}, <span className="text-emerald-600">What&apos;s the vision?</span>
          </h1>

          <MessageInput
            onSend={handleSend}
            disabled={isStreaming}
          />
        </div>
      ) : (
        // ---------- Active conversation state ----------
        <>
          <div className="relative z-10 flex-1 overflow-y-auto px-6 pt-6 pb-4 max-w-4xl mx-auto w-full">
            <MessageList messages={displayedMessages} />
            <div ref={bottomRef} />
          </div>

          <div className="relative z-10 flex justify-center px-6 pb-6 max-w-4xl mx-auto w-full">
            <MessageInput
              onSend={handleSend}
              disabled={isStreaming}
          />
          </div>
        </>
      )}
    </div>
  );

}