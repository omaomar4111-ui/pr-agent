import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';
import { AGENTS } from '@/data/agents';
import { moderateMessage } from '@/lib/aiModerator';
import { deductCredits, recordActiveContactInteraction } from '@/lib/creditLedger';

export async function POST(req: NextRequest) {
  try {
    const { 
      message, 
      history, 
      brief, 
      agentId: requestedAgentId, 
      conversationId,
      modelPreference,
      tenantId = 'TENANT-DEFAULT',
      customerId = 'CUSTOMER-ANON'
    } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Phase 1: SaaS Foundation — Active Contacts Metering & AI Credit Check
    const creditCheck = await deductCredits(
      tenantId,
      1, // 1 Credit per AI reply
      'ai_reply',
      `chat-${tenantId}-${conversationId || 'conv'}-${Date.now()}`
    );

    if (!creditCheck.success) {
      return NextResponse.json({
        reply: `⚠️ عذراً يا فندم: ${creditCheck.reason}. يرجى من التاجر تجديد الباقة أو شحن الكريديت للاستمرار في الرد الذكي.`,
        error: 'INSUFFICIENT_CREDITS',
        remainingCredits: creditCheck.remainingCredits
      }, { status: 402 });
    }

    // Register active contact for this month
    await recordActiveContactInteraction(tenantId, customerId);

    const cleanMsg = message.trim();

    // 0. AI Moderation Check (ai-moderator-support-agent)
    const moderation = moderateMessage(cleanMsg);
    if (!moderation.allowed) {
      return NextResponse.json({
        reply: `⚠️ نعتذر منك، لم نتمكن من معالجة الرسالة: ${moderation.reason}. يرجى الالتزام بمعايير الاستخدام المهذب.`,
        moderated: true,
        category: moderation.category
      }, { status: 200 });
    }
    let currentAgentId = requestedAgentId;

    // 1. Resolve Active Agent from Supabase if conversationId is provided
    if (conversationId && !currentAgentId) {
      try {
        const { data: conv } = await supabaseAdmin
          .from('conversations')
          .select('active_agent')
          .eq('id', conversationId)
          .maybeSingle();

        if (conv?.active_agent) {
          currentAgentId = conv.active_agent;
        }
      } catch (err) {
        console.warn('Could not read conversation active agent, using fallback');
      }
    }

    // Default to Sara Tarek if none resolved
    const activeAgent = AGENTS.find(a => a.id === currentAgentId) || AGENTS[0];

    // 2. Determine Query Complexity for 4 Argon Routing
    const isComplexQuery = 
      modelPreference === '4-argon' ||
      cleanMsg.length > 70 ||
      activeAgent.id === 'payment_verify' ||
      activeAgent.id === 'complaints' ||
      cleanMsg.includes('مشكلة') ||
      cleanMsg.includes('شكوى') ||
      cleanMsg.includes('استرجاع') ||
      cleanMsg.includes('خامة');

    // 3. Dynamic System Prompt tailored to the selected Agent
    const dynamicSystemPrompt = `
أنت الآن تلعب دور: "${activeAgent.name}" (${activeAgent.role}).
شخصيتك وتوجيهك الأساسي:
${activeAgent.system_prompt}

بريف البراند والمتجر:
- المنتجات: ${brief?.productsCatalogSummary || 'هوديز أوفرسايز (650ج)، جواكت جلد مستورد (1850ج)، قمصان قطن (450ج)'}
- الشحن المجاني: فوق ${brief?.freeShippingThreshold || '1000'} جنيه.
- سياسة المعاينة: معاينة كاملة ومجانية مع المندوب قبل دفع أي جنيه واستبدال مجاني خلال 14 يوم.
- طرق الدفع: إنستاباي، فودافون كاش، الدفع عند الاستلام (COD).

قواعد صارمة:
1. التزم بشخصيتك ودورك المحدد كـ (${activeAgent.name}) ولا تخرج عنه.
2. الرد يجب أن يكون مصرياً راقياً، ذكياً، مختصراً (جملتين أو 3 جمل كحد أقصى كشات الواتساب الحقيقي).
`.trim();

    const apiKey = process.env.GEMINI_API_KEY || '';

    // 4. Invoke Gemini with Dynamic Instruction
    if (apiKey) {
      try {
        const targetModel = isComplexQuery ? 'gemini-1.5-pro' : 'gemini-1.5-flash';
        const controller = new AbortController();
        const timeoutMs = isComplexQuery ? 8000 : 4500;
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${targetModel}:generateContent?key=${apiKey}`;

        const res = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: `${dynamicSystemPrompt}\n\nرسالة العميل:\n"${cleanMsg}"` }]
              }
            ],
            generationConfig: {
              temperature: 0.6,
              maxOutputTokens: 120,
            }
          })
        });

        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
          if (reply) {
            return NextResponse.json({
              reply,
              agent: {
                id: activeAgent.id,
                name: activeAgent.name,
                role: activeAgent.role
              },
              source: isComplexQuery ? '4_ARGON_DYNAMIC_AGENT' : 'FAST_DYNAMIC_AGENT',
              timestamp: new Date().toISOString()
            });
          }
        }
      } catch (err) {
        console.warn('Gemini call bypassed, falling back to agent specific offline logic');
      }
    }

    // 5. Agent-Specific Heuristics (Zero-Latency Guarantee)
    const fallbackReply = generateAgentSpecificFallback(activeAgent.id, cleanMsg);

    return NextResponse.json({
      reply: fallbackReply,
      agent: {
        id: activeAgent.id,
        name: activeAgent.name,
        role: activeAgent.role
      },
      source: 'AGENT_OFFLINE_LOGIC',
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    return NextResponse.json({
      reply: 'يا فندم أهلاً بك! تم تحويل استفسارك لمسؤول القسم وهيتابع معاك فوراً.',
      source: 'SAFETY_FALLBACK',
      timestamp: new Date().toISOString()
    }, { status: 200 });
  }
}

function generateAgentSpecificFallback(agentId: string, text: string): string {
  const lower = text.toLowerCase();

  switch (agentId) {
    case 'cashier':
      return 'أهلاً بك يا فندم! معاك عمر من قسم الحسابات. تقدر تحول فوراً على إنستاباي برقمنا المعتمد، وأول ما تبعت صورة التحويل هنا هأكدلك الأوردر في ثوانٍ 💳';

    case 'returns':
      return 'مساء الخير يا فندم! معاك مروة من قسم الاستبدال. متقلقش خالص حقك مضمون 100%، بنبعتلك مندوب استبدال مجاناً لحد عندك بالقطعة والمقاس المظبوط خلال 48 ساعة فقط 🙏';

    case 'shipping':
      return 'يا هلا بيك! كابتن هيثم معاك من التنسيق اللوجستي وبوسطة. الشحن بياخد من 24 لـ 48 ساعة في القاهرة والجيزة و 72 ساعة للمحافظات، وبوليصتك بتطلع فوراً برابط تتبع حي 🚚';

    case 'complaints':
      return 'حقك علينا تماماً يا فندم وراحتك أولويتنا! أنا د. خالد الصاوي مدير خدمة العملاء ومسؤول شخصياً عن حل المشكلة دي فوراً وتعويض حضرتك بما يليق بيك 🌹';

    case 'upselling':
      return 'يا فندم اختيارك للهودي ممتاز! بس حابب أفيدك إنك لو أضفت بنطلون شينو بـ 620ج هيتطبق عليك الشحن المجاني فوراً وهتوفر 130ج بالكامل، تحب أضيفه مع الأوردر؟ 🔥';

    case 'catalog':
      return 'أهلاً بحضرتك! معاك نوران فاشون. خاماتنا قطن مصري 100% ميلتون تقيل 380 جرام معالج، والتلبيس أوفرسايز مظبوط جداً ومريح. تحب أساعدك تختار المقاس الأنسب؟ 👔';

    case 'payment_verify':
      return 'تمام يا فندم! أنا مدقق المدفوعات الذكي 4 Argon. بمجرد رفع سكرين شوت التحويل سأقوم بمطابقة الرقم المرجعي والمبلغ بالقرش واعتماد الشحنة تلقائياً 🛡️';

    case 'order_tracker':
      return 'أهلاً بحضرتك يا فندم! معاك يوسف من تتبع الشحنات. اديني بس رقم تليفونك أو رقم الأوردر وهطلعلك مكان المندوب وحالة الشحنة في ثوانٍ 📍';

    case 'fallback':
      return 'عفواً يا فندم لتفاصيل طلبك الخاصة، أنا حولت الشات حالياً لأحد المشرفين البشريين من فريق الإدارة وسينضم للمحادثة خلال دقائق للرد عليك مباشرة 🙏';

    default: // sara_tarek
      if (lower.includes('مقاس')) return 'مقاساتنا متوفرة من M لـ 3XL وتلبيسها أوفرسايز مريح جداً ومظبوط. ابعتلي طولك ووزنك وأنا هطلعلك المقاس المثالي فوراً! ✨';
      if (lower.includes('سعر') || lower.includes('كام')) return 'الهودي الأوفرسايز عليه خصم حصري بـ 650ج بدلاً من 850ج، ولو طلبت قطعتين الشحن بيكون مجاناً لحد باب بيتك! 🔥';
      return 'يا هلا بيك يا فندم! نورتنا في المتجر، معاك سارة طارق من المبيعات. إيه الموديل أو القطعة اللي عاجباك عشان أحجزلك مقاسك قبل نفاذ الكمية؟ ✨';
  }
}
