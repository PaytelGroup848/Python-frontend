import { useMutation } from "@tanstack/react-query";

import { useQueryClient } from "@tanstack/react-query";

import { datasetRecordService } from "../services/dataset-record-service";

export function useDeleteRecord() {

    const queryClient =
        useQueryClient();

    return useMutation({

        mutationFn: (
            recordId: number,
        ) =>

            datasetRecordService.delete(

                recordId,

            ),

        onSuccess: (

            _,

            recordId,

        ) => {

            queryClient.invalidateQueries({

                queryKey: [

                    "dataset-records",

                ],

            });

            queryClient.removeQueries({

                queryKey: [

                    "dataset-record",

                    recordId,

                ],

            });

        },

    });

}