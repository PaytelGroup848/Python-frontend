

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { datasetSnapshotService } from "../services/dataset-snapshot-service";

import {
    CreateDatasetSnapshotRequest,
} from "../types/dataset-snapshot";

export function useCreateSnapshot() {

    const queryClient =
        useQueryClient();

    return useMutation({

        mutationFn: (
            request: CreateDatasetSnapshotRequest,
        ) =>
            datasetSnapshotService.create(
                request,
            ),

        onSuccess: async (snapshot) => {

            await queryClient.invalidateQueries({
                queryKey: ["dataset-snapshots"],
            });

            queryClient.setQueryData(
                ["dataset-snapshot", snapshot.id],
                snapshot,
            );

        },

    });

}