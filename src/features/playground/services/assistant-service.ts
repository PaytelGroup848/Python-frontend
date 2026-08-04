import { apiClient } from "@/services/api/client";

import {
    Assistant,
} from "../types/assistant";

export async function getAssistants() {

    const { data } =
        await apiClient.get<
            Assistant[]
        >(
            "/assistants"
        );

    return data;
}