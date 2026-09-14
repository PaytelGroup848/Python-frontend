import { useAuthStore } from "@/stores/auth-store";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.patwatoliai.com" ||"http://localhost:8000";

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

function getAuthHeaders(): Record<string, string> {
  const token = useAuthStore.getState().accessToken;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

export async function fetchApiKeys(): Promise<BackendApiKey[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api-keys`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch API keys");
    const data = await res.json();
    return Array.isArray(data) ? data : data.api_keys || data.keys || [];
  } catch (err) {
    console.error("Backend API keys fetch error:", err);
    return [];
  }
}

export async function createBackendApiKey(name: string): Promise<BackendApiKey> {
  const res = await fetch(`${API_BASE_URL}/api-keys`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ name }),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || "Failed to create API key");
  }
  return await res.json();
}

export async function deleteBackendApiKey(keyId: string | number): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/api-keys/${keyId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return res.ok;
  } catch (err) {
    console.error("Failed to delete API key on backend:", err);
    return false;
  }
}

export async function disableBackendApiKey(keyId: string | number): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/api-keys/${keyId}/disable`, {
      method: "PATCH",
      headers: getAuthHeaders(),
    });
    return res.ok;
  } catch (err) {
    console.error("Failed to disable API key on backend:", err);
    return false;
  }
}

export async function fetchUsageOverview(): Promise<UsageOverview> {
  try {
    const res = await fetch(`${API_BASE_URL}/api-keys/usage`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch usage overview");
    const data = await res.json();
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

