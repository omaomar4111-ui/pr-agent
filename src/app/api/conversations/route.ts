import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabaseClient';

export interface ConversationDTO {
  id: string;
  customerName: string;
  phone: string;
  channel: 'instagram' | 'whatsapp' | 'web';
  lastMessage: string;
  time: string;
  unread: boolean;
  status: 'open' | 'pending' | 'resolved';
  assignedTo: 'ai_bot' | 'human_agent';
  agentName: string;
  cartTotal?: number;
  items?: string;
}

let mockConversations: ConversationDTO[] = [
  {
    id: "conv-1",
    customerName: "كريم ممدوح (@kareem_style)",
    phone: "+20 101 234 5678",
    channel: "instagram",
    lastMessage: "تمام انا عايز أطلب قطعتين من الهودي الأسود لارج، وحولت 1,300 على إنستاباي",
    time: "15:42",
    unread: true,
    status: "pending",
    assignedTo: "ai_bot",
    agentName: "سارة طارق (Sales Closer & OCR)",
    cartTotal: 1300,
    items: "هودي أسود أوفر سايز (L) × 2"
  },
  {
    id: "conv-2",
    customerName: "نورهان الشريف",
    phone: "+20 112 987 6543",
    channel: "whatsapp",
    lastMessage: "العنوان بالتفصيل: التجمع الخامس، النرجس 2، فيلا 14",
    time: "14:20",
    unread: false,
    status: "open",
    assignedTo: "human_agent",
    agentName: "أحمد حسني (Human Specialist)",
    cartTotal: 850,
    items: "فستان بيج شتوي (M) × 1"
  },
  {
    id: "conv-3",
    customerName: "محمد السعيد",
    phone: "+20 120 445 8899",
    channel: "whatsapp",
    lastMessage: "تم استلام البوليصة وشكراً جداً على سرعة الشحن",
    time: "11:05",
    unread: false,
    status: "resolved",
    assignedTo: "ai_bot",
    agentName: "PR Sentinel (Auto Pilot)",
    cartTotal: 750,
    items: "تيشيرت أبيض أساسي (XL) × 3"
  }
];

export async function GET(req: NextRequest) {
  try {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabaseAdmin
        .from('conversations')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return NextResponse.json({ success: true, conversations: data });
      }
    }

    return NextResponse.json({ success: true, conversations: mockConversations });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, assignedTo, status } = body;

    mockConversations = mockConversations.map((c) => {
      if (c.id === id) {
        return {
          ...c,
          assignedTo: assignedTo !== undefined ? assignedTo : c.assignedTo,
          status: status !== undefined ? status : c.status
        };
      }
      return c;
    });

    if (isSupabaseConfigured() && id) {
      await supabaseAdmin
        .from('conversations')
        .update({
          assigned_to: assignedTo,
          status
        })
        .eq('id', id);
    }

    return NextResponse.json({ success: true, message: 'Updated conversation successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
