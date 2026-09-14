import { apiClient } from "@/services/api/client";

export interface MediaActionResult {
  success: boolean;
  data: {
    id: number;
    file_url: string;
    parent_image_id?: number;
    dimensions?: string;
    edit_type?: string;
    status: string;
  };
}

export async function removeImageBackground(params: {
  imageId?: number;
  fileUrl?: string;
}): Promise<MediaActionResult> {
  const { data } = await apiClient.post<MediaActionResult>("/api/v1/media/remove-bg", {
    image_id: params.imageId,
    file_url: params.fileUrl,
  });
  return data;
}

export async function upscaleImage4K(params: {
  imageId?: number;
  fileUrl?: string;
  scale?: number;
}): Promise<MediaActionResult> {
  const { data } = await apiClient.post<MediaActionResult>("/api/v1/media/upscale", {
    image_id: params.imageId,
    file_url: params.fileUrl,
    scale: params.scale || 4,
  });
  return data;
}
