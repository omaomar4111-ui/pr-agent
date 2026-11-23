-- ============================================
-- PHASE 1: SaaS Foundation Migration
-- ============================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. AI Credit Ledger (محاسبة الكريديت)
CREATE TABLE IF NOT EXISTS credit_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
  amount INTEGER NOT NULL, -- + for credit, - for debit
  balance_after INTEGER NOT NULL,
  action TEXT NOT NULL CHECK (action IN (
    'monthly_grant', 'chat_reply', 'vision_verify', 'proactive_agent', 
    'manual_topup', 'refund', 'trial_grant'
  )),
  reference_id TEXT, -- message_id, payment_id, etc.
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_credit_ledger_tenant ON credit_ledger(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_credit_ledger_ref ON credit_ledger(reference_id) WHERE reference_id IS NOT NULL;

-- Unique constraint: منع خصم كريديت مكرر لنفس المرجع
CREATE UNIQUE INDEX IF NOT EXISTS idx_credit_ledger_unique_debit 
  ON credit_ledger(tenant_id, reference_id, action) 
  WHERE reference_id IS NOT NULL AND amount < 0;

-- 2. Active Contacts (العملاء النشطين شهرياً)
CREATE TABLE IF NOT EXISTS active_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE NOT NULL,
  first_contact_at TIMESTAMPTZ DEFAULT NOW(),
  last_contact_at TIMESTAMPTZ DEFAULT NOW(),
  billing_period TEXT NOT NULL, -- 'YYYY-MM' e.g. '2026-11'
  is_counted BOOLEAN DEFAULT TRUE,
  metadata JSONB DEFAULT '{}'::jsonb,
  UNIQUE(tenant_id, customer_id, billing_period)
);

CREATE INDEX IF NOT EXISTS idx_active_contacts_tenant_period ON active_contacts(tenant_id, billing_period);
CREATE INDEX IF NOT EXISTS idx_active_contacts_customer ON active_contacts(customer_id);

-- 3. Subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL UNIQUE,
  plan TEXT NOT NULL CHECK (plan IN ('trial', 'starter', 'growth', 'enterprise')),
  status TEXT NOT NULL CHECK (status IN ('active', 'past_due', 'cancelled', 'expired', 'trial')),
  current_period_start TIMESTAMPTZ DEFAULT NOW(),
  current_period_end TIMESTAMPTZ,
  trial_ends_at TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  credits_balance INTEGER DEFAULT 0,
  monthly_credit_allowance INTEGER DEFAULT 0,
  max_active_contacts INTEGER DEFAULT 100,
  max_agents INTEGER DEFAULT 1,
  price_egp NUMERIC(10,2) DEFAULT 0,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_tenant ON subscriptions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

-- 4. Usage Limits (حدود استخدام يومية/شهرية)
CREATE TABLE IF NOT EXISTS usage_counters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
  period TEXT NOT NULL, -- 'day:2026-11-23' or 'month:2026-11'
  metric TEXT NOT NULL CHECK (metric IN (
    'chat_messages', 'vision_checks', 'proactive_runs', 'api_calls'
  )),
  count INTEGER DEFAULT 0,
  limit_count INTEGER,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, period, metric)
);

CREATE INDEX IF NOT EXISTS idx_usage_counters_tenant ON usage_counters(tenant_id, period);

-- 5. Team Members (RBAC)
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
  user_id UUID, -- Supabase auth.users.id (nullable until invited)
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'agent', 'viewer')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'revoked')),
  invited_by UUID,
  invited_at TIMESTAMPTZ DEFAULT NOW(),
  accepted_at TIMESTAMPTZ,
  UNIQUE(tenant_id, email)
);

CREATE INDEX IF NOT EXISTS idx_team_members_tenant ON team_members(tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_team_members_user ON team_members(user_id) WHERE user_id IS NOT NULL;

-- 6. إضافة UNIQUE constraint على payment reference (منع احتيال)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'payments_unique_reference'
  ) THEN
    ALTER TABLE payments 
      ADD CONSTRAINT payments_unique_reference 
      UNIQUE NULLS DISTINCT (tenant_id, extracted_reference);
  END IF;
END $$;

-- 7. إضافة حقول على tenants للـ auth
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS owner_user_id UUID;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'trial';
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;

-- 8. إضافة index على tenants.owner_user_id للـ lookups
CREATE INDEX IF NOT EXISTS idx_tenants_owner ON tenants(owner_user_id) WHERE owner_user_id IS NOT NULL;

-- ============================================
-- ROW LEVEL SECURITY (RLS) — Tenant Isolation
-- ============================================

-- تفعيل RLS على كل الجداول
ALTER TABLE credit_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE active_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_counters ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Helper function: الحصول على tenant_id من JWT
CREATE OR REPLACE FUNCTION get_current_tenant_id()
RETURNS UUID AS $$
  SELECT NULLIF(
    current_setting('request.jwt.claims', true)::json->>'tenant_id',
    ''
  )::UUID;
$$ LANGUAGE SQL STABLE;

-- Policies لكل جدول
DROP POLICY IF EXISTS "tenant_isolation_credit_ledger" ON credit_ledger;
CREATE POLICY "tenant_isolation_credit_ledger" ON credit_ledger
  FOR ALL USING (tenant_id = get_current_tenant_id());

DROP POLICY IF EXISTS "tenant_isolation_active_contacts" ON active_contacts;
CREATE POLICY "tenant_isolation_active_contacts" ON active_contacts
  FOR ALL USING (tenant_id = get_current_tenant_id());

DROP POLICY IF EXISTS "tenant_isolation_subscriptions" ON subscriptions;
CREATE POLICY "tenant_isolation_subscriptions" ON subscriptions
  FOR ALL USING (tenant_id = get_current_tenant_id());

DROP POLICY IF EXISTS "tenant_isolation_usage_counters" ON usage_counters;
CREATE POLICY "tenant_isolation_usage_counters" ON usage_counters
  FOR ALL USING (tenant_id = get_current_tenant_id());

DROP POLICY IF EXISTS "tenant_isolation_team_members" ON team_members;
CREATE POLICY "tenant_isolation_team_members" ON team_members
  FOR ALL USING (tenant_id = get_current_tenant_id());

-- ============================================
-- FUNCTIONS: Atomic Credit Operations
-- ============================================

-- دالة atomic لخصم الكريديت
CREATE OR REPLACE FUNCTION spend_credits(
  p_tenant_id UUID,
  p_amount INTEGER,
  p_action TEXT,
  p_reference_id TEXT,
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS TABLE (success BOOLEAN, new_balance INTEGER, error TEXT) AS $$
DECLARE
  v_current_balance INTEGER;
  v_new_balance INTEGER;
  v_existing_count INTEGER;
BEGIN
  -- Check for duplicate debit
  IF p_reference_id IS NOT NULL THEN
    SELECT COUNT(*) INTO v_existing_count
    FROM credit_ledger
    WHERE tenant_id = p_tenant_id 
      AND reference_id = p_reference_id 
      AND action = p_action
      AND amount < 0;
    
    IF v_existing_count > 0 THEN
      RETURN QUERY SELECT FALSE, 0, 'duplicate_debit'::TEXT;
      RETURN;
    END IF;
  END IF;
  
  -- Get current balance (from subscriptions)
  SELECT credits_balance INTO v_current_balance
  FROM subscriptions
  WHERE tenant_id = p_tenant_id
  FOR UPDATE; -- Row lock
  
  IF v_current_balance IS NULL THEN
    RETURN QUERY SELECT FALSE, 0, 'no_subscription'::TEXT;
    RETURN;
  END IF;
  
  IF v_current_balance < p_amount THEN
    RETURN QUERY SELECT FALSE, v_current_balance, 'insufficient_credits'::TEXT;
    RETURN;
  END IF;
  
  v_new_balance := v_current_balance - p_amount;
  
  -- Update balance
  UPDATE subscriptions SET credits_balance = v_new_balance WHERE tenant_id = p_tenant_id;
  
  -- Log transaction
  INSERT INTO credit_ledger (tenant_id, amount, balance_after, action, reference_id, metadata)
  VALUES (p_tenant_id, -p_amount, v_new_balance, p_action, p_reference_id, p_metadata);
  
  RETURN QUERY SELECT TRUE, v_new_balance, NULL::TEXT;
END;
$$ LANGUAGE plpgsql;

-- دالة atomic لإضافة الكريديت
CREATE OR REPLACE FUNCTION grant_credits(
  p_tenant_id UUID,
  p_amount INTEGER,
  p_action TEXT,
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS INTEGER AS $$
DECLARE
  v_new_balance INTEGER;
BEGIN
  UPDATE subscriptions 
  SET credits_balance = credits_balance + p_amount,
      updated_at = NOW()
  WHERE tenant_id = p_tenant_id
  RETURNING credits_balance INTO v_new_balance;
  
  IF v_new_balance IS NULL THEN
    RAISE EXCEPTION 'tenant % has no subscription', p_tenant_id;
  END IF;
  
  INSERT INTO credit_ledger (tenant_id, amount, balance_after, action, metadata)
  VALUES (p_tenant_id, p_amount, v_new_balance, p_action, p_metadata);
  
  RETURN v_new_balance;
END;
$$ LANGUAGE plpgsql;

-- Trigger: تحديث updated_at تلقائياً
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_subscriptions_updated ON subscriptions;
CREATE TRIGGER trg_subscriptions_updated BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Seeding demo store
INSERT INTO subscriptions (
  tenant_id, plan, status, credits_balance, monthly_credit_allowance,
  max_active_contacts, max_agents, price_egp, current_period_end
)
SELECT 
  id, 'growth', 'active', 10000, 10000, 2000, 5, 1650, NOW() + INTERVAL '30 days'
FROM tenants 
WHERE slug = 'demo-store'
ON CONFLICT (tenant_id) DO NOTHING;

INSERT INTO credit_ledger (tenant_id, amount, balance_after, action, metadata)
SELECT 
  id, 10000, 10000, 'monthly_grant', '{"plan":"growth","initial":true}'::jsonb
FROM tenants 
WHERE slug = 'demo-store'
AND NOT EXISTS (
  SELECT 1 FROM credit_ledger WHERE tenant_id = tenants.id AND action = 'monthly_grant'
);
