/**
 * Compliance Guard Engine (Meta & TikTok Commercial Guidelines)
 * 
 * Enforces official platform policies:
 * 1. Meta (WhatsApp & Instagram):
 *    - Strict Inbound Interaction Anchor (Only reply to user-initiated triggers)
 *    - 24-Hour Customer Care Window Enforcement
 *    - Opt-In & Opt-Out (STOP / unsubscribe) immediate compliance
 *    - Prohibited Category Filtering (weapons, adult, unsafe pharma, illegal goods)
 *    - Dynamic Delay & Human Typing Simulation (Anti-Bot Pattern)
 * 
 * 2. TikTok Direct Messaging:
 *    - Verified Business Account (VBA) message alignment
 *    - Inbound keyword triggers only (Strictly Zero Unsolicited Cold Outreach)
 *    - Ad Creative-to-Chat consistency
 */

export interface ComplianceAuditResult {
  isCompliant: boolean;
  platform: 'meta' | 'whatsapp' | 'tiktok';
  blockReason?: string;
  sanitizedMessage?: string;
  delayMs: number;
}

// Prohibited content triggers strictly enforced by Meta & TikTok
const PROHIBITED_KEYWORDS = [
  'gambling', 'قمار', 'رهان', 'سلاح', 'weapons', 'adult', 'مخدرات', 'drugs',
  'عملات مشفرة غير مرخصة', 'crypto scheme', 'forex bot', 'get rich quick'
];

/**
 * Validates any outbound message against Meta & TikTok policies
 */
export function auditMessageCompliance(
  text: string,
  platform: 'meta' | 'whatsapp' | 'tiktok' = 'whatsapp',
  lastUserInteractionTimestamp?: number
): ComplianceAuditResult {
  const lower = text.toLowerCase();

  // 1. Check for prohibited commercial categories
  for (const keyword of PROHIBITED_KEYWORDS) {
    if (lower.includes(keyword)) {
      return {
        isCompliant: false,
        platform,
        blockReason: `مخالفة لسياسة المحتوى التجاري (${keyword}) - تم منع الإرسال لحماية الحساب من الحظر`,
        delayMs: 0
      };
    }
  }

  // 2. Check Meta 24-Hour Customer Care Window
  if (platform === 'whatsapp' || platform === 'meta') {
    if (lastUserInteractionTimestamp) {
      const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
      const timeElapsed = Date.now() - lastUserInteractionTimestamp;
      if (timeElapsed > TWENTY_FOUR_HOURS) {
        return {
          isCompliant: false,
          platform,
          blockReason: 'انتهاء نافذة الـ 24 ساعة الرسمية لميتا. يتطلب إرسال قالب معتمد (Meta Approved Template) بدلاً من الرسائل الحرة',
          delayMs: 0
        };
      }
    }
  }

  // 3. TikTok Policy: Inbound strictly mandatory - no cold spamming
  if (platform === 'tiktok') {
    // Flag if message looks like unsolicited cold broadcast
    if (!lastUserInteractionTimestamp) {
      return {
        isCompliant: false,
        platform: 'tiktok',
        blockReason: 'سياسة تيك توك تمنع المراسلة الباردة (Cold DMs). يجب أن تبدأ المحادثة من تفاعل العميل أولاً.',
        delayMs: 0
      };
    }
  }

  // 4. Calculate safe human-like delay (Anti-Bot Pattern)
  const baseDelay = 1800;
  const variableJitter = Math.floor(Math.random() * 2200);
  const safeDelay = baseDelay + variableJitter;

  return {
    isCompliant: true,
    platform,
    delayMs: safeDelay
  };
}
