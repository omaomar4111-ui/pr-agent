import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabaseClient';

export interface MacroItem {
  id: string;
  name: string;
  description: string;
  actions: {
    addTag?: string;
    changeStatus?: 'open' | 'pending' | 'resolved';
    assignAgent?: string;
    sendReply?: string;
    generateAWB?: boolean;
  };
}

let mockMacros: MacroItem[] = [
  {
    id: "macro-1",
    name: "اعتماد الأوردر وتصدير البوليصة فوراً",
    description: "يقوم بتغيير حالة المحادثة لمؤكد، وتوليد بوليصة شحن بوسطة، وإشعار العميل برسالة تأكيد.",
    actions: {
      addTag: "Order_Confirmed",
      changeStatus: "pending",
      generateAWB: true,
      sendReply: "تم تأكيد طلبك بنجاح وجاري تسليمه لشركة الشحن! رقم التتبع سيصلك في رسالة نصية."
    }
  },
  {
    id: "macro-2",
    name: "تحويل لاسترجاع السلة (Cart Recovery Drip)",
    description: "إرسال كوبون خصم 10% وتحديد المحادثة للمتابعة بعد ساعتين.",
    actions: {
      addTag: "Abandoned_Cart",
      changeStatus: "open",
      sendReply: "لاحظنا أنك لم تكمل الطلب! احصل على كود خصم PR10 الآن صالح لمدة ساعتين فقط."
    }
  },
  {
    id: "macro-3",
    name: "إغلاق المحادثة كطلب مكتمل (Resolve & CSAT)",
    description: "تحديد المحادثة كمنتهية وإرسال استبيان تقييم الخدمة للعميل.",
    actions: {
      addTag: "Completed_Order",
      changeStatus: "resolved",
      sendReply: "شكراً لتسوقك معنا! نرجو تقييم تجربتك معنا من 1 إلى 5 نجوم لمساعدتنا في تطوير الخدمة."
    }
  }
];

export async function GET(req: NextRequest) {
  try {
    return NextResponse.json({ success: true, macros: mockMacros });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { macroId, conversationId } = body;

    const macro = mockMacros.find((m) => m.id === macroId);
    if (!macro) {
      return NextResponse.json({ error: "Macro not found" }, { status: 404 });
    }

    // Execute macro actions in database
    if (isSupabaseConfigured() && conversationId) {
      if (macro.actions.changeStatus) {
        await supabaseAdmin
          .from('conversations')
          .update({ status: macro.actions.changeStatus })
          .eq('id', conversationId);
      }
    }

    return NextResponse.json({
      success: true,
      executedMacro: macro.name,
      appliedActions: macro.actions,
      message: `تم تنفيذ ماكرو: "${macro.name}" بنجاح!`
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
