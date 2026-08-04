import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  updatePrice,
} from "../services/plan-service";

interface UpdatePriceMutation {
  priceId: number;

  payload: {
    provider: string;

    currency: string;

    amount: number;

    billing_cycle: string;

    external_price_id?: string;
  };
}

export function useUpdatePrice() {

  const queryClient =
    useQueryClient();

  return useMutation({

    mutationFn: (
      data: UpdatePriceMutation
    ) =>
      updatePrice(
        data.priceId,
        data.payload
      ),

    onSuccess: async () => {

      await queryClient.invalidateQueries({

        queryKey: [
          "plan-prices"
        ],
      });
    },
  });
}