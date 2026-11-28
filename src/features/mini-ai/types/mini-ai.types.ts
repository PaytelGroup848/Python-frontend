export interface MiniAIEntitlements {
  plan_tier: "free" | "paid";
  plan_name: string;
  max_bots: number;
  max_chunks_per_bot: number;
  allow_public_embed: boolean;
  allow_insights: boolean;
  monthly_public_messages_limit: number;
}

export interface QAPairInput {
  question: string;
  answer: string;
}

export interface MiniAIItem {
  id: number;
  name: string;
  code: string;
  description: string | null;
  system_prompt: string | null;
  is_active: boolean;
  is_custom: boolean;
  owner_user_id: number | null;
  knowledge_base_id: number | null;
  chunks_count: number;
  share_slug: string | null;
  is_public: boolean;
  strict_rag: boolean;
  allowed_domains: string[] | null;
  welcome_message: string | null;
  created_at: string;
}

export interface CreateMiniAIPayload {
  name: string;
  system_prompt: string;
  description?: string;
  qa_pairs?: QAPairInput[];
  file?: File | null;
}

export interface MiniAIUpdatePayload {
  name?: string;
  description?: string | null;
  system_prompt?: string;
  strict_rag?: boolean;
  is_public?: boolean;
  share_slug?: string | null;
  allowed_domains?: string[] | null;
  welcome_message?: string | null;
}

export interface MiniAIDocumentItem {
  id: number;
  file_name: string;
  mime_type: string | null;
  status: string;
  error_message: string | null;
  chunk_count: number;
  created_at: string;
}

export interface MiniAIDocumentsResponse {
  documents: MiniAIDocumentItem[];
  chunks_used: number;
  chunk_limit: number;
  remaining_chunks: number;
}

export interface MiniAILeadItem {
  id: number;
  visitor_name: string;
  visitor_contact: string;
  first_question: string | null;
  created_at: string;
}

export interface MiniAIGapItem {
  id: number;
  question: string;
  hit_count: number;
  resolved: boolean;
  created_at: string;
  updated_at: string;
}

export interface MiniAIInsightsResponse {
  leads: MiniAILeadItem[];
  gaps: MiniAIGapItem[];
  total_leads: number;
  total_gaps: number;
}

export interface PublicBotInfo {
  name: string;
  description: string | null;
  welcome_message: string | null;
  strict_rag: boolean;
}

export interface PublicChatResponse {
  answer: string;
  sources: string[];
  grounded: boolean;
  fallback_triggered: boolean;
}
