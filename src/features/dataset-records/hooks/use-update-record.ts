import { useMutation } from "@tanstack/react-query";

import { useQueryClient } from "@tanstack/react-query";

import { datasetRecordService } from "../services/dataset-record-service";

import {
    UpdateDatasetRecordRequest,
} from "../types/dataset-record";

interface UpdateRecordMutation {

    recordId: number;

    request: UpdateDatasetRecordRequest;

}

export function useUpdateRecord() {

    const queryClient =
        useQueryClient();

    return useMutation({

        mutationFn: (
            data: UpdateRecordMutation,
        ) =>

            datasetRecordService.update(

                data.recordId,

                data.request,

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