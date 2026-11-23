import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabaseClient';

export type CreditAction = 
  | 'chat_reply' 
  | 'vision_verify' 
  | 'proactive_agent';

const CREDIT_COSTS: Record<CreditAction, number> = {
  chat_reply: 1,
  vision_verify: 2,
  proactive_agent: 1,
};

export interface SpendResult {
  success: boolean;
  newBalance: number;
  error?: string;
  reservationId?: string;
}

// In-Memory fallback store for offline/local environments
const memoryBalances = new Map<string, number>();
const memorySpentRefs = new Set<string>();
const memoryReservations = new Map<string, { tenantId: string; amount: number; action: CreditAction; timestamp: number }>();

/**
 * P0 Security Fix: 2-Phase Credit Reservation Pattern (Safe Pre-flight Hold)
 * 1. reserveCredits: Atomically holds credits before invoking expensive LLM/Vision APIs.
 * 2. commitCredits: Confirms deduction once AI response finishes successfully.
 * 3. releaseCredits: Automatically restores held credits if AI fails or times out.
 */
export async function reserveCredits(
  tenantId: string,
  action: CreditAction,
  reservationId: string,
  metadata?: Record<string, any>
): Promise<SpendResult> {
  const amount = CREDIT_COSTS[action];

  if (isSupabaseConfigured() && supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin.rpc('reserve_credits', {
        p_tenant_id: tenantId,
        p_amount: amount,
        p_action: action,
        p_reservation_id: reservationId,
        p_metadata: metadata || {},
      });

      if (!error && data) {
        const row = Array.isArray(data) ? data[0] : data;
        return {
          success: row?.success || false,
          newBalance: row?.new_balance || 0,
          reservationId: row?.reservation_id || reservationId,
          error: row?.error,
        };
      }
    } catch (e) {
      console.warn('Supabase reserve_credits RPC error, using atomic memory fallback:', e);
    }
  }

  // Memory fallback logic with atomic hold
  const current = memoryBalances.get(tenantId) ?? 10000;
  if (current < amount) {
    return { success: false, newBalance: current, error: 'insufficient_credits' };
  }

  const updated = current - amount;
  memoryBalances.set(tenantId, updated);
  memoryReservations.set(reservationId, {
    tenantId,
    amount,
    action,
    timestamp: Date.now(),
  });

  return { success: true, newBalance: updated, reservationId };
}

/**
 * Commits a previously reserved credit amount after successful task completion.
 */
export async function commitCredits(
  reservationId: string,
  actualMetadata?: Record<string, any>
): Promise<{ success: boolean; error?: string }> {
  if (isSupabaseConfigured() && supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin.rpc('commit_credits', {
        p_reservation_id: reservationId,
        p_metadata: actualMetadata || {},
      });

      if (!error && data) {
        const row = Array.isArray(data) ? data[0] : data;
        return { success: row?.success ?? true };
      }
    } catch (e) {
      console.warn('Supabase commit_credits RPC error, using memory fallback:', e);
    }
  }

  if (memoryReservations.has(reservationId)) {
    const res = memoryReservations.get(reservationId)!;
    memorySpentRefs.add(`${res.tenantId}:${reservationId}:${res.action}`);
    memoryReservations.delete(reservationId);
    return { success: true };
  }

  return { success: true };
}

/**
 * Releases reserved credits back to the tenant if the downstream AI task fails or is aborted.
 */
export async function releaseCredits(
  reservationId: string,
  reason?: string
): Promise<{ success: boolean; restoredBalance: number }> {
  if (isSupabaseConfigured() && supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin.rpc('release_credits', {
        p_reservation_id: reservationId,
        p_reason: reason || 'downstream_task_failed',
      });

      if (!error && data) {
        const row = Array.isArray(data) ? data[0] : data;
        return {
          success: row?.success ?? true,
          restoredBalance: row?.new_balance ?? 0,
        };
      }
    } catch (e) {
      console.warn('Supabase release_credits RPC error, using memory fallback:', e);
    }
  }

  if (memoryReservations.has(reservationId)) {
    const res = memoryReservations.get(reservationId)!;
    const current = memoryBalances.get(res.tenantId) ?? 10000;
    const restored = current + res.amount;
    memoryBalances.set(res.tenantId, restored);
    memoryReservations.delete(reservationId);
    return { success: true, restoredBalance: restored };
  }

  return { success: false, restoredBalance: 0 };
}

/**
 * Legacy spendCredits: executes reserve + commit atomically.
 */
export async function spendCredits(
  tenantId: string,
  action: CreditAction,
  referenceId: string,
  metadata?: Record<string, any>
): Promise<SpendResult> {
  const reserve = await reserveCredits(tenantId, action, referenceId, metadata);
  if (!reserve.success) {
    return reserve;
  }
  await commitCredits(referenceId, metadata);
  return reserve;
}

/**
 * Grant credits (monthly allowance, topup, trial).
 */
export async function grantCredits(
  tenantId: string,
  amount: number,
  action: 'monthly_grant' | 'manual_topup' | 'trial_grant' | 'refund',
  metadata?: Record<string, any>
): Promise<number> {
  if (isSupabaseConfigured() && supabaseAdmin) {
    const { data, error } = await supabaseAdmin.rpc('grant_credits', {
      p_tenant_id: tenantId,
      p_amount: amount,
      p_action: action,
      p_metadata: metadata || {},
    });

    if (!error && data !== null) {
      return data as number;
    }
  }

  const current = memoryBalances.get(tenantId) ?? 10000;
  const updated = current + amount;
  memoryBalances.set(tenantId, updated);
  return updated;
}

/**
 * Get current credit balance.
 */
export async function getCreditsBalance(tenantId: string): Promise<number> {
  if (isSupabaseConfigured() && supabaseAdmin) {
    const { data } = await supabaseAdmin
      .from('subscriptions')
      .select('credits_balance')
      .eq('tenant_id', tenantId)
      .maybeSingle();
    if (data?.credits_balance !== undefined) {
      return data.credits_balance;
    }
  }

  return memoryBalances.get(tenantId) ?? 10000;
}
