import { useMutation } from "@tanstack/react-query";

import { useQueryClient } from "@tanstack/react-query";

import { datasetService } from "../services/dataset-service";

export function useDeleteDataset() {

    const queryClient =
        useQueryClient();

    return useMutation({

        mutationFn: (
            datasetId: number,
        ) =>
            datasetService.delete(
                datasetId,
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