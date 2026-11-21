import { NextRequest, NextResponse } from "next/server";

export interface ProactiveTrigger {
  id: string;
  type: "abandoned_cart" | "pending_instapay" | "post_purchase_review" | "restock_alert";
  title: string;
  status: "active" | "paused";
  targetChannel: "whatsapp" | "instagram";
  delayMinutes: number;
  aiTone: "friendly" | "urgent" | "luxury" | "supportive";
  systemPrompt: string;
  stats: {
    triggeredCount: number;
    recoveredRevenue: number;
    conversionRate: string;
  };
}

// In-memory proactive triggers registry (ready for DB sync)
let PROACTIVE_TRIGGERS: ProactiveTrigger[] = [
  {
    id: "trigger-abandoned-cart",
    type: "abandoned_cart",
    title: "استرجاع السلات المتروكة (Abandoned Cart Recovery)",
    status: "active",
    targetChannel: "whatsapp",
    delayMinutes: 30,
    aiTone: "friendly",
    systemPrompt: "العميل اختار منتج ومقاس لكن لم يكمل الطلب منذ 30 دقيقة. ذكّره بلطافة بالمنتج وأخبره أن المقاس سينفد، واعرض عليه شحن مجاني أو خصم 10% بلهجة مصرية ودودة بدون إلحاح مزعج.",
    stats: {
      triggeredCount: 148,
      recoveredRevenue: 98400,
      conversionRate: "42.5%"
    }
  },
  {
    id: "trigger-pending-instapay",
    type: "pending_instapay",
    title: "متابعة إيصال إنستاباي المعلق (Pending InstaPay Chase)",
    status: "active",
    targetChannel: "whatsapp",
    delayMinutes: 60,
    aiTone: "supportive",
    systemPrompt: "العميل أكد رغبته بالدفع عبر إنستاباي ولم يرسل الإيصال خلال ساعة. اسأله بلباقة إن كان يحتاج مساعدة في تفاصيل التحويل أو رقم الحساب، وأكد له أن الأوردر محجوز لمدة ساعتين فقط.",
    stats: {
      triggeredCount: 89,
      recoveredRevenue: 64200,
      conversionRate: "68.2%"
    }
  },
  {
    id: "trigger-post-purchase",
    type: "post_purchase_review",
    title: "متابعة ما بعد الاستلام وتنشيط البيع (Post-Delivery Upsell)",
    status: "active",
    targetChannel: "whatsapp",
    delayMinutes: 2880, // 48 hours
    aiTone: "luxury",
    systemPrompt: "بوليصة الشحن سُلمت منذ يومين. اطمئن على رضا العميل عن خامة ومقاس القطعة، واطلب تقييمه، واعرض عليه كولكشن القطع المتناسقة معها.",
    stats: {
      triggeredCount: 230,
      recoveredRevenue: 47100,
      conversionRate: "31.0%"
    }
  }
];

// Mock event leads for proactive scanning
const PENDING_LEADS = [
  {
    id: "lead-01",
    customerName: "سارة المهندس",
    phone: "201019842100",
    channel: "whatsapp",
    triggerType: "abandoned_cart",
    lastActionTime: "منذ 34 دقيقة",
    cartItem: "سويت شيرت ميلتون بيج (مقاس M)",
    cartValue: 750,
    suggestedMessage: "أهلاً يا سارة 🌸 لاحظنا إنك كنتِ بتشوفي السويت شيرت البيج مقاس M. حابين نبلغك إن باقي منه قطعتين فقط في المخزن، ولو محتاجة مساعدة في مقاسات الطول والوزن إحنا معاكي!"
  },
  {
    id: "lead-02",
    customerName: "كريم فهمي",
    phone: "201289123456",
    channel: "whatsapp",
    triggerType: "pending_instapay",
    lastActionTime: "منذ 65 دقيقة",
    cartItem: "هودي أوفرسايز كحلي (مقاس XL)",
    cartValue: 690,
    suggestedMessage: "مساء الخير يا كريم 👋 الأوردر الخاص بحضرتك محجوز برقم #NOIR-3091، وحابين نتأكد لو واجهتك أي مشكلة في التحويل على إنستاباي عشان نلحق نسلمه لمندوب الشحن اليوم."
  },
  {
    id: "lead-03",
    customerName: "منى الشريف",
    phone: "201154789012",
    channel: "instagram",
    triggerType: "post_purchase_review",
    lastActionTime: "منذ 48 ساعة (تم التسليم)",
    cartItem: "فستان كتان زيتي (مقاس L)",
    cartValue: 1200,
    suggestedMessage: "أهلاً يا منى! 💚 نتمنى يكون الفستان الكتان عجبك ومقاسه مظبوط. كولكشن الصيف الجديد نزل بالكامل ويسعدنا نقدملك خصم 15% على قطعتك القادمة بكود VIP15!"
  }
];

// GET: Returns list of triggers and current actionable leads
export async function GET() {
  return NextResponse.json({
    success: true,
    triggers: PROACTIVE_TRIGGERS,
    pendingLeads: PENDING_LEADS,
    summary: {
      activeTriggers: PROACTIVE_TRIGGERS.filter(t => t.status === "active").length,
      totalRecoveredRevenue: PROACTIVE_TRIGGERS.reduce((acc, t) => acc + t.stats.recoveredRevenue, 0),
      readyToSendLeads: PENDING_LEADS.length,
      engineStatus: "running_autonomous_cron"
    }
  });
}

// POST: Trigger manual execution or toggle trigger status
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, triggerId, leadId, customPrompt } = body;

    if (action === "toggle") {
      PROACTIVE_TRIGGERS = PROACTIVE_TRIGGERS.map(t => {
        if (t.id === triggerId) {
          return { ...t, status: t.status === "active" ? "paused" : "active" };
        }
        return t;
      });
      return NextResponse.json({ success: true, triggers: PROACTIVE_TRIGGERS });
    }

    if (action === "fire_lead") {
      const lead = PENDING_LEADS.find(l => l.id === leadId);
      if (!lead) {
        return NextResponse.json({ error: "Lead not found" }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        sentAt: new Date().toISOString(),
        lead,
        status: "dispatched_via_whatsapp",
        message: lead.suggestedMessage,
        rateLimitNote: "تم إرسال الرسالة عبر WhatsApp Cloud API بنجاح."
      });
    }

    if (action === "fire_all_pending") {
      return NextResponse.json({
        success: true,
        dispatchedCount: PENDING_LEADS.length,
        totalValueRecovered: PENDING_LEADS.reduce((acc, l) => acc + l.cartValue, 0),
        dispatchedLeads: PENDING_LEADS.map(l => ({
          name: l.customerName,
          phone: l.phone,
          status: "delivered"
        }))
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
