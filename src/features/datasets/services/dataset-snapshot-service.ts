import { apiClient } from "@/services/api/client";

import {
    DatasetSnapshot,
} from "../types/dataset-snapshot";

class DatasetSnapshotService {

    async list(
        datasetId: number,
    ): Promise<DatasetSnapshot[]> {

        const response =
            await apiClient.get<DatasetSnapshot[]>(

                `/datasets/${datasetId}/snapshots`

            );

        return response.data;

    }

    async get(
        datasetId: number,
        snapshotId: number,
    ): Promise<DatasetSnapshot> {

        const snapshots =
            await this.list(
                datasetId,
            );

        const snapshot =
            snapshots.find(
                item =>
                    item.id === snapshotId,
            );

        if (!snapshot) {

            throw new Error(
                "Dataset snapshot not found.",
            );

        }

        return snapshot;

    }

}

export const datasetSnapshotService =
    new DatasetSnapshotService();