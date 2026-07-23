import { apiClient } from "@/services/api/client";

import {

    ModelListResponse,

} from "../types/model";

class ModelService {

    async list(): Promise<ModelListResponse> {

        const response =
            await apiClient.get<ModelListResponse>(
                "/models",
            );

        return response.data;

    }

}

export const modelService =
    new ModelService();