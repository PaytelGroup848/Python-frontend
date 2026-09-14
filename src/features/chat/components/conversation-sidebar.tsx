"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Trash2,
  Bot,
  ChevronDown,
  Sparkles,
  Settings,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  MessageSquare,
  Key,
  X,
} from "lucide-react";

import {
  createConversation,
  getConversations,
  getConversationMessages,
  deleteConversation,
} from "../services/conversation-service";

import { useConversationStore } from "../stores/conversation-store";
import { useChatStore } from "../stores/chat-store";
import { useAuthStore } from "@/stores/auth-store";
import { useAssistants } from "@/features/playground/hooks/use-assistants";
import { Assistant } from "@/features/playground/types/assistant";
import { useQuery } from "@tanstack/react-query";
import { fetchUserUsage } from "@/features/billing/services/billing.service";
import { UpgradePlanModal } from "@/features/billing/components/upgrade-plan-modal";
import { SettingsModal } from "./settings-modal";
import { ApiKeysModal } from "./api-keys-modal";


export function ConversationSidebar() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const conversations = useConversationStore((state) => state.conversations);
  const setConversations = useConversationStore((state) => state.setConversations);
  const activeConversationId = useConversationStore((state) => state.activeConversationId);
  const setActiveConversation = useConversationStore((state) => state.setActiveConversation);
  const setMessages = useChatStore((state) => state.setMessages);
  const activeAssistantId = useConversationStore((state) => state.activeAssistantId);
  const setActiveAssistantId = useConversationStore((state) => state.setActiveAssistantId);
  const isMobileSidebarOpen = useConversationStore((state) => state.isMobileSidebarOpen);
  const setMobileSidebarOpen = useConversationStore((state) => state.setMobileSidebarOpen);

  const { data: assistants = [] } = useAssistants();
  const [isAssistantDropdownOpen, setIsAssistantDropdownOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isApiKeysOpen, setIsApiKeysOpen] = useState(false);
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);

  const { data: usage } = useQuery({
    queryKey: ["billing-usage"],
    queryFn: fetchUserUsage,
    staleTime: 60 * 1000,
  });

  const currentPlanName = usage?.plan?.toUpperCase() || "FREE";

  const [isCollapsed, setIsCollapsed] = useState(false);

  const userEmail = user?.email || "user@platform.com";
  const userName = user?.full_name || (user?.email ? user.email.split("@")[0] : "User");
  const userAvatarInitial = userName.charAt(0).toUpperCase();

  const handleLogout = () => {
    setMobileSidebarOpen(false);
    logout();
    router.push("/login");
  };

  const activeAssistant: Assistant | undefined = assistants.find((a: Assistant) => a.id === activeAssistantId) || assistants[0];

  useEffect(() => {
    if (assistants.length > 0 && activeAssistantId === null) {
      const general = assistants.find((a: Assistant) => a.code === "general") || assistants[0];
      if (general) {
        setActiveAssistantId(general.id);
      }
    }
  }, [assistants, activeAssistantId, setActiveAssistantId]);

  // When opening mobile drawer, ensure it is in expanded view
  useEffect(() => {
    if (isMobileSidebarOpen && isCollapsed) {
      setIsCollapsed(false);
    }
  }, [isMobileSidebarOpen, isCollapsed]);

  /* =========================
     LOAD CONVERSATIONS
  ========================= */

  useEffect(() => {
    async function load() {
      setActiveConversation(null);
      setMessages([]);

      try {
        const data = await getConversations(activeAssistantId);
        setConversations(data);

        if (data.length > 0) {
          const latestConversation = data[0];
          try {
            const messages = await getConversationMessages(latestConversation.id);
            setActiveConversation(latestConversation.id);
            setMessages(messages);
          } catch {
            setActiveConversation(null);
            setMessages([]);
          }
        } else {
          setActiveConversation(null);
          setMessages([]);
        }
      } catch (error) {
        console.error(error);
        setActiveConversation(null);
        setMessages([]);
      }
    }

    load();
  }, [activeAssistantId]);

  /* =========================
     CREATE CHAT
  ========================= */

  async function handleNewChat() {
    setMobileSidebarOpen(false);
    try {
      const conversation = await createConversation(activeAssistantId);
      const updatedConversations = await getConversations(activeAssistantId);
      setConversations(updatedConversations);
      setActiveConversation(conversation.id);
      setMessages([]);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDeleteChat(conversationId: number) {
    try {
      await deleteConversation(conversationId);
      const updatedConversations = conversations.filter((c) => c.id !== conversationId);
      setConversations(updatedConversations);

      if (activeConversationId === conversationId) {
        if (updatedConversations.length > 0) {
          const latest = updatedConversations[0];
          const messages = await getConversationMessages(latest.id);
          setActiveConversation(latest.id);
          setMessages(messages);
        } else {
          setActiveConversation(null);
          setMessages([]);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  const filteredConversations = conversations.filter(
    (c) => activeAssistantId === null || c.assistant_id === activeAssistantId
  );

  return (
    <>
      {/* MOBILE BACKDROP OVERLAY (TAP TO CLOSE) */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs transition-opacity duration-300 md:hidden animate-in fade-in"
          onClick={() => setMobileSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-full flex-col border-r border-slate-200 bg-white text-slate-900 select-none shadow-2xl transition-transform duration-300 ease-in-out md:relative md:z-0 md:shadow-sm md:translate-x-0 ${
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } w-72 ${isCollapsed ? "md:w-20" : "md:w-72"}`}
      >
        {/* ASSISTANT SELECTOR & TOGGLE HEADER */}
        <div className="relative border-b border-slate-200/80 p-3.5 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <label className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 px-1">
                Patwatoli AI Assistant
              </label>
            )}
            <div className="flex items-center gap-1 ml-auto">
              {/* DESKTOP COLLAPSE BUTTON */}
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className={`hidden md:flex p-1.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all ${isCollapsed ? "mx-auto" : ""}`}
                title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
              >
                {isCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
              </button>
              {/* MOBILE CLOSE (X) BUTTON */}
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="flex md:hidden p-1.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all cursor-pointer"
                title="Close Menu"
                aria-label="Close Menu"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="relative">
            {!isCollapsed ? (
              <button
                onClick={() => setIsAssistantDropdownOpen(!isAssistantDropdownOpen)}
                className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-left transition hover:border-emerald-500 hover:bg-emerald-50/50 shadow-sm"
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-sm shadow-emerald-600/30">
                    <Bot size={16} />
                  </div>
                  <div className="truncate">
                    <div className="text-sm font-bold text-slate-900 truncate">
                      {activeAssistant?.name || "General Chat"}
                    </div>
                    <div className="text-[11px] font-medium text-slate-500 truncate">
                      {activeAssistant?.description || "Universal AI Assistant"}
                    </div>
                  </div>
                </div>
                <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${isAssistantDropdownOpen ? "rotate-180 text-emerald-600" : ""}`} />
              </button>
            ) : (
              <button
                onClick={() => setIsAssistantDropdownOpen(!isAssistantDropdownOpen)}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-600/30 mx-auto transition hover:scale-105"
                title={activeAssistant?.name || "General Chat"}
              >
                <Bot size={20} />
              </button>
            )}

            {/* DROPDOWN MENU */}
            {isAssistantDropdownOpen && (
              <>
                {/* Backdrop dismiss */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsAssistantDropdownOpen(false)}
                />
                <div
                  className={`absolute z-50 max-h-80 overflow-y-auto space-y-1 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-2xl backdrop-blur-xl ${
                    isCollapsed ? "left-full ml-2 top-0 w-64" : "left-0 right-0 top-full mt-1.5"
                  }`}
                >
                  {assistants.length === 0 ? (
                    <div className="px-3 py-3 text-center text-xs text-slate-500 font-medium">
                      Loading assistants...
                    </div>
                  ) : (
                    assistants.map((assistant) => (
                      <button
                        key={assistant.id}
                        onClick={() => {
                          setActiveAssistantId(assistant.id);
                          setActiveConversation(null);
                          setMessages([]);
                          setIsAssistantDropdownOpen(false);
                          setMobileSidebarOpen(false);
                        }}
                        className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm transition ${
                          activeAssistantId === assistant.id
                            ? "bg-emerald-50 text-emerald-900 font-bold border border-emerald-200/80 shadow-xs"
                            : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                        }`}
                      >
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-600/10 text-emerald-700 font-bold">
                          <Bot size={15} />
                        </div>
                        <div className="truncate">
                          <div className="font-bold text-slate-900 truncate">{assistant.name}</div>
                          <div className="text-[10px] text-slate-500 truncate">{assistant.description}</div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </>
            )}
          </div>

        </div>

      {/* NEW CHAT ACTION */}
      <div className="p-3.5">
        {!isCollapsed ? (
          <button
            onClick={handleNewChat}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:shadow-lg hover:shadow-emerald-600/25 active:scale-[0.98] shadow-md shadow-emerald-600/20"
          >
            <Plus size={16} />
            New Conversation
          </button>
        ) : (
          <button
            onClick={handleNewChat}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 mx-auto transition hover:scale-105"
            title="New Conversation"
          >
            <Plus size={18} />
          </button>
        )}
      </div>

      {/* CONVERSATION HISTORY */}
      <div className="flex-1 overflow-y-auto px-3.5 py-1 space-y-1">
        {!isCollapsed && (
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
            Recent Chats
          </div>
        )}

        {filteredConversations.length === 0 ? (
          !isCollapsed && (
            <div className="px-3 py-8 text-center text-xs text-slate-400 italic">
              No chats yet for {activeAssistant?.name || "this model"}. Click &quot;New Conversation&quot; to start!
            </div>
          )
        ) : (
          filteredConversations.map((conversation) => {
            const isActive = activeConversationId === conversation.id;
            return (
              <div
                key={conversation.id}
                onClick={async () => {
                  setMobileSidebarOpen(false);
                  try {
                    const messages = await getConversationMessages(conversation.id);
                    setActiveConversation(conversation.id);
                    setMessages(messages);
                  } catch (error) {
                    console.error(error);
                    setActiveConversation(null);
                    setMessages([]);
                  }
                }}
                className={`group flex items-center ${isCollapsed ? "justify-center p-2.5" : "justify-between px-3 py-2.5"} rounded-xl text-sm cursor-pointer transition-all duration-150 ${isActive ? "bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200/80 shadow-sm" : "text-slate-600 border border-transparent hover:bg-slate-100 hover:text-slate-900"}`}
                title={isCollapsed ? conversation.title || "Untitled Chat" : undefined}
              >
                {!isCollapsed ? (
                  <>
                    <span className="truncate pr-2">{conversation.title || "Untitled Chat"}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteChat(conversation.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 transition"
                      title="Delete chat"
                    >
                      <Trash2 size={14} />
                    </button>
                  </>
                ) : (
                  <MessageSquare size={16} className={isActive ? "text-emerald-600" : "text-slate-400"} />
                )}
              </div>
            );
          })
        )}
      </div>

      {/* USER & SETTINGS FOOTER */}
      <div className="border-t border-slate-200 p-3 mt-auto space-y-2 bg-slate-50">
        {!isCollapsed ? (
          <>
            {/* UPGRADE PLAN BUTTON */}
            <button
              onClick={() => {
                setIsUpgradeOpen(true);
                setMobileSidebarOpen(false);
              }}
              className="flex w-full items-center justify-between rounded-xl bg-white border border-slate-200 p-2.5 transition hover:border-emerald-500 hover:bg-emerald-50/30 shadow-xs cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-xs group-hover:scale-105 transition-transform">
                  <Sparkles size={16} />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-slate-900">
                    {currentPlanName === "PRO" ? "Pro Plan Active" : "Upgrade Plan"}
                  </div>
                  <div className="text-[11px] font-medium text-slate-500">
                    {currentPlanName === "PRO" ? "1M monthly tokens" : "Frontier AI & higher limits"}
                  </div>
                </div>
              </div>
              <span
                className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                  currentPlanName === "PRO"
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                    : "bg-emerald-600 text-white"
                }`}
              >
                {currentPlanName === "PRO" ? "PRO" : "UPGRADE"}
              </span>
            </button>

            {/* DEVELOPER API KEYS */}
            <button
              onClick={() => {
                setIsApiKeysOpen(true);
                setMobileSidebarOpen(false);
              }}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 hover:text-slate-950 hover:bg-slate-200/70 transition cursor-pointer"
            >
              <Key size={16} className="text-slate-700" />
              <span className="text-slate-800 font-semibold">Developer API Keys</span>
            </button>

            {/* PLATFORM SETTINGS */}
            <button
              onClick={() => {
                setIsSettingsOpen(true);
                setMobileSidebarOpen(false);
              }}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 hover:text-slate-950 hover:bg-slate-200/70 transition cursor-pointer"
            >
              <Settings size={16} className="text-slate-700" />
              <span className="text-slate-800 font-semibold">Platform Settings</span>
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => {
                setIsUpgradeOpen(true);
                setMobileSidebarOpen(false);
              }}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-emerald-600 shadow-xs hover:border-emerald-400 hover:bg-emerald-50 mx-auto transition cursor-pointer"
              title={`Upgrade Plan (${currentPlanName})`}
            >
              <Sparkles size={18} />
            </button>

            <button
              onClick={() => {
                setIsApiKeysOpen(true);
                setMobileSidebarOpen(false);
              }}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-xs hover:text-slate-900 hover:bg-slate-100 mx-auto transition cursor-pointer"
              title="Developer API Keys"
            >
              <Key size={18} />
            </button>

            <button
              onClick={() => {
                setIsSettingsOpen(true);
                setMobileSidebarOpen(false);
              }}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-xs hover:text-slate-900 hover:bg-slate-100 mx-auto transition cursor-pointer"
              title="Platform Settings"
            >
              <Settings size={18} />
            </button>
          </>
        )}

        {/* USER PROFILE CARD */}
        {!isCollapsed ? (
          <div className="flex items-center justify-between rounded-xl bg-white p-2.5 border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-700 font-bold text-xs text-white shadow-xs">
                {userAvatarInitial}
              </div>
              <div className="truncate">
                <div className="text-xs font-bold text-slate-900 truncate">
                  {userName}
                </div>
                <div className="text-[11px] font-medium text-slate-500 truncate">
                  {userEmail}
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
              title="Log out"
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogout}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-700 text-xs font-bold text-white shadow-xs mx-auto transition hover:opacity-90 cursor-pointer"
            title={`Log out (${userName})`}
          >
            {userAvatarInitial}
          </button>
        )}
      </div>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <ApiKeysModal isOpen={isApiKeysOpen} onClose={() => setIsApiKeysOpen(false)} />
      <UpgradePlanModal isOpen={isUpgradeOpen} onClose={() => setIsUpgradeOpen(false)} />
    </aside>
  </>
  );
}