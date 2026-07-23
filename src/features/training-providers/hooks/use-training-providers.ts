import { useQuery } from "@tanstack/react-query";

import {
    trainingProviderService,
} from "../services/training-provider-service";

export function useTrainingProviders() {

    return useQuery({

        queryKey: [
            "training-providers",
        ],

        queryFn: () =>
            trainingProviderService.list(),

    });

}