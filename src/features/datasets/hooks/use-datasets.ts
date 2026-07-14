import { useQuery } from "@tanstack/react-query";

import { datasetService } from "../services/dataset-service";

import {
    DatasetQueryParams,
} from "../types/dataset";

export function useDatasets(
    params?: DatasetQueryParams,
) {

    return useQuery({

        queryKey: [

            "datasets",

            params,

        ],

        queryFn: () =>
            datasetService.list(
                params ?? {},
            ),

        });

}