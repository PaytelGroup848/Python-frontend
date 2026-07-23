import { useQuery } from "@tanstack/react-query";

import {
    trainingConfigurationService,
} from "../services/training-configuration-service";

export function useTrainingConfigurations() {

    return useQuery({

        queryKey: [
            "training-configurations",
        ],

        queryFn: () =>
            trainingConfigurationService.list(),

    });

}