"use client";

import { Bot, Sparkles, Menu, Plus } from "lucide-react";
import { useAssistants } from "../hooks/use-assistants";
import { useConversationStore } from "@/features/chat/stores/conversation-store";
import { useChatStore } from "@/features/chat/stores/chat-store";

export function ChatHeader() {
  const activeAssistantId = useConversationStore((state) => state.activeAssistantId);
  const conversations = useConversationStore((state) => state.conversations);
  const activeConversationId = useConversationStore((state) => state.activeConversationId);
  const setActiveConversation = useConversationStore((state) => state.setActiveConversation);
  const setMobileSidebarOpen = useConversationStore((state) => state.setMobileSidebarOpen);
  const setMessages = useChatStore((state) => state.setMessages);
  const { data: assistants = [] } = useAssistants();

  const assistant = assistants.find((item) => item.id === activeAssistantId);
  const conversation = conversations.find((item) => item.id === activeConversationId);

  const handleNewChat = () => {
    setActiveConversation(null);
    setMessages([]);
  };

  return (
    <header className="flex h-14 md:h-16 min-h-[56px] md:min-h-[64px] items-center justify-between border-b border-slate-200/80 bg-white/95 px-3 sm:px-6 py-2 backdrop-blur-2xl text-slate-900 shadow-xs z-10">
      <div className="flex items-center gap-2 sm:gap-3.5 overflow-hidden min-w-0">
        {/* MOBILE HAMBURGER BUTTON (DRAWER TOGGLE) */}
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors md:hidden shrink-0 cursor-pointer"
          title="Open Menu"
          aria-label="Open Menu"
        >
          <Menu size={20} />
        </button>

        <div className="flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-600/30">
          <Bot size={18} className="sm:size-5" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 truncate">
              {assistant?.name ?? "General Chat"}
            </h2>
            <span className="shrink-0 flex items-center gap-1 rounded-full bg-emerald-50 px-2 sm:px-2.5 py-0.5 text-[10px] sm:text-[11px] font-semibold text-emerald-700 border border-emerald-200 shadow-xs">
              <Sparkles size={11} className="text-emerald-600" />
              <span className="hidden sm:inline">Active Model</span>
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-500 truncate max-w-[150px] sm:max-w-md hidden xs:block">
            {assistant?.description ?? "Universal AI Assistant"}
          </p>
        </div>


        {/* FEATURE BADGES */}
        <div className="ml-4 hidden md:flex items-center gap-1.5 border-l border-slate-200 pl-4">
          {assistant?.code === "coder" && (
            <>
              <span className="rounded-md bg-purple-50 px-2 py-0.5 text-[11px] font-medium text-purple-800 border border-purple-200">
                Code Assistant
              </span>
              <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-800 border border-indigo-200">
                Syntax Highlighting
              </span>
              <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-800 border border-blue-200">
                Refactoring
              </span>
            </>
          )}
          {(assistant?.code === "general" || assistant?.config?.document_chat_enabled) && (
            <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-800 border border-emerald-200">
              Documents
            </span>
          )}
          {(assistant?.code === "general" || assistant?.config?.voice_enabled) && (
            <span className="rounded-md bg-teal-50 px-2 py-0.5 text-[11px] font-medium text-teal-800 border border-teal-200">
              Voice
            </span>
          )}
          {assistant?.config?.web_search_enabled && (
            <span className="rounded-md bg-sky-50 px-2 py-0.5 text-[11px] font-medium text-sky-800 border border-sky-200">
              Web Search
            </span>
          )}
          {assistant?.config?.tool_calling_enabled && (
            <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-800 border border-amber-200">
              Tools
            </span>
          )}
          {assistant?.config?.rag_enabled && (
            <span className="rounded-md bg-cyan-50 px-2 py-0.5 text-[11px] font-medium text-cyan-800 border border-cyan-200">
              RAG
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {/* MOBILE NEW CHAT (+) BUTTON */}
        <button
          onClick={handleNewChat}
          className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors md:hidden cursor-pointer"
          title="New Conversation"
          aria-label="New Conversation"
        >
          <Plus size={20} />
        </button>

        <div className="text-right hidden sm:block">
          <p className="text-xs font-bold text-slate-800 truncate max-w-[160px]">
            {conversation?.title ?? "New Chat"}
          </p>
          <p className="flex items-center justify-end gap-1.5 text-[11px] text-emerald-600 font-semibold">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Online
          </p>
        </div>
      </div>
    </header>
  );
}