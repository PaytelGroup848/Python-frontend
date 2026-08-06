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
}

export const
useConversationStore =
  create<ConversationState>(
    (set) => ({

      conversations: [],

      activeConversationId:
        null,

      activeAssistantId: null,

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
    })
  );