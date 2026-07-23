import { useQuery } from "@tanstack/react-query";

import { datasetRecordService } from "../services/dataset-record-service";

export function useRecord(
    recordId: number,
) {

    return useQuery({

        queryKey: [

            "dataset-record",

            recordId,

        ],

        queryFn: () =>

            datasetRecordService.get(

                recordId,

            ),

        enabled:

            recordId > 0,

    });

}