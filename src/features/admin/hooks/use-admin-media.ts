"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAdminMedia,
  deleteAdminMedia,
  AdminMediaResponse,
  AdminMediaParams,
} from "../services/media-service";

export function useAdminMedia(params?: AdminMediaParams) {
  return useQuery<AdminMediaResponse>({
    queryKey: ["admin-media", params],
    queryFn: () => getAdminMedia(params),
  });
}

export function useDeleteAdminMedia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (imageId: number) => deleteAdminMedia(imageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-media"] });
    },
  });
}

