import { useQuery } from "@tanstack/react-query";

import {
    modelVersionService,
} from "../services/model-version-service";

export function useModelVersions(
    modelId?: number,
) {
    return useQuery({

        queryKey: [
            "model-versions",
            modelId,
        ],

        queryFn: () =>
            modelVersionService.listByModel(
                modelId!,
            ),

        enabled: !!modelId,

    });
}