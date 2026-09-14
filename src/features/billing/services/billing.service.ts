import { apiClient } from "@/services/api/client";
import {
  PublicPlansResponse,
  PurchaseSubscriptionPayload,
  PurchaseResponse,
  VerifyPaymentPayload,
  VerifyPaymentResponse,
  UserUsageSummary,
} from "../types/billing.types";

export async function fetchPublicPlans(): Promise<PublicPlansResponse> {
  const { data } = await apiClient.get<PublicPlansResponse>("/plans");
  return data;
}

export async function purchaseSubscription(
  payload: PurchaseSubscriptionPayload
): Promise<PurchaseResponse> {
  const { data } = await apiClient.post<PurchaseResponse>(
    "/subscriptions/purchase",
    payload
  );
  return data;
}

export async function verifyPayment(
  payload: VerifyPaymentPayload
): Promise<VerifyPaymentResponse> {
  const { data } = await apiClient.post<VerifyPaymentResponse>(
    "/subscriptions/verify-payment",
    payload
  );
  return data;
}

export async function fetchUserUsage(): Promise<UserUsageSummary> {
  const { data } = await apiClient.get<UserUsageSummary>("/billing/usage");
  return data;
}

export async function fetchUserSubscription() {
  const { data } = await apiClient.get("/billing/subscription");
  return data;
}

export async function cancelSubscription(): Promise<{ message: string }> {
  const { data } = await apiClient.post<{ message: string }>("/billing/subscription/cancel");
  return data;
}

