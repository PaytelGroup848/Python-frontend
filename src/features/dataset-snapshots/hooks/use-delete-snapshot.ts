
import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import { datasetSnapshotService } from "../services/dataset-snapshot-service";

export function useDeleteSnapshot() {

    const queryClient =
        useQueryClient();

    return useMutation({

        mutationFn: (
            snapshotId: number,
        ) =>
            datasetSnapshotService.delete(
                snapshotId,
            ),

        onSuccess: (
            _,
            snapshotId,
        ) => {

            queryClient.invalidateQueries({

                queryKey: [

                    "dataset-snapshots",

                ],

            });

            queryClient.removeQueries({

                queryKey: [

                    "dataset-snapshot",

                    snapshotId,

                ],

            });

        },

    });

}