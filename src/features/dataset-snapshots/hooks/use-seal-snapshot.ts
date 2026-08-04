
import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import { datasetSnapshotService } from "../services/dataset-snapshot-service";

export function useSealSnapshot() {

    const queryClient =
        useQueryClient();

    return useMutation({

        mutationFn: (
            snapshotId: number,
        ) =>
            datasetSnapshotService.seal(
                snapshotId,
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