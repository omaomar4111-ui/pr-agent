import { NextRequest, NextResponse } from 'next/server';
import { detectDeviceIntelligence, DeviceTelemetry } from '@/lib/deviceIntelligence';

// In-Memory Lead Telemetry Store (Ready for DB Logging)
let VISITOR_TELEMETRY_LOGS: DeviceTelemetry[] = [
  {
    deviceType: 'mobile',
    model: 'iPhone Pro Max / Plus Series',
    os: 'iOS',
    browser: 'Safari',
    screenResolution: '430x932',
    purchasingPowerTier: 'VIP_LUXURY',
    purchasingPowerLabel: 'فئة VIP فائقة (iPhone Pro Max)',
    confidence: 0.96,
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString()
  },
  {
    deviceType: 'desktop',
    model: 'Apple Mac (MacBook / iMac)',
    os: 'macOS',
    browser: 'Chrome',
    screenResolution: '1920x1080',
    purchasingPowerTier: 'VIP_LUXURY',
    purchasingPowerLabel: 'فئة رجال أعمال / VIP (MacBook)',
    confidence: 0.94,
    timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString()
  },
  {
    deviceType: 'mobile',
    model: 'Samsung Galaxy S-Ultra / Foldable Flagship',
    os: 'Android',
    browser: 'Chrome',
    screenResolution: '412x915',
    purchasingPowerTier: 'VIP_LUXURY',
    purchasingPowerLabel: 'فئة VIP (Galaxy Ultra / Fold)',
    confidence: 0.92,
    timestamp: new Date(Date.now() - 1000 * 60 * 42).toISOString()
  }
];

export async function GET() {
  const vipCount = VISITOR_TELEMETRY_LOGS.filter(v => v.purchasingPowerTier === 'VIP_LUXURY').length;
  const highCount = VISITOR_TELEMETRY_LOGS.filter(v => v.purchasingPowerTier === 'HIGH').length;

  return NextResponse.json({
    success: true,
    telemetryLogs: VISITOR_TELEMETRY_LOGS,
    summary: {
      totalTracked: VISITOR_TELEMETRY_LOGS.length,
      vipLuxuryPercent: Math.round((vipCount / (VISITOR_TELEMETRY_LOGS.length || 1)) * 100),
      highTicketLeads: vipCount + highCount
    }
  });
}

export async function POST(req: NextRequest) {
  try {
    const userAgent = req.headers.get('user-agent') || '';
    const body = await req.json().catch(() => ({}));
    const { screenWidth, screenHeight } = body;

    const telemetry = detectDeviceIntelligence(userAgent, screenWidth, screenHeight);
    
    // Add to logs (keep recent 100 entries)
    VISITOR_TELEMETRY_LOGS.unshift(telemetry);
    if (VISITOR_TELEMETRY_LOGS.length > 100) {
      VISITOR_TELEMETRY_LOGS.pop();
    }

    return NextResponse.json({
      success: true,
      telemetry,
      realEstateRecommendation: telemetry.purchasingPowerTier === 'VIP_LUXURY' 
        ? 'عميل مستهدف بقوة للفيلات والتاون هاوس في التجمع والزايد (High Net Worth)'
        : 'عميل مستهدف للشقق وأنظمة السداد الممتدة'
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
