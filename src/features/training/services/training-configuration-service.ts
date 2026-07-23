
import { apiClient } from "@/services/api/client";

export interface TrainingConfiguration {

    id: number;

    configuration_code: string;

    display_name: string;

    description: string | null;

    training_type: string;

    runtime_code: string;

    configuration_json: Record<string, unknown>;

    published_at: string | null;

    is_system: boolean;

    created_by: string;

    created_at: string;

    updated_at: string;
}


export interface CreateTrainingConfigurationRequest {

    configuration_code: string;

    display_name: string;

    description?: string | null;

    training_type: string;

    runtime_code: string;

    configuration_json: Record<string, unknown>;

    created_by: string;

}

export interface UpdateTrainingConfigurationRequest {
    display_name?: string;
    description?: string | null;
    status?: string;
}

class TrainingConfigurationService {

    async list(): Promise<TrainingConfiguration[]> {

        const { data } = await apiClient.get(
            "/training/configurations",
        );

        return data;
    }

    async get(
        id: number,
    ): Promise<TrainingConfiguration> {

        const response = await apiClient.get(
            `/training/configurations/${id}`,
        );

        return response.data;
    }

    async create(
        payload: CreateTrainingConfigurationRequest,
    ): Promise<TrainingConfiguration> {

        const response = await apiClient.post(
            "/training/configurations",
            payload,
        );

        return response.data;
    }

    async update(
        id: number,
        payload: UpdateTrainingConfigurationRequest,
    ): Promise<TrainingConfiguration> {

        const response = await apiClient.put(
            `/training/configurations/${id}`,
            payload,
        );

        return response.data;
    }

    async clone(
        id: number,
    ): Promise<TrainingConfiguration> {

        const response = await apiClient.post(
            `/training/configurations/${id}/clone`,
        );

        return response.data;
    }

    async activate(
        id: number,
    ): Promise<void> {

        await apiClient.post(
            `/training/configurations/${id}/activate`,
        );
    }

    async publish(
        id: number,
    ): Promise<void> {

        await apiClient.post(
            `/training/configurations/${id}/publish`,
        );
    }
}

export const trainingConfigurationService =
    new TrainingConfigurationService();