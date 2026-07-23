export interface DatasetSnapshot {
    id: number;

    dataset_id: number;

    snapshot_name: string;

    snapshot_version: number;

    status: string;

    is_immutable: boolean;

    record_count: number;

    max_record_id: number | null;

    content_hash: string | null;

    description: string | null;

    metadata_json: Record<string, unknown> | null;

    created_at: string;

    updated_at: string;

    sealed_at: string | null;
}

export interface CreateDatasetSnapshotRequest {
    dataset_id: number;

    snapshot_name: string;

    description?: string | null;

    metadata_json?: Record<string, unknown> | null;
}

export interface SealDatasetSnapshotRequest {
    snapshot_id: number;
}

export interface DatasetSnapshotQueryParams {
    dataset_id: number;

    page?: number;

    page_size?: number;

    search?: string;

    status?: string;

    is_immutable?: boolean;
}

export interface DatasetSnapshotListResponse {
    items: DatasetSnapshot[];

    total: number;

    page: number;

    page_size: number;

    total_pages: number;
}
