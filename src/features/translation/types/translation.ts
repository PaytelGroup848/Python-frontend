export type BlockType = "heading" | "paragraph" | "table" | "list_item";

export interface DocumentBlock {
  block_id: number;
  type: BlockType;
  text?: string | null;
  level?: number | null;
  rows?: string[][] | null;
  list_type?: "bullet" | "numbered" | null;
  list_level?: number | null;
}

export interface SupportedLanguage {
  code: string;
  display_name: string;
  native_name: string;
  is_source: boolean;
  is_target: boolean;
}

export type JobStatus = "queued" | "parsing" | "translating" | "exporting" | "completed" | "failed";

export interface DocumentJobStatus {
  job_id: string;
  filename: string;
  status: JobStatus;
  progress_percent: number;
  source_language: string;
  target_language: string;
  blocks_total: number;
  blocks_completed: number;
  original_blocks?: DocumentBlock[] | null;
  translated_blocks?: DocumentBlock[] | null;
  prompt_tokens_used: number;
  completion_tokens_used: number;
  total_tokens_used: number;
  error_message?: string | null;
  available_downloads: ("pdf" | "docx")[];
  created_at?: string | null;
  completed_at?: string | null;
}

export interface DocumentJobCreated {
  job_id: string;
  filename: string;
  status: string;
  source_language: string;
  target_language: string;
  message: string;
}

export interface TextTranslationResult {
  status: string;
  source_language: string;
  target_language: string;
  original_text: string;
  translated_text: string;
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}
