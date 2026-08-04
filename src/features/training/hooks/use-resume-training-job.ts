import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import {
    trainingService,
} from "../services/training-service";

import {
    TrainingJob,
} from "../types/training";

export function useResumeTrainingJob() {

    const queryClient =
        useQueryClient();

    return useMutation<
        TrainingJob,
        Error,
        number
    >({

        mutationFn: (
            trainingJobId,
        ) =>
            trainingService.resume(
                trainingJobId,
            ),

        onSuccess: async (
            trainingJob,
        ) => {

            await queryClient.invalidateQueries({
                queryKey: [
                    "training-jobs",
                ],
            });

            await queryClient.invalidateQueries({
                queryKey: [
                    "training-job",
                    trainingJob.id,
                ],
            });

        },

    });

}