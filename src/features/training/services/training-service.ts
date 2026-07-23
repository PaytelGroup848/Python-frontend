
import { apiClient } from "@/services/api/client";

import {

    CreateTrainingJobRequest,

    TrainingJob,

    TrainingJobListResponse,

    TrainingJobQueryParams,

    UpdateTrainingJobRequest,

} from "../types/training";

class TrainingService {

    async list(
        params: TrainingJobQueryParams = {},
    ): Promise<TrainingJobListResponse> {

        const response = await apiClient.get<TrainingJobListResponse>(

            "/training/jobs",

            {

                params: {

                    page: params.page,

                    page_size: params.page_size,

                    search: params.search,

                    status: params.status,

                    dataset_id: params.dataset_id,

                    dataset_snapshot_id:
                        params.dataset_snapshot_id,

                    training_provider_id:
                        params.training_provider_id,

                    training_configuration_id:
                        params.training_configuration_id,

                    base_model_id:
                        params.base_model_id,

                    training_type:
                        params.training_type,

                    sort:
                        params.sort,

                    direction:
                        params.direction,

                },

            },

        );

        return response.data;

    }

    async get(
        trainingJobId: number,
    ): Promise<TrainingJob> {

        const response =
            await apiClient.get<TrainingJob>(

                `/training/jobs/${trainingJobId}`,

            );

        return response.data;

    }

    async create(
        request: CreateTrainingJobRequest,
    ): Promise<TrainingJob> {

        const response =
            await apiClient.post<TrainingJob>(

                "/training/jobs",

                request,

            );

        return response.data;

    }

    async update(
        trainingJobId: number,
        request: UpdateTrainingJobRequest,
    ): Promise<TrainingJob> {

        const response =
            await apiClient.patch<TrainingJob>(

                `/training/jobs/${trainingJobId}`,

                request,

            );

        return response.data;

    }

    async cancel(
        trainingJobId: number,
    ): Promise<TrainingJob> {

        const response =
            await apiClient.post<TrainingJob>(

                `/training/jobs/${trainingJobId}/cancel`,

            );

        return response.data;

    }

    async pause(
        trainingJobId: number,
    ): Promise<TrainingJob> {

        const response =
            await apiClient.post<TrainingJob>(

                `/training/jobs/${trainingJobId}/pause`,

            );

        return response.data;

    }

    async resume(
        trainingJobId: number,
    ): Promise<TrainingJob> {

        const response =
            await apiClient.post<TrainingJob>(

                `/training/jobs/${trainingJobId}/resume`,

            );

        return response.data;

    }

    async dispatch(
        trainingJobId: number,
    ): Promise<TrainingJob> {

        const response =
            await apiClient.post<TrainingJob>(

                `/training/jobs/${trainingJobId}/dispatch`,

            );

        return response.data;

    }

    async retry(
        trainingJobId: number,
    ): Promise<TrainingJob> {

        const response =
            await apiClient.post<TrainingJob>(

                `/training/jobs/${trainingJobId}/retry`,

            );

        return response.data;

    }

    async delete(
        trainingJobId: number,
    ): Promise<void> {

        await apiClient.delete(

            `/training/jobs/${trainingJobId}`,

        );

    }

}

export const trainingService =
    new TrainingService();