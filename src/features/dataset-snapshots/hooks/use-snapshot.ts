

import { useQuery } from "@tanstack/react-query";

import { datasetSnapshotService } from "../services/dataset-snapshot-service";

export function useSnapshot(
    snapshotId: number,
) {

    return useQuery({

        queryKey: [

            "dataset-snapshot",

            snapshotId,

        ],

        queryFn: () =>

            datasetSnapshotService.get(

                snapshotId,

            ),

        enabled:

            snapshotId > 0,

    });

}