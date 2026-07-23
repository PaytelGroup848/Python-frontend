

import { useQuery } from "@tanstack/react-query";

import { datasetSnapshotService } from "../services/dataset-snapshot-service";

import {
    DatasetSnapshotQueryParams,
} from "../types/dataset-snapshot";

export function useSnapshots(
    params: DatasetSnapshotQueryParams,
) {

    return useQuery({

        queryKey: [

            "dataset-snapshots",

            params,

        ],

        queryFn: () =>

            datasetSnapshotService.list(

                params,

            ),

        placeholderData: (

            previousData,

        ) =>

            previousData,

    });

}