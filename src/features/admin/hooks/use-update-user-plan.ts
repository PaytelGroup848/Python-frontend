"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  updateUserPlan,
} from "../services/user-service";

export function useUpdateUserPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      planName,
    }: {
      userId: number;
      planName: string;
    }) =>
      updateUserPlan(
        userId,
        planName
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-users"],
      });
    },
  });
}
