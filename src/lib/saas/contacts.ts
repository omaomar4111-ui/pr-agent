import { supabaseAdmin } from '@/lib/supabaseClient';

const inMemoryContacts = new Map<string, Set<string>>();

/**
 * Record an active contact. Call this whenever a customer sends a message
 * (inbound). Only counted ONCE per billing period.
 */
export async function recordActiveContact(
  tenantId: string,
  customerId: string
): Promise<void> {
  const now = new Date();
  const period = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  if (supabaseAdmin) {
    try {
      // Upsert — if already exists for this period, just update last_contact_at
      const { error } = await supabaseAdmin
        .from('active_contacts')
        .upsert(
          {
            tenant_id: tenantId,
            customer_id: customerId,
            billing_period: period,
            last_contact_at: now.toISOString(),
            is_counted: true,
          },
          {
            onConflict: 'tenant_id,customer_id,billing_period',
            ignoreDuplicates: false,
          }
        );

      if (error) console.error('recordActiveContact error:', error);

      // Update usage counter
      const { count } = await supabaseAdmin
        .from('active_contacts')
        .select('*', { count: 'exact', head: true })
        .eq('tenant_id', tenantId)
        .eq('billing_period', period);

      await supabaseAdmin
        .from('usage_counters')
        .upsert(
          {
            tenant_id: tenantId,
            period: `month:${period}`,
            metric: 'api_calls',
            count: count || 0,
          },
          { onConflict: 'tenant_id,period,metric' }
        );
      return;
    } catch (e) {
      console.warn('Supabase recordActiveContact error:', e);
    }
  }

  // Memory fallback
  const key = `${tenantId}:${period}`;
  if (!inMemoryContacts.has(key)) {
    inMemoryContacts.set(key, new Set());
  }
  inMemoryContacts.get(key)!.add(customerId);
}

/**
 * Count active contacts for current month.
 */
export async function countActiveContacts(tenantId: string): Promise<number> {
  const now = new Date();
  const period = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  if (supabaseAdmin) {
    try {
      const { count } = await supabaseAdmin
        .from('active_contacts')
        .select('*', { count: 'exact', head: true })
        .eq('tenant_id', tenantId)
        .eq('billing_period', period);

      return count || 0;
    } catch (e) {
      console.warn('Supabase countActiveContacts error:', e);
    }
  }

  const key = `${tenantId}:${period}`;
  return inMemoryContacts.get(key)?.size || 0;
}
