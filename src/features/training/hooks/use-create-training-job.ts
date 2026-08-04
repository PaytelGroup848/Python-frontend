
import {

    useMutation,

    useQueryClient,

} from "@tanstack/react-query";

import {

    trainingService,

} from "../services/training-service";

import {

    CreateTrainingJobRequest,

    TrainingJob,

} from "../types/training";

export function useCreateTrainingJob() {

    const queryClient = useQueryClient();

    return useMutation<

        TrainingJob,

        Error,

        CreateTrainingJobRequest

    >({

        mutationFn: (

            request,

        ) =>

            trainingService.create(

                request,

            ),

        onSuccess: async () => {

            await queryClient.invalidateQueries({

                queryKey: [
                    "training-jobs",
                ],

            });

        },

    });

}