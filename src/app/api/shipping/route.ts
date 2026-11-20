import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabaseClient';

export interface ShippingRequest {
  orderId: string;
  courier: 'bosta' | 'aramex' | 'oto';
  customerName: string;
  customerPhone: string;
  address: string;
  city: string;
  items: string;
  codAmount: number;
}

export async function POST(req: NextRequest) {
  try {
    const body: ShippingRequest = await req.json();
    const { orderId, courier = 'bosta', customerName, customerPhone, address, city, codAmount = 0 } = body;

    if (!customerPhone || !address) {
      return NextResponse.json({ error: 'Customer phone and address are required' }, { status: 400 });
    }

    // 1. Generate real-like courier airway bill (AWB)
    const trackingPrefix = courier === 'bosta' ? 'BST' : courier === 'aramex' ? 'EXP' : 'OTO';
    const trackingNumber = `${trackingPrefix}-${Math.floor(1000000 + Math.random() * 9000000)}`;
    const labelUrl = `https://shipping-labels.pragent.app/${trackingNumber}.pdf`;

    // 2. Persist in database if connected
    if (isSupabaseConfigured() && orderId) {
      await supabaseAdmin
        .from('orders')
        .update({
          shipping_courier: courier,
          shipping_tracking_number: trackingNumber,
          shipping_label_url: labelUrl,
          status: 'dispatched'
        })
        .eq('id', orderId);
    }

    return NextResponse.json({
      success: true,
      courier,
      trackingNumber,
      labelUrl,
      estimatedDelivery: 'خلال 24 إلى 48 ساعة عمل',
      pickupScheduled: true,
      pickupDate: new Date(Date.now() + 86400000).toLocaleDateString('ar-EG'),
      details: {
        receiver: customerName,
        phone: customerPhone,
        destination: `${city} - ${address}`,
        codAmount: `${codAmount} ج.م`
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
