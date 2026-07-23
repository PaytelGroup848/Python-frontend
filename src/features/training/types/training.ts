// src/features/training/types/training.ts

export interface TrainingJob {

    id: number;

    dataset_id: number;

    dataset_snapshot_id: number | null;

    training_provider_id: number;

    training_configuration_id: number;

    base_model_id: number;

    base_model_version_id: number | null;

    tokenizer_version_id: number | null;

    training_type: string;

    priority: number;

    created_by: string | null;

    status: string;

    is_active: boolean;

    artifact_path: string | null;

    started_at: string | null;

    completed_at: string | null;

    queued_at: string | null;

    failed_at: string | null;

    failure_reason: string | null;

    current_epoch: number;

    current_step: number;

    global_step: number;

    processed_samples: number;

    processed_tokens: number;

    current_loss: number | null;

    learning_rate: number | null;

    last_checkpoint_path: string | null;

    last_checkpoint_at: string | null;

    created_at: string;

    updated_at: string;

}

export interface CreateTrainingJobRequest {

    dataset_id: number;

    dataset_snapshot_id: number;

    training_provider_id: number;

    training_configuration_id: number;

    base_model_id: number;

    base_model_version_id: number;

    tokenizer_version_id?: number | null;

    training_type: string;

    priority: number;

    created_by?: string | null;

}

export interface UpdateTrainingJobRequest {

    status?: string;

    priority?: number;

    artifact_path?: string | null;

    failure_reason?: string | null;

}

export interface CancelTrainingJobRequest {

    training_job_id: number;

}

export interface PauseTrainingJobRequest {

    training_job_id: number;

}

export interface ResumeTrainingJobRequest {

    training_job_id: number;

}

export interface RetryTrainingJobRequest {

    training_job_id: number;

}

export interface TrainingJobQueryParams {

    page?: number;

    page_size?: number;

    search?: string;

    status?: string;

    dataset_id?: number;

    dataset_snapshot_id?: number;

    training_provider_id?: number;

    training_configuration_id?: number;

    base_model_id?: number;

    training_type?: string;

    sort?: string;

    direction?: "asc" | "desc";

}

export interface TrainingJobListResponse {

    items: TrainingJob[];

    total: number;

    page: number;

    page_size: number;

    total_pages: number;

}

export interface TrainingMetrics {

    current_epoch: number;

    current_step: number;

    global_step: number;

    processed_samples: number;

    processed_tokens: number;

    current_loss: number | null;

    learning_rate: number | null;

}

export interface TrainingCheckpoint {

    last_checkpoint_path: string | null;

    last_checkpoint_at: string | null;

}

export interface TrainingTimeline {

    queued_at: string | null;

    started_at: string | null;

    completed_at: string | null;

    failed_at: string | null;

}

export interface TrainingSummary {

    total_jobs: number;

    pending_jobs: number;

    running_jobs: number;

    completed_jobs: number;

    failed_jobs: number;

    cancelled_jobs: number;

}