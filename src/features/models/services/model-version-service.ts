import { apiClient } from "@/services/api/client";

export interface ModelVersion {

    id: number;

    model_id: number;

    version: string;

    display_name: string;

    description: string | null;

    status: string;

    is_active: boolean;

    created_at: string;

    updated_at: string;

}

class ModelVersionService {

    async listByModel(
        modelId: number,
    ): Promise<ModelVersion[]> {

        const { data } =
            await apiClient.get<ModelVersion[]>(

                `/models/${modelId}/versions`

            );

        return data;

    }

    async get(
        modelVersionId: number,
    ): Promise<ModelVersion> {

        const { data } =
            await apiClient.get<ModelVersion>(

                `/models/versions/${modelVersionId}`

            );

        return data;

    }

}

export const modelVersionService =
    new ModelVersionService();