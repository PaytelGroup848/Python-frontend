import { apiClient } from "@/services/api/client";

export interface Tokenizer {
    id: number;
    code: string;
    display_name: string;
    description: string | null;
    status: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

class TokenizerService {

    async list(): Promise<Tokenizer[]> {

        const { data } = await apiClient.get(
            "/tokenizers"
        );

        return data;
    }

    async get(
        tokenizerId: number,
    ): Promise<Tokenizer> {

        const { data } = await apiClient.get(
            `/tokenizers/${tokenizerId}`
        );

        return data;
    }
}

export const tokenizerService =
    new TokenizerService();