export interface DatasetRecord {

    id: number;

    dataset_id: number;

    external_id: string | null;

    input: string;

    output: string;

    metadata: Record<string, unknown> | null;

    status: string;

    created_at: string;

    updated_at: string;

}

export interface CreateDatasetRecordRequest {

    dataset_id: number;

    external_id?: string;

    input: string;

    output: string;

    metadata?: Record<string, unknown>;

}

export interface UpdateDatasetRecordRequest {

    external_id?: string;

    input?: string;

    output?: string;

    metadata?: Record<string, unknown>;

    status?: string;

}

export interface DatasetRecordQueryParams {

    page?: number;

    page_size?: number;

    search?: string;

    status?: string;

    dataset_id?: number;

    sort?: string;

    direction?: "asc" | "desc";

}

export interface DatasetRecordListResponse {

    items: DatasetRecord[];

    total: number;

    page: number;

    page_size: number;

    total_pages: number;

}