
import { useQuery } from "@tanstack/react-query";

import { trainingService } from "../services/training-service";

export function useTrainingJob(
    trainingJobId: number,
) {

    return useQuery({

        queryKey: [

            "training-job",

            trainingJobId,

        ],

        queryFn: () =>

            trainingService.get(

                trainingJobId,

            ),

        enabled:

            trainingJobId > 0,

    });

}