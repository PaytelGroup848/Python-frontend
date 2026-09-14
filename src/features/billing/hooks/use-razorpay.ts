"use client";

import { useState, useEffect, useCallback } from "react";

const RAZORPAY_SCRIPT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

declare global {
  interface Window {
    Razorpay?: any;
  }
}

let scriptLoadingPromise: Promise<boolean> | null = null;

function loadRazorpayScript(): Promise<boolean> {
  if (typeof window === "undefined") {
    return Promise.resolve(false);
  }

  if (window.Razorpay) {
    return Promise.resolve(true);
  }

  if (!scriptLoadingPromise) {
    scriptLoadingPromise = new Promise((resolve) => {
      const existingScript = document.querySelector(
        `script[src="${RAZORPAY_SCRIPT_SRC}"]`
      );

      if (existingScript) {
        if (window.Razorpay) {
          resolve(true);
        } else {
          existingScript.addEventListener("load", () => resolve(true));
          existingScript.addEventListener("error", () => resolve(false));
        }
        return;
      }

      const script = document.createElement("script");
      script.src = RAZORPAY_SCRIPT_SRC;
      script.async = true;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        scriptLoadingPromise = null; // allow retry on network failure
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }

  return scriptLoadingPromise;
}

export interface RazorpayCheckoutOptions {
  key: string;
  amount: number; // in paise
  currency: string;
  order_id: string;
  name?: string;
  description?: string;
  prefill?: {
    name?: string;
    email?: string;
  };
  themeColor?: string;
  onSuccess: (response: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => void;
  onDismiss?: () => void;
  onError?: (error: any) => void;
}

export function useRazorpay() {
  const [isReady, setIsReady] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    loadRazorpayScript().then((success) => {
      if (!isMounted) return;
      setIsLoading(false);
      if (success) {
        setIsReady(true);
        setLoadError(null);
      } else {
        setIsReady(false);
        setLoadError("Failed to load secure payment gateway. Please check your internet connection.");
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const openCheckout = useCallback(
    async (options: RazorpayCheckoutOptions) => {
      let ready = isReady && !!window.Razorpay;
      if (!ready) {
        setIsLoading(true);
        const success = await loadRazorpayScript();
        setIsLoading(false);
        if (!success || !window.Razorpay) {
          const err = "Payment gateway could not be loaded. Please try again.";
          setLoadError(err);
          options.onError?.(new Error(err));
          return;
        }
        ready = true;
        setIsReady(true);
      }

      try {
        const rzp = new window.Razorpay({
          key: options.key,
          amount: options.amount,
          currency: options.currency,
          name: options.name || "Patwatoli AI",
          description: options.description || "AI Platform Subscription",
          order_id: options.order_id,
          prefill: options.prefill,
          theme: {
            color: options.themeColor || "#059669",
          },
          handler: function (response: any) {
            if (
              response.razorpay_payment_id &&
              response.razorpay_order_id &&
              response.razorpay_signature
            ) {
              options.onSuccess({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              });
            } else {
              options.onError?.(new Error("Incomplete payment response from gateway"));
            }
          },
          modal: {
            ondismiss: function () {
              options.onDismiss?.();
            },
          },
        });

        rzp.on("payment.failed", function (response: any) {
          options.onError?.(response.error || new Error("Payment failed"));
        });

        rzp.open();
      } catch (err) {
        options.onError?.(err);
      }
    },
    [isReady]
  );

  return {
    isReady,
    isLoading,
    loadError,
    openCheckout,
  };
}

