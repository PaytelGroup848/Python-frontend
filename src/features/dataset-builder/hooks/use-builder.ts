import { useQuery } from "@tanstack/react-query";

import { datasetBuilderService } from "../services/dataset-builder-service";

export function useBuilder(
    datasetId: number,
) {

    return useQuery({

        queryKey: [

            "dataset-builder",

            datasetId,

        ],

        queryFn: () =>

            datasetBuilderService.get(

                datasetId,

            ),

        enabled:

            datasetId > 0,

    });

}