import { useMutation } from "@tanstack/react-query";

import { useQueryClient } from "@tanstack/react-query";

import { datasetRecordService } from "../services/dataset-record-service";

interface ImportRecordsMutation {

    datasetId: number;

    file: File;

}

export function useImportRecords() {

    const queryClient =
        useQueryClient();

    return useMutation({

        mutationFn: (
            data: ImportRecordsMutation,
        ) =>

            datasetRecordService.import(

                data.datasetId,

                data.file,

            ),

        onSuccess: (

            _,

            variables,

        ) => {

            queryClient.invalidateQueries({

                queryKey: [

                    "dataset-records",

                ],

            });

            queryClient.invalidateQueries({

                queryKey: [

                    "datasets",

                ],

            });

            queryClient.invalidateQueries({

                queryKey: [

                    "dataset",

                    variables.datasetId,

                ],

            });

        },

    });

}