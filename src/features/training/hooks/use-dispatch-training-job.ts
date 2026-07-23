
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

export function useDispatchTrainingJob() {

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

            trainingService.dispatch(
                trainingJobId,
            ),

        onSuccess: (
            trainingJob,
        ) => {

            queryClient.invalidateQueries({

                queryKey: [

                    "training-jobs",

                ],

            });

            queryClient.invalidateQueries({

                queryKey: [

                    "training-job",

                    trainingJob.id,

                ],

            });

        },

    });

}