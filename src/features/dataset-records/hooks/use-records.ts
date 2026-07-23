import { useQuery } from "@tanstack/react-query";

import { datasetRecordService } from "../services/dataset-record-service";

import {
    DatasetRecordQueryParams,
} from "../types/dataset-record";

export function useRecords(
    params: DatasetRecordQueryParams,
) {

    return useQuery({

        queryKey: [

            "dataset-records",

            params,

        ],

        queryFn: () =>

            datasetRecordService.list(

                params,

            ),

        placeholderData: (
            previousData,
        ) => previousData,

    });

}