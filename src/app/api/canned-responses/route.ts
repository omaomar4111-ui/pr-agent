import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabaseClient';

export interface CannedResponseItem {
  id: string;
  shortCode: string;
  content: string;
  category: string;
}

let mockCannedResponses: CannedResponseItem[] = [
  {
    id: "cr-1",
    shortCode: "/shipping",
    content: "أهلاً بيك يا فندم! 🌸 متاح الشحن والتوصيل لجميع المحافظات خلال 48 ساعة عمل مع إمكانية المعاينة قبل الاستلام.",
    category: "شحن وتوصيل"
  },
  {
    id: "cr-2",
    shortCode: "/instapay",
    content: "تم التحقق من تحويل إنستاباي بنجاح! الأوردر معتمد الآن ومرفق به بوليصة الشحن مع المندوب.",
    category: "مدفوعات"
  },
  {
    id: "cr-3",
    shortCode: "/discount",
    content: "كوبون الخصم كود: PR10 يمنحك خصم 10% فوري عند إتمام الطلب وتأكيد مقاسك الآن ✨",
    category: "عروض ترويجية"
  },
  {
    id: "cr-4",
    shortCode: "/sizes",
    content: "جدول المقاسات لدينا معتمد 100% قطن مصري: M (65-75 كجم)، L (75-85 كجم)، XL (85-98 كجم)، XXL (98+ كجم). تحب نجهزلك أي مقاس؟",
    category: "مقاسات"
  }
];

export async function GET(req: NextRequest) {
  try {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabaseAdmin
        .from('canned_responses')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return NextResponse.json({ success: true, cannedResponses: data });
      }
    }
    return NextResponse.json({ success: true, cannedResponses: mockCannedResponses });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { shortCode, content, category = "عام" } = body;

    if (!shortCode || !content) {
      return NextResponse.json({ error: 'Short code and content are required' }, { status: 400 });
    }

    const newItem: CannedResponseItem = {
      id: `cr-${Date.now()}`,
      shortCode: shortCode.startsWith('/') ? shortCode : `/${shortCode}`,
      content,
      category
    };

    if (isSupabaseConfigured()) {
      await supabaseAdmin.from('canned_responses').insert([newItem]);
    }

    mockCannedResponses.unshift(newItem);
    return NextResponse.json({ success: true, cannedResponse: newItem });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
