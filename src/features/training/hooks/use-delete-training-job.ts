import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import {
    trainingService,
} from "../services/training-service";

export function useDeleteTrainingJob() {

    const queryClient = useQueryClient();

    return useMutation<void, Error, number>({

        mutationFn: (
            trainingJobId,
        ) =>
            trainingService.delete(
                trainingJobId,
            ),

        onSuccess: () => {

            queryClient.invalidateQueries({

                queryKey: [
                    "training-jobs",
                ],

            });

        },

    });

}