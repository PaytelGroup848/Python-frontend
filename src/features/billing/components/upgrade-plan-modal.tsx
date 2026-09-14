"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  X,
  Check,
  Sparkles,
  Zap,
  ShieldCheck,
  Loader2,
  AlertCircle,
  Crown,
} from "lucide-react";
import {
  fetchPublicPlans,
  purchaseSubscription,
  verifyPayment,
  cancelSubscription,
} from "../services/billing.service";
import { useRazorpay } from "../hooks/use-razorpay";
import { useAuthStore } from "@/stores/auth-store";
import { PublicPlan } from "../types/billing.types";

interface UpgradePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  highlightPlan?: string;
}

const PLAN_RANK: Record<string, number> = {
  free: 0,
  pro: 1,
  enterprise: 2,
};

export function UpgradePlanModal({
  isOpen,
  onClose,
}: UpgradePlanModalProps) {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const { openCheckout } = useRazorpay();

  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [processingPlanCode, setProcessingPlanCode] = useState<string | null>(null);
  const [isDowngradeModalOpen, setIsDowngradeModalOpen] = useState(false);
  const [isDowngrading, setIsDowngrading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { data, isLoading: isPlansLoading } = useQuery({
    queryKey: ["public-plans"],
    queryFn: fetchPublicPlans,
    enabled: isOpen,
    staleTime: 5 * 60 * 1000,
  });

  if (!isOpen) return null;

  const plans = data?.plans || [];
  const activePlanCode = (data?.active_plan_code || "free").toLowerCase();
  const activeBillingCycle = data?.active_billing_cycle || "monthly";
  const userRank = PLAN_RANK[activePlanCode] ?? 0;

  // Calculate dynamic annual savings percentage from the pro plan prices if available
  const proPlan = plans.find((p) => p.plan_code === "pro");
  const proMonthly = proPlan?.prices.find((p) => p.billing_cycle === "monthly")?.amount;
  const proYearly = proPlan?.prices.find((p) => p.billing_cycle === "yearly")?.amount;
  const annualDiscountPct =
    proMonthly && proYearly
      ? Math.round(((proMonthly * 12 - proYearly) / (proMonthly * 12)) * 100)
      : 17;

  const handleUpgrade = async (plan: PublicPlan) => {
    if (processingPlanCode) return; // double-click lock
    setErrorMessage(null);
    setSuccessMessage(null);
    setProcessingPlanCode(plan.plan_code);

    try {
      // 1. Authoritative purchase order creation
      const purchaseRes = await purchaseSubscription({
        plan_code: plan.plan_code,
        billing_cycle: billingCycle,
        provider: "razorpay",
        currency: "INR",
      });

      const orderId = purchaseRes.payment.payment_intent_id;
      const keyId = purchaseRes.razorpay_key_id;
      const orderAmountPaise = purchaseRes.payment.payment?.amount
        ? Math.round(purchaseRes.payment.payment.amount * 100)
        : 79900;

      if (!orderId || !keyId) {
        throw new Error("Unable to create payment order. Gateway key missing.");
      }

      // 2. Open Razorpay Checkout Modal
      await openCheckout({
        key: keyId,
        amount: orderAmountPaise,
        currency: purchaseRes.payment.payment?.currency || "INR",
        order_id: orderId,
        name: "Patwatoli AI",
        description: `${plan.plan_name} (${billingCycle}) Subscription`,
        prefill: {
          name: user?.full_name || undefined,
          email: user?.email || undefined,
        },
        themeColor: "#059669",
        onSuccess: async (response) => {
          // 3. DO NOT celebrate yet! Strictly call server-side verification first.
          try {
            const verifyRes = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.status === "verified" || verifyRes.status === "already_paid") {
              setSuccessMessage(`🎉 Success! Your account is now on ${plan.plan_name} (${billingCycle}).`);
              queryClient.invalidateQueries({ queryKey: ["public-plans"] });
              queryClient.invalidateQueries({ queryKey: ["billing-usage"] });
              queryClient.invalidateQueries({ queryKey: ["user-subscription"] });

              setTimeout(() => {
                onClose();
                setSuccessMessage(null);
              }, 2200);
            } else {
              setErrorMessage("Payment completed, but verification is still pending. Your account will update shortly.");
            }
          } catch (verifyErr: unknown) {
            const errObj = verifyErr as { response?: { data?: { detail?: string } }; message?: string };
            setErrorMessage(
              errObj.response?.data?.detail || errObj.message || "Payment verification failed. Please contact support."
            );
          } finally {
            setProcessingPlanCode(null);
          }
        },
        onDismiss: () => {
          setProcessingPlanCode(null);
        },
        onError: (err: { message?: string }) => {
          setProcessingPlanCode(null);
          setErrorMessage(err.message || "Payment cancelled or failed.");
        },
      });
    } catch (err: unknown) {
      const errObj = err as { response?: { data?: { detail?: string } }; message?: string };
      setProcessingPlanCode(null);
      setErrorMessage(
        errObj.response?.data?.detail || errObj.message || "Checkout initiation failed. Please try again."
      );
    }
  };

  const handleDowngradeToFree = async () => {
    setIsDowngrading(true);
    setErrorMessage(null);
    try {
      await cancelSubscription();
      setSuccessMessage("Your subscription has been cancelled. Your account has been reverted to the Free tier.");
      queryClient.invalidateQueries({ queryKey: ["public-plans"] });
      queryClient.invalidateQueries({ queryKey: ["billing-usage"] });
      queryClient.invalidateQueries({ queryKey: ["user-subscription"] });
      setIsDowngradeModalOpen(false);

      setTimeout(() => {
        onClose();
        setSuccessMessage(null);
      }, 2500);
    } catch (err: unknown) {
      const errObj = err as { response?: { data?: { detail?: string } }; message?: string };
      setErrorMessage(errObj.response?.data?.detail || errObj.message || "Failed to cancel subscription. Please contact support.");
    } finally {
      setIsDowngrading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] text-slate-900">
        {/* MODAL HEADER */}
        <div className="relative px-6 pt-6 pb-4 border-b border-slate-100 text-center bg-white">
          <button
            onClick={onClose}
            className="absolute right-5 top-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            aria-label="Close"
          >
            <X size={18} />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold mb-2">
            <Sparkles size={13} />
            <span>Scale Your Intelligence</span>
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Choose the Perfect Plan
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Unlock high token allowances, frontier AI models (Claude 3.5, GPT-4o), and priority generation latency.
          </p>

          {/* BILLING CYCLE TOGGLE */}
          <div className="mt-4 inline-flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                billingCycle === "monthly"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                billingCycle === "yearly"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>Annual Billing</span>
              {annualDiscountPct > 0 && (
                <span className="px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  Save {annualDiscountPct}%
                </span>
              )}
            </button>
          </div>
        </div>

        {/* NOTIFICATIONS */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2 font-semibold">
            <ShieldCheck size={16} className="shrink-0 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* PLAN CARDS GRID */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          {isPlansLoading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <Loader2 className="animate-spin text-emerald-600" size={32} />
              <span className="text-xs text-slate-500">Loading plan tiers...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
              {plans.map((plan) => {
                const cardCode = plan.plan_code.toLowerCase();
                const cardRank = PLAN_RANK[cardCode] ?? 0;
                const isPro = cardCode === "pro";
                const isFree = cardCode === "free";

                // Tier comparison flags
                const isCurrentTier = cardCode === activePlanCode;
                const isCurrentPlanAndCycle =
                  isCurrentTier && (isFree || activeBillingCycle === billingCycle);

                // Find price for the selected billing cycle
                const priceObj =
                  plan.prices.find((p) => p.billing_cycle === billingCycle) ||
                  plan.prices.find((p) => p.billing_cycle === "monthly") ||
                  plan.prices[0];

                const amount = priceObj ? priceObj.amount : 0;
                const currency = priceObj?.currency === "INR" ? "₹" : "$";
                const isProcessing = processingPlanCode === plan.plan_code;

                return (
                  <div
                    key={plan.id}
                    className={`relative flex flex-col rounded-2xl p-5 bg-white transition-all duration-200 ${
                      isPro
                        ? "border-2 border-emerald-500 shadow-lg shadow-emerald-500/10 scale-[1.02]"
                        : "border border-slate-200 shadow-xs hover:border-slate-300"
                    }`}
                  >
                    {isPro && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold tracking-wide uppercase shadow-sm">
                        Most Popular
                      </div>
                    )}

                    <div className="flex items-center justify-between mb-2">
                      <div className="font-bold text-base text-slate-900 flex items-center gap-1.5">
                        {isPro && <Crown size={16} className="text-emerald-600" />}
                        <span>{plan.plan_name}</span>
                      </div>
                      {isCurrentTier && (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                          Current Plan
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-500 min-h-[32px] line-clamp-2">
                      {plan.description || "Comprehensive AI platform access"}
                    </p>

                    {/* PRICE BLOCK */}
                    <div className="my-4 pb-4 border-b border-slate-100">
                      {isFree ? (
                        <div className="text-3xl font-black text-slate-900">
                          Free
                          <span className="text-xs font-normal text-slate-500 ml-1">/ forever</span>
                        </div>
                      ) : (
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-black text-slate-900">
                            {currency}{amount.toLocaleString()}
                          </span>
                          <span className="text-xs font-normal text-slate-500">
                            /{billingCycle === "yearly" ? "year" : "month"}
                          </span>
                        </div>
                      )}
                      <div className="text-[11px] font-medium text-slate-500 mt-1">
                        {plan.monthly_token_limit > 0
                          ? `${plan.monthly_token_limit.toLocaleString()} tokens per month`
                          : "Standard token limit"}
                      </div>
                    </div>

                    {/* FEATURES LIST */}
                    <div className="flex-1 space-y-2.5 mb-6">
                      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        Included Features
                      </div>
                      {plan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                          <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 mt-0.5">
                            <Check size={10} strokeWidth={3} />
                          </div>
                          <span className="font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* ACTION BUTTON AREA */}
                    <div className="mt-auto pt-2">
                      {/* 1. CURRENT PLAN AND CYCLE */}
                      {isCurrentPlanAndCycle ? (
                        <button
                          disabled
                          className="w-full py-2.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-500 border border-slate-200 cursor-default flex items-center justify-center gap-1.5"
                        >
                          <Check size={14} className="text-emerald-600" />
                          <span>Current Plan</span>
                        </button>
                      ) : isCurrentTier && !isCurrentPlanAndCycle ? (
                        /* 2. SWITCH BILLING CYCLE (e.g. Monthly -> Annual) */
                        <button
                          onClick={() => handleUpgrade(plan)}
                          disabled={isProcessing || processingPlanCode !== null}
                          className="w-full py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:shadow-md"
                        >
                          {isProcessing ? (
                            <>
                              <Loader2 size={14} className="animate-spin" />
                              <span>Securing Checkout...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles size={14} />
                              <span>Switch to {billingCycle === "yearly" ? "Annual" : "Monthly"}</span>
                            </>
                          )}
                        </button>
                      ) : cardRank > userRank ? (
                        /* 3. UPGRADE TO HIGHER TIER */
                        <button
                          onClick={() => handleUpgrade(plan)}
                          disabled={isProcessing || processingPlanCode !== null}
                          className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer ${
                            isPro
                              ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20 hover:shadow-md"
                              : "bg-slate-900 hover:bg-slate-800 text-white"
                          } ${
                            isProcessing || processingPlanCode !== null
                              ? "opacity-60 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          {isProcessing ? (
                            <>
                              <Loader2 size={14} className="animate-spin" />
                              <span>Securing Checkout...</span>
                            </>
                          ) : (
                            <>
                              <Zap size={14} />
                              <span>Upgrade to {plan.plan_name}</span>
                            </>
                          )}
                        </button>
                      ) : isFree ? (
                        /* 4. DOWNGRADE TO FREE */
                        <button
                          onClick={() => setIsDowngradeModalOpen(true)}
                          disabled={isProcessing || isDowngrading}
                          className="w-full py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-red-700 bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-200 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <span>Downgrade to Free</span>
                        </button>
                      ) : (
                        /* 5. DOWNGRADE TO LOWER PAID TIER (e.g. Enterprise -> Pro) */
                        <button
                          onClick={() => handleUpgrade(plan)}
                          disabled={isProcessing || processingPlanCode !== null}
                          className="w-full py-2.5 rounded-xl text-xs font-semibold text-slate-800 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          {isProcessing ? (
                            <>
                              <Loader2 size={14} className="animate-spin" />
                              <span>Securing Checkout...</span>
                            </>
                          ) : (
                            <span>Change to {plan.plan_name}</span>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-600" />
            <span>Encrypted 256-bit Razorpay checkout • Instant token activation</span>
          </div>
          <span className="hidden sm:inline">UPI • Credit/Debit Cards • NetBanking</span>
        </div>
      </div>

      {/* CONFIRMATION MODAL FOR DOWNGRADE TO FREE */}
      {isDowngradeModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-200">
                <AlertCircle size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Downgrade to Free Tier?</h3>
                <p className="text-xs text-slate-500">Cancel your paid subscription plan</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to downgrade? Your active subscription will be cancelled immediately and your account limits will revert to the standard Free Tier (10,000,000 tokens/month).
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsDowngradeModalOpen(false)}
                disabled={isDowngrading}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              >
                Keep My Plan
              </button>
              <button
                onClick={handleDowngradeToFree}
                disabled={isDowngrading}
                className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-sm shadow-red-600/20"
              >
                {isDowngrading ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    <span>Downgrading...</span>
                  </>
                ) : (
                  <span>Confirm Downgrade</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
