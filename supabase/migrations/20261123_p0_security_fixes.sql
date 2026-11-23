-- =========================================================================
-- Phase 1 SaaS Foundation (Security Hardening & 2-Phase Credit Reservation)
-- Migration: 20261123_p0_security_fixes.sql
-- =========================================================================

-- 1. Ensure Table Structure for Reservations
CREATE TABLE IF NOT EXISTS credit_reservations (
  id TEXT PRIMARY KEY, -- reservation_id
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
  amount INTEGER NOT NULL,
  action TEXT NOT NULL,
  status TEXT DEFAULT 'held' CHECK (status IN ('held', 'committed', 'released')),
  metadata JSONB DEFAULT '{}'::jsonb,
  held_at TIMESTAMPTZ DEFAULT NOW(),
  settled_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_credit_reservations_tenant ON credit_reservations(tenant_id, status);

-- 2. P0: 2-Phase Commit RPC Functions for Credits
CREATE OR REPLACE FUNCTION reserve_credits(
  p_tenant_id UUID,
  p_amount INTEGER,
  p_action TEXT,
  p_reservation_id TEXT,
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS TABLE (success BOOLEAN, new_balance INTEGER, reservation_id TEXT, error TEXT) AS $$
DECLARE
  v_current_balance INTEGER;
  v_new_balance INTEGER;
  v_existing_reservation TEXT;
BEGIN
  -- Idempotency check: is this reservation already held or processed?
  SELECT id INTO v_existing_reservation
  FROM credit_reservations
  WHERE id = p_reservation_id;

  IF v_existing_reservation IS NOT NULL THEN
    SELECT credits_balance INTO v_current_balance
    FROM subscriptions WHERE tenant_id = p_tenant_id;
    RETURN QUERY SELECT TRUE, v_current_balance, p_reservation_id, NULL::TEXT;
    RETURN;
  END IF;

  -- Lock subscription row to prevent concurrent race conditions
  SELECT credits_balance INTO v_current_balance
  FROM subscriptions
  WHERE tenant_id = p_tenant_id
  FOR UPDATE;

  IF v_current_balance IS NULL THEN
    RETURN QUERY SELECT FALSE, 0, p_reservation_id, 'no_subscription'::TEXT;
    RETURN;
  END IF;

  IF v_current_balance < p_amount THEN
    RETURN QUERY SELECT FALSE, v_current_balance, p_reservation_id, 'insufficient_credits'::TEXT;
    RETURN;
  END IF;

  v_new_balance := v_current_balance - p_amount;

  -- Deduct hold amount
  UPDATE subscriptions 
  SET credits_balance = v_new_balance, updated_at = NOW() 
  WHERE tenant_id = p_tenant_id;

  -- Insert reservation log
  INSERT INTO credit_reservations (id, tenant_id, amount, action, status, metadata)
  VALUES (p_reservation_id, p_tenant_id, p_amount, p_action, 'held', p_metadata);

  RETURN QUERY SELECT TRUE, v_new_balance, p_reservation_id, NULL::TEXT;
END;
$$ LANGUAGE plpgsql;

-- 3. Commit Credits (After AI succeeds)
CREATE OR REPLACE FUNCTION commit_credits(
  p_reservation_id TEXT,
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS TABLE (success BOOLEAN, error TEXT) AS $$
DECLARE
  v_reservation RECORD;
  v_new_balance INTEGER;
BEGIN
  SELECT * INTO v_reservation
  FROM credit_reservations
  WHERE id = p_reservation_id AND status = 'held'
  FOR UPDATE;

  IF v_reservation IS NULL THEN
    -- Either already committed or not found
    RETURN QUERY SELECT TRUE, NULL::TEXT;
    RETURN;
  END IF;

  -- Get latest balance for ledger logging
  SELECT credits_balance INTO v_new_balance
  FROM subscriptions WHERE tenant_id = v_reservation.tenant_id;

  -- Record permanently in credit_ledger
  INSERT INTO credit_ledger (tenant_id, amount, balance_after, action, reference_id, metadata)
  VALUES (
    v_reservation.tenant_id, 
    -v_reservation.amount, 
    v_new_balance, 
    v_reservation.action, 
    p_reservation_id, 
    v_reservation.metadata || p_metadata
  );

  -- Mark reservation committed
  UPDATE credit_reservations 
  SET status = 'committed', settled_at = NOW() 
  WHERE id = p_reservation_id;

  RETURN QUERY SELECT TRUE, NULL::TEXT;
END;
$$ LANGUAGE plpgsql;

-- 4. Release Credits (If AI fails or times out)
CREATE OR REPLACE FUNCTION release_credits(
  p_reservation_id TEXT,
  p_reason TEXT DEFAULT 'downstream_failed'
)
RETURNS TABLE (success BOOLEAN, new_balance INTEGER, error TEXT) AS $$
DECLARE
  v_reservation RECORD;
  v_restored_balance INTEGER;
BEGIN
  SELECT * INTO v_reservation
  FROM credit_reservations
  WHERE id = p_reservation_id AND status = 'held'
  FOR UPDATE;

  IF v_reservation IS NULL THEN
    RETURN QUERY SELECT FALSE, 0, 'reservation_not_found_or_settled'::TEXT;
    RETURN;
  END IF;

  -- Refund held credits back to subscriptions
  UPDATE subscriptions
  SET credits_balance = credits_balance + v_reservation.amount,
      updated_at = NOW()
  WHERE tenant_id = v_reservation.tenant_id
  RETURNING credits_balance INTO v_restored_balance;

  -- Mark reservation released
  UPDATE credit_reservations
  SET status = 'released', settled_at = NOW(), metadata = metadata || jsonb_build_object('release_reason', p_reason)
  WHERE id = p_reservation_id;

  RETURN QUERY SELECT TRUE, v_restored_balance, NULL::TEXT;
END;
$$ LANGUAGE plpgsql;
