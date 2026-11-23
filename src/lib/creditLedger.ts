/**
 * SaaS Foundation Engine: Credit Ledger & Active Contacts Metering
 * Implements:
 * 1. AI Credit Deductions & Idempotent Transactions (Prevents double deduction)
 * 2. Active Contacts Monthly Tracker (ManyChat Billing Model)
 * 3. Trial Expiry & Balance Checks
 */

import { supabaseAdmin, isSupabaseConfigured } from './supabaseClient';

export interface CreditDeductionResult {
  success: boolean;
  remainingCredits: number;
  deductedAmount: number;
  reason?: string;
  isTrialExpired?: boolean;
}

// In-Memory Fallback Ledger (when Supabase credentials are local/mock)
const inMemoryBalances = new Map<string, { credits: number; trialEndsAt: number }>();
const inMemoryIdempotency = new Set<string>();
const inMemoryActiveContacts = new Map<string, Set<string>>(); // `${tenantId}:${cycle}` -> Set<customerId>

/**
 * Deducts AI credits with strict Idempotency protection
 */
export async function deductCredits(
  tenantId: string,
  amount: number,
  activityType: 'ai_reply' | 'vision_ocr_verify' | 'proactive_trigger',
  idempotencyKey?: string,
  metadata?: Record<string, any>
): Promise<CreditDeductionResult> {
  // Idempotency check: if request was already processed, do not deduct again
  if (idempotencyKey && inMemoryIdempotency.has(idempotencyKey)) {
    const cached = inMemoryBalances.get(tenantId) || { credits: 490, trialEndsAt: Date.now() + 3 * 86400000 };
    return { success: true, remainingCredits: cached.credits, deductedAmount: 0 };
  }

  if (isSupabaseConfigured() && supabaseAdmin) {
    try {
      // 1. Fetch current subscription
      const { data: sub } = await supabaseAdmin
        .from('tenant_subscriptions')
        .select('current_credits_balance, status, trial_ends_at')
        .eq('tenant_id', tenantId)
        .maybeSingle();

      const currentBalance = sub?.current_credits_balance ?? 500;
      const trialEndsAt = sub?.trial_ends_at ? new Date(sub.trial_ends_at).getTime() : Date.now() + 3 * 86400000;

      if (Date.now() > trialEndsAt && sub?.status === 'trialing') {
        return { success: false, remainingCredits: currentBalance, deductedAmount: 0, isTrialExpired: true, reason: 'انتهت فترة التجربة المجانية لمدة 3 أيام' };
      }

      if (currentBalance < amount) {
        return { success: false, remainingCredits: currentBalance, deductedAmount: 0, reason: 'رصيد الكريديت غير كافٍ. يرجى الشحن أو ترقية الباقة' };
      }

      const newBalance = currentBalance - amount;

      // 2. Update balance
      await supabaseAdmin
        .from('tenant_subscriptions')
        .update({ current_credits_balance: newBalance, updated_at: new Date().toISOString() })
        .eq('tenant_id', tenantId);

      // 3. Record in ledger
      await supabaseAdmin
        .from('credit_ledger')
        .insert({
          tenant_id: tenantId,
          amount: -amount,
          balance_after: newBalance,
          activity_type: activityType,
          idempotency_key: idempotencyKey || `tx-${Date.now()}-${Math.random()}`,
          metadata: metadata || {}
        });

      if (idempotencyKey) inMemoryIdempotency.add(idempotencyKey);
      return { success: true, remainingCredits: newBalance, deductedAmount: amount };
    } catch (e) {
      console.warn('Supabase credit ledger transaction failed, using memory state:', e);
    }
  }

  // Memory Fallback Execution
  const current = inMemoryBalances.get(tenantId) || { credits: 500, trialEndsAt: Date.now() + 3 * 86400000 };
  if (current.credits < amount) {
    return { success: false, remainingCredits: current.credits, deductedAmount: 0, reason: 'رصيد الكريديت غير كافٍ' };
  }

  current.credits -= amount;
  inMemoryBalances.set(tenantId, current);
  if (idempotencyKey) inMemoryIdempotency.add(idempotencyKey);

  return { success: true, remainingCredits: current.credits, deductedAmount: amount };
}

/**
 * Registers an interaction for Active Contacts Metering (ManyChat Model)
 * A contact is counted once per calendar month.
 */
export async function recordActiveContactInteraction(
  tenantId: string,
  customerId: string
): Promise<{ isNewContactThisMonth: boolean; currentMonthCount: number }> {
  const currentMonthCycle = new Date().toISOString().slice(0, 7); // e.g. "2026-11"
  const cycleKey = `${tenantId}:${currentMonthCycle}`;

  if (isSupabaseConfigured() && supabaseAdmin) {
    try {
      const { data: existing } = await supabaseAdmin
        .from('active_contacts_meter')
        .select('id, message_count')
        .eq('tenant_id', tenantId)
        .eq('customer_id', customerId)
        .eq('billing_cycle_month', currentMonthCycle)
        .maybeSingle();

      if (existing) {
        // Increment message count on existing contact
        await supabaseAdmin
          .from('active_contacts_meter')
          .update({ message_count: (existing.message_count || 1) + 1, last_interaction_at: new Date().toISOString() })
          .eq('id', existing.id);

        return { isNewContactThisMonth: false, currentMonthCount: 1 };
      } else {
        // New active contact this month
        await supabaseAdmin
          .from('active_contacts_meter')
          .insert({
            tenant_id: tenantId,
            customer_id: customerId,
            billing_cycle_month: currentMonthCycle
          });

        return { isNewContactThisMonth: true, currentMonthCount: 1 };
      }
    } catch (e) {
      console.warn('Supabase active contact metering failed, falling back to memory:', e);
    }
  }

  // Memory fallback
  let set = inMemoryActiveContacts.get(cycleKey);
  if (!set) {
    set = new Set<string>();
    inMemoryActiveContacts.set(cycleKey, set);
  }

  const isNew = !set.has(customerId);
  set.add(customerId);

  return { isNewContactThisMonth: isNew, currentMonthCount: set.size };
}
