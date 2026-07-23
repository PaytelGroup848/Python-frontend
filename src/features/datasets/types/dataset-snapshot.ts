export interface DatasetSnapshot {

    id: number;

    dataset_id: number;

    snapshot_code: string;

    status: string;

    record_count: number;

    max_record_id: number | null;

    content_hash: string;

    snapshot_metadata_json: Record<string, unknown>;

    is_immutable: boolean;

    frozen_at: string;

    created_at: string;

}