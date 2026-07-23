

import { apiClient } from "@/services/api/client";

import {
    DatasetSnapshot,
    DatasetSnapshotListResponse,
    DatasetSnapshotQueryParams,
    CreateDatasetSnapshotRequest,
} from "../types/dataset-snapshot";

class DatasetSnapshotService {

    async list(
        params: DatasetSnapshotQueryParams,
    ): Promise<DatasetSnapshotListResponse> {

        const response =
            await apiClient.get<DatasetSnapshotListResponse>(
                "/dataset-snapshots",
                {
                    params,
                },
            );

        return response.data;

    }

    async get(
        snapshotId: number,
    ): Promise<DatasetSnapshot> {

        const response =
            await apiClient.get<DatasetSnapshot>(
                `/dataset-snapshots/${snapshotId}`,
            );

        return response.data;

    }

    async create(
        request: CreateDatasetSnapshotRequest,
    ): Promise<DatasetSnapshot> {

        const response =
            await apiClient.post<DatasetSnapshot>(
                "/dataset-snapshots",
                request,
            );

        return response.data;

    }

    async seal(
        snapshotId: number,
    ): Promise<DatasetSnapshot> {

        const response =
            await apiClient.post<DatasetSnapshot>(
                `/dataset-snapshots/${snapshotId}/seal`,
            );

        return response.data;

    }

    async delete(
        snapshotId: number,
    ): Promise<void> {

        await apiClient.delete(
            `/dataset-snapshots/${snapshotId}`,
        );

    }

}

export const datasetSnapshotService =
    new DatasetSnapshotService();