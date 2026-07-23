import { apiClient } from "@/services/api/client";

export interface TrainingProvider {

    id: number;

    provider_code: string;

    display_name: string;

    description: string | null;

    status: string;

    created_at: string;

    updated_at: string;

}

class TrainingProviderService {

    async list(): Promise<TrainingProvider[]> {

        const { data } = await apiClient.get(
            "/training/providers",
        );

        return data;

    }

    async get(
        providerId: number,
    ): Promise<TrainingProvider> {

        const { data } = await apiClient.get(
            `/training/providers/${providerId}`,
        );

        return data;

    }

}

export const trainingProviderService =
    new TrainingProviderService();