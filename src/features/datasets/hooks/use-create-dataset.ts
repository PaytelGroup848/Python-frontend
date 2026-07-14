import { useMutation } from "@tanstack/react-query";

import { useQueryClient } from "@tanstack/react-query";

import { datasetService } from "../services/dataset-service";

import { CreateDatasetRequest } from "../types/dataset";

export function useCreateDataset() {

    const queryClient =
        useQueryClient();

    return useMutation({

        mutationFn: (
            request: CreateDatasetRequest,
        ) =>
            datasetService.create(
                request,
            ),

        onSuccess: () => {

            queryClient.invalidateQueries({

                queryKey: [
                    "datasets",
                ],

            });

        },

    });

}