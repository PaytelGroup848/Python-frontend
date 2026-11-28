import type { WebImageItem, WebSourceItem } from "../utils/source-parser";

export interface ChatMessageAttachment {
  filename: string;
  status?: string;
}

export interface ChatMessage {
  id: string | number;
  role: "user" | "assistant";
  content: string;
  attachments?: ChatMessageAttachment[];
  aspectRatio?: string;
  webSearch?: boolean;
  think?: boolean;
  reasoningContent?: string;
  reasoningDuration?: number;
  sources?: WebSourceItem[];
  images?: WebImageItem[];
}
