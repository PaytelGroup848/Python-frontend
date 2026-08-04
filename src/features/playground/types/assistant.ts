export interface AssistantConfig {

    id: number;

    assistant_id: number;

    model_id: number | null;

    temperature: number;

    top_p: number;

    max_tokens: number;

    context_window: number;

    memory_enabled: boolean;

    rag_enabled: boolean;

    cag_enabled: boolean;

    tool_calling_enabled: boolean;

    voice_enabled: boolean;

    ocr_enabled: boolean;

    web_search_enabled: boolean;

    document_chat_enabled: boolean;

    image_generation_enabled: boolean;

}

export interface Assistant {

    id: number;

    name: string;

    code: string;

    description: string | null;

    system_prompt: string | null;

    is_active: boolean;

    created_at: string;

    updated_at: string;

    config: AssistantConfig | null;

}