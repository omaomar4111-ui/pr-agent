import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId') || 'default-tenant';

    // Default mock stats if database is initializing or empty
    let stats = {
      todayRevenue: 28450,
      monthlyRevenue: 412900,
      totalOrders: 142,
      pendingOrders: 9,
      instapayPending: 4,
      aiHandledRate: 94.2,
      activeConversations: 38
    };

    let recentOrders = [
      {
        id: "ORD-9281",
        customer: "محمد الشناوي",
        phone: "+201012345678",
        channel: "whatsapp",
        items: "تيشيرت أوفر سايز أسود (L) × 2",
        total: 950,
        status: "pending_payment",
        paymentMethod: "InstaPay",
        date: "منذ 4 دقائق"
      },
      {
        id: "ORD-9280",
        customer: "سارة عبد العزيز",
        phone: "+201123456789",
        channel: "instagram",
        items: "فستان بيج شتوي (M) × 1",
        total: 1400,
        status: "confirmed",
        paymentMethod: "InstaPay",
        date: "منذ 18 دقيقة"
      },
      {
        id: "ORD-9279",
        customer: "عمر خالد",
        phone: "+201298765432",
        channel: "messenger",
        items: "حذاء رياضي كلاسيك أسود (43) × 1",
        total: 1850,
        status: "dispatched",
        courier: "Bosta",
        trackingNumber: "BST-8839210",
        paymentMethod: "COD",
        date: "منذ ساعة"
      },
      {
        id: "ORD-9278",
        customer: "نوران أحمد",
        phone: "+201099887766",
        channel: "whatsapp",
        items: "حقيبة جلدية هافان × 1",
        total: 780,
        status: "confirmed",
        paymentMethod: "InstaPay",
        date: "منذ ساعتين"
      }
    ];

    let pendingInstaPay = [
      {
        id: "IPAY-441",
        customer: "محمد الشناوي",
        amount: 950,
        refNumber: "Ref: 9940129",
        senderPhone: "01012345678",
        orderId: "ORD-9281",
        time: "منذ 4 دقائق",
        confidence: 0.98
      },
      {
        id: "IPAY-440",
        customer: "أحمد مصطفى",
        amount: 2100,
        refNumber: "Ref: 8810234",
        senderPhone: "01550011223",
        orderId: "ORD-9275",
        time: "منذ 32 دقيقة",
        confidence: 0.95
      }
    ];

    // Try fetching from Supabase if table exists
    if (supabase) {
      try {
        const { data: dbOrders, error: ordersErr } = await supabase
          .from('orders')
          .select('*')
          .limit(10)
          .order('created_at', { ascending: false });

        if (!ordersErr && dbOrders && dbOrders.length > 0) {
          recentOrders = dbOrders.map((o: any) => ({
            id: o.order_number || o.id,
            customer: o.customer_name || 'عميل',
            phone: o.customer_phone || '-',
            channel: o.channel || 'whatsapp',
            items: o.items_summary || 'منتجات المتجر',
            total: o.total_amount || 0,
            status: o.status || 'pending',
            paymentMethod: o.payment_method || 'COD',
            date: new Date(o.created_at).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
          }));

          const confirmed = dbOrders.filter((o: any) => o.status === 'confirmed').length;
          const pending = dbOrders.filter((o: any) => o.status === 'pending_payment' || o.status === 'pending').length;
          const totalRev = dbOrders.reduce((acc: number, curr: any) => acc + (Number(curr.total_amount) || 0), 0);

          stats.totalOrders = dbOrders.length;
          stats.pendingOrders = pending;
          stats.todayRevenue = totalRev;
        }
      } catch (e) {
        // Fallback to initial structured data
      }
    }

    return NextResponse.json({
      success: true,
      stats,
      recentOrders,
      pendingInstaPay,
      channels: [
        { name: "WhatsApp Business API", active: true, conversations: 24, status: "connected" },
        { name: "Instagram Direct", active: true, conversations: 11, status: "connected" },
        { name: "Facebook Messenger", active: true, conversations: 3, status: "connected" },
        { name: "Web Chat Widget", active: true, conversations: 0, status: "standby" }
      ]
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
