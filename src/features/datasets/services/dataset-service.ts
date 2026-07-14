import { apiClient } from "@/services/api/client";

import {

    CreateDatasetRequest,

    Dataset,

    DatasetListResponse,

    DatasetQueryParams,

    UpdateDatasetRequest,

} from "../types/dataset";

class DatasetService {

    async list(
        params: DatasetQueryParams = {},
    ): Promise<DatasetListResponse> {

        const response = await apiClient.get<DatasetListResponse>(

            "/datasets",

            {

                params: {

                    page: params.page,

                    page_size: params.page_size,

                    search: params.search,

                    domain: params.domain,

                    status: params.status,

                    sort: params.sort,

                    direction: params.direction,

                },

            },

        );

        return response.data;

    }

    async get(
        datasetId: number,
    ): Promise<Dataset> {

        const response = await apiClient.get<Dataset>(
            `/datasets/${datasetId}`
        );

        return response.data;
    }

    async create(
        request: CreateDatasetRequest,
    ): Promise<Dataset> {

        const response = await apiClient.post<Dataset>(
            "/datasets",
            request,
        );

        return response.data;
    }

    async update(
        datasetId: number,
        request: UpdateDatasetRequest,
    ): Promise<Dataset> {

        const response = await apiClient.patch<Dataset>(
            `/datasets/${datasetId}`,
            request,
        );

        return response.data;
    }

    async delete(
        datasetId: number,
    ): Promise<void> {

        await apiClient.delete(
            `/datasets/${datasetId}`
        );
    }
}

export const datasetService = new DatasetService();