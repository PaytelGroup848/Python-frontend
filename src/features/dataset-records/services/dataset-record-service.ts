import { apiClient } from "@/services/api/client";

import {

    DatasetRecord,

    DatasetRecordListResponse,

    DatasetRecordQueryParams,

    CreateDatasetRecordRequest,

    UpdateDatasetRecordRequest,

} from "../types/dataset-record";

class DatasetRecordService {

    async list(
        params: DatasetRecordQueryParams,
    ): Promise<DatasetRecordListResponse> {

        const response =
            await apiClient.get<DatasetRecordListResponse>(

                "/dataset-records",

                {

                    params,

                },

            );

        return response.data;

    }

    async get(
        recordId: number,
    ): Promise<DatasetRecord> {

        const response =
            await apiClient.get<DatasetRecord>(

                `/dataset-records/${recordId}`,

            );

        return response.data;

    }

    async create(
        request: CreateDatasetRecordRequest,
    ): Promise<DatasetRecord> {

        const response =
            await apiClient.post<DatasetRecord>(

                "/dataset-records",

                request,

            );

        return response.data;

    }

    async update(
        recordId: number,
        request: UpdateDatasetRecordRequest,
    ): Promise<DatasetRecord> {

        const response =
            await apiClient.patch<DatasetRecord>(

                `/dataset-records/${recordId}`,

                request,

            );

        return response.data;

    }

    async delete(
        recordId: number,
    ): Promise<void> {

        await apiClient.delete(

            `/dataset-records/${recordId}`,

        );

    }

    async import(
        datasetId: number,
        file: File,
    ): Promise<void> {

        const formData =
            new FormData();

        formData.append(

            "file",

            file,

        );

        const response =
            await apiClient.post(

                `/datasets/${datasetId}/records/import`,

                formData,

                {

                    headers: {

                        "Content-Type":

                            "multipart/form-data",

                    },

                },

            );

        return response.data;

    }

}

export const datasetRecordService =
    new DatasetRecordService();