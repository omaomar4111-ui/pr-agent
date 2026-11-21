import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const channel = searchParams.get('channel') || 'whatsapp';

    if (channel === 'whatsapp') {
      // Realistic Evolution/Baileys pairing code/session string
      const pairingString = `2@${Date.now()},pr-agent-session-${Math.floor(Math.random() * 100000)},meta-cloud-api`;
      const qrCodeDataUrl = await QRCode.toDataURL(pairingString, {
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff'
        },
        width: 280
      });

      return NextResponse.json({
        success: true,
        channel: 'whatsapp',
        status: 'ready_to_scan',
        instanceName: 'PR-Store-WhatsApp-1',
        qrCode: qrCodeDataUrl,
        pairingCode: `${Math.floor(100 + Math.random() * 900)}-${Math.floor(100 + Math.random() * 900)}`,
        expiresIn: 60
      });
    }

    if (channel === 'meta') {
      return NextResponse.json({
        success: true,
        channel: 'meta',
        status: 'authorized',
        connectedPages: [
          { id: 'page-1', name: 'صفحة متجر الفاشون الرسمية (Facebook)', igUsername: '@pr_store_egypt', fans: '42.5K' }
        ]
      });
    }

    return NextResponse.json({ error: 'Unknown channel' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { channel, action } = body;

    if (action === 'connect_mock' || action === 'verify_scan') {
      return NextResponse.json({
        success: true,
        channel,
        status: 'connected',
        phoneNumber: '+20 101 234 5678',
        connectedAt: new Date().toISOString(),
        message: 'تم توصيل القناة وتفعيل استقبال رسائل الزبائن بنجاح!'
      });
    }

    if (action === 'disconnect') {
      return NextResponse.json({
        success: true,
        channel,
        status: 'disconnected',
        message: 'تم فصل القناة'
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
