import {
    useQuery,
} from "@tanstack/react-query";

import {
    getAssistants,
} from "../services/assistant-service";

export function useAssistants() {

    return useQuery({

        queryKey: [
            "assistants",
        ],

        queryFn:
            getAssistants,

    });

}