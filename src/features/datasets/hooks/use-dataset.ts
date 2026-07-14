import { useQuery } from "@tanstack/react-query";

import { datasetService } from "../services/dataset-service";

export function useDataset(
    datasetId: number,
) {

    return useQuery({

        queryKey: [

            "dataset",

            datasetId,

        ],

        queryFn: () =>

            datasetService.get(

                datasetId,

            ),

        enabled:

            Number.isFinite(

                datasetId,

            ),

    });

}