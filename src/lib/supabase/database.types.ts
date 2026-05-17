export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      businesses: {
        Row: {
          id: string;
          created_at: string;
          name: string;
          type: string;
          city: string;
          logo_url: string | null;
          mode: "stamps" | "points";
          goal: number;
          reward_description: string;
          plan: "starter" | "growth" | "pro";
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          points_rate: number | null;
          user_id: string;
        };
        Insert: Omit<Database["public"]["Tables"]["businesses"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["businesses"]["Insert"]>;
      };
      loyalty_cards: {
        Row: {
          id: string;
          created_at: string;
          business_id: string;
          customer_name: string;
          phone: string | null;
          email: string | null;
          pass_serial: string | null;
          wallet_type: "apple" | "google" | null;
          last_scan_at: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["loyalty_cards"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["loyalty_cards"]["Insert"]>;
      };
      stamp_states: {
        Row: {
          id: string;
          card_id: string;
          business_id: string;
          current_stamps: number;
          goal_stamps: number;
          total_rewards_given: number;
        };
        Insert: Omit<Database["public"]["Tables"]["stamp_states"]["Row"], "id">;
        Update: Partial<Database["public"]["Tables"]["stamp_states"]["Insert"]>;
      };
      points_states: {
        Row: {
          id: string;
          card_id: string;
          business_id: string;
          current_points: number;
          total_points_earned: number;
          total_rewards_given: number;
        };
        Insert: Omit<Database["public"]["Tables"]["points_states"]["Row"], "id">;
        Update: Partial<Database["public"]["Tables"]["points_states"]["Insert"]>;
      };
      transactions: {
        Row: {
          id: string;
          created_at: string;
          card_id: string;
          business_id: string;
          type: "scan" | "reward" | "bonus";
          stamps_delta: number | null;
          points_delta: number | null;
          amount: number | null;
        };
        Insert: Omit<Database["public"]["Tables"]["transactions"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["transactions"]["Insert"]>;
      };
      push_logs: {
        Row: {
          id: string;
          created_at: string;
          card_id: string;
          trigger_type: string;
          message: string;
          sent_at: string;
          status: "sent" | "failed" | "pending";
        };
        Insert: Omit<Database["public"]["Tables"]["push_logs"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["push_logs"]["Insert"]>;
      };
      push_limits: {
        Row: {
          id: string;
          card_id: string;
          week_count: number;
          last_reset_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["push_limits"]["Row"], "id">;
        Update: Partial<Database["public"]["Tables"]["push_limits"]["Insert"]>;
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}
