import { apiClient } from "@/services/api/client";

export interface ProviderStatus {
  name: string;
  status: string;
  latency_ms: number;
}

export interface ProviderResponse {
  providers: ProviderStatus[];
}

class ProviderService {

  async getProviders(): Promise<ProviderResponse> {

    const response = await apiClient.get("/admin/providers"
    );

    return response.data;
  }
}

export const providerService =
  new ProviderService();