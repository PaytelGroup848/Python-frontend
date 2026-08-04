export interface Conversation {

    id: number;

    workspace_id: number;

    assistant_id: number | null;

    title: string;

    status: string;

    pinned: boolean;

    archived: boolean;

    message_count: number;

    last_message_at: string | null;

    created_at: string;

    updated_at: string;
}