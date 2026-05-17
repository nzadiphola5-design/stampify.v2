import type { Business, LoyaltyCard, Transaction, PushLog, AdminStats } from "./types";

export const mockBusiness: Business = {
  id: "biz_1",
  name: "Salon Élite",
  type: "Coiffeur",
  city: "Montréal",
  mode: "stamps",
  goal: 10,
  reward_description: "1 coupe gratuite",
  plan: "growth",
  points_rate: 10,
  created_at: "2026-01-15T10:00:00Z",
  active_clients: 142,
  scans_today: 8,
  rewards_this_month: 23,
  inactive_clients: 17,
};

export const mockBusinessPoints: Business = {
  id: "biz_2",
  name: "Épicerie BonMarché",
  type: "Épicerie",
  city: "Québec",
  mode: "points",
  goal: 500,
  reward_description: "5$ de rabais",
  plan: "pro",
  points_rate: 10,
  rewards_catalog: [
    { id: "r1", points_required: 500, description: "5$ de rabais" },
    { id: "r2", points_required: 1000, description: "10$ de rabais" },
    { id: "r3", points_required: 2000, description: "Produit gratuit" },
  ],
  created_at: "2026-02-10T10:00:00Z",
  active_clients: 389,
  scans_today: 24,
  rewards_this_month: 67,
  inactive_clients: 42,
};

export const mockClients: LoyaltyCard[] = [
  { id: "c1", business_id: "biz_1", customer_name: "Marie Dubois", phone: "514-555-0101", email: "marie@example.com", wallet_type: "apple", created_at: "2026-03-01T10:00:00Z", last_scan_at: "2026-05-14T14:30:00Z" },
  { id: "c2", business_id: "biz_1", customer_name: "Jean Tremblay", phone: "514-555-0102", wallet_type: "google", created_at: "2026-03-05T10:00:00Z", last_scan_at: "2026-05-15T09:15:00Z" },
  { id: "c3", business_id: "biz_1", customer_name: "Sophie Martin", phone: "514-555-0103", email: "sophie@example.com", wallet_type: "apple", created_at: "2026-03-10T10:00:00Z", last_scan_at: "2026-04-10T11:00:00Z" },
  { id: "c4", business_id: "biz_1", customer_name: "Pierre Gagnon", phone: "514-555-0104", created_at: "2026-03-15T10:00:00Z", last_scan_at: "2026-04-05T16:45:00Z" },
  { id: "c5", business_id: "biz_1", customer_name: "Isabelle Roy", phone: "514-555-0105", wallet_type: "apple", created_at: "2026-03-20T10:00:00Z", last_scan_at: "2026-05-16T08:00:00Z" },
  { id: "c6", business_id: "biz_1", customer_name: "Michel Côté", phone: "514-555-0106", wallet_type: "google", created_at: "2026-04-01T10:00:00Z", last_scan_at: "2026-05-12T13:20:00Z" },
  { id: "c7", business_id: "biz_1", customer_name: "Amélie Bouchard", email: "amelie@example.com", created_at: "2026-04-05T10:00:00Z", last_scan_at: "2026-03-10T10:00:00Z" },
  { id: "c8", business_id: "biz_1", customer_name: "François Lavoie", phone: "514-555-0108", wallet_type: "apple", created_at: "2026-04-10T10:00:00Z", last_scan_at: "2026-05-16T07:30:00Z" },
];

export const mockStampStates: Record<string, number> = {
  c1: 7, c2: 10, c3: 3, c4: 5, c5: 9, c6: 2, c7: 1, c8: 6,
};

export const mockPointsStates: Record<string, number> = {
  c1: 340, c2: 820, c3: 150, c4: 620, c5: 480, c6: 90, c7: 1200, c8: 310,
};

export const mockTransactions: Transaction[] = [
  { id: "t1", card_id: "c2", business_id: "biz_1", type: "reward", stamps_delta: 0, customer_name: "Jean Tremblay", created_at: "2026-05-15T09:15:00Z" },
  { id: "t2", card_id: "c8", business_id: "biz_1", type: "scan", stamps_delta: 1, customer_name: "François Lavoie", created_at: "2026-05-16T07:30:00Z" },
  { id: "t3", card_id: "c5", business_id: "biz_1", type: "scan", stamps_delta: 1, customer_name: "Isabelle Roy", created_at: "2026-05-16T08:00:00Z" },
  { id: "t4", card_id: "c1", business_id: "biz_1", type: "scan", stamps_delta: 1, customer_name: "Marie Dubois", created_at: "2026-05-14T14:30:00Z" },
  { id: "t5", card_id: "c6", business_id: "biz_1", type: "scan", stamps_delta: 1, customer_name: "Michel Côté", created_at: "2026-05-12T13:20:00Z" },
  { id: "t6", card_id: "c4", business_id: "biz_1", type: "scan", stamps_delta: 1, customer_name: "Pierre Gagnon", created_at: "2026-05-10T11:00:00Z" },
  { id: "t7", card_id: "c3", business_id: "biz_1", type: "bonus", stamps_delta: 1, customer_name: "Sophie Martin", created_at: "2026-05-08T16:00:00Z" },
  { id: "t8", card_id: "c1", business_id: "biz_1", type: "scan", stamps_delta: 1, customer_name: "Marie Dubois", created_at: "2026-05-05T10:00:00Z" },
];

export const mockPushLogs: PushLog[] = [
  { id: "p1", card_id: "c2", trigger_type: "reward_earned", message: "Félicitations ! Vous avez gagné : 1 coupe gratuite.", sent_at: "2026-05-15T09:16:00Z", status: "sent" },
  { id: "p2", card_id: "c5", trigger_type: "one_away", message: "Plus qu'un tampon ! Votre prochaine visite vous rapporte 1 coupe gratuite. 🎁", sent_at: "2026-05-16T08:01:00Z", status: "sent" },
  { id: "p3", card_id: "c3", trigger_type: "inactivity_30", message: "Ça fait un moment ! Revenez voir Salon Élite — vos tampons vous attendent.", sent_at: "2026-05-10T09:00:00Z", status: "sent" },
  { id: "p4", card_id: "c7", trigger_type: "inactivity_60", message: "Salon Élite vous offre 1 tampon bonus pour votre retour. Valable 7 jours.", sent_at: "2026-05-12T09:00:00Z", status: "sent" },
  { id: "p5", card_id: "c4", trigger_type: "halfway", message: "Vous avez 5 tampons sur 10 ! Encore 5 visites pour votre récompense.", sent_at: "2026-05-10T11:01:00Z", status: "failed" },
];

export const adminMockBusinesses: Business[] = [
  { ...mockBusiness, id: "biz_1", name: "Salon Élite", city: "Montréal", plan: "growth", active_clients: 142, scans_today: 8, rewards_this_month: 23, inactive_clients: 17 },
  { ...mockBusinessPoints, id: "biz_2", name: "Épicerie BonMarché", city: "Québec", plan: "pro", active_clients: 389, scans_today: 24, rewards_this_month: 67, inactive_clients: 42 },
  { id: "biz_3", name: "Café Lumière", type: "Café", city: "Ottawa", mode: "stamps", goal: 8, reward_description: "Café offert", plan: "starter", created_at: "2026-04-01T10:00:00Z", active_clients: 56, scans_today: 3, rewards_this_month: 9, inactive_clients: 5 },
  { id: "biz_4", name: "Auto Prestige", type: "Garage", city: "Montréal", mode: "points", goal: 1000, reward_description: "50$ de rabais", plan: "growth", points_rate: 5, created_at: "2026-03-20T10:00:00Z", active_clients: 203, scans_today: 11, rewards_this_month: 34, inactive_clients: 28 },
  { id: "biz_5", name: "Boutique Chic", type: "Vêtements", city: "Laval", mode: "points", goal: 500, reward_description: "10% de rabais", plan: "pro", points_rate: 10, created_at: "2026-02-28T10:00:00Z", active_clients: 421, scans_today: 18, rewards_this_month: 89, inactive_clients: 63 },
  { id: "biz_6", name: "Lavage Express", type: "Lavage auto", city: "Longueuil", mode: "stamps", goal: 6, reward_description: "Lavage gratuit", plan: "starter", created_at: "2026-04-15T10:00:00Z", active_clients: 31, scans_today: 2, rewards_this_month: 4, inactive_clients: 3 },
];

export const mockAdminStats: AdminStats = {
  total_businesses: 48,
  active_businesses: 41,
  total_cards: 6284,
  total_scans_today: 284,
  total_revenue_monthly: 2190,
  push_sent_today: 421,
  plan_distribution: { starter: 18, growth: 20, pro: 10 },
};

export const mockScanHistory = [
  { date: "Mai 10", scans: 12 },
  { date: "Mai 11", scans: 8 },
  { date: "Mai 12", scans: 15 },
  { date: "Mai 13", scans: 6 },
  { date: "Mai 14", scans: 19 },
  { date: "Mai 15", scans: 22 },
  { date: "Mai 16", scans: 8 },
];

export const mockRevenueHistory = [
  { month: "Jan", revenue: 840 },
  { month: "Fév", revenue: 1100 },
  { month: "Mar", revenue: 1450 },
  { month: "Avr", revenue: 1780 },
  { month: "Mai", revenue: 2190 },
];
