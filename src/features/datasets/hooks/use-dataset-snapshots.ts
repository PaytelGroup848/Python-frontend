import { useQuery } from "@tanstack/react-query";

import {
    datasetSnapshotService,
} from "../services/dataset-snapshot-service";

export function useDatasetSnapshots(
    datasetId?: number,
) {

    return useQuery({

        queryKey: [
            "dataset-snapshots",
            datasetId,
        ],

        queryFn: () =>
            datasetSnapshotService.list(
                datasetId!,
            ),

        enabled: !!datasetId,

    });

}