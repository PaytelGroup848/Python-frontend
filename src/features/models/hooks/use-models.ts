import {

    useQuery,

} from "@tanstack/react-query";

import {

    modelService,

} from "../services/model-service";

export function useModels() {

    return useQuery({

        queryKey: [

            "models",

        ],

        queryFn: () =>

            modelService.list(),

    });

}