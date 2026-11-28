"use client";

import Link from "next/link";
import {
  Menu,
  Plus,
  LogIn,
  ChevronDown,
  Check,
} from "lucide-react";
import { useAssistants } from "../hooks/use-assistants";
import { getAssistantLogo } from "@/features/chat/utils/assistant-logo";
import { useConversationStore } from "@/features/chat/stores/conversation-store";
import { useChatStore } from "@/features/chat/stores/chat-store";
import { useAuthStore } from "@/stores/auth-store";
import { AuthModal } from "@/components/auth/auth-modal";
import { CreateMiniAIModal } from "@/features/mini-ai/components/create-mini-ai-modal";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ChatHeader() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMiniAIModalOpen, setIsMiniAIModalOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const isGuest = user?.role === "guest" || !user;

  const activeAssistantId = useConversationStore((state) => state.activeAssistantId);
  const setActiveAssistantId = useConversationStore((state) => state.setActiveAssistantId);
  const setActiveConversation = useConversationStore((state) => state.setActiveConversation);
  const setMobileSidebarOpen = useConversationStore((state) => state.setMobileSidebarOpen);
  const setMessages = useChatStore((state) => state.setMessages);
  const { data: assistants = [] } = useAssistants();

  const assistant = assistants.find((item) => item.id === activeAssistantId);

  const handleNewChat = () => {
    setActiveConversation(null);
    setMessages([]);
  };

  // Keyboard shortcut Ctrl+K / Cmd+K for New Chat (Enterprise SaaS standard)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        handleNewChat();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const userName = user?.full_name || (user?.email ? user.email.split("@")[0] : "User");
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <header className="flex h-14 md:h-16 min-h-14 md:min-h-16 items-center justify-between border-b border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 px-3 sm:px-6 py-2 backdrop-blur-2xl text-slate-900 dark:text-white shadow-xs z-10 transition-colors">
      {/* LEFT ZONE: MOBILE HAMBURGER & INTERACTIVE MODEL SELECTOR */}
      <div className="flex items-center gap-2 sm:gap-3 overflow-hidden min-w-0">
        {/* Mobile Sidebar Hamburger Toggle */}
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors md:hidden shrink-0 cursor-pointer"
          title="Open Menu"
          aria-label="Open Menu"
        >
          <Menu size={20} />
        </button>

        {/* Interactive Assistant / Model Dropdown Selector (ChatGPT / Claude Standard) */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="group flex items-center gap-2.5 rounded-xl px-2.5 py-1.5 -ml-1 text-left hover:bg-slate-100/90 dark:hover:bg-slate-800/80 transition-all cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700/60 focus:outline-none"
              title="Switch AI Assistant"
            >
              <div className="relative flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800 shadow-2xs group-hover:border-emerald-500/50 transition-colors">
                <img
                  src={getAssistantLogo(assistant?.code, assistant?.name)}
                  alt={assistant?.name ?? "Assistant"}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex flex-col min-w-0 text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                    {assistant?.name ?? "General Chat"}
                  </span>
                  <ChevronDown
                    size={13}
                    className="text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-transform duration-200 group-data-[state=open]:rotate-180 shrink-0"
                  />
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate hidden xs:inline max-w-[190px]">
                  {assistant?.description ?? "Universal AI Assistant"}
                </span>
              </div>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="start"
            className="w-80 sm:w-96 p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl backdrop-blur-2xl z-50"
          >
            <div className="flex items-center justify-between px-2.5 py-2 mb-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Select Assistant & Model
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500">
                {assistants.length} available
              </span>
            </div>

            <div className="space-y-1 max-h-[380px] overflow-y-auto pr-1">
              {assistants.map((item) => {
                const isSelected = item.id === activeAssistantId;
                return (
                  <DropdownMenuItem
                    key={item.id}
                    onClick={() => {
                      setActiveAssistantId(item.id);
                      setActiveConversation(null);
                      setMessages([]);
                    }}
                    className={`flex items-start gap-3 p-2.5 rounded-xl cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/80 text-emerald-950 dark:text-emerald-100"
                        : "hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-800 dark:text-slate-200"
                    }`}
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 mt-0.5 shadow-2xs">
                      <img
                        src={getAssistantLogo(item.code, item.name)}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs sm:text-sm font-semibold truncate">
                          {item.name}
                        </span>
                        {isSelected && (
                          <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 shrink-0">
                            <Check size={13} />
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5 leading-snug">
                        {item.description || "Enterprise AI Assistant"}
                      </p>
                    </div>
                  </DropdownMenuItem>
                );
              })}
            </div>
            {!isGuest && (
              <div className="border-t border-slate-200 dark:border-slate-800 mt-1 pt-1 space-y-0.5">
                <DropdownMenuItem
                  onClick={() => setIsMiniAIModalOpen(true)}
                  className="flex items-center gap-2 p-2.5 rounded-xl cursor-pointer text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10"
                >
                  <Plus size={14} />
                  <span>Create My Mini AI</span>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/mini-ai"
                    className="flex items-center justify-between p-2.5 rounded-xl cursor-pointer text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <span>Manage Studio</span>
                    <span>→</span>
                  </Link>
                </DropdownMenuItem>
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>


      {/* RIGHT ZONE: ENTERPRISE ACTIONS & AUTHENTICATION */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* NEW CHAT (+) BUTTON WITH KEYBOARD SHORTCUT */}
        <button
          onClick={handleNewChat}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 border border-slate-200/80 dark:border-slate-700/60 transition-all cursor-pointer shadow-2xs"
          title="Start New Conversation (Ctrl+K)"
        >
          <Plus size={14} className="text-emerald-600 dark:text-emerald-400" />
          <span className="hidden sm:inline">New Chat</span>
          <kbd className="hidden md:inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-mono text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            ⌘K
          </kbd>
        </button>

        {/* AUTHENTICATION STATE */}
        {isGuest ? (
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs shadow-emerald-600/20 hover:shadow-emerald-600/30 transition-all cursor-pointer"
            >
              <LogIn size={13} />
              <span className="hidden sm:inline">Sign In</span>
              <span className="sm:hidden">Login</span>
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-2 pl-1 border-l border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 px-2.5 py-1 shadow-2xs">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-600 text-[11px] font-bold text-white uppercase shadow-2xs">
                {userInitial}
              </div>
              <span className="text-xs font-medium text-slate-700 dark:text-slate-200 hidden sm:inline max-w-[120px] truncate">
                {userName}
              </span>
              <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 hidden md:inline">
                {user?.role === "admin" ? "Admin" : "Enterprise"}
              </span>
            </div>
          </div>
        )}
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        canClose={true}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => setIsAuthModalOpen(false)}
      />

      <CreateMiniAIModal
        isOpen={isMiniAIModalOpen}
        onClose={() => setIsMiniAIModalOpen(false)}
        onCreated={(id) => {
          setActiveAssistantId(id);
          setActiveConversation(null);
          setMessages([]);
        }}
        existingMiniAIs={assistants.filter((a) => a.is_custom)}
      />
    </header>
  );
}
