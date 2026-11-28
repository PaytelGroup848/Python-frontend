import { create } from "zustand";

import { ChatMessage } from "../types/chat.types";
import type { WebImageItem, WebSourceItem } from "../utils/source-parser";

interface ChatState {
  messages: ChatMessage[];
  isStreaming: boolean;

  isSourcesRailOpen: boolean;
  railMessageId: string | number | null;
  railSources: WebSourceItem[];
  highlightedSourceIndex: number | null;

  setMessages: (messages: ChatMessage[]) => void;
  addMessage: (message: ChatMessage) => void;
  updateLastMessage: (
    chunk: string,
    meta?: { reasoningDuration?: number }
  ) => void;
  updateLastMessageSources: (
    sources: WebSourceItem[],
    images: WebImageItem[]
  ) => void;
  clearMessages: () => void;
  setStreaming: (value: boolean) => void;

  openSourcesRail: (
    messageId: string | number,
    sources: WebSourceItem[],
    highlightIndex?: number | null
  ) => void;
  closeSourcesRail: () => void;
  toggleSourcesRail: (
    messageId: string | number,
    sources: WebSourceItem[]
  ) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isStreaming: false,

  isSourcesRailOpen: false,
  railMessageId: null,
  railSources: [],
  highlightedSourceIndex: null,

  setMessages: (messages) =>
    set({
      messages,
      isSourcesRailOpen: false,
      railMessageId: null,
      railSources: [],
      highlightedSourceIndex: null,
    }),

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  updateLastMessage: (chunk, meta) =>
    set((state) => {
      const messages = [...state.messages];
      for (let i = messages.length - 1; i >= 0; i--) {
        if (messages[i].role === "assistant") {
          messages[i] = {
            ...messages[i],
            content: messages[i].content + chunk,
            ...(meta?.reasoningDuration !== undefined
              ? { reasoningDuration: meta.reasoningDuration }
              : {}),
          };
          break;
        }
      }
      return { messages };
    }),

  updateLastMessageSources: (sources, images) =>
    set((state) => {
      const messages = [...state.messages];
      for (let i = messages.length - 1; i >= 0; i--) {
        if (messages[i].role === "assistant") {
          messages[i] = {
            ...messages[i],
            sources,
            images,
          };
          break;
        }
      }
      return { messages };
    }),

  setStreaming: (value) => set({ isStreaming: value }),

  clearMessages: () =>
    set({
      messages: [],
      isSourcesRailOpen: false,
      railMessageId: null,
      railSources: [],
      highlightedSourceIndex: null,
    }),

  openSourcesRail: (messageId, sources, highlightIndex = null) =>
    set({
      isSourcesRailOpen: true,
      railMessageId: messageId,
      railSources: sources,
      highlightedSourceIndex: highlightIndex,
    }),

  closeSourcesRail: () =>
    set({
      isSourcesRailOpen: false,
      highlightedSourceIndex: null,
    }),

  toggleSourcesRail: (messageId, sources) =>
    set((state) => {
      if (state.isSourcesRailOpen && state.railMessageId === messageId) {
        return { isSourcesRailOpen: false, highlightedSourceIndex: null };
      }
      return {
        isSourcesRailOpen: true,
        railMessageId: messageId,
        railSources: sources,
        highlightedSourceIndex: null,
      };
    }),
}));
