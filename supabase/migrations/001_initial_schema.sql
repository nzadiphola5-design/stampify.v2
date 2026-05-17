-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────────
-- BUSINESSES
-- ─────────────────────────────────────────────
create table businesses (
  id                    uuid primary key default uuid_generate_v4(),
  created_at            timestamptz default now(),
  user_id               uuid references auth.users(id) on delete cascade not null,
  name                  text not null,
  type                  text not null,
  city                  text not null,
  logo_url              text,
  mode                  text check (mode in ('stamps','points')) not null default 'stamps',
  goal                  int not null default 10,
  reward_description    text not null default '',
  plan                  text check (plan in ('starter','growth','pro')) not null default 'starter',
  stripe_customer_id    text,
  stripe_subscription_id text,
  points_rate           int default 10
);

alter table businesses enable row level security;
create policy "Users manage own businesses"
  on businesses for all using (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- LOYALTY CARDS
-- ─────────────────────────────────────────────
create table loyalty_cards (
  id              uuid primary key default uuid_generate_v4(),
  created_at      timestamptz default now(),
  business_id     uuid references businesses(id) on delete cascade not null,
  customer_name   text not null,
  phone           text,
  email           text,
  pass_serial     text unique,
  wallet_type     text check (wallet_type in ('apple','google')),
  last_scan_at    timestamptz
);

alter table loyalty_cards enable row level security;
create policy "Business owners manage their cards"
  on loyalty_cards for all
  using (business_id in (select id from businesses where user_id = auth.uid()));

-- Allow public insert (client joining)
create policy "Public can create card"
  on loyalty_cards for insert with check (true);

-- ─────────────────────────────────────────────
-- STAMP STATES
-- ─────────────────────────────────────────────
create table stamp_states (
  id                  uuid primary key default uuid_generate_v4(),
  card_id             uuid references loyalty_cards(id) on delete cascade not null unique,
  business_id         uuid references businesses(id) on delete cascade not null,
  current_stamps      int not null default 0,
  goal_stamps         int not null default 10,
  total_rewards_given int not null default 0
);

alter table stamp_states enable row level security;
create policy "Business owners manage stamp states"
  on stamp_states for all
  using (business_id in (select id from businesses where user_id = auth.uid()));

-- ─────────────────────────────────────────────
-- POINTS STATES
-- ─────────────────────────────────────────────
create table points_states (
  id                  uuid primary key default uuid_generate_v4(),
  card_id             uuid references loyalty_cards(id) on delete cascade not null unique,
  business_id         uuid references businesses(id) on delete cascade not null,
  current_points      int not null default 0,
  total_points_earned int not null default 0,
  total_rewards_given int not null default 0
);

alter table points_states enable row level security;
create policy "Business owners manage points states"
  on points_states for all
  using (business_id in (select id from businesses where user_id = auth.uid()));

-- ─────────────────────────────────────────────
-- TRANSACTIONS
-- ─────────────────────────────────────────────
create table transactions (
  id          uuid primary key default uuid_generate_v4(),
  created_at  timestamptz default now(),
  card_id     uuid references loyalty_cards(id) on delete cascade not null,
  business_id uuid references businesses(id) on delete cascade not null,
  type        text check (type in ('scan','reward','bonus')) not null,
  stamps_delta int,
  points_delta int,
  amount      numeric(10,2)
);

alter table transactions enable row level security;
create policy "Business owners view transactions"
  on transactions for all
  using (business_id in (select id from businesses where user_id = auth.uid()));

-- ─────────────────────────────────────────────
-- PUSH LOGS
-- ─────────────────────────────────────────────
create table push_logs (
  id           uuid primary key default uuid_generate_v4(),
  created_at   timestamptz default now(),
  card_id      uuid references loyalty_cards(id) on delete cascade not null,
  trigger_type text not null,
  message      text not null,
  sent_at      timestamptz default now(),
  status       text check (status in ('sent','failed','pending')) not null default 'pending'
);

alter table push_logs enable row level security;
create policy "Business owners view push logs"
  on push_logs for all
  using (card_id in (
    select lc.id from loyalty_cards lc
    join businesses b on b.id = lc.business_id
    where b.user_id = auth.uid()
  ));

-- ─────────────────────────────────────────────
-- PUSH LIMITS (max 2 per week per card)
-- ─────────────────────────────────────────────
create table push_limits (
  id            uuid primary key default uuid_generate_v4(),
  card_id       uuid references loyalty_cards(id) on delete cascade not null unique,
  week_count    int not null default 0,
  last_reset_at timestamptz default now()
);

alter table push_limits enable row level security;

-- ─────────────────────────────────────────────
-- INDEXES
-- ─────────────────────────────────────────────
create index idx_loyalty_cards_business on loyalty_cards(business_id);
create index idx_transactions_business on transactions(business_id);
create index idx_transactions_created on transactions(created_at desc);
create index idx_push_logs_card on push_logs(card_id);
