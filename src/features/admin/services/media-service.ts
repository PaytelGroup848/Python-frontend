import { apiClient } from "@/services/api/client";

export interface AdminMediaItem {
  id: number;
  user_id: number;
  conversation_id?: number | null;
  provider: string;
  model_name: string;
  original_prompt: string;
  enhanced_prompt?: string;
  file_url: string;
  aspect_ratio?: string;
  status: string;
  created_at: string;
  user_name: string;
  user_email: string;
}

export interface AdminMediaResponse {
  images: AdminMediaItem[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface AdminMediaParams {
  page?: number;
  limit?: number;
  provider?: string;
  search?: string;
}

export async function getAdminMedia(params?: AdminMediaParams): Promise<AdminMediaResponse> {
  const { data } = await apiClient.get<AdminMediaResponse>("/admin/media", {
    params,
  });
  return data;
}

export async function deleteAdminMedia(imageId: number): Promise<{ success: boolean; message: string }> {
  const { data } = await apiClient.delete<{ success: boolean; message: string }>(`/admin/media/${imageId}`);
  return data;
}

