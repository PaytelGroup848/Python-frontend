export interface Dataset {
    id: number;

    name: string;

    domain: string;

    version: string;

    description: string | null;

    source: string | null;

    record_count: number;

    corpus_name?: string;

    snapshot_count?: number;

    training_job_count?: number;

    status: string;

    created_at: string;
}

export interface CreateDatasetRequest {

    corpus_id: number;

    name: string;

    domain: string;

    version: string;

    description?: string;

    source?: string;

}

export interface UpdateDatasetRequest {
    name?: string;

    domain?: string;

    version?: string;

    description?: string;

    source?: string;

    status?: string;
}

export interface DatasetQueryParams {

    page?: number;

    page_size?: number;

    search?: string;

    status?: string;

    domain?: string;

    sort?: string;

    direction?: "asc" | "desc";

}

export interface DatasetListResponse {

    items: Dataset[];

    total: number;

    page: number;

    page_size: number;

    total_pages: number;

}