import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabaseClient';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantId = searchParams.get('tenantId') || 'default-tenant';

    if (isSupabaseConfigured()) {
      const { data: orders, error } = await supabaseAdmin
        .from('orders')
        .select('*, customers(name, phone, governorate, city_area)')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false });

      if (!error && orders) {
        return NextResponse.json({ success: true, orders });
      }
    }

    // Default mock data when offline/testing
    const mockOrders = [
      {
        id: "ord-101",
        customer: "كريم ممدوح",
        phone: "01012345678",
        city: "القاهرة - المعادي",
        items: "هودي أسود أوفر سايز (L) × 2",
        total: 1300,
        stage: "verified",
        paymentMethod: "INSTAPAY",
        createdAt: "منذ 10 دقائق"
      },
      {
        id: "ord-102",
        customer: "نورهان الشريف",
        phone: "01129876543",
        city: "القاهرة - التجمع الخامس",
        items: "فستان بيج شتوي (M) × 1",
        total: 850,
        stage: "pending_payment",
        paymentMethod: "INSTAPAY",
        createdAt: "منذ 25 دقيقة"
      },
      {
        id: "ord-103",
        customer: "محمد السعيد",
        phone: "01234567890",
        city: "الإسكندرية - سموحة",
        items: "تيشيرت أبيض أساسي (XL) × 3",
        total: 750,
        stage: "new",
        paymentMethod: "COD",
        createdAt: "منذ ساعة"
      },
      {
        id: "ord-104",
        customer: "سلمى فؤاد",
        phone: "01098765432",
        city: "الجيزة - الدقي",
        items: "سويت شيرت كحلي (S) × 1",
        total: 550,
        stage: "dispatched",
        paymentMethod: "COD",
        createdAt: "منذ 3 ساعات"
      }
    ];

    return NextResponse.json({ success: true, orders: mockOrders });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { orderId, stage, status } = await req.json();
    const newStatus = stage || status;

    if (isSupabaseConfigured() && orderId) {
      await supabaseAdmin
        .from('orders')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', orderId);
    }

    return NextResponse.json({ success: true, orderId, updatedStage: newStatus });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
