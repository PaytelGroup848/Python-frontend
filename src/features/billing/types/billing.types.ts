export interface PlanPrice {
  id: number;
  billing_cycle: "monthly" | "yearly" | string;
  amount: number;
  currency: string;
  provider: string;
}

export interface PublicPlan {
  id: number;
  plan_code: string;
  plan_name: string;
  description?: string;
  monthly_token_limit: number;
  monthly_request_limit: number;
  features: string[];
  prices: PlanPrice[];
  is_current?: boolean;
}

export interface PublicPlansResponse {
  plans: PublicPlan[];
  active_plan_code: string;
  active_billing_cycle?: "monthly" | "yearly";
}

export interface PurchaseSubscriptionPayload {
  plan_code: string;
  provider: "razorpay" | string;
  billing_cycle: "monthly" | "yearly";
  currency: string;
  auto_renew?: boolean;
}

export interface PurchaseResponse {
  subscription: {
    id: number;
    plan_name: string;
    status: string;
  };
  invoice: {
    id: number;
    invoice_number: string;
    status: string;
  };
  payment: {
    payment_intent_id: string; // Razorpay Order ID
    client_secret: string;
    status: string;
    payment?: {
      id: number;
      amount: number;
      currency: string;
    };
  };
  razorpay_key_id?: string;
}

export interface VerifyPaymentPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface VerifyPaymentResponse {
  status: "verified" | "already_paid";
  subscription: "active";
  payment_id?: number;
  subscription_id?: number;
  message: string;
}

export interface UserUsageSummary {
  plan: string;
  used_tokens: number;
  remaining_tokens: number;
  used_requests: number;
  remaining_requests: number;
  monthly_token_limit: number;
  monthly_request_limit: number;
  monthly_cost_limit?: number;
}

