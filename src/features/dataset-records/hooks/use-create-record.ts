import { useMutation } from "@tanstack/react-query";

import { useQueryClient } from "@tanstack/react-query";

import { datasetRecordService } from "../services/dataset-record-service";

import {
    CreateDatasetRecordRequest,
} from "../types/dataset-record";

export function useCreateRecord() {

    const queryClient =
        useQueryClient();

    return useMutation({

        mutationFn: (
            request: CreateDatasetRecordRequest,
        ) =>

            datasetRecordService.create(

                request,

            ),

        onSuccess: (
            record,
        ) => {

            queryClient.invalidateQueries({

                queryKey: [

                    "dataset-records",

                ],

            });

            queryClient.invalidateQueries({

                queryKey: [

                    "dataset-record",

                    record.id,

                ],

            });

        },

    });

}