export interface DatasetBuilder {

    dataset_id: number;

    dataset_name: string;

    dataset_version: string;

    dataset_status: string;

    total_records: number;

    valid_records: number;

    invalid_records: number;

    duplicate_records: number;

    build_status: string;

    last_build_at: string | null;

    created_at: string;

    updated_at: string;

}

export interface DatasetBuilderConfiguration {

    dataset_id: number;

    train_split: number;

    validation_split: number;

    test_split: number;

    shuffle: boolean;

    random_seed: number | null;

}

export interface DatasetValidationIssue {

    type: string;

    severity: string;

    message: string;

    affected_records: number;

}

export interface DatasetPreviewSample {

    id: number;

    input: string;

    output: string;

}

export interface DatasetBuilderResponse {

    summary: DatasetBuilder;

    configuration: DatasetBuilderConfiguration;

    validation: DatasetValidationIssue[];

    preview: DatasetPreviewSample[];

}

export interface BuildDatasetRequest {

    dataset_id: number;

}

export interface BuildDatasetResponse {

    build_id: number;

    status: string;

    message: string;

}