import { useMutation } from "@tanstack/react-query";

import { useQueryClient } from "@tanstack/react-query";

import { datasetService } from "../services/dataset-service";

import {
    UpdateDatasetRequest,
} from "../types/dataset";

interface UpdateDatasetMutation {

    datasetId: number;

    request: UpdateDatasetRequest;

}

export function useUpdateDataset() {

    const queryClient =
        useQueryClient();

    return useMutation({

        mutationFn: (
            data: UpdateDatasetMutation,
        ) =>
            datasetService.update(

                data.datasetId,

                data.request,

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