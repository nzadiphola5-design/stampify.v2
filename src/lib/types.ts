export type LoyaltyMode = "stamps" | "points";
export type WalletType = "apple" | "google";
export type PlanType = "starter" | "growth" | "pro";

export interface Business {
  id: string;
  name: string;
  type: string;
  city: string;
  logo_url?: string;
  mode: LoyaltyMode;
  goal: number;
  reward_description: string;
  plan: PlanType;
  stripe_customer_id?: string;
  points_rate?: number; // points per dollar
  rewards_catalog?: RewardItem[];
  created_at: string;
  active_clients: number;
  scans_today: number;
  rewards_this_month: number;
  inactive_clients: number;
}

export interface RewardItem {
  id: string;
  points_required: number;
  description: string;
}

export interface LoyaltyCard {
  id: string;
  business_id: string;
  customer_name: string;
  phone?: string;
  email?: string;
  pass_serial?: string;
  wallet_type?: WalletType;
  created_at: string;
  last_scan_at?: string;
}

export interface TamponState {
  id: string;
  card_id: string;
  business_id: string;
  current_stamps: number;
  goal_stamps: number;
  total_rewards_given: number;
}

export interface PointsState {
  id: string;
  card_id: string;
  business_id: string;
  current_points: number;
  total_points_earned: number;
  total_rewards_given: number;
}

export interface Transaction {
  id: string;
  card_id: string;
  business_id: string;
  type: "scan" | "reward" | "bonus";
  stamps_delta?: number;
  points_delta?: number;
  amount?: number;
  customer_name: string;
  created_at: string;
}

export interface PushLog {
  id: string;
  card_id: string;
  trigger_type: string;
  message: string;
  sent_at: string;
  status: "sent" | "failed" | "pending";
}

export interface AdminStats {
  total_businesses: number;
  active_businesses: number;
  total_cards: number;
  total_scans_today: number;
  total_revenue_monthly: number;
  push_sent_today: number;
  plan_distribution: { starter: number; growth: number; pro: number };
}
