import { apiClient } from "@/services/api/client";

export interface TokenizerVersion {
    id: number;
    tokenizer_id: number;
    version: string;
    display_name: string;
    description: string | null;
    vocabulary_size: number;
    status: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

class TokenizerVersionService {

    async listByTokenizer(
        tokenizerId: number,
    ): Promise<TokenizerVersion[]> {

        const { data } = await apiClient.get(
            `/tokenizers/${tokenizerId}/versions`
        );

        return data;
    }

    async get(
        tokenizerVersionId: number,
    ): Promise<TokenizerVersion> {

        const { data } = await apiClient.get(
            `/tokenizers/versions/${tokenizerVersionId}`
        );

        return data;
    }
}

export const tokenizerVersionService =
    new TokenizerVersionService();