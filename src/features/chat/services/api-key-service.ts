import { apiClient } from "@/services/api/client";

export interface BackendApiKey {
  id: number | string;
  name: string;
  key?: string;
  api_key?: string;
  prefix?: string;
  is_active?: boolean;
  created_at?: string;
  last_used_at?: string;
}

export interface UsageOverview {
  total_tokens: number;
  prompt_tokens: number;
  completion_tokens: number;
  monthly_tokens: number;
  token_limit: number;
  remaining_tokens: number;
  estimated_cost: number;
  plan_name: string;
}

export async function fetchApiKeys(): Promise<BackendApiKey[]> {
  try {
    const res = await apiClient.get<BackendApiKey[] | { api_keys?: BackendApiKey[]; keys?: BackendApiKey[] }>("/api-keys");
    const data = res.data;
    if (Array.isArray(data)) {
      return data;
    }
    return data.api_keys || data.keys || [];
  } catch (err) {
    console.error("Backend API keys fetch error:", err);
    return [];
  }
}

export async function createBackendApiKey(name: string): Promise<BackendApiKey> {
  const res = await apiClient.post<BackendApiKey>("/api-keys", { name });
  return res.data;
}

export async function deleteBackendApiKey(keyId: string | number): Promise<boolean> {
  try {
    const res = await apiClient.delete(`/api-keys/${keyId}`);
    return res.status >= 200 && res.status < 300;
  } catch (err) {
    console.error("Failed to delete API key on backend:", err);
    return false;
  }
}

export async function disableBackendApiKey(keyId: string | number): Promise<boolean> {
  try {
    const res = await apiClient.patch(`/api-keys/${keyId}/disable`);
    return res.status >= 200 && res.status < 300;
  } catch (err) {
    console.error("Failed to disable API key on backend:", err);
    return false;
  }
}

export async function fetchUsageOverview(): Promise<UsageOverview> {
  try {
    const res = await apiClient.get<Partial<UsageOverview>>("/api-keys/usage");
    const data = res.data;
    return {
      total_tokens: Number(data.total_tokens || 0),
      prompt_tokens: Number(data.prompt_tokens || 0),
      completion_tokens: Number(data.completion_tokens || 0),
      monthly_tokens: Number(data.monthly_tokens || 0),
      token_limit: Number(data.token_limit || 100000),
      remaining_tokens: Number(data.remaining_tokens || 100000),
      estimated_cost: Number(data.estimated_cost || 0),
      plan_name: String(data.plan_name || "free"),
    };
  } catch (err) {
    console.warn("Failed to fetch backend usage overview:", err);
    return {
      total_tokens: 0,
      prompt_tokens: 0,
      completion_tokens: 0,
      monthly_tokens: 0,
      token_limit: 100000,
      remaining_tokens: 100000,
      estimated_cost: 0,
      plan_name: "free",
    };
  }
}
