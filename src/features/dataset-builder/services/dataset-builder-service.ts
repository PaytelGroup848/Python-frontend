import { apiClient } from "@/services/api/client";

import {

    DatasetBuilderResponse,

    BuildDatasetRequest,

    BuildDatasetResponse,

} from "../types/dataset-builder";

class DatasetBuilderService {

    async get(
        datasetId: number,
    ): Promise<DatasetBuilderResponse> {

        const response =
            await apiClient.get<DatasetBuilderResponse>(

                `/datasets/${datasetId}/builder`,

            );

        return response.data;

    }

    async build(
        request: BuildDatasetRequest,
    ): Promise<BuildDatasetResponse> {

        const response =
            await apiClient.post<BuildDatasetResponse>(

                `/datasets/${request.dataset_id}/builder/build`,

            );

        return response.data;

    }

}

export const datasetBuilderService =
    new DatasetBuilderService();