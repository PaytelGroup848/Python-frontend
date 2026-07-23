import { useMutation } from "@tanstack/react-query";

import { useQueryClient } from "@tanstack/react-query";

import { datasetBuilderService } from "../services/dataset-builder-service";

import {
    BuildDatasetRequest,
} from "../types/dataset-builder";

export function useBuildDataset() {

    const queryClient =
        useQueryClient();

    return useMutation({

        mutationFn: (
            request: BuildDatasetRequest,
        ) =>

            datasetBuilderService.build(

                request,

            ),

        onSuccess: (

            _,

            variables,

        ) => {

            queryClient.invalidateQueries({

                queryKey: [

                    "dataset-builder",

                    variables.dataset_id,

                ],

            });

            queryClient.invalidateQueries({

                queryKey: [

                    "datasets",

                ],

            });

        },

    });

}