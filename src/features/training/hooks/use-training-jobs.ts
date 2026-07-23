
import { useQuery } from "@tanstack/react-query";

import { trainingService } from "../services/training-service";

import {
    TrainingJobQueryParams,
} from "../types/training";

export function useTrainingJobs(
    params: TrainingJobQueryParams,
) {

    return useQuery({

        queryKey: [

            "training-jobs",

            params,

        ],

        queryFn: () =>

            trainingService.list(

                params,

            ),

        placeholderData: (

            previousData,

        ) =>

            previousData,

    });

}