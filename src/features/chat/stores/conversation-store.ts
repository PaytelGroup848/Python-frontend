import { create }
  from "zustand";

import {
  Conversation,
} from "../types/conversation.types";

interface ConversationState {

  conversations:
    Conversation[];

  activeConversationId:
    number | null;

  activeAssistantId: number | null;

  isMobileSidebarOpen: boolean;

  setMobileSidebarOpen: (
    open: boolean
  ) => void;

  setActiveAssistantId: (
    assistantId: number | null
  ) => void;

  setConversations: (
    conversations:
      Conversation[]
  ) => void;

  setActiveConversation: (
    id: number | null
  ) => void;

  updateTitle: (
    id: number,
    title: string
  ) => void;
}

export const
useConversationStore =
  create<ConversationState>(
    (set) => ({

      conversations: [],

      activeConversationId:
        null,

      activeAssistantId: null,

      isMobileSidebarOpen: false,

      setMobileSidebarOpen: (
        open
      ) =>
        set({
          isMobileSidebarOpen: open,
        }),

      setConversations: (
        conversations
      ) =>
        set({
          conversations,
        }),

      setActiveConversation: (
        id
      ) =>
        set({
          activeConversationId:
            id,
        }),

      setActiveAssistantId: (
        assistantId
      ) =>
        set({
          activeAssistantId: assistantId,
          activeConversationId: null,
        }),

      updateTitle: (
        id,
        title
      ) =>
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === id ? { ...c, title } : c
          ),
        })),
    })
  );