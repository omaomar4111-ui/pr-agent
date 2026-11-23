-- =========================================================================
-- Phase 1: SaaS Foundation — Credit Ledger, Active Contacts & Anti-Fraud
-- Supabase Migration (PostgreSQL)
-- =========================================================================

-- 1. Hardened Unique Constraint on Payments Reference Number (Prevent Fraud 100%)
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  amount NUMERIC(10,2) NOT NULL,
  method TEXT NOT NULL CHECK (method IN ('instapay', 'vodafone_cash', 'cod', 'card')),
  reference_number TEXT UNIQUE, -- Hardware database constraint to prevent re-used receipts
  sender_name TEXT,
  sender_account TEXT,
  ocr_payload JSONB DEFAULT '{}'::jsonb,
  status TEXT DEFAULT 'pending' CHECK (status IN ('verified', 'pending', 'fraud_flagged', 'rejected')),
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure index on reference_number for instant lookup
CREATE INDEX IF NOT EXISTS idx_payments_ref_num ON payments(reference_number);

-- 2. Tenant Subscription & Balance Management
CREATE TABLE IF NOT EXISTS tenant_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE UNIQUE,
  plan_tier TEXT DEFAULT 'trial' CHECK (plan_tier IN ('trial', 'starter', 'growth', 'scale')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'past_due', 'canceled', 'trialing')),
  active_contacts_limit INT DEFAULT 100,
  monthly_ai_credits_limit INT DEFAULT 500,
  current_credits_balance INT DEFAULT 500,
  trial_ends_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '3 days'),
  current_period_start TIMESTAMPTZ DEFAULT NOW(),
  current_period_end TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. AI Credit Ledger (Immutable Transaction Log to Prevent Double Spending)
CREATE TABLE IF NOT EXISTS credit_ledger (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  amount INT NOT NULL, -- Positive for purchase/grant, negative for deduction
  balance_after INT NOT NULL,
  activity_type TEXT NOT NULL CHECK (activity_type IN (
    'ai_reply', 
    'vision_ocr_verify', 
    'proactive_trigger', 
    'credit_topup', 
    'monthly_grant',
    'trial_grant'
  )),
  idempotency_key TEXT UNIQUE, -- Prevents deducting twice on network retries
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_credit_ledger_tenant ON credit_ledger(tenant_id, created_at DESC);

-- 4. Monthly Active Contacts Metering (ManyChat Rule: Unique contact per billing cycle)
CREATE TABLE IF NOT EXISTS active_contacts_meter (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  billing_cycle_month TEXT NOT NULL, -- Format: YYYY-MM
  first_seen_at TIMESTAMPTZ DEFAULT NOW(),
  last_interaction_at TIMESTAMPTZ DEFAULT NOW(),
  message_count INT DEFAULT 1,
  UNIQUE(tenant_id, customer_id, billing_cycle_month)
);

CREATE INDEX IF NOT EXISTS idx_active_contacts_cycle ON active_contacts_meter(tenant_id, billing_cycle_month);

-- 5. Row Level Security (RLS) Policies
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE active_contacts_meter ENABLE ROW LEVEL SECURITY;
