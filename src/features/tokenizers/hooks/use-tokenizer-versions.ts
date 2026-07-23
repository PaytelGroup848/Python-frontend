import { useQuery } from "@tanstack/react-query";

import {
    tokenizerVersionService,
} from "../services/tokenizer-version-service";

export function useTokenizerVersions(
    tokenizerId?: number,
) {

    return useQuery({

        queryKey: [
            "tokenizer-versions",
            tokenizerId,
        ],

        queryFn: () =>
            tokenizerVersionService.listByTokenizer(
                tokenizerId!,
            ),

        enabled: !!tokenizerId,

    });

}