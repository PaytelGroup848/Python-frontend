import { useQuery } from "@tanstack/react-query";

import {
    tokenizerService,
} from "../services/tokenizer-service";

export function useTokenizers() {

    return useQuery({

        queryKey: [
            "tokenizers",
        ],

        queryFn: () =>
            tokenizerService.list(),

    });

}